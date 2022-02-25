from django.db import models
import sys
import os
print(sys.path.append(os.path.abspath(os.path.dirname(os.path.abspath(os.path.dirname(__file__))))))

from apps.user.models import User
from datetime import datetime

# def upload_to(instance, filename):
#     return 'posts/{filename}'.format(filename=filename)

# def upload_to2(instance, filename):
#     return 'user_{}/{}'.format(instance.id, filename)

def upload_to3(instance, filename):
    cur_time = str(datetime.today().strftime('%Y-%m-%d_%H-%M-%S'))
    return '{}/{}/{}'.format(instance.user_id, cur_time, filename)

class Video(models.Model):
    video_url = models.FileField(upload_to=upload_to3, default='posts/default')
    user_id = models.ForeignKey(User, on_delete=models.CASCADE, db_column='user_id', null=True)
    
    def __str__(self):
        return self.url
    
    # def save(self, *args, **kwargs):
    #     if self.id is None:
    #         temp_video = self.url
    #         self.url = None
    #         super().save(*args, **kwargs)
    #         self.url = temp_video
    #     super().save(*args, **kwargs)


