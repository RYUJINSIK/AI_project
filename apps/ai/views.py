from rest_framework import status
from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.user.models import User

from .models import RecordVideo
from .serializers import VideoSerializer, VideoUpdateSerializer


class VideoView(APIView):
    """
        post request로 받은 사용자영상을 업로드하는 API
    """

    def get(self, request, format=None):
        queryset = RecordVideo.objects.all()
        serializer = VideoSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, format=None):
        serializer = VideoSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


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
