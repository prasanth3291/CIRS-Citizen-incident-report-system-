# from allauth.socialaccount.views import OAuth2LoginView
from allauth.socialaccount.models import SocialAccount
from django.shortcuts import redirect
from django.urls import reverse
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.shortcuts import redirect
from allauth.account.views import LoginView
# from allauth.socialaccount.providers.google.views import GoogleLoginView


@method_decorator(login_required, name='dispatch')
class GoogleLoginView(LoginView):
    def get(self, request, *args, **kwargs):
        # Check if the user is already associated with a Google account
        google_account = SocialAccount.objects.filter(user=request.user, provider='google').first()
        if google_account:
            # User is already associated, redirect or perform custom logic
            return redirect('home')  # Replace 'home' with your desired URL

        # User is not associated, proceed with Google authentication
        return super().get(request, *args, **kwargs)

    def get_success_url(self):
        # Return the URL to redirect to after successful login
        return reverse('home')  # Replace 'home' with your desired URL
