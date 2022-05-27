"""This file and its contents are licensed under the Apache License 2.0. Please see the included NOTICE for copyright information and LICENSE for a copy of the license.
"""
import data_export.api
from django.shortcuts import redirect
from django.urls import include, path

from . import api, views

app_name = 'projects'

# reverse for projects:name
_urlpatterns = [
    path('', views.project_list, name='project-index'),
    path('<int:pk>/details/', views.project_details, name='project-details'),
    path('<int:pk>/settings/', views.project_settings,
         name='project-settings', kwargs={'sub_path': ''}),
    path('<int:pk>/settings/<sub_path>', views.project_settings,
         name='project-settings-anything'),

    path('upload-example/', views.upload_example_using_config,
         name='project-upload-example-using-config'),
]

# reverse for projects:api:name
_api_urlpatterns = [
    # CRUD
    path('', api.ProjectListAPI.as_view(), name='project-list'),
    path('<int:pk>/', api.ProjectAPI.as_view(), name='project-detail'),

    # Project members
    path('<int:pk>/members', api.ProjectMemberAPI.as_view(), name='project-members'),

    # Only 1 project member
    path('<int:pk>/members/<int:user>',
         api.ProjectMemberAPI.as_view(), name='project-member'),

    # Project statistics
    path('<int:pk>/statistics', api.ProjectMemberStatisticsAPI.as_view(),
         name='project-statistics'),

    # Project statistics for specific member
    path('<int:pk>/statistics/<int:user>',
         api.ProjectMemberStatisticsAPI.as_view(), name='project_member-statistics'),

    # Get next task
    path('<int:pk>/next/', api.ProjectNextTaskAPI.as_view(), name='project-next'),

    # Validate label config in general
    path('validate/', api.LabelConfigValidateAPI.as_view(),
         name='label-config-validate'),

    # Validate label config for project
    path('<int:pk>/validate', api.ProjectLabelConfigValidateAPI.as_view(),
         name='project-label-config-validate'),

    # Project summary
    path('<int:pk>/summary/', api.ProjectSummaryAPI.as_view(),
         name='project-summary'),

    # Tasks list for the project: get and destroy
    path('<int:pk>/tasks/', api.TasksListAPI.as_view(), name='project-tasks-list'),

    # Generate sample task for this project
    path('<int:pk>/sample-task/', api.ProjectSampleTask.as_view(),
         name='project-sample-task'),

    # List available model versions
    path('<int:pk>/model-versions/', api.ProjectModelVersions.as_view(),
         name='project-model-versions'),

    # Update contact status of project member
    path('<int:pk>/settings/members', api.ProjectMemberAPI.as_view(),
         name='update-project-member'),

    # Update ranking of project member
    path('<int:pk>/ranking', api.RankingProjectMemberAPI.as_view(),
         name='update-project-member-ranking'),

    # Update ranking of project member
    path('<int:pk>/filter_user', api.FilterUserAPI.as_view(),
         name='update-project-member-filter'),

]

_api_urlpatterns_templates = [
    path('', api.TemplateListAPI.as_view(), name='template-list'),
]


urlpatterns = [
    path('projects/', include(_urlpatterns)),
    path('api/projects/', include((_api_urlpatterns, app_name), namespace='api')),
    path('api/templates/', include((_api_urlpatterns_templates,
         app_name), namespace='api-templates')),
]
