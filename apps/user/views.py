from rest_framework import status
from rest_framework.response import Response
from rest_framework import generics 
from .models import User
from .serializers import RegisterSerializer, UserSerializer


# from rest_framework.authentication import BaseAuthentication
# from rest_framework.permissions import IsAuthenticated

class RegisterView(generics.GenericAPIView):
    serializer_class = RegisterSerializer
    
    def post(self, request):
        # serializer = self.get_serializer(data=request.data)
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                'user': serializer.data,
                'status': status.HTTP_201_CREATED
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

