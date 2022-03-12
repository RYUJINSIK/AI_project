from django.db import models

from .utils import upload_to


class LearningVideo(models.Model):
    '''
        학습용 단어 30개를 관리하는 model
    '''

    CATEGORY = [("B", "신체"), ("S", "질환")]
    DIFFICULTY = [("L", "하"), ("M", "중"), ("H", "상")]
    video_name = models.CharField(max_length=50)
    korean_name = models.CharField(max_length=50)
    video_url = models.FileField(
        upload_to=upload_to,
        default="learning/default",
    )
    image_url = models.FileField(
        upload_to=upload_to,
        default=""
    )
    category = models.CharField(max_length=1, choices=CATEGORY)
    difficulty = models.CharField(max_length=1, choices=DIFFICULTY)

    def __str__(self):
        return self.video_name

    class Meta:
        db_table = "learning_word"
