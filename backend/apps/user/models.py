from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.db import models
from rest_framework_simplejwt.tokens import RefreshToken

from apps.core.models import TimeStampModel
from apps.video.models import LearningVideo


class UserManager(BaseUserManager):
    '''
        사용자 생성 시 권한 설정을 위한 헬퍼 클래스
    '''

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
    '''
        사용자 정보를 관리하는 모델
    '''

    id = models.AutoField(primary_key=True)
    email = models.EmailField(default='', max_length=100,
                              null=False, blank=False, unique=True)
    name = models.CharField(
        default='',
        max_length=100,
        null=False,
        blank=False
    )

    # User 모델의 필수 field
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)

    # 헬퍼 클래스 사용
    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name']

    def __str__(self):
        return self.email

    def tokens(self):
        refresh = RefreshToken.for_user(self)
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token)
        }

    def get_name(self):
        return self.name

    class Meta:
        db_table = "user"


class MedalType(models.Model):
    '''
        메달 정보를 관리하는 모델
    '''

    medal_name = models.CharField(max_length=10)

    def __str__(self):
        return self.medal_name

    class Meata:
        db_table = "medal_type"


class LearningHistory(TimeStampModel):
    '''
        사용자의 학습 정보를 관리하는 모델
    '''

    user_id = models.ForeignKey(
        User, on_delete=models.CASCADE,
        db_column="user_id",
        default=""
    )
    learning_video_id = models.ForeignKey(
        LearningVideo, on_delete=models.CASCADE,
        db_column="learning_video_id",
        default=""
    )
    medal_id = models.ForeignKey(
        MedalType, on_delete=models.CASCADE,
        db_column="medal_id",
        default=""
    )
    score = models.IntegerField(blank=True)

    class Meta:
        db_table = "learning_history"
