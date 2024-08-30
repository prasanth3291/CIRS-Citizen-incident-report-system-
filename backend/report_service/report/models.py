from django.db import models
# Create your models here.
class Report(models.Model):
    offence_description = models.TextField()
    location = models.TextField()
    nearest_police_station = models.TextField()
    vehicle_number = models.TextField(null=True)
    no_of_offendents = models.IntegerField()
    accused = models.TextField(null=True)
    image = models.ImageField(upload_to='images/', blank=True, null=True)
    video = models.FileField(upload_to='videos/', blank=True, null=True)

class Station_details(models.Model):
    station_name=models.CharField( max_length=250)
    location=models.TextField()
    


