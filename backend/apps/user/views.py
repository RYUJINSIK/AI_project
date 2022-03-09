from rest_framework import generics, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from apps.video.models import LearningVideo

from ..core.utils import extract_user_id
from .models import LearningHistory
from .serializers import (IdCheckSerializer, UserCreateSerializer,
                          UserLoginSerializer, UserRecordSerializer)
from .utils import medal_score, update_query_dict


class IdcheckView(generics.GenericAPIView):
    """
        아이디 중복 체크
    """

    serializer_class = IdCheckSerializer
    permission_classes = (AllowAny,)

    def post(self, request):
        serializer = IdCheckSerializer(data=request.data)
        if serializer.is_valid():
            return Response(serializer.data, status=200)
        else:
            return Response(serializer.errors, status=400)


class RegisterView(generics.GenericAPIView):
    """
        회원가입
    """

    serializer_class = UserCreateSerializer
    permission_classes = (AllowAny,)

    def post(self, request):
        serializer = UserCreateSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()  # DB 저장
            return Response(serializer.data, status=200)
        return Response(serializer.errors, status=200)


class UserloginView(generics.GenericAPIView):
    """
        로그인
    """

    serializer_class = UserLoginSerializer
    permission_classes = (AllowAny,)

    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)

        if not serializer.is_valid(raise_exception=True):
            return Response({"message": "Request Body Error."}, status=400)
        if serializer.validated_data['email'] == "None":
            return Response({'message': 'fail'}, status=400)

        response = {
            'success': 'True',
            'email': serializer.data['email'],
            'access_token': serializer.data['access_token'],
            'refresh_token': serializer.data['refresh_token']

        }
        return Response(response, status=200)


class UserScoreRecordView(generics.GenericAPIView):

    serializer_class = UserRecordSerializer

    def get_object(self, learning_video_id, user_id):
        return LearningHistory.objects.filter(
            learning_video_id=learning_video_id,
            user_id=user_id
        )

    def get(self, request):
        '''
            유저가 해당 영상을 학습한 이력이 있는지 확인한다.
            있다면 exists: True, 없다면 exists: False 반환
        '''
        user_id = extract_user_id(request)
        learning_video_id = request.query_params.get("learning_video_id")
        object = self.get_object(
            learning_video_id=learning_video_id,
            user_id=user_id
        )
        if object.exists():
            return Response(
                {"exists": True},
                status=status.HTTP_200_OK
            )
        else:
            return Response(
                {"exists": False},
                status=status.HTTP_200_OK
            )

    def post(self, request):
        '''
            request body
            score, learning_video_id
            get 요청시 exists가 False 인 경우 요청한다.
            단어에 맞는 user의 점수와 메달을 기입한다.
        '''
        score = int(request.data['score'])
        user_id = extract_user_id(request)
        medal_id = medal_score(score)
        request_data = update_query_dict(request.data, [user_id, medal_id])
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

    def patch(self, request):
        '''
            request body
            score, learning_video_id
            get 요청시 exists가 True 인 경우 요청한다.
            단어에 맞는 user의 점수와 메달을 수정한다.
        '''
        score = int(request.data['score'])
        learning_video_id = request.data['learning_video_id']
        user_id = extract_user_id(request)
        medal_id = medal_score(score)
        request_data = update_query_dict(request.data, [user_id, medal_id])
        history_obj = LearningHistory.objects.filter(
            user_id=user_id['user_id'],
            learning_video_id=learning_video_id
        ).first()
        serializer = self.serializer_class(
            history_obj,
            data=request_data,
            partial=True
        )
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"success": True},
                status=status.HTTP_200_OK
            )
        else:
            return Response(
                {"Bad Request"},
                status=status.HTTP_400_BAD_REQUEST,
            )


class MyPageListView(generics.GenericAPIView):
    """
        마이페이지 들어갈 데이터 요청
    """

    serializer_class = UserRecordSerializer

    def get(self, request):
        user_id = extract_user_id(request)

        learning_list = LearningHistory.objects.filter(
            user_id=user_id['user_id']).order_by('-updated_at').values('learning_video_id')

        word_list = []

        for list in learning_list:
            video_id = list['learning_video_id']
            word_list.append(LearningVideo.objects.filter(
                id=video_id).values('video_name', 'korean_name'))

        if word_list == []:
            return Response({
                'message': "학습한 기록이 없습니다."
            }, status=status.HTTP_200_OK)
        return Response(word_list, status=status.HTTP_200_OK)
