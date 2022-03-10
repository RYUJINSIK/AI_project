from rest_framework import status
from rest_framework.generics import GenericAPIView
from rest_framework.response import Response

from .models import QuizDescription, QuizQuestion
from .serializers import QuizSerializer
from .utils import extract_quiz_list


class QuizView(GenericAPIView):
    '''
        퀴즈 유형 선택 시 해당 유형의 퀴즈 정보를 전달 해주는 API
    '''

    serializer_class = QuizSerializer

    def get_queryset(self, model, collection_id):
        return model.objects.filter(collection_id=collection_id)

    def get(self, request, collection_id):
        question_obj = self.get_queryset(QuizQuestion, collection_id)
        description_obj = self.get_queryset(QuizDescription, collection_id)
        quiz_list = extract_quiz_list(question_obj, description_obj)
        return Response(
            quiz_list,
            status=status.HTTP_200_OK
        )
