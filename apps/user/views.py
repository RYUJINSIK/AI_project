from django.shortcuts import render
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

<<<<<<< HEAD
from .models import Trx

=======
>>>>>>> ff81d3f7ceb1135becb55af6279acb12d4b128b7

class UserView(APIView):
    def get(self, request):
        data = 'test data'
        return Response(data, status=status.HTTP_200_OK)
