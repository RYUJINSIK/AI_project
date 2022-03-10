from rest_framework import serializers

from .models import QuizDescription


class QuizSerializer(serializers.ModelSerializer):
    '''
        퀴즈 보기를 직렬화
    '''

    class Meta:
        model = QuizDescription
        fields = ["description"]
