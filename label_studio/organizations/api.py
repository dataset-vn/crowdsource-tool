"""This file and its contents are licensed under the Apache License 2.0. Please see the included NOTICE for copyright information and LICENSE for a copy of the license.
"""
import logging
import json
from django.http import request
from django.db import IntegrityError


from django.urls import reverse
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response

from drf_yasg.utils import swagger_auto_schema

from core.mixins import APIViewVirtualRedirectMixin, APIViewVirtualMethodMixin
from core.permissions import IsAuthenticated, BaseRulesPermission
from core.utils.common import get_object_with_check_and_log
from core.utils.exceptions import DatasetJscDatabaseException

from users.models import User
from organizations.models import Organization, OrganizationMember
from organizations.serializers import (
    OrganizationSerializer, OrganizationIdSerializer, OrganizationMemberUserSerializer, OrganizationMemberSerializer, OrganizationInviteSerializer
)


logger = logging.getLogger(__name__)


class OrganizationAPIPermissions(BaseRulesPermission):
    perm = 'organizations.change_organization'


class OrganizationListAPI(generics.ListCreateAPIView,
                          generics.RetrieveUpdateDestroyAPIView):
    """
    get:
    List your organizations

    post:
    Create a new organization

    Return a list of the organizations you've created.
    """
    parser_classes = (JSONParser, FormParser, MultiPartParser)
    permission_classes = (IsAuthenticated, OrganizationAPIPermissions)
    serializer_class = OrganizationIdSerializer

    def get_object(self):
        org = get_object_with_check_and_log(self.request, Organization, pk=self.kwargs[self.lookup_field])
        self.check_object_permissions(self.request, org)
        return org

    def get_queryset(self):
        user_id = self.request.user.id
        orgs_id = OrganizationMember.objects.values_list('organization_id', flat=True).filter(user_id=user_id)
        orgs_list = Organization.objects.filter(id__in=orgs_id)
        return orgs_list

    def perform_create(self, serializer):
        org_creator = self.request.user
        org_title = json.loads(self.request.body)['title']

        
        try:
            org = serializer.save(created_by=org_creator, title=org_title)
            
        except IntegrityError as e:
            if 'duplicate key value violates unique constraint \"organization_created_by_id_key\"' in str(e):
                raise DatasetJscDatabaseException("Each user can create only one organization")

        try:
            OrganizationMember.objects.create(user=org_creator, organization=org)
        except IntegrityError as e:
            raise DatasetJscDatabaseException("Error(s) happened when adding this user to the new organization")

    @swagger_auto_schema(tags=['Organizations'])
    def get(self, request, *args, **kwargs):
        return super(OrganizationListAPI, self).get(request, *args, **kwargs)

    @swagger_auto_schema(tags=['Organizations'])
    def post(self, request, *args, **kwargs):
        return super(OrganizationListAPI, self).post(request, *args, **kwargs)

class OrganizationMemberListAPI(generics.ListCreateAPIView,
                                generics.RetrieveUpdateDestroyAPIView):

    """
    get:
    Get organization members list
 
    Retrieve a list of the organization members.
    """
 
    parser_classes = (JSONParser, FormParser, MultiPartParser)
    permission_classes = (IsAuthenticated, OrganizationAPIPermissions)
    serializer_class = OrganizationMemberUserSerializer
 
    def get_queryset(self):
        org = get_object_with_check_and_log(self.request, Organization, pk=self.kwargs[self.lookup_field])
        self.check_object_permissions(self.request, org)
        return org.members
 
    @swagger_auto_schema(tags=['Organizations'])
    def get(self, request, *args, **kwargs):
        return super(OrganizationMemberListAPI, self).get(request, *args, **kwargs)


