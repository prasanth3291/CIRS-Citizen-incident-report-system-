
from django.urls import path
from .import views
from .views import RegisterView,loginView,MyTokenObtainPairView
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

urlpatterns = [
    path('register/',RegisterView.as_view()),
    path('login/',loginView.as_view()),
    path('login/', MyTokenObtainPairView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'), 
    path("activate/<uidb64>/<token>/", views.activate, name="activate"),
    path('forgot_password/',views.forgot_password,name='forgot_password'),
    path('reset_password/',views.resest_password,name='reset_password'),
    path('get_nearby_police_station/',views.get_nearby_police_station, name='get_nearby_police_station'),
    path('profile/', views.profile_detail, name='profile_detail'),
    path('profile/update/', views.profile_update, name='profile_update'),
    path('refresh_google_token/', views.refresh_google_token, name='refresh_google_token'),
]
    
    

   
    

    



