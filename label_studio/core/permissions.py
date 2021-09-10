"""This file and its contents are licensed under the Apache License 2.0. Please see the included NOTICE for copyright information and LICENSE for a copy of the license.
"""
import logging
import rules

from pydantic import BaseModel
from typing import Optional

from django.shortcuts import redirect, reverse
from django.core.exceptions import PermissionDenied as HTMLPermissionDenied
from django.views.decorators.http import require_http_methods
from django.conf import settings
from django.apps import apps

from rest_framework.permissions import IsAuthenticated, SAFE_METHODS, BasePermission
from rest_framework.exceptions import PermissionDenied as DRFPermissionDenied

from core.utils.common import get_object_with_check_and_log
from users.models import User
logger = logging.getLogger(__name__)


class AllPermissions(BaseModel):
    organizations_create = 'organizations.create'
    organizations_view = 'organizations.view'
    organizations_change = 'organizations.change'
    organizations_delete = 'organizations.delete'
    organizations_invite = 'organizations.invite'
    projects_create = 'projects.create'
    projects_view = 'projects.view'
    projects_change = 'projects.change'
    projects_delete = 'projects.delete'
    tasks_create = 'tasks.create'
    tasks_view = 'tasks.view'
    tasks_change = 'tasks.change'
    tasks_delete = 'tasks.delete'
    annotations_create = 'annotations.create'
    annotations_view = 'annotations.view'
    annotations_change = 'annotations.change'
    annotations_delete = 'annotations.delete'
    actions_perform = 'actions.perform'
    predictions_any = 'predictions.any'


all_permissions = AllPermissions()


class ViewClassPermission(BaseModel):
    GET: Optional[str] = None
    PATCH: Optional[str] = None
    PUT: Optional[str] = None
    DELETE: Optional[str] = None
    POST: Optional[str] = None


def make_perm(name, pred, overwrite=False):
    if rules.perm_exists(name):
        if overwrite:
            rules.remove_perm(name)
        else:
            return
    rules.add_perm(name, pred)


for _, permission_name in all_permissions:
    make_perm(permission_name, rules.is_authenticated)


class PermissionException(Exception):
    pass


class BasePermission(IsAuthenticated):
    def __call__(self, *args, **kwargs):
        return self.has_object_permission(*args, **kwargs)


class BaseRulesPermission(BasePermission):
    perm = None

    def has_object_permission(self, request, view, obj):
        if request.user.has_perm(self.perm, obj):
            return True


class CanViewTask(BaseRulesPermission):
    perm = 'tasks.view_task'


class CanChangeTask(BaseRulesPermission):
    perm = 'tasks.change_task'


class CanViewProject(BaseRulesPermission):
    perm = 'projects.view_project'


class CanChangeProject(BaseRulesPermission):
    perm = 'projects.change_project'


class IsBusiness(BasePermission):
    """ Permission checks for business account
    """
    def has_permission(self, request, view):
        # check is user authenticated
        if not BasePermission.has_permission(self, request, view):
            return False

        # check user is business and it's approved
        if not request.user.is_anonymous:
            return True

        return False


class IsSuperuser(BasePermission):
    """ Check: is superuser, god mode
    """
    def has_permission(self, request, view):
        user = request.user

        # each super user has read only access
        if user.is_superuser and hasattr(request, 'method') and request.method == 'GET':
            return True

        # super user longvule070402@gmail.com has full read-write access
        elif user.is_superuser and user.email == 'longvule070402@gmail.com':
            return True

        return False

    def has_object_permission(self, request, view, obj):
        return self.has_permission(request, view)


class IsManager(BasePermission):
    """ Check: is user owner of this project, task or task annotation
    """

    def has_object_permission(self, request, view, obj):
        # Check if method is not DELETE which means its not deleting something
        if request.method in ["GET", "POST", "PATCH"]:
            return True
        user = request.user

        # TODO: Consider this get_object function to take in 'request' as another argument.
        # If that happens, we can check if user is project member in the get_object function.
        project = get_project(obj)
        if not project:
            return False

        member = ProjectMember.objects.get(project=project, user=user)
        # If this user is not project member, then deny
        if not member.exists():
            return False

            # Check if user is project's creator
        if member.role == "manager":
            return True

        return False


""" ProjectTemplate """


class CanModifyUserOrReadOnly(IsBusiness):

    def has_object_permission(self, request, view, obj):
        if IsSuperuser()(request, view, obj):
            return True

        if not isinstance(obj, User):
            raise PermissionError(f'obj is not User: type {type(obj)} found')

        # read only
        if request.method in SAFE_METHODS:
            return True

        # user who creates this template can delete it
        if request.user == obj:
            return True

        return False

#Predicates
@rules.predicate
def is_project_owner (user, project):
    if not project:
        return False

    member = ProjectMember.objects.get(project=project, user=user)
    # If this user is not project member, then deny
    if not member.exists():
        return False

    # Check if user is project's creator
    if member.role == "owner" or project.created_by == user:
        return True

    return False

@rules.predicate
def is_project_manager (user, project):
    if not project:
        return False

    member = ProjectMember.objects.get(project=project, user=user)
    # If this user is not project member, then deny
    if not member.exists():
        return False

    # Check if user is project's creator
    if member.role == "manager":
        return True

    return False

#Rules
rules.add_perm('projects.change_project', is_project_owner | is_project_manager)
rules.add_perm('projects.delete_project', is_project_owner)
rules.has_perm('projects.change_project', is_project_owner | is_project_manager)
rules.has_perm('projects.delete_project', is_project_owner)
