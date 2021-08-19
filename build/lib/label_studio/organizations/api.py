"""This file and its contents are licensed under the Apache License 2.0. Please see the included NOTICE for copyright information and LICENSE for a copy of the license.
"""
import logging
import json

from django.urls import reverse
from django.conf import settings

from django.db import IntegrityError


from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from rest_framework import generics, status, filters

from rest_framework.views import APIView
from rest_framework.response import Response

from drf_yasg.utils import swagger_auto_schema
from django.utils.decorators import method_decorator

from label_studio.core.mixins import APIViewVirtualRedirectMixin, APIViewVirtualMethodMixin
from label_studio.core.permissions import all_permissions, ViewClassPermission
from label_studio.core.utils.common import get_object_with_check_and_log

from core.utils.exceptions import DatasetJscDatabaseException

from organizations.models import Organization, OrganizationMember
from organizations.serializers import (
    OrganizationSerializer, OrganizationIdSerializer, OrganizationMemberUserSerializer, OrganizationInviteSerializer
)


logger = logging.getLogger(__name__)


@method_decorator(name='get', decorator=swagger_auto_schema(
        tags=['Organizations'],
        operation_summary='List your organizations',
        operation_description="""
        Return a list of the organizations you've created or that you have access to.
        """
    ))
class OrganizationListAPI(generics.ListCreateAPIView):
    """
    GET get the list of organizations that current user is in.

    POST create a new organization which the current user is its owner.
    """
    parser_classes = (JSONParser, FormParser, MultiPartParser)
    permission_required = ViewClassPermission(
        GET=all_permissions.organizations_view,
        PUT=all_permissions.organizations_change,
        POST=all_permissions.organizations_create,
        PATCH=all_permissions.organizations_change,
        DELETE=all_permissions.organizations_change,
    )
    serializer_class = OrganizationIdSerializer

    def get_object(self):
        org = get_object_with_check_and_log(self.request, Organization, pk=self.kwargs[self.lookup_field])
        self.check_object_permissions(self.request, org)
        return org

    def get_queryset(self):
        return Organization.objects.filter(users=self.request.user).distinct()


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







    def get(self, request, *args, **kwargs):
        return super(OrganizationListAPI, self).get(request, *args, **kwargs)

    @swagger_auto_schema(auto_schema=None)
    def post(self, request, *args, **kwargs):
        return super(OrganizationListAPI, self).post(request, *args, **kwargs)


@method_decorator(name='get', decorator=swagger_auto_schema(
        tags=['Organizations'],
        operation_summary='Get organization members list',
        operation_description='Retrieve a list of the organization members and their IDs.'
    ))
class OrganizationMemberListAPI(generics.ListAPIView):

    parser_classes = (JSONParser, FormParser, MultiPartParser)
    permission_required = ViewClassPermission(
        GET=all_permissions.organizations_view,
        PUT=all_permissions.organizations_change,
        PATCH=all_permissions.organizations_change,
        DELETE=all_permissions.organizations_change,
    )
    
    filter_backends = [filters.SearchFilter]
    search_fields = ['user__username', 'user__email', 'user__first_name', 'user__last_name']

    serializer_class = OrganizationMemberUserSerializer

    def get_queryset(self):
        org = generics.get_object_or_404(self.request.user.organizations, pk=self.kwargs[self.lookup_field])
        return org.members.order_by('user__username')

    def get(self, request, *args, **kwargs):
        return super(OrganizationMemberListAPI, self).get(request, *args, **kwargs)


@method_decorator(name='get', decorator=swagger_auto_schema(
        tags=['Organizations'],
        operation_summary=' Get organization settings',
        operation_description='Retrieve the settings for a specific organization by ID.'
    ))
@method_decorator(name='patch', decorator=swagger_auto_schema(
        tags=['Organizations'],
        operation_summary='Update organization settings',
        operation_description='Update the settings for a specific organization by ID.'
    ))
class OrganizationAPI(APIViewVirtualRedirectMixin,
                      APIViewVirtualMethodMixin,
                      generics.RetrieveUpdateAPIView):

    parser_classes = (JSONParser, FormParser, MultiPartParser)
    queryset = Organization.objects.all()
    permission_required = all_permissions.organizations_change
    serializer_class = OrganizationSerializer

    redirect_route = 'organizations-dashboard'
    redirect_kwarg = 'pk'

    def get_object(self):
        org = generics.get_object_or_404(self.request.user.organizations, pk=self.kwargs[self.lookup_field])
        self.check_object_permissions(self.request, org)
        return org

    def get(self, request, *args, **kwargs):
        return super(OrganizationAPI, self).get(request, *args, **kwargs)

    def patch(self, request, *args, **kwargs):
        return super(OrganizationAPI, self).patch(request, *args, **kwargs)

    @swagger_auto_schema(auto_schema=None)
    def post(self, request, *args, **kwargs):
        return super(OrganizationAPI, self).post(request, *args, **kwargs)

    @swagger_auto_schema(auto_schema=None)
    def put(self, request, *args, **kwargs):
        return super(OrganizationAPI, self).put(request, *args, **kwargs)


@method_decorator(name='get', decorator=swagger_auto_schema(
        tags=["Invites"],
        operation_summary='Get organization invite link',
        operation_description='Get a link to use to invite a new member to an organization in Label Studio Enterprise.',
        responses={200: OrganizationInviteSerializer()}
    ))
class OrganizationInviteAPI(APIView):
    parser_classes = (JSONParser,)
    permission_required = all_permissions.organizations_change

    def get(self, request, *args, **kwargs):
        org = get_object_with_check_and_log(self.request, Organization, pk=request.user.active_organization_id)
        self.check_object_permissions(self.request, org)
        invite_url = '{}?token={}'.format(reverse('user-signup'), org.token)
        if hasattr(settings, 'FORCE_SCRIPT_NAME') and settings.FORCE_SCRIPT_NAME:
            invite_url = invite_url.replace(settings.FORCE_SCRIPT_NAME, '', 1)
        serializer = OrganizationInviteSerializer(data={'invite_url': invite_url, 'token': org.token})
        serializer.is_valid()
        return Response(serializer.data, status=200)


@method_decorator(name='post', decorator=swagger_auto_schema(
        tags=["Invites"],
        operation_summary='Reset organization token',
        operation_description='Reset the token used in the invitation link to invite someone to an organization.',
        responses={200: OrganizationInviteSerializer()}
    ))
class OrganizationResetTokenAPI(APIView):
    permission_required = all_permissions.organizations_invite
    parser_classes = (JSONParser,)

    def post(self, request, *args, **kwargs):
        org = request.user.active_organization
        org.reset_token()
        logger.debug(f'New token for organization {org.pk} is {org.token}')
        invite_url = '{}?token={}'.format(reverse('user-signup'), org.token)
        serializer = OrganizationInviteSerializer(data={'invite_url': invite_url, 'token': org.token})
        serializer.is_valid()
        return Response(serializer.data, status=201)