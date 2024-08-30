from django.urls import path
from .views import ReportView
from .import views



urlpatterns = [
    path('report/',ReportView.as_view(),name='report'),
    path('get_nearby_police_station/',views.get_nearby_police_station, name='get_nearby_police_station'),
    path('get_reports/',views.get_reports,name='get_reports'),
    path('sample/',views.sample,name="sample")
]
