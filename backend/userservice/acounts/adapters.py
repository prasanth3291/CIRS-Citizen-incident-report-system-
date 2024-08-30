from allauth.socialaccount.adapter import DefaultSocialAccountAdapter
from django.core.exceptions import ObjectDoesNotExist
from .models import User

class CustomSocialAccountAdapter(DefaultSocialAccountAdapter):
    
    def new_user(self, request, sociallogin):
        user = super().new_user(request, sociallogin)
        user.auth_provider = sociallogin.account.provider
        return user

    def save_user(self, request, sociallogin, form=None):
        email = sociallogin.account.extra_data.get('email')
        username = email.split('@')[0]  # Get the portion before the '@' for the username

        try:
            # Check if a user with this email already exists
            existing_user = User.objects.get(email=email)

            # If a user already exists, link this social login to the existing user
            sociallogin.user = existing_user
        except ObjectDoesNotExist:
            # If the user doesn't exist, create a new one
            user = self.new_user(request, sociallogin)
            user.username = username  # Set the username as the portion before '@'
            user.email = email
            user.first_name = sociallogin.account.extra_data.get('given_name', '')
            user.last_name = sociallogin.account.extra_data.get('family_name', '')
            user.auth_provider = sociallogin.account.provider
            user.save()
            sociallogin.user = user

        # Proceed with saving the social login and user link
        return super().save_user(request, sociallogin, form)