class OrganizationMemberAPI(generics.ListCreateAPIView,
                            generics.RetrieveUpdateDestroyAPIView):
    """
    get:
    Get organization members list

    Retrieve a list of the organization members.
    """

    parser_classes = (JSONParser, FormParser, MultiPartParser)
    permission_classes = (IsAuthenticated, OrganizationAPIPermissions)
    serializer_class = OrganizationMemberSerializer

    # def get_object(self):
    #     queryset = self.get_queryset()

    #     obj = get_object_with_check_and_log(queryset, **filter)
    #     self.check_object_permissions(self.request, obj)
    #     return obj

    def get_queryset(self):
        # org = get_object_with_check_and_log(self.request, Organization, pk=self.kwargs[self.lookup_field])
        # self.check_object_permissions(self.request, org)

        org_id = self.kwargs['pk']
        current_user_id = self.request.user.id

        if not OrganizationMember.objects.filter(organization_id=org_id, user_id=current_user_id).exists():
            return

        # org = Organization.objects.get(id=org_id)
        return OrganizationMember.objects.filter(organization=org_id)

    def perform_create(self, serializer):
        org_id = self.kwargs['pk']
        member_id = json.loads(self.request.body)['user_pk']
        current_user_id = self.request.user.id

        member = User.objects.get(id=member_id)
        org = Organization.objects.get(id=org_id)

        # if not OrganizationMember.objects.filter(organization_id=org_id, user_id=current_user_id).exists():
        #     print("Only organization member can add new members")
        #     return

        try:
            serializer.save(user=member, organization=org)
        except IntegrityError as e:
            raise DatasetJscDatabaseException('Database error when adding member')

    def perform_destroy(self, instance):
        current_user_id = self.request.user.id
        member_id = json.loads(self.request.body)['user_pk']
        org_id = self.kwargs['pk']

        if not OrganizationMember.objects.filter(user=current_user_id, organization=org_id).exists():
            raise DatasetJscDatabaseException("Operation can only be performed by a organization member")

        try:
            instance = OrganizationMember.objects.get(user=member_id, organization=org_id)
            instance.delete()
        except IntegrityError as e:
            logger.error('Fallback to cascase deleting after integrity_error: {}'.format(str(e)))

        return


    @swagger_auto_schema(tags=['Organizations'])
    def get(self, request, *args, **kwargs):
        return super(OrganizationMemberAPI, self).get(request, *args, **kwargs)

    @swagger_auto_schema(tags=['Organizations'])
    def post(self, request, *args, **kwargs):
        return super(OrganizationMemberAPI, self).post(request, *args, **kwargs)

    @swagger_auto_schema(tags=['Organizations'])
    def delete(self, request, *args, **kwargs):
        return super(OrganizationMemberAPI, self).delete(request, *args, **kwargs)


class OrganizationAPI(APIViewVirtualRedirectMixin,
                      APIViewVirtualMethodMixin,
                      generics.RetrieveUpdateAPIView):
    """
    get:
    Get organization settings

    Retrieve the settings for a specific organization.

    patch:
    Update organization settings

    Update the settings for a specific organization.
    """
    parser_classes = (JSONParser, FormParser, MultiPartParser)
    queryset = Organization.objects.all()
    permission_classes = (IsAuthenticated, OrganizationAPIPermissions)
    serializer_class = OrganizationSerializer

    redirect_route = 'organizations-dashboard'
    redirect_kwarg = 'pk'

    def get_object(self):
        org = get_object_with_check_and_log(self.request, Organization, pk=self.kwargs[self.lookup_field])
        self.check_object_permissions(self.request, org)
        return org

    def get_queryset(self):
        user_id = self.request.user.id
        orgs_id = OrganizationMember.objects.values_list('organization_id', flat=True).filter(user_id=user_id)
        return Organization.objects.filter(id__in=orgs_id)

        #return Organization.objects.filter(created_by=self.request.user)

    @swagger_auto_schema(tags=['Organizations'])
    def get(self, request, *args, **kwargs):
        return super(OrganizationAPI, self).get(request, *args, **kwargs)

    @swagger_auto_schema(tags=['Organizations'])
    def patch(self, request, *args, **kwargs):
        return super(OrganizationAPI, self).patch(request, *args, **kwargs)

    @swagger_auto_schema(auto_schema=None)
    def post(self, request, *args, **kwargs):
        return super(OrganizationAPI, self).post(request, *args, **kwargs)

    @swagger_auto_schema(auto_schema=None)
    def put(self, request, *args, **kwargs):
        return super(OrganizationAPI, self).put(request, *args, **kwargs)


class OrganizationInviteAPI(APIView):
    parser_classes = (JSONParser,)
    permission_classes = (IsAuthenticated,)

    @swagger_auto_schema(
        tags=["Invites"],
        operation_summary='Get organization invite link',
        responses={200: OrganizationInviteSerializer()}
    )
    def get(self, request, *args, **kwargs):
        org = get_object_with_check_and_log(self.request, Organization, pk=request.user.active_organization_id)
        self.check_object_permissions(self.request, org)
        invite_url = '{}?token={}'.format(reverse('user-signup'), org.token)
        serializer = OrganizationInviteSerializer(data={'invite_url': invite_url, 'token': org.token})
        serializer.is_valid()
        return Response(serializer.data, status=200)


class OrganizationResetTokenAPI(APIView):
    parser_classes = (JSONParser,)
    permission_classes = (IsAuthenticated,)

    @swagger_auto_schema(
        tags=["Invites"],
        operation_summary='Reset organization token',
        responses={200: OrganizationInviteSerializer()}
    )
    def post(self, request, *args, **kwargs):
        org = get_object_with_check_and_log(self.request, Organization, pk=request.user.active_organization_id)
        self.check_object_permissions(self.request, org)
        org.reset_token()
        logger.debug(f'New token for organization {org.pk} is {org.token}')
        invite_url = '{}?token={}'.format(reverse('user-signup'), org.token)
        serializer = OrganizationInviteSerializer(data={'invite_url': invite_url, 'token': org.token})
        serializer.is_valid()
        return Response(serializer.data, status=201)

