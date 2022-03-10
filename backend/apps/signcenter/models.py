from django.db import models


class SignCenter(models.Model):
    '''
        수어통역센터의 정보를 관리하는 모델
    '''

    center_name = models.CharField(max_length=50)
    location = models.CharField(max_length=100)
    phone_num = models.CharField(max_length=15, blank=True)
    video_phone_num = models.CharField(max_length=15, null=True, blank=True)
    lat = models.FloatField(default=0.0)
    lng = models.FloatField(default=0.0)

    def __str__(self):
        return self.center_name

    class Meta:
        db_table = "sign_center"
