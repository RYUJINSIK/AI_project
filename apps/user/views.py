from django.shortcuts import render
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView


class UserView(APIView):
    def get(self, request):
        data = 'test data'
        return Response(data, status=status.HTTP_200_OK)
