from rest_framework import serializers

from .models import LearningVideo


class LearningVideoSerializer(serializers.ModelSerializer):
    '''
        학습용 단어 serializer
    '''

    class Meta:
        model = LearningVideo
        fields = "__all__"