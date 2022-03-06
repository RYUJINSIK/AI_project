from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import LearningVideo
from .serializers import LearningVideoSerializer


class LearningVideoView(APIView):
    """
        교육용 영상 업로드 API
        GET : 교육용 영상을 조회하는 부분
        - video_name = 선택할 영상
        POST : 교육용 영상을 업로드하는 부분.
        - video_name = 비디오 이름
        - video_url = 업로드할 파일(형식 file)
        - category = 신체, 증상(B : 신체, S : 질환)
        - difficulty = 난이도(L : 하, M : 중, H : 상)
        - korean_name = 한국 이름

    """

    def get(self, request, video_name=None, format=None):
        queryset = LearningVideo.objects.filter(video_name=video_name)
        serializer = LearningVideoSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, format=None):
        serializer = LearningVideoSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LearningVideoAllView(APIView):
    '''
        난이도에 따라서 분류된 영상을
        보여주는 View
        difficulty
        - L : 쉬움
        - M : 중간
        - H : 상
    '''
    def get(self, request, format=None):
        queryset = LearningVideo.objects.all()
        serializer = LearningVideoSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class LearningVideoDifficultyView(APIView):
    '''
        난이도에 따라서 분류된 영상을
        보여주는 View
        difficulty
        - L : 쉬움
        - M : 중간
        - H : 상
    '''
    def get(self, request, difficulty=None, format=None):
        queryset = LearningVideo.objects.filter(difficulty=difficulty)
        serializer = LearningVideoSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class LearningVideoCategoryView(APIView):
    '''
        카테고리에 따라서 분류된 영상을
        보여주는 View
        category
        - B : 신체
        - S : 질환
    '''
    def get(self, request, category=None, format=None):
        queryset = LearningVideo.objects.filter(category=category)
        serializer = LearningVideoSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
