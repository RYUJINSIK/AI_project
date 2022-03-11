from rest_framework import status
from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from rest_framework.views import APIView

from ..core.utils import extract_user_id
from .models import RecordVideo
from .serializers import VideoSerializer
from .utils import (get_medal_name, keypoints_labeling, predict_check,
                    predict_score, video_patch)


class VideoUploadView(GenericAPIView):
    '''
        Frontend의 웹캠 비디오를 업로드 받는 API
        user_id : JWT 토큰에서 추출
    '''

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
                {"success": True},
                status=status.HTTP_201_CREATED
            )
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)


class VideoPatchView(APIView):
    '''
        받은 웹캠 영상의 해상도를 변환해주는 API
        user_id : JWT 토큰에서 추출
        PATCH : 사용자가 업로드한 가장 최신 영상을 변환 (해상도와 .avi확장자를 변경)
                변경 사항을 DB에 반영한다
    '''

    def patch(self, request):
        user_id = extract_user_id(request)['user_id']
        video_obj = RecordVideo.objects.filter(user_id=user_id).last()
        try:
            video_patch(video_obj)
        except ValueError:
            return Response(
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        return Response(
            {
                "success": True,
                "message": "Patch success",
            },
            status=status.HTTP_200_OK,
        )


class PredictScoreView(APIView):
    '''
        영상에서 keypoints을 추출하여 학습모델이 추론할 수 있는 형태로 가공하는 API
        사용자가 학습을 선택한 단어의 video_name을 query_params의 labels 변수에 받는다.
        user_id : JWT 토큰에서 추출.
        user_video : 사용자가 제공한 video
        user_sign : 사용자가 예측한 단어(label)
    '''

    def get_object(self, user_id):
        return RecordVideo.objects.filter(user_id=user_id).last()

    def get(self, request):
        user_id = extract_user_id(request)['user_id']
        user_video = self.get_object(user_id).video_url.name
        user_sign = request.query_params.get("labels")
        keypoints_data = predict_check(user_video)
        if not keypoints_data:
            return Response(
                {"추론을 진행하기에 영상 길이가 너무 짧습니다"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        predict_data = keypoints_labeling(keypoints_data)
        accuracy = predict_score(predict_data, user_sign)
        score = int(accuracy)
        medal_name = get_medal_name(score)
        return Response(
            {
                "score": score,
                "medal_name": medal_name
            },
            status=status.HTTP_200_OK,
        )
