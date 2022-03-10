from django.db import models

from ..user.models import User
from ..video.models import LearningVideo


class QuizCollection(models.Model):
    '''
        퀴즈 컬랙션 모델
    '''

    collection_name = models.CharField(max_length=50)

    def __str__(self):
        return self.collection

    class Meta:
        db_table = "quiz_collection"


class QuizDescription(models.Model):
    '''
        보기를 관리하는 모델
    '''

    collection_id = models.ForeignKey(
        QuizCollection, on_delete=models.CASCADE,
        db_column="collection_id",
        default=""
    )
    description = models.CharField(
        max_length=20,
        db_column="description",
        default=""
    )
    korean_name = models.CharField(
        max_length=20,
        db_column="korean_name",
        default=""
    )

    def __str__(self):
        return self.description

    class Meta:
        db_table = "quiz_description"


class QuizQuestion(models.Model):
    '''
        퀴즈의 답과 보기를 관리하는 모델
    '''

    collection_id = models.ForeignKey(
        QuizCollection, on_delete=models.CASCADE,
        db_column="collection_id",
        default=""
    )
    answer_id = models.ForeignKey(
        QuizDescription, on_delete=models.CASCADE,
        db_column="answer_id",
        default=""
    )
    video_id = models.ForeignKey(
        LearningVideo, on_delete=models.CASCADE,
        db_column="video_id",
        default=""
    )
    question = models.CharField(max_length=30)

    def __str__(self):
        return self.question

    class Meta:
        db_table = "quiz_question"


class QuizUserCollection(models.Model):
    '''
        사용자 퀴즈 컬랙션 점수를 관리하는 모델
        (차후 확장성을 고려한 모델, 현재 서비스에는 이용되지 않음)
    '''

    collection_id = models.ForeignKey(
        QuizCollection, on_delete=models.CASCADE,
        db_column="collection_id",
        default=""
    )
    user_id = models.ForeignKey(
        User, on_delete=models.CASCADE,
        db_column="user_id",
        default=""
    )
    score = models.IntegerField(
        db_column="score",
        default=""
    )

    class Meta:
        db_table = "quiz_user_collection"
