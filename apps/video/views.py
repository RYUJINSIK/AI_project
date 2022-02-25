from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Video
from .serializers import VideoSerializer


class VideoView(APIView):
    def post(self, request):
        serializer = VideoSerializer(data=request.data)
# 인기야 serializer의 결과는 python dic -> json 형태이다.
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
