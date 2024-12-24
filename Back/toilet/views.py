# toilet/views.py
from rest_framework import generics, permissions
from .models import Toilet, Review, Comment, PoliceStation
from .serializers import ToiletSerializer, ReviewSerializer, CommentSerializer, PoliceStationSerializer
from math import radians, sin, cos, sqrt, atan2


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

def get_nearest_toilet(user_latitude, user_longitude):
    try:
        nearest_toilet = None
        min_distance = float('inf')

        for toilet in Toilet.objects.all():
            # Haversine 공식을 사용하여 거리 계산
            dlat = radians(float(toilet.latitude) - float(user_latitude))
            dlon = radians(float(toilet.longitude) - float(user_longitude))
            a = sin(dlat / 2)**2 + cos(radians(float(user_latitude))) * cos(radians(float(toilet.latitude))) * sin(dlon / 2)**2
            c = 2 * atan2(sqrt(a), sqrt(1 - a))
            distance = 6371 * c  # 지구 반지름 (km)

            if distance < min_distance:
                min_distance = distance
                nearest_toilet = toilet

        return nearest_toilet, min_distance
    except (ValueError, TypeError) as e:
        return None, None

from django.http import JsonResponse
def emergency_request(request):
    try:
        user_latitude = float(request.GET.get('latitude'))
        user_longitude = float(request.GET.get('longitude'))
        nearest_toilet, distance = get_nearest_toilet(user_latitude, user_longitude)

        if nearest_toilet:
            return JsonResponse({
                'name': nearest_toilet.name,
                'latitude': nearest_toilet.latitude,
                'longitude': nearest_toilet.longitude,
                'address': nearest_toilet.address,
                'distance': round(distance, 2),  # km 단위로 거리 표시
                'is_accessible': nearest_toilet.is_accessible,
                'opening_hours': nearest_toilet.opening_hours
            }, content_type='application/json')
        else:
            return JsonResponse({
                'error': 'No toilets found'
            }, status=404, content_type='application/json')
    except (ValueError, TypeError):
        return JsonResponse({
            'error': 'Invalid coordinates provided'
        }, status=400, content_type='application/json')
