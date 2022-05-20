"""This file and its contents are licensed under the Apache License 2.0. Please see the included NOTICE for copyright information and LICENSE for a copy of the license.
"""
import drf_yasg.openapi as openapi
import logging
import numpy as np
import pathlib
import json
import os

from datetime import datetime
from collections import Counter
from django.db import IntegrityError
from django.db.models.fields import DecimalField
from django.conf import settings
from django.shortcuts import get_object_or_404
from drf_yasg.utils import swagger_auto_schema
from django.utils.decorators import method_decorator
from django.db.models import F, Q, When, Count, Case, OuterRef, Max, Exists, Value, BooleanField, Avg, Window
from django.db.models.functions import Rank
from rest_framework.views import APIView
from rest_framework import generics, status, filters
from rest_framework.exceptions import NotFound, ValidationError as RestValidationError
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import exception_handler

from core.utils.common import conditional_atomic
from core.label_config import config_essential_data_has_changed
from projects.models import (
    Project, ProjectSummary, ProjectMember
)
from projects.serializers import (
    ProjectSerializer, ProjectMemberSerializer, ProjectLabelConfigSerializer, ProjectSummarySerializer, ProjectMemberStatisticsSerializer
)

from users.models import User
from users.serializers import UserStatisticsSerializer
from tasks.models import Task, Annotation, Prediction, TaskLock, Q_task_finished_annotations
from tasks.serializers import TaskSerializer, AnnotationSerializer, TaskWithAnnotationsAndPredictionsAndDraftsSerializer

from core.mixins import APIViewVirtualRedirectMixin, APIViewVirtualMethodMixin
from core.permissions import all_permissions, ViewClassPermission, IsAuthenticated
from core.utils.common import (
    get_object_with_check_and_log, bool_from_request, paginator, paginator_help)
from core.utils.exceptions import ProjectExistException, LabelStudioDatabaseException, DatasetJscDatabaseException
from core.utils.io import find_dir, find_file, read_yaml

from data_manager.functions import get_prepared_queryset
from data_manager.models import View

from notifications.telegram.bot import telegram_bot_sendtext

logger = logging.getLogger(__name__)


_result_schema = openapi.Schema(
    title='Labeling result',
    description='Labeling result (choices, labels, bounding boxes, etc.)',
    type=openapi.TYPE_OBJECT,
    properies={
        'from_name': openapi.Schema(
            title='from_name',
            description='The name of the labeling tag from the project config',
            type=openapi.TYPE_STRING
        ),
        'to_name': openapi.Schema(
            title='to_name',
            description='The name of the labeling tag from the project config',
            type=openapi.TYPE_STRING
        ),
        'value': openapi.Schema(
            title='value',
            description='Labeling result value. Format depends on chosen ML backend',
            type=openapi.TYPE_OBJECT
        )
    },
    example={
        'from_name': 'image_class',
        'to_name': 'image',
        'value': {
            'labels': ['Cat']
        }
    }
)

_task_data_schema = openapi.Schema(
    title='Task data',
    description='Task data',
    type=openapi.TYPE_OBJECT,
    example={
        'id': 1,
        'my_image_url': 'https://app.heartex.ai/static/samples/kittens.jpg'
    }
)


@method_decorator(name='get', decorator=swagger_auto_schema(
    tags=['Projects'],
    operation_summary='List your projects',
    operation_description="""
    Return a list of the projects that you've created.

    To perform most tasks with the Label Studio API, you must specify the project ID, sometimes referred to as the `pk`.
    To retrieve a list of your Label Studio projects, update the following command to match your own environment.
    Replace the domain name, port, and authorization token, then run the following from the command line:
    ```bash
    curl -X GET {}/api/projects/ -H 'Authorization: Token abc123'
    ```
    """.format(settings.HOSTNAME or 'https://localhost:8080')
))
@method_decorator(name='post', decorator=swagger_auto_schema(
    tags=['Projects'],
    operation_summary='Create new project',
    operation_description="""
    Create a project and set up the labeling interface in Label Studio using the API.
    
    ```bash
    curl -H Content-Type:application/json -H 'Authorization: Token abc123' -X POST '{}/api/projects' \
    --data "{{\"label_config\": \"<View>[...]</View>\"}}"
    ```
    """.format(settings.HOSTNAME or 'https://localhost:8080')
))
class ProjectListAPI(generics.ListCreateAPIView):
    parser_classes = (JSONParser, FormParser, MultiPartParser)
    serializer_class = ProjectSerializer
    filter_backends = [filters.OrderingFilter]
    # permission_required = ViewClassPermission(
    #     GET=all_permissions.projects_view,
    #     POST=all_permissions.projects_create,
    # )
    permission_classes = (AllowAny, )
    ordering = ['-created_at']

    def get_queryset(self):
        # TODO:
        #1. 
        #2. Get all ID of projects inside this active organization of which current user is member (using ProjectMember)
        #3. return all projects that its id is in IDs list from step 2
        user = self.request.user        
        
        if user.is_authenticated:
            current_user_id = self.request.user.id
            current_user_projects = Project.objects.with_counts().all().filter(Q(members__user_id=current_user_id)).annotate(current_user_role=Case(
                When(members__user_id=current_user_id, then=F('members__role')),
                default=Value('')
            ))

            public_projects = Project.objects.with_counts().filter(Q(project_status='open') | Q(project_status='open_running')).exclude(Q(members__user_id=current_user_id))

            projects = current_user_projects | public_projects

            return projects

        else:
            return Project.objects.with_counts().filter(Q(project_status='open') | Q(project_status='open_running'))

    def get_serializer_context(self):
        context = super(ProjectListAPI, self).get_serializer_context()
        context['created_by'] = self.request.user
        return context

    def perform_create(self, ser):
        user_id = self.request.user.id
        user_name = User.objects.filter(id=user_id)[0].username
        try:
            project = ser.save(organization=self.request.user.active_organization)
            # Also make that curent user owner of the project
            try:
                ProjectMember.objects.create(user_id=user_id, project_id=project.id, role='owner')
                telegram_bot_sendtext("User " + user_name + " has created project " + project.title.replace("#","no."))
            except IntegrityError as e:
                raise DatasetJscDatabaseException('Database error during project member creation. Try again.')

        except IntegrityError as e:
            if str(e) == 'UNIQUE constraint failed: project.title, project.created_by_id':
                raise ProjectExistException('Project with the same name already exists: {}'.
                                            format(ser.validated_data.get('title', '')))
            raise LabelStudioDatabaseException('Database error during project creation. Try again.')


