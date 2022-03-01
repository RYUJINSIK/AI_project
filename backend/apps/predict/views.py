from rest_framework import status
from rest_framework.generics import GenericAPIView
from rest_framework.response import Response

from apps.user.models import User
from .models import RecordVideo
from .video import predict_score
from .serializers import VideoSerializer, VideoUpdateSerializer,PredictScoreSerializer


class VideoView(GenericAPIView):
    """
    Frontend의 웹캠 비디오를 업로드 받는 API
    1. Frontend 에서 Video file을 전달.
    2. Backend 에서 저장.
    """

    serializer_class = VideoSerializer

    """
        쿼리 조회에 필요한 queryset
    """

    def get_queryset(self):
        return User.objects.filter(id=self.kwargs["user_id"])

    def post(self, request):
        serializer = self.serializer_class(data=request.data)

        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(
            {"success"},
            status=status.HTTP_201_CREATED
        )


class VideoPatchView(GenericAPIView):
    """
    받은 웹캠 비디오의 해상도를 변환해주는 View
    PATCH : 사용자의 가장 최신 비디오를 변환 한다.
    """

    serializer_class = VideoUpdateSerializer

    def get_queryset(self):
        return User.objects.filter(id=self.kwargs["user_id"])

    def patch(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(
            {
                "success": True,
                "message": "Patch success",
            },
            status=status.HTTP_200_OK,
        )
    
class PredictScoreView(GenericAPIView):
    '''
    영상에서 필요한 부분을 추출하여
    모델을 채점할 수 있는 형태로 가공한다.
    '''

    serializer_class = PredictScoreSerializer

    def get_object(self,user_id):
        return RecordVideo.objects.filter(user_id=user_id).last()

    def get(self, request, user_id):
        score = self.get_object(user_id)
        serializer = self.serializer_class(score)
        video_url = serializer.data['video_url']
        accuracy = predict_score(video_url, "null")
        if accuracy:
            print(f'predict_score : {accuracy}')
        else:
            return Response(
                {"추론을 진행하기에 영상 길이가 너무 짧습니다"},
                status=status.HTTP_503_SERVICE_UNAVAILABLE)
        return Response(accuracy, status=status.HTTP_200_OK,)


