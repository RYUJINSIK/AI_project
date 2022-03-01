from rest_framework import generics
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from .serializers import (IdCheckSerializer, UserCreateSerializer,
                          UserLoginSerializer)


class IdcheckView(generics.GenericAPIView):
    serializer_class = IdCheckSerializer
    permission_classes = (AllowAny,)

    def post(self, request):
        print(request.data)
        serializer = IdCheckSerializer(data=request.data)
        if serializer.is_valid():
            return Response(serializer.data, status=201)
        else:
            return Response(serializer.errors, status=400)


class RegisterView(generics.GenericAPIView):
    serializer_class = UserCreateSerializer
    permission_classes = (AllowAny,)

    def post(self, request):
        serializer = UserCreateSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()  # DB 저장
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


class UserloginView(generics.GenericAPIView):
    serializer_class = UserLoginSerializer
    permission_classes = (AllowAny,)

    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)

        if not serializer.is_valid(raise_exception=True):
            return Response({"message": "Request Body Error."}, status=401)
        if serializer.validated_data['email'] == "None":
            return Response({'message': 'fail'}, status=400)
        
        response = {
            'success': 'True',
            'email': serializer.data['email'],
            'token': serializer.data['token']
        }
        return Response(response, status=200)
