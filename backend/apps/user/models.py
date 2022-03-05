from tkinter import scrolledtext
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.db import models
from numpy import savez_compressed
from platformdirs import user_log_dir
from rest_framework_simplejwt.tokens import RefreshToken

from apps.core.models import TimeStampModel
from apps.video.models import LearningVideo


class UserManager(BaseUserManager):
    # 일반 user 생성
    def create_user(self, email, name, password=None):
        if not email:
            raise ValueError('must have user email')
        if not name:
            raise ValueError('must have user name')
        user = self.model(
            email=self.normalize_email(email),
            name=name
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    # 관리자 user 생성
    def create_superuser(self, email, name, password=None):
        user = self.create_user(
            email,
            password=password,
            name=name
        )
        user.is_admin = True
        user.save(using=self._db)
        return user


class User(AbstractBaseUser, TimeStampModel):
    id = models.AutoField(primary_key=True)
    email = models.EmailField(default='', max_length=100,
                              null=False, blank=False, unique=True)
    name = models.CharField(default='', max_length=100, null=False, blank=False)

    # User 모델의 필수 field
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)

    # 헬퍼 클래스 사용
    objects = UserManager()

    # 사용자의 username field는 name으로 설정
    USERNAME_FIELD = 'email'
    # 필수로 작성해야하는 field
    REQUIRED_FIELDS = ['name']

    def __str__(self):
        return self.email

    def tokens(self):
        refresh = RefreshToken.for_user(self)
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token)
        }

    class Meta:
        db_table = "user"


class LearningHistory(TimeStampModel):
    user_id = models.ForeignKey(
        User, on_delete=models.CSCADE,
        db_column="user_id",
        default=""
    )
    learning_video_id = models.ForeignKey(
        LearningVideo, on_delete=models.CASCADE,
        db_column="learning_video_id",
        default=""
    )  
    score = models.IntegerField(blank=True)

    class Meta:
        db_table = "learning_history"
