"""This file and its contents are licensed under the Apache License 2.0. Please see the included NOTICE for copyright information and LICENSE for a copy of the license.
"""
from rest_framework import serializers
from django.conf import settings

from .models import User
from core.utils.common import load_func


class BaseUserSerializer(serializers.ModelSerializer):
    # short form for user presentation
    initials = serializers.SerializerMethodField(default='?', read_only=True)
    avatar = serializers.SerializerMethodField(read_only=True)

    def get_avatar(self, user):
        return user.avatar_url

    def get_initials(self, user):
        return user.get_initials()

    class Meta:
        model = User
        fields = (
            'id',
            'first_name',
            'last_name',
            'username',
            'email',
            'last_activity',
            'avatar',
            'initials',
            'phone',
            'active_organization',
            
        )


class UserSimpleSerializer(BaseUserSerializer):
    num_annotations=serializers.IntegerField(read_only=True)

    class Meta:
        model = User
        fields = ('id', 'first_name', 'last_name', 'email', 'avatar', 'num_annotations')

class UserStatisticsSerializer(BaseUserSerializer):
    num_tasks = serializers.IntegerField(read_only=True)
    num_annotations= serializers.IntegerField(read_only=True)
    num_skips= serializers.IntegerField(read_only=True)
    avg_lead_time= serializers.IntegerField(read_only=True)
    
    class Meta:
        model = User
        fields = ('id', 'first_name', 'last_name', 'email', 'avatar', 'num_tasks', 'num_annotations', 'num_skips', 'avg_lead_time')


UserSerializer = load_func(settings.USER_SERIALIZER)
