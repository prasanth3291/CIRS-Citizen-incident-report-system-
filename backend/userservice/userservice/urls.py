
from django.contrib import admin
from django.urls import path,include
from allauth.account.views import LoginView, LogoutView
from acounts.views import customeGoogleLogin


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/',include('acounts.urls')),
    path('acounts/',include('allauth.urls')),
    path('google/callback/', include('allauth.socialaccount.providers.google.urls')),
    path('dj-rest-auth/google/', customeGoogleLogin.as_view(), name='google_login')
    # path('api/social_auth/',include('socialauth.urls'))
    # path('accounts/google/login/', LoginView.as_view(), name='account_login'), 
    # path('accounts/logout/', LogoutView.as_view(), name='account_logout'),
    # path('accounts/user-details/', UserDetails.as_view(), name='user-details'),


    
]
