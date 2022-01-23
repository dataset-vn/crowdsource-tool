"""This file and its contents are licensed under the Apache License 2.0. Please see the included NOTICE for copyright information and LICENSE for a copy of the license.
"""
import logging

from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect, reverse
from django.contrib import auth
from django.conf import settings
from django.core.exceptions import PermissionDenied
from rest_framework.authtoken.models import Token
from django.utils.translation import activate, get_language
from django.contrib.sites.shortcuts import get_current_site
from django.http import HttpResponse
from django.shortcuts import render, redirect
from django.contrib.auth import login, authenticate
from django.contrib.sites.shortcuts import get_current_site
from django.utils.encoding import force_bytes, force_text
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.template.loader import render_to_string
from .tokens import account_activation_token
from django.core.mail import EmailMessage

from users.models import User
from users import forms
from core.utils.common import load_func
from users.functions import proceed_registration
from organizations.models import Organization
from organizations.forms import OrganizationSignupForm


logger = logging.getLogger()

from django.contrib.auth import views as auth_views
from core.utils.params import get_bool_env, get_env


class FPasswordResetView(auth_views.PasswordResetView):
    from_email = get_env('DTS_MAIL_HOST')
    template_name = 'password/password_reset_form.html'


class FPasswordResetDoneView(auth_views.PasswordResetDoneView):
    template_name = 'password/password_reset_done.html'


class FPasswordResetConfirmView(auth_views.PasswordResetConfirmView):
    template_name = 'password/password_reset_confirm.html'


class FPasswordResetCompleteView(auth_views.PasswordResetCompleteView):
    template_name = 'password/password_reset_complete.html'


@login_required
def logout(request):
    auth.logout(request)
    if settings.HOSTNAME:
        redirect_url = settings.HOSTNAME
        if not redirect_url.endswith('/'):
            redirect_url += '/'
        return redirect(redirect_url)
    return redirect('/')


def user_signup(request):
    """ Sign up page
    """
    language_navigator(request)
    user = request.user
    next_page = request.GET.get('next')
    token = request.GET.get('token')
    next_page = next_page if next_page else reverse('projects:project-index')
    user_form = forms.UserSignupForm()
    organization_form = OrganizationSignupForm()

    if user.is_authenticated:
        return redirect(next_page)

    # make a new user
    if request.method == 'POST':
        organization = Organization.objects.first()
        if settings.DISABLE_SIGNUP_WITHOUT_LINK is True:
            if not(token and organization and token == organization.token):
                raise PermissionDenied()

        user_form = forms.UserSignupForm(request.POST)
        organization_form = OrganizationSignupForm(request.POST)

        if user_form.is_valid():
            unAuthenticatedUser = user_form.save()
            unAuthenticatedUser.username = unAuthenticatedUser.email.split('@')[0]
            unAuthenticatedUser.is_active = False
            unAuthenticatedUser.save()
            redirect_response = proceed_registration(request, unAuthenticatedUser, organization_form, next_page)
            # if redirect_response:
            #     return redirect_response
            # user.is_active = False
            current_site = get_current_site(request)
            mail_subject = 'Activate your Dataset account'
            message = render_to_string('users/user_verify_email.html', {
                'user': unAuthenticatedUser,
                'domain': current_site.domain,
                'uid':urlsafe_base64_encode(force_bytes(unAuthenticatedUser.id)),
                'token':account_activation_token.make_token(unAuthenticatedUser),
            })
            to_email = user_form.cleaned_data.get('email')
            from_email = get_env('DTS_MAIL_HOST')
            email = EmailMessage(
                        mail_subject, message, from_email=from_email, to=[to_email]
            )
            email.send()
            return render(request,"users/user_active_email.html")

    return render(request, 'users/user_signup.html', {
        'user_form': user_form,
        'organization_form': organization_form,
        'next': next_page,
        'token': token,
    })

def activate_user(request, uidb64, token):
    try:
        uid = force_text(urlsafe_base64_decode(uidb64))
        user = User.objects.filter(id=uid)
    except(TypeError, ValueError, OverflowError, User.DoesNotExist):
        user = None
    if user is not None and account_activation_token.check_token(user[0], token):
        user.update(is_active=True)
        # user.save()
        # user_login(request)
        return redirect('/user/login')
        return HttpResponse('Thank you for your email confirmation. Now you can login your account.')
    else:
        return HttpResponse('Activation link is invalid!')

def user_login(request):
    """ Login page
    """
    language_navigator(request)
    user = request.user
    next_page = request.GET.get('next')
    next_page = next_page if next_page else reverse('projects:project-index')
    login_form = load_func(settings.USER_LOGIN_FORM)
    form = login_form()

    if user.is_authenticated:
        return redirect(next_page)

    if request.method == 'POST':
        form = login_form(request.POST)
        if form.is_valid():
            user = form.cleaned_data['user']
            auth.login(request, user, backend='django.contrib.auth.backends.ModelBackend')

            # user is organization member
            org_pk = Organization.find_by_user(user).pk
            user.active_organization_id = org_pk
            user.save(update_fields=['active_organization'])
            return redirect(next_page)

    return render(request, 'users/user_login.html', {
        'form': form,
        'next': next_page
    })


@login_required
def user_account(request):
    language_navigator(request)
    user = request.user

    if user.active_organization is None and 'organization_pk' not in request.session:
        return redirect(reverse('main'))

    form = forms.UserProfileForm(instance=user)
    token = Token.objects.get(user=user)

    if request.method == 'POST':
        form = forms.UserProfileForm(request.POST, instance=user)
        if form.is_valid():
            form.save()
            return redirect(reverse('user-account'))

    return render(request, 'users/user_account.html', {
        'settings': settings,
        'user': user,
        'user_profile_form': form,
        'token': token
    })


def language_navigator(request):
    """current_language = get_language()
    if current_language == 'vi':
      activate('vi')
    elif current_language == None:
      activate('vi')
    else:
      activate('en')"""
    
    activate('vi')
    if request.GET.get('lang') == 'vi':
      activate('vi')
    elif request.GET.get('lang') == 'en':
      activate('en')