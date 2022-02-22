from django.shortcuts import render
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Center
from .serializers import CenterSerializer


class MapView(APIView):
    def get(self, request):
        center_list = Center.objects.filter(name__icontains='인천')
        serializer = CenterSerializer(center_list)
        # context = {'center_list': serializer.data}
        # return Response(context, status=status.HTTP_200_OK)
        
        center_list = Center.objects.order_by('id')[:1]
        test_context = {'center_list': center_list}
        print(test_context)
        return render(request, 'map/test2.html', test_context)
