from django.db import models

# Create your models here.
class Center(models.Model):
  name = models.CharField(max_length=50)
  number = models.CharField(max_length=15)
  location = models.CharField(max_length=100)
  lat = models.FloatField(default=0.0)
  lng = models.FloatField(default=0.0)
  