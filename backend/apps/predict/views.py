from rest_framework import status
from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from rest_framework.views import APIView

from ..core.utils import extract_user_id
from .models import RecordVideo
from .serializers import VideoSerializer, VideoUpdateSerializer
from .utils import keypoints_labeling, predict_check, predict_score


class VideoView(GenericAPIView):
    """
    Frontend의 웹캠 비디오를 업로드 받는 API
    user_id : JWT 토큰에서 추출.
    """

    serializer_class = VideoSerializer

    def post(self, request):
        user_id = extract_user_id(request)
        request_data = request.data
        request_data.update(user_id)
        # user_id와 video_url을 serailizer에 query_dict 형태로 전달.
        serializer = self.serializer_class(data=request_data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"success"},
                status=status.HTTP_201_CREATED
            )
        else:
            return Response(
                {"Bad Request"},
                status=status.HTTP_400_BAD_REQUEST,
            )


class VideoPatchView(GenericAPIView):
    """
    받은 웹캠 비디오의 해상도를 변환해주는 View
    PATCH : 사용자의 가장 최신 비디오를 변환 한다.
    user_id : JWT 토큰에서 추출.
    """

    serializer_class = VideoUpdateSerializer

    def patch(self, request):
        user_id = extract_user_id(request)
        serializer = self.serializer_class(data=user_id)
        serializer.is_valid(raise_exception=True)
        return Response(
            {
                "success": True,
                "message": "Patch success",
            },
            status=status.HTTP_200_OK,
        )


class PredictScoreView(APIView):
    """
    영상에서 필요한 부분을 추출하여
    모델을 채점할 수 있는 형태로 가공한다.
    user_id : JWT 토큰에서 추출.
    user_video : 사용자가 제공한 video
    user_sign : 사용자가 예측한 단어
    """

    def get_object(self, user_id):
        return RecordVideo.objects.filter(user_id=user_id).last()

    def get(self, request):
        user_id = extract_user_id(request)['user_id']
        user_video = self.get_object(user_id).video_url.name
        user_sign = request.query_params.get("label")
        keypoints_data = predict_check(user_video)
        if not keypoints_data:
            return Response(
                {"추론을 진행하기에 영상 길이가 너무 짧습니다"},
                status=status.HTTP_501_NOT_IMPLEMENTED,
            )
        predict_data = keypoints_labeling(keypoints_data)
        accuracy = predict_score(predict_data, user_sign)

        return Response(
            accuracy,
            status=status.HTTP_200_OK,
        )
