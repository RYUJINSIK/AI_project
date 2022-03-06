from rest_framework import status
from rest_framework.response import Response
from rest_framework.generics import GenericAPIView

from .models import SignCenter
from .serializers import CenterSerializer
from .utils import select_centers

from rest_framework.permissions import AllowAny
from django.http import QueryDict, JsonResponse


class MapView(GenericAPIView):
    serializer_class = CenterSerializer
    queryset = SignCenter.objects.all()
    permission_classes = (AllowAny,)
    
    def get(self, request, lat, lng):
        queryset = self.get_queryset()
        centers = select_centers(queryset, lat, lng, cnt=5)
        return Response(centers, status=status.HTTP_200_OK)
