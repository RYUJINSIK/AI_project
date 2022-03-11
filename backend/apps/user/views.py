from rest_framework import status
from rest_framework.generics import GenericAPIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from ..core.utils import extract_user_id
from .models import LearningHistory
from .serializers import (IdCheckSerializer, UserCreateSerializer,
                          UserLoginSerializer, UserRecordSerializer)
from .utils import (calc_medal, learning_record_check, response_mypage,
                    update_query_dict)


class IdcheckView(GenericAPIView):
    '''
        아이디 중복 확인하는 API
    '''

    serializer_class = IdCheckSerializer
    permission_classes = (AllowAny,)

    def post(self, request):
        serializer = IdCheckSerializer(data=request.data)
        if serializer.is_valid():
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)


class RegisterView(GenericAPIView):
    '''
        회원가입 API
    '''

    serializer_class = UserCreateSerializer
    permission_classes = (AllowAny,)

    def post(self, request):
        serializer = UserCreateSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"success": True},
                status=status.HTTP_201_CREATED
            )
        return Response(status=status.HTTP_400_BAD_REQUEST)


class UserloginView(GenericAPIView):
    '''
        사용자 로그인 API
    '''

    serializer_class = UserLoginSerializer
    permission_classes = (AllowAny,)

    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)

        if not serializer.is_valid(raise_exception=True):
            return Response(status=status.HTTP_400_BAD_REQUEST)
        if serializer.validated_data['email'] == "None":
            return Response(status=status.HTTP_400_BAD_REQUEST)

        response = {
            'success': 'True',
            'email': serializer.data['email'],
            'name': serializer.data['name'],
            'access_token': serializer.data['access_token'],
            'refresh_token': serializer.data['refresh_token']
        }
        return Response(response, status=status.HTTP_200_OK)


class UserScoreRecordView(GenericAPIView):
    '''
        사용자 학습현황 API
        PUT:
            유저가 학습한 이력이 있는지 판단하고
            학습 이력이 있다면 받은 데이터를 이용하여 학습 이력을 수정한다.
            학습 이력이 없다면 받은 데이터를 이용하여 학습 이력에 기입한다.
    '''

    serializer_class = UserRecordSerializer

    def put(self, request):

        user_id = extract_user_id(request)
        learning_video_id = request.data['learning_video_id']
        score = int(request.data['score'])
        exists = learning_record_check(user_id['user_id'], learning_video_id)

        medal_id = calc_medal(score)
        request_data = update_query_dict(request.data, [user_id, medal_id])

        if exists:
            history_obj = LearningHistory.objects.filter(
                user_id=user_id['user_id'],
                learning_video_id=learning_video_id
            ).first()
            serializer = self.serializer_class(
                history_obj,
                data=request_data,
                partial=True
            )
            serializer.is_valid()
            serializer.save()
            return Response(
                {"success": True},
                status=status.HTTP_200_OK
            )
        elif not exists:
            serializer = self.serializer_class(data=request_data)
            serializer.is_valid()
            serializer.save()
            return Response(
                {"success": True},
                status=status.HTTP_201_CREATED
            )
        return Response(status=status.HTTP_400_BAD_REQUEST)


class MyPageListView(GenericAPIView):
    '''
        마이페이지 들어갈 데이터를 요청하는 API
    '''

    serializer_class = UserRecordSerializer

    def get(self, request):
        user_id = extract_user_id(request)

        learning_list = LearningHistory.objects.filter(
            user_id=user_id['user_id']).order_by('-updated_at').values(
                'score', 'medal_id', 'learning_video_id')
        learning_rate, gold, silver, bronze, word_list =\
            response_mypage(learning_list)

        if not word_list:
            return Response(status=status.HTTP_204_NO_CONTENT)

        response = {
            'recent_learning': word_list,
            'gold': gold,
            'silver': silver,
            'bronze': bronze,
            'learning_rate': learning_rate
        }

        return Response(response, status=status.HTTP_200_OK)
