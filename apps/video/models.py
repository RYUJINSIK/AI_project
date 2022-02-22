# import os
# import sys

# sys.path.append(os.path.dirname(os.path.abspath(os.path.dirname(__file__))))
from django import urls
from django.db import models
# from user.models import User


def upload_to(instance, filename):
    return 'posts/{filename}'.format(filename=filename)

class Video(models.Model):
    url = models.FileField(upload_to='video/%y%m%d', default='posts/default')
    # url = models.FileField(upload_to=upload_to, default='posts/default.avi)
    # url = models.ForeignKey(User, on_delete=models.CASCADE)
    
    def __str__(self):
        return self.url