from rest_framework import generics
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from .serializers import (IdCheckSerializer, UserCreateSerializer,
                          UserLoginSerializer)


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
