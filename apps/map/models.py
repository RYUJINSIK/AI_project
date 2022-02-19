from django.db import models


# Create your models here.
class Center(models.Model):
    name = models.CharField(max_length=50)
    location = models.CharField(max_length=100)
    voice_call = models.CharField(max_length=15, null=True)
    video_call = models.CharField(max_length=15, null=True, blank=True)
    lat = models.FloatField(default=0.0)
    lng = models.FloatField(default=0.0)
    
    def __str__(self):
      return self.name
