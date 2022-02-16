from django.shortcuts import render
from rest_framework import status
from rest_framework.response import Response
#from rest_framework.generics import GenericAPIView
from rest_framework.views import APIView

from .models import Center
from .serializers import CenterSerializer

# Create your views here.

class TestView(APIView):
  def get(self, request):
    data = 'test data'
    return Response(data, status=status.HTTP_200_OK)
    
class MapView(APIView):
  def get(self, request):
    center_list = Center.objects.all()
    serializer = CenterSerializer(center_list, many=True)
    context = {'center_list': serializer.data}
    
    # return Response(context, status=status.HTTP_200_OK)
  
  
    center_list = Center.objects.order_by('id')[:2]
    test_context = {'center_list': center_list}
    print(test_context)
    return render(request, 'map/test2.html', test_context)
