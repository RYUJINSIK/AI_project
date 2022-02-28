from rest_framework import generics
from rest_framework.response import Response

from .serializers import IdCheckSerializer, UserCreateSerializer


class IdcheckView(generics.GenericAPIView):
    serializer_class = IdCheckSerializer

    def post(self, request):
        print(request.data)
        serializer = IdCheckSerializer(data=request.data)
        if serializer.is_valid():
            return Response(serializer.data, status=201)
        else:
            return Response(serializer.errors, status=400)


class RegisterView(generics.GenericAPIView):
    serializer_class = UserCreateSerializer

    def post(self, request):
        print(request.data)
        serializer = UserCreateSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()  # DB 저장
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
