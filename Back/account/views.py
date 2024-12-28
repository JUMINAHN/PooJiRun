from rest_framework import generics, permissions, viewsets
from .models import User
from .serializers import UserSerializer
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import action

# class RegisterUserView(generics.CreateAPIView):
#     """
#     회원가입 View: 이메일, 비밀번호, 닉네임으로 사용자 생성.
#     """
#     queryset = User.objects.all()
#     serializer_class = UserSerializer
#     permission_classes = [permissions.AllowAny]  # 모든 사용자 접근 가능


class UserDetailView(generics.RetrieveUpdateAPIView):
    """
    현재 로그인된 사용자 정보 조회 및 업데이트 View.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]  # 인증된 사용자만 접근 가능

    def get_object(self):
        return self.request.user  # 현재 로그인된 사용자 반환


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    
    @action(detail=False, methods=['get'])
    def me(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def register(self, request):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            self.perform_create(serializer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)