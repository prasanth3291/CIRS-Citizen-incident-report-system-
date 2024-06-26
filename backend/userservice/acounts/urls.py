
from django.urls import path
from .import views
from .views import RegisterView,loginView,MyTokenObtainPairView
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

urlpatterns = [
    path('register/',RegisterView.as_view()),
    path('login/',loginView.as_view()),
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'), 
    path("activate/<uidb64>/<token>/", views.activate, name="activate"),
    path('forgot_password/',views.forgot_password,name='forgot_password'),
    path('reset_password/',views.resest_password,name='reset_password'),
    path('get_nearby_police_station/',views.get_nearby_police_station, name='get_nearby_police_station'),

   
    

    

]


