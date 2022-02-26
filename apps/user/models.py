from django.db import models

from apps.core.models import TimeStampModel


class User(TimeStampModel):
    user_name = models.CharField(max_length=50)
    password = models.CharField(max_length=200)
    email = models.EmailField(max_length=100)
    address = models.CharField(max_length=200)
    
    def __str__(self):
        return self.user_name
    
    class Meta:
        db_table = 'user'

