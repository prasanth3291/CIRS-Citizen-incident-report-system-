from rest_framework.views import APIView,Response,status
from .serializers import ReportSerializer
from rest_framework.decorators import api_view
# for nearest police station
import requests
from django.http import JsonResponse
# to get reports 
from .models import Report


class ReportView(APIView):
    def post(self,request):
        serializer = ReportSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            success_message = "Your response successfully saved"

            return Response(success_message, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
def get_nearby_police_station(request):     
    latitude = request.GET.get('latitude')
    longitude = request.GET.get('longitude')
    api_key = 'AIzaSyBcTjbgvSoIXc7Qb4F-TIFx_AM70rrhVD0'
    url = f'https://maps.googleapis.com/maps/api/place/nearbysearch/json?keyword=police+station&location={latitude},{longitude}&radius=10500&type=police+station&key={api_key}'

    response = requests.get(url)
    data = response.json()

    return JsonResponse(data)    

@api_view(['GET'])
def get_reports(request):
    reports = Report.objects.all()
    serializer =ReportSerializer(reports,many=True)
    return Response(serializer.data)
def sample(request):
    pass