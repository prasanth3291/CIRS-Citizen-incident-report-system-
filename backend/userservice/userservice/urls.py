
from django.contrib import admin
from django.urls import path,include
from acounts.views import customeGoogleLogin,google_login
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/',include('acounts.urls')),
    path('acounts/',include('allauth.urls')),
    path('google/callback/', include('allauth.socialaccount.providers.google.urls')),
    # new 2
    path('dj-rest-auth/', include('dj_rest_auth.urls')),
    path('dj-rest-auth/registration/', include('dj_rest_auth.registration.urls')),
    # path('dj-rest-auth/google/', customeGoogleLogin.as_view(), name='google_login'),
    path('api/auth/google/', google_login, name='google_login'),
]
urlpatterns = urlpatterns + static(
    settings.MEDIA_URL, document_root=settings.MEDIA_ROOT
)
