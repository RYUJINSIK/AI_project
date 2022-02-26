from django.db import models


class TimeStampModel(models.Model):
    """생성, 수정 날짜 필드를 갖는 추상 모델
    """
    created_at = models.DateTimeField(verbose_name='생성된 날짜', auto_now_add=True)
    updated_at = models.DateTimeField(verbose_name='수정된 날짜', auto_now =True)
    
    class Meta:
        abstract = True
