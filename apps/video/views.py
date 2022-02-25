import os
import sys

from moviepy.editor import VideoFileClip
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
# base_dir = os.path.join(os.path.abspath(os.path.dirname(os.path.dirname(os.path.abspath(os.path.dirname(__file__))))), '/media')
# video_url = serializer.data['url'][:13] # video/220222/0.avi
# video_name = serializer.data['url'][13:]

# s_path = os.path.join(*[base_dir, video_url, video_name])
# e_path = os.path.join(*[base_dir, video_url, 't', video_name])

# file = VideoFileClip(s_path)

# new = file.subclip(t_start=0, t_end=(1))
# new.write_videofile(e_path, codec='libx264')
