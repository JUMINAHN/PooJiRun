# toilet/views.py

from rest_framework import generics, permissions
from .models import Toilet, Review, Comment, PoliceStation
from .serializers import ToiletSerializer, ReviewSerializer, CommentSerializer, PoliceStationSerializer


class ToiletListView(generics.ListCreateAPIView):
    """
    화장실 목록 조회 및 생성
    """
    queryset = Toilet.objects.all()
    serializer_class = ToiletSerializer
    permission_classes = [permissions.AllowAny]


class ToiletDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    특정 화장실 조회, 수정 및 삭제
    """
    queryset = Toilet.objects.all()
    serializer_class = ToiletSerializer
    permission_classes = [permissions.AllowAny]  # 모든 사용자 접근 가능


# views.py
class ReviewListView(generics.ListCreateAPIView):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticated]  # 인증된 사용자만 접근 가능

    def perform_create(self, serializer):
        # 현재 로그인한 사용자를 자동으로 user 필드에 저장
        serializer.save(user=self.request.user)


class ReviewDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    특정 리뷰 조회, 수정 및 삭제
    """
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [permissions.AllowAny]  # 모든 사용자 접근 가능


class CommentListView(generics.ListCreateAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated]  # 인증된 사용자만 접근 가능

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class CommentDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    특정 댓글 조회, 수정 및 삭제
    """
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [permissions.AllowAny]  # 모든 사용자 접근 가능


class PoliceStationListView(generics.ListCreateAPIView):
    """
    경찰서 목록 조회 및 생성
    """
    queryset = PoliceStation.objects.all()
    serializer_class = PoliceStationSerializer
    permission_classes = [permissions.AllowAny]  # 모든 사용자 접근 가능


class PoliceStationDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    특정 경찰서 조회, 수정 및 삭제
    """
    queryset = PoliceStation.objects.all()
    serializer_class = PoliceStationSerializer
    permission_classes = [permissions.AllowAny]  # 모든 사용자 접근 가능
