from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import RecordVideo
from .serializers import VideoSerializer


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
