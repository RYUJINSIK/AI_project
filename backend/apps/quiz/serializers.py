from rest_framework import serializers

from .models import QuizDescription


class QuizSerializer(serializers.ModelSerializer):
    '''
    퀴즈 반환
    '''

    class Meta:
        model = QuizDescription
        fields = ["description"]
