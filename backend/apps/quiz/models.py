from django.db import models

from ..user.models import User
from ..video.models import LearningVideo

# Create your models here.


class QuizCollection(models.Model):
    '''
        문제 모음 모델
    '''
    collection_name = models.CharField(max_length=50)

    def __str__(self):
        return self.collection

    class Meta:
        db_table = "quiz_collection"


class QuizDescription(models.Model):
    '''
        지문 모음 모델
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

    def __str__(self):
        return self.description

    class Meta:
        db_table = "quiz_description"


class QuizQuestion(models.Model):
    '''
        질문 종류 모델
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
        사용자 문제 모음 점수 관리
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
