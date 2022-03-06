from rest_framework import serializers

from .models import LearningVideo


class LearningVideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = LearningVideo
        fields = "__all__"
