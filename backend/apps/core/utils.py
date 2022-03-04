from django.http import QueryDict
from rest_framework_simplejwt.authentication import JWTAuthentication


def extract_user_id(request):
    '''
        JWT 토큰에서 user_id를 추출하는 method
    '''
    JWT_authenticator = JWTAuthentication()
    response = JWT_authenticator.authenticate(request)
    if response:
        _, token = response
        user_id = token.payload['user_id']
        user_id = QueryDict(f'user_id={user_id}')
        return user_id
    else:
        return False