@method_decorator(name='get', decorator=swagger_auto_schema(
        tags=['Projects'],
        operation_summary='Get project by ID',
        operation_description='Retrieve information about a project by project ID.'
    ))
@method_decorator(name='delete', decorator=swagger_auto_schema(
        tags=['Projects'],
        operation_summary='Delete project',
        operation_description='Delete a project by specified project ID.'
    ))
@method_decorator(name='patch', decorator=swagger_auto_schema(
        tags=['Projects'],
        operation_summary='Update project',
        operation_description='Update the project settings for a specific project.',
        request_body=ProjectSerializer
    ))
class ProjectAPI(APIViewVirtualRedirectMixin,
                 APIViewVirtualMethodMixin,
                 generics.RetrieveUpdateDestroyAPIView):

    parser_classes = (JSONParser, FormParser, MultiPartParser)
    queryset = Project.objects.with_counts()
    permission_required = ViewClassPermission(
        GET=all_permissions.projects_view,
        DELETE=all_permissions.projects_delete,
        PATCH=all_permissions.projects_change,
        PUT=all_permissions.projects_change,
        POST=all_permissions.projects_create,
    )
    serializer_class = ProjectSerializer

    redirect_route = 'projects:project-detail'
    redirect_kwarg = 'pk'

    def get_queryset(self):
        current_user_id = self.request.user.id
        project_id = self.kwargs['pk']
        if not ProjectMember.objects.filter(user=current_user_id, project=project_id).exists():
          return Project.objects.with_counts().filter(Q(id=project_id))
        return Project.objects.with_counts().filter(Q(members__user_id=current_user_id)).annotate(current_user_role=Case(
                When(Q(members__user_id=current_user_id) & Q(members__project_id=project_id), then=F('members__role')),
                default=Value('')
            ))

    def get(self, request, *args, **kwargs):
        return super(ProjectAPI, self).get(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        
        current_user_id = self.request.user.id
        current_user_email = self.request.user.email
        project_id = self.kwargs['pk']
        project = Project.objects.get(id=project_id)
        current_user_role = ProjectMember.objects.filter(project_id=project_id, user_id=current_user_id)[0].role

        if current_user_role != 'owner' and current_user_id != project.created_by_id and current_user_email != 'chon@dataset.vn':
            raise DatasetJscDatabaseException('Operation can only be performed by a project owner')

        return super(ProjectAPI, self).delete(request, *args, **kwargs)

    def patch(self, request, *args, **kwargs):
        user_id = self.request.user.id
        user_name = User.objects.filter(id=user_id)[0].username
        project = self.get_object()
        label_config = self.request.data.get('label_config')

        # config changes can break view, so we need to reset them
        if label_config:
            try:
                has_changes = config_essential_data_has_changed(label_config, project.label_config)
            except KeyError:
                pass
            else:
                if has_changes:
                    View.objects.filter(project=project).all().delete()
        if(self.request.data.get('title')):
            project_title = self.request.data.get('title')
            if(project_title != project.title):
                telegram_bot_sendtext("User " + user_name + " has changed project name from " + project.title.replace("#","no.") + " to " + project_title.replace("#","no."))

        return super(ProjectAPI, self).patch(request, *args, **kwargs)

    def perform_destroy(self, instance):
        """Performance optimization for whole project deletion
        if we catch constraint error fallback to regular .delete() method"""
        try:
            task_annotation_qs = Annotation.objects.filter(task__project_id=instance.id)
            task_annotation_qs._raw_delete(task_annotation_qs.db)
            task_prediction_qs = Prediction.objects.filter(task__project_id=instance.id)
            task_prediction_qs._raw_delete(task_prediction_qs.db)
            task_locks_qs = TaskLock.objects.filter(task__project_id=instance.id)
            task_locks_qs._raw_delete(task_locks_qs.db)
            task_qs = Task.objects.filter(project_id=instance.id)
            task_qs._raw_delete(task_qs.db)
            instance.delete()
        except IntegrityError as e:
            logger.error('Fallback to cascade deleting after integrity_error: {}'.format(str(e)))
            instance.delete()

    @swagger_auto_schema(auto_schema=None)
    def post(self, request, *args, **kwargs):
        return super(ProjectAPI, self).post(request, *args, **kwargs)

    @swagger_auto_schema(auto_schema=None)
    def put(self, request, *args, **kwargs):
        return super(ProjectAPI, self).put(request, *args, **kwargs)


@method_decorator(name='get', decorator=swagger_auto_schema(
        tags=['Projects'],
        operation_summary='Get next task to label',
        operation_description="""
            Get the next task for labeling. If you enable Machine Learning in
            your project, the response might include a "predictions"
            field. It contains a machine learning prediction result for
            this task.
        """,
        responses={200: TaskWithAnnotationsAndPredictionsAndDraftsSerializer()}
    ))

class ProjectMemberStatisticsAPI(generics.ListCreateAPIView, 
                       generics.RetrieveUpdateDestroyAPIView):
    parser_classes = (JSONParser, FormParser, MultiPartParser)
    permission_classes = (IsAuthenticated,)
    serializer_class = UserStatisticsSerializer

    def get_queryset(self,):
        
        project_id = self.kwargs['pk']
        user_id = None
        if 'user' in self.kwargs:
            user_id = self.kwargs['user']
        current_user_id = self.request.user.id
        # time_point = json.loads(self.request.body)['time_point']
        # if time_point is None:
        #     time_point = "2021-01-27 00:00:00+07"
        # TODO: Only Project Leader or above can see member list
        # TODO: use django permission instead of directly checking if role is manager as below
        if not ProjectMember.objects.filter(user=current_user_id, project=project_id, role__in=['manager', 'owner']).exists():
            raise DatasetJscDatabaseException("Operation can only be performed by a project manager or project owner")
        current_project = Project.objects.get(id=project_id)
        time_point = "2021-07-13 00:00:00+07"

        if user_id != None:
            return User.objects.filter(id=user_id, project_memberships__project_id=project_id).annotate(num_tasks=Count('annotations__task', filter=Q(annotations__task__project=current_project) & Q(annotations__updated_at__gt=time_point)), 
                                                                                        num_annotations=Count('annotations', filter=Q(annotations__task__project=current_project) & Q(annotations__updated_at__gt=time_point)),
                                                                                        num_skips=Count('annotations', filter=Q(annotations__was_cancelled=True) & Q(annotations__task__project=current_project) & Q(annotations__updated_at__gt=time_point)),
                                                                                        avg_lead_time=Avg('annotations__lead_time', filter=Q(annotations__task__project=current_project) & Q(annotations__updated_at__gt=time_point)))

        return User.objects.filter(project_memberships__project_id=project_id).annotate(num_tasks=Count('annotations__task', filter=Q(annotations__task__project=current_project) & Q(annotations__updated_at__gt=time_point)), 
                                                                                        num_annotations=Count('annotations', filter=Q(annotations__task__project=current_project) & Q(annotations__updated_at__gt=time_point)),
                                                                                        num_skips=Count('annotations', filter=Q(annotations__was_cancelled=True) & Q(annotations__task__project=current_project) & Q(annotations__updated_at__gt=time_point)),
                                                                                        avg_lead_time=Avg('annotations__lead_time', filter=Q(annotations__task__project=current_project) & Q(annotations__updated_at__gt=time_point)))


class ProjectMemberAPI(generics.ListCreateAPIView, 
                       generics.RetrieveUpdateDestroyAPIView):
    parser_classes = (JSONParser, FormParser, MultiPartParser)
    permission_classes = (IsAuthenticated,)
    filter_backends = [filters.SearchFilter]
    serializer_class = ProjectMemberSerializer

    search_fields = ['user__username', 'user__email', 'user__first_name', 'user__last_name']

    def get_queryset(self,):
        project_id = self.kwargs['pk']
        user_id = None
        if 'user' in self.kwargs:
            user_id = self.kwargs['user']
        current_user_id = self.request.user.id
        project = Project.objects.get(id=project_id)

        current_user_role = self.get_project_member_role(project_id, current_user_id)
        # TODO: Only Project Leader or above can see member list
        # TODO: use django permission instead of directly checking if role is manager as below
        if user_id != None and (user_id == current_user_id or current_user_role in ["manager", "owner"]):
            return ProjectMember.objects.filter(project=project_id, user=user_id)

        if not ProjectMember.objects.filter(user=current_user_id, project=project_id, role__in=['manager', 'owner']).exists() and current_user_id != project.created_by_id:
            raise DatasetJscDatabaseException("Operation can only be performed by a project manager or project owner")
        
        members = ProjectMember.objects.filter(project=project_id).order_by('-role')
        members = members.extra(select={'total_records': members.count()}) # This extra total_records will temporarily help frontend to paginate members list 

        if self.request.query_params.get('search'):
            return members

        paginated_members = paginator(members, self.request)
        return paginated_members

    def get_object(self):
        current_user_id = self.request.user.id
        project_id = self.kwargs['pk']
        user_id = json.loads(self.request.body)['user_pk']

        if not Project.objects.filter(pk=project_id).exists():
            raise DatasetJscDatabaseException('There is no such project')
        if not User.objects.filter(pk=user_id).exists():
            raise DatasetJscDatabaseException('There is no such member')
        # TODO: use django permission instead of directly checking if role is manager as below
        #if not ProjectMember.objects.filter(user=current_user_id, project=project_id, role__in=['manager', 'owner']).exists():
        #    raise DatasetJscDatabaseException("Operation can only be performed by a project manager or project owner")
        if not ProjectMember.objects.filter(user=user_id, project=project_id).exists():
            raise DatasetJscDatabaseException('There is no such member in the project')

        project = Project.objects.get(pk=project_id)
        user = User.objects.get(pk=user_id)
        queryset = ProjectMember.objects.filter(project=project, user=user)

        obj = get_object_or_404(queryset)
        self.check_object_permissions(self.request, obj)
        return obj

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        result, detail = self.perform_destroy(instance)
        if result == True:
            return Response({'code':200, 'detail': detail}, status=status.HTTP_200_OK)
        raise DatasetJscDatabaseException(detail)

    def get_project_member_role(self, project_id: str, user_id: str) -> str:
        """
            Returns role of specific user in a project by id.
            Returns `None` if that user doesn't exist
        """
        current_project = Project.objects.get(id=project_id)
        current_user = ProjectMember.objects.filter(project_id=project_id, user_id=user_id).first()

        if not hasattr(current_user, 'role'):
            return None
        if current_user.role is not None:
            return current_user.role
        if current_project.created_by_id == user_id:
            return 'owner'
        return 'annotator'
        
    def perform_create(self, serializer):
        # Added by NgDMau
        # check if logging user is admin of current project
        # if yes, user can add others to this current project, else cant
        current_user_id = self.request.user.id
        project_id = self.kwargs['pk']

        user_id = json.loads(self.request.body)['user_pk']
        user_role = json.loads(self.request.body)['role']

        current_user_role = self.get_project_member_role(project_id, current_user_id)

        # Error handling

        if current_user_role != 'owner' and user_role == 'owner':
            raise DatasetJscDatabaseException('Operation can only be performed by a project owner')

        roles = ['owner', 'manager', 'reviewer', 'annotator','trainee','pending']
        if user_role not in roles:
            user_role = 'annotator' # In case body content changed unexpectedly

        if not Project.objects.filter(pk=project_id).exists():
            raise DatasetJscDatabaseException('There is no such project')
        if not User.objects.filter(pk=user_id).exists():
            raise DatasetJscDatabaseException('There is no such member')
        # TODO: use django permission instead of directly checking if role is manager as below
        #if not ProjectMember.objects.filter(user=current_user_id, project=project_id, role__in=['manager', 'owner',None]).exists():
        #   raise DatasetJscDatabaseException("Operation can only be performed by a project manager or project owner")
        if ProjectMember.objects.filter(user=user_id, project=project_id).exists():
            raise DatasetJscDatabaseException('This user is already in the project')
        
        project = Project.objects.get(pk=project_id)
        user = User.objects.get(pk=user_id)
        self.check_object_permissions(self.request, project)

        try:
            serializer.save(user=user, project=project, role=user_role)
            telegram_bot_sendtext("User " + user.username + " has joined project " + project.title.replace('#','no.') + " as a " + user_role)
        except IntegrityError as e:
            raise DatasetJscDatabaseException('Database error during project creation. Try again.')

    def perform_update(self, serializer):
        project_id = self.kwargs['pk']
        user_id = json.loads(self.request.body)['user_pk']
        contact_status = json.loads(self.request.body)['contact_status']
        role = json.loads(self.request.body)['role']

        project = Project.objects.get(pk=project_id)
        user = User.objects.get(pk=user_id)
        self.check_object_permissions(self.request, project)
        try:
            serializer.save(user=user, project=project, contact_status=contact_status, role=role)
        except IntegrityError as e:
            raise DatasetJscDatabaseException('Database error during project creation. Try again.')

    def perform_destroy(self, instance):
        body = json.loads(self.request.body)
        if 'user_pk' not in body:
            return False, "Member not found"

        project_id = self.kwargs['pk']
        member_id = body['user_pk']
        member_role = self.get_project_member_role(project_id, member_id)
        #operator_id = self.request.user.id
        #operator_role = self.get_project_member_role(project_id, operator_id)
        
        #if operator_role not in ["manager", "owner"]:
        #    return False, "Operation can only be performed by a project manager or project owner"

        if member_role == "owner":
            return False, "Could not remove owner from the project"

        user = User.objects.get(id=member_id)
        project = Project.objects.get(id=project_id)

        try:
            instance.delete()
            telegram_bot_sendtext("User " + user.username + " has been removed from project " + project.title.replace('#','no.'))
            return True, "Removed member successfully"
        except IntegrityError as e:
            logger.error('Fallback to cascase deleting after integrity_error: {}'.format(str(e)))
            return False, "Removed member failed"


    @swagger_auto_schema(tags=['ProjectMember'])
    def get(self, request, *args, **kwargs):
        return super(ProjectMemberAPI, self).get(request, *args, **kwargs)

    @swagger_auto_schema(tags=['ProjectMember'])
    def post(self, request, *args, **kwargs):
        return super(ProjectMemberAPI, self).post(request, *args, **kwargs)

    @swagger_auto_schema(tags=['ProjectMember'])
    def patch(self, request, *args, **kwargs):
        return super(ProjectMemberAPI, self).patch(request, *args, **kwargs)

    @swagger_auto_schema(tags=['ProjectMember'])
    def delete(self, request, *args, **kwargs):
        return super(ProjectMemberAPI, self).delete(request, *args, **kwargs)


class ProjectNextTaskAPI(generics.RetrieveAPIView):
    permission_required = all_permissions.tasks_view
    serializer_class = TaskWithAnnotationsAndPredictionsAndDraftsSerializer  # using it for swagger API docs

    # def _get_random_unlocked(self, task_query, upper_limit=None):
    #     # get random task from task query, ignoring locked tasks
    #     n = task_query.count()
    #     if n > 0:
    #         upper_limit = upper_limit or n
    #         random_indices = np.random.permutation(upper_limit)
    #         task_query_only = task_query.only('overlap', 'id')

    #         for i in random_indices:
    #             try:
    #                 task = task_query_only[int(i)]
    #             except IndexError as exc:
    #                 logger.error(f'Task query out of range for {int(i)}, count={task_query_only.count()}. '
    #                              f'Reason: {exc}', exc_info=True)
    #             except Exception as exc:
    #                 logger.error(exc, exc_info=True)
    #             else:
    #                 try:
    #                     task = Task.objects.select_for_update(skip_locked=True).get(pk=task.id)
    #                     if not task.has_lock(self.current_user):
    #                         return task
    #                 except Task.DoesNotExist:
    #                     logger.debug('Task with id {} locked'.format(task.id))

    def _get_first_unlocked(self, tasks_query):
        # Skip tasks that are locked due to being taken by collaborators
        for task_id in tasks_query.values_list('id', flat=True):
            try:
                task = Task.objects.select_for_update(skip_locked=True).get(pk=task_id)
                if not task.has_lock(self.current_user):
                    return task
            except Task.DoesNotExist:
                logger.debug('Task with id {} locked'.format(task_id))

    def _try_ground_truth(self, tasks, project):
        """Returns task from ground truth set"""
        ground_truth = Annotation.objects.filter(task=OuterRef('pk'), ground_truth=True)
        not_solved_tasks_with_ground_truths = tasks.annotate(
            has_ground_truths=Exists(ground_truth)).filter(has_ground_truths=True)
        if not_solved_tasks_with_ground_truths.exists():
            if project.sampling == project.SEQUENCE:
                return self._get_first_unlocked(not_solved_tasks_with_ground_truths)
            return self._get_random_unlocked(not_solved_tasks_with_ground_truths)

    def _try_tasks_with_overlap(self, tasks):
        """Filter out tasks without overlap (doesn't return next task)"""
        tasks_with_overlap = tasks.filter(overlap__gt=1)
        if tasks_with_overlap.exists():
            return None, tasks_with_overlap
        else:
            return None, tasks.filter(overlap=1)

    def _try_breadth_first(self, tasks):
        """Try to find tasks with maximum amount of annotations, since we are trying to label tasks as fast as possible
        """

        # =======
        # This commented part is trying to solve breadth-first in a bit different way:
        # it selects first task where any amount of annotations have been already created
        # we've left it here to be able to select it through the project settings later
        # =======
        # annotations = Annotation.objects.filter(task=OuterRef('pk'), ground_truth=False)
        # not_solved_tasks_labeling_started = tasks.annotate(labeling_started=Exists(annotations))
        # not_solved_tasks_labeling_started_true = not_solved_tasks_labeling_started.filter(labeling_started=True)
        # if not_solved_tasks_labeling_started_true.exists():
        #     # try to complete tasks that are already in progress
        #     next_task = self._get_random(not_solved_tasks_labeling_started_true)
        #     return next_task

        tasks = tasks.annotate(annotations_count=Count('annotations'))
        max_annotations_count = tasks.aggregate(Max('annotations_count'))['annotations_count__max']
        if max_annotations_count == 0:
            # there is no any labeled tasks found
            return

        # find any task with maximal amount of created annotations
        not_solved_tasks_labeling_started = tasks.annotate(
            reach_max_annotations_count=Case(
                When(annotations_count=max_annotations_count, then=Value(True)),
                default=Value(False),
                output_field=BooleanField()))
        not_solved_tasks_labeling_with_max_annotations = not_solved_tasks_labeling_started.filter(
            reach_max_annotations_count=True)
        if not_solved_tasks_labeling_with_max_annotations.exists():
            # try to complete tasks that are already in progress
            return self._get_random_unlocked(not_solved_tasks_labeling_with_max_annotations)

    def _try_uncertainty_sampling(self, tasks, project, user_solved_tasks_array):
        task_with_current_predictions = tasks.filter(predictions__model_version=project.model_version)
        if task_with_current_predictions.exists():
            logger.debug('Use uncertainty sampling')
            # collect all clusters already solved by user, count number of solved task in them
            user_solved_clusters = project.prepared_tasks.filter(pk__in=user_solved_tasks_array).annotate(
                cluster=Max('predictions__cluster')).values_list('cluster', flat=True)
            user_solved_clusters = Counter(user_solved_clusters)
            # order each task by the count of how many tasks solved in it's cluster
            cluster_num_solved_map = [When(predictions__cluster=k, then=v) for k, v in user_solved_clusters.items()]

            num_tasks_with_current_predictions = task_with_current_predictions.count()  # WARNING! this call doesn't work after consequent annotate
            if cluster_num_solved_map:
                task_with_current_predictions = task_with_current_predictions.annotate(
                    cluster_num_solved=Case(*cluster_num_solved_map, default=0, output_field=DecimalField()))
                # next task is chosen from least solved cluster and with lowest prediction score
                possible_next_tasks = task_with_current_predictions.order_by('cluster_num_solved', 'predictions__score')
            else:
                possible_next_tasks = task_with_current_predictions.order_by('predictions__score')

            num_annotators = project.annotators().count()
            if num_annotators > 1 and num_tasks_with_current_predictions > 0:
                # try to randomize tasks to avoid concurrent labeling between several annotators
                next_task = self._get_random_unlocked(
                    possible_next_tasks, upper_limit=min(num_annotators + 1, num_tasks_with_current_predictions))
            else:
                next_task = self._get_first_unlocked(possible_next_tasks)
        else:
            # uncertainty sampling fallback: choose by random sampling
            logger.debug(f'Uncertainty sampling fallbacks to random sampling '
                         f'(current project.model_version={str(project.model_version)})')
            next_task = self._get_random_unlocked(tasks)
        return next_task

    def _make_response(self, next_task, request, use_task_lock=True):
        """Once next task has chosen, this function triggers inference and prepare the API response"""
        user = request.user
        project = next_task.project

        if use_task_lock:
            # set lock for the task with TTL 3x time more then current average lead time (or 1 hour by default)
            next_task.set_lock(request.user)

        # call machine learning api and format response
        if project.show_collab_predictions and not next_task.predictions.exists():
            for ml_backend in project.ml_backends.all():
                ml_backend.predict_one_task(next_task)

        # serialize task
        context = {'request': request, 'project': project, 'resolve_uri': True,
                   'proxy': bool_from_request(request.GET, 'proxy', True)}
        serializer = TaskWithAnnotationsAndPredictionsAndDraftsSerializer(next_task, context=context)
        response = serializer.data

        annotations = []
        for c in response.get('annotations', []):
            if c.get('completed_by') == user.id and not (c.get('ground_truth') or c.get('honeypot')):
                annotations.append(c)
        response['annotations'] = annotations

        # remove all predictions if we don't want to show it in the label stream
        if not project.show_collab_predictions:
            response['predictions'] = []

        return Response(response)

    def get(self, request, *args, **kwargs):
        project = get_object_with_check_and_log(request, Project, pk=self.kwargs['pk'])
        self.check_object_permissions(request, project)
        user = request.user
        self.current_user = user

        # support actions api call from actions/next_task.py
        if hasattr(self, 'prepared_tasks'):
            project.prepared_tasks = self.prepared_tasks
        # get prepared tasks from request params (filters, selected items)
        else:
            project.prepared_tasks = get_prepared_queryset(self.request, project)

        # detect solved and not solved tasks
        user_solved_tasks_array = user.annotations.filter(ground_truth=False)\
            .exclude(was_cancelled=True)\
            .filter(task__isnull=False).distinct().values_list('task__pk', flat=True)

        with conditional_atomic():
            not_solved_tasks = project.prepared_tasks.\
                exclude(pk__in=user_solved_tasks_array)

            # if annotator is assigned for tasks, he must to solve it regardless of is_labeled=True
            assigned_flag = hasattr(self, 'assignee_flag') and self.assignee_flag
            if not assigned_flag:
                not_solved_tasks = not_solved_tasks.filter(is_labeled=False)

            not_solved_tasks_count = not_solved_tasks.count()

            # return nothing if there are no tasks remain
            if not_solved_tasks_count == 0:
                raise NotFound(f'There are no tasks remaining to be annotated by the user={user}')
            logger.debug(f'{not_solved_tasks_count} tasks that still need to be annotated for user={user}')

            # ordered by data manager
            if assigned_flag:
                next_task = not_solved_tasks.filter(annotator_assigned=user).first()
                if not next_task:
                    raise NotFound('No more tasks found')
                return self._make_response(next_task, request, use_task_lock=False)

            # If current user has already lock one task - return it (without setting the lock again)
            next_task = Task.get_locked_by(user, tasks=not_solved_tasks)
            if next_task:
                return self._make_response(next_task, request, use_task_lock=False)

            if project.show_ground_truth_first:
                logger.debug(f'User={request.user} tries ground truth from {not_solved_tasks_count} tasks')
                next_task = self._try_ground_truth(not_solved_tasks, project)
                if next_task:
                    return self._make_response(next_task, request)

            if project.show_overlap_first:
                # don't output anything - just filter tasks with overlap
                logger.debug(f'User={request.user} tries overlap first from {not_solved_tasks_count} tasks')
                _, not_solved_tasks = self._try_tasks_with_overlap(not_solved_tasks)

            # don't use this mode for data manager sorting, because the sorting becomes not obvious
            if project.sampling != project.SEQUENCE:
                # if there any tasks in progress (with maximum number of annotations), randomly sampling from them
                logger.debug(f'User={request.user} tries depth first from {not_solved_tasks_count} tasks')
                next_task = self._try_breadth_first(not_solved_tasks)
                if next_task:
                    return self._make_response(next_task, request)

            if project.sampling == project.UNCERTAINTY:
                logger.debug(f'User={request.user} tries uncertainty sampling from {not_solved_tasks_count} tasks')
                next_task = self._try_uncertainty_sampling(not_solved_tasks, project, user_solved_tasks_array)

            elif project.sampling == project.UNIFORM:
                logger.debug(f'User={request.user} tries random sampling from {not_solved_tasks_count} tasks')
                next_task = self._get_random_unlocked(not_solved_tasks)

            elif project.sampling == project.SEQUENCE:
                logger.debug(f'User={request.user} tries sequence sampling from {not_solved_tasks_count} tasks')
                next_task = self._get_first_unlocked(not_solved_tasks)

            if next_task:
                return self._make_response(next_task, request)
            else:
                raise NotFound(
                    f'There are still some tasks to complete for the user={user}, but they seem to be locked by another user.')


@method_decorator(name='post', decorator=swagger_auto_schema(
        tags=['Projects'],
        operation_summary='Validate label config',
        operation_description='Validate a labeling configuration for a project.',
        responses={200: 'Validation success'}
    ))
class LabelConfigValidateAPI(generics.CreateAPIView):
    parser_classes = (JSONParser, FormParser, MultiPartParser)
    permission_classes = (AllowAny,)
    serializer_class = ProjectLabelConfigSerializer

    def post(self, request, *args, **kwargs):
        return super(LabelConfigValidateAPI, self).post(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
        except RestValidationError as exc:
            context = self.get_exception_handler_context()
            response = exception_handler(exc, context)
            response = self.finalize_response(request, response)
            return response

        return Response(status=status.HTTP_204_NO_CONTENT)


@method_decorator(name='post', decorator=swagger_auto_schema(
        tags=['Projects'],
        operation_summary='Validate a label config',
        manual_parameters=[
            openapi.Parameter(
                name='label_config',
                type=openapi.TYPE_STRING,
                in_=openapi.IN_QUERY,
                description='labeling config')
        ]
))
class ProjectLabelConfigValidateAPI(generics.RetrieveAPIView):
    """ Validate label config
    """
    parser_classes = (JSONParser, FormParser, MultiPartParser)
    serializer_class = ProjectLabelConfigSerializer
    permission_required = all_permissions.projects_change
    queryset = Project.objects.all()

    def post(self, request, *args, **kwargs):
        project = self.get_object()
        label_config = self.request.data.get('label_config')
        if not label_config:
            raise RestValidationError('Label config is not set or is empty')

        # check new config includes meaningful changes
        has_changed = config_essential_data_has_changed(label_config, project.label_config)
        project.validate_config(label_config)
        return Response({'config_essential_data_has_changed': has_changed}, status=status.HTTP_200_OK)

    @swagger_auto_schema(auto_schema=None)
    def get(self, request, *args, **kwargs):
        return super(ProjectLabelConfigValidateAPI, self).get(request, *args, **kwargs)


class ProjectSummaryAPI(generics.RetrieveAPIView):
    parser_classes = (JSONParser,)
    serializer_class = ProjectSummarySerializer
    permission_required = all_permissions.projects_view
    queryset = ProjectSummary.objects.all()

    @swagger_auto_schema(tags=['Projects'], operation_summary='Project summary')
    def get(self, *args, **kwargs):
        return super(ProjectSummaryAPI, self).get(*args, **kwargs)


@method_decorator(name='delete', decorator=swagger_auto_schema(
        tags=['Projects'],
        operation_summary='Delete all tasks',
        operation_description='Delete all tasks from a specific project.'
))
@method_decorator(name='get', decorator=swagger_auto_schema(
        **paginator_help('tasks', 'Projects'),
        operation_summary='List project tasks',
        operation_description="""
            Retrieve a paginated list of tasks for a specific project. For example, use the following cURL command:
            ```bash
            curl -X GET {}/api/projects/{{id}}/tasks/ -H 'Authorization: Token abc123'
            ```
        """.format(settings.HOSTNAME or 'https://localhost:8080')
    ))
class TasksListAPI(generics.ListCreateAPIView,
                   generics.DestroyAPIView,
                   APIViewVirtualMethodMixin,
                   APIViewVirtualRedirectMixin):

    parser_classes = (JSONParser, FormParser)
    permission_required = ViewClassPermission(
        GET=all_permissions.tasks_view,
        POST=all_permissions.tasks_change,
        DELETE=all_permissions.tasks_delete,
    )
    serializer_class = TaskSerializer
    redirect_route = 'projects:project-settings'
    redirect_kwarg = 'pk'

    def get_queryset(self):
        project = generics.get_object_or_404(Project.objects.for_user(self.request.user), pk=self.kwargs.get('pk', 0))
        tasks = Task.objects.filter(project=project)
        return paginator(tasks, self.request)

    def delete(self, request, *args, **kwargs):
        project = generics.get_object_or_404(Project.objects.for_user(self.request.user), pk=self.kwargs['pk'])
        Task.objects.filter(project=project).delete()
        return Response(status=204)

    def get(self, *args, **kwargs):
        return super(TasksListAPI, self).get(*args, **kwargs)

    @swagger_auto_schema(auto_schema=None, tags=['Projects'])
    def post(self, *args, **kwargs):
        return super(TasksListAPI, self).post(*args, **kwargs)

    def get_serializer_context(self):
        context = super(TasksListAPI, self).get_serializer_context()
        context['project'] = get_object_with_check_and_log(self.request, Project, pk=self.kwargs['pk'])
        return context

    def perform_create(self, serializer):
        project = get_object_with_check_and_log(self.request, Project, pk=self.kwargs['pk'])
        serializer.save(project=project)


class TemplateListAPI(generics.ListAPIView):
    parser_classes = (JSONParser, FormParser, MultiPartParser)
    permission_required = all_permissions.projects_view
    swagger_schema = None

    def list(self, request, *args, **kwargs):
        annotation_templates_dir = find_dir('annotation_templates')
        configs = []
        for config_file in pathlib.Path(annotation_templates_dir).glob('**/*.yml'):
            config = read_yaml(config_file)
            if config.get('image', '').startswith('/static') and settings.HOSTNAME:
                # if hostname set manually, create full image urls
                config['image'] = settings.HOSTNAME + config['image']
            configs.append(config)
        template_groups_file = find_file(os.path.join('annotation_templates', 'groups.txt'))
        with open(template_groups_file, encoding='utf-8') as f:
            groups = f.read().splitlines()
        logger.debug(f'{len(configs)} templates found.')
        return Response({'templates': configs, 'groups': groups})


class ProjectSampleTask(generics.RetrieveAPIView):
    parser_classes = (JSONParser,)
    queryset = Project.objects.all()
    permission_required = all_permissions.projects_view
    serializer_class = ProjectSerializer
    swagger_schema = None

    def post(self, request, *args, **kwargs):
        label_config = self.request.data.get('label_config')
        if not label_config:
            raise RestValidationError('Label config is not set or is empty')

        project = self.get_object()
        return Response({'sample_task': project.get_sample_task(label_config)}, status=200)


class ProjectModelVersions(generics.RetrieveAPIView):
    parser_classes = (JSONParser,)
    swagger_schema = None
    permission_required = all_permissions.projects_view
    queryset = Project.objects.all()

    def get(self, request, *args, **kwargs):
        project = self.get_object()
        model_versions = Prediction.objects.filter(task__project=project).values_list('model_version', flat=True).distinct()
        return Response(data=model_versions)

class RankingProjectMemberAPI(generics.ListCreateAPIView,
                           generics.DestroyAPIView,
                           APIViewVirtualMethodMixin,
                           APIViewVirtualRedirectMixin):

    parser_classes = (JSONParser, FormParser, MultiPartParser)
    permission_classes = (IsAuthenticated,)
    serializer_class = UserStatisticsSerializer

    def get_queryset(self):
        project_id = self.kwargs['pk']
        user_id = None
        if 'user' in self.kwargs:
            user_id = self.kwargs['user']
        current_project = Project.objects.get(id=project_id)
        time_point = "2021-07-13 00:00:00+07"
        num_annotations = Count('annotations', filter=Q(annotations__task__project=current_project) & Q(
            annotations__updated_at__gt=time_point))

        return User.objects.filter(project_memberships__project_id=project_id).annotate(
            avg_lead_time=Avg('annotations__lead_time', filter=Q(annotations__task__project=current_project) & Q(annotations__updated_at__gt=time_point)),
            total_points = num_annotations * 100,
            rank=Window(
                expression=Rank(),
                order_by=F('total_points').desc(),
            )
        )
