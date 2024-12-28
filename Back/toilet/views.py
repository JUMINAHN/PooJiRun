# toilet/views.py
from django.conf import settings
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
from django.http import JsonResponse

from django.http import JsonResponse

def emergency_request(request):
    try:
        user_latitude = float(request.GET.get('latitude'))
        user_longitude = float(request.GET.get('longitude'))
        nearest_toilet, distance = get_nearest_toilet(user_latitude, user_longitude)

        if nearest_toilet:
            # Kakao API를 사용하여 거리와 소요 시간 계산
            distance_text, duration_text = get_distance_and_duration(
                user_latitude, user_longitude,
                nearest_toilet.latitude, nearest_toilet.longitude
            )

            return JsonResponse({
                'name': nearest_toilet.name,
                'latitude': nearest_toilet.latitude,
                'longitude': nearest_toilet.longitude,
                'address': nearest_toilet.address,
                'distance': round(distance, 2),
                'estimated_distance': distance_text,
                'estimated_duration': duration_text,
                'is_accessible': nearest_toilet.is_accessible,
                'opening_hours': nearest_toilet.opening_hours
            })
        else:
            return JsonResponse({'error': 'No toilets found'}, status=404)
    except (ValueError, TypeError):
        return JsonResponse({'error': 'Invalid coordinates provided'}, status=400)

import requests

def get_distance_and_duration(origin_lat, origin_lng, dest_lat, dest_lng):
    try:
        url = "https://apis-navi.kakaomobility.com/v1/directions"
        headers = {"Authorization": f"KakaoAK {settings.KAKAO_APP_KEY}"}
        params = {
            "origin": f"{origin_lng},{origin_lat}",  # 경도, 위도 순서
            "destination": f"{dest_lng},{dest_lat}",
            "priority": "RECOMMEND"  # 최단 시간 또는 최단 거리
        }

        response = requests.get(url, headers=headers, params=params)
        data = response.json()
        
        print(f"Kakao API Response: {data}")  # 디버깅 로그 추가
        print(settings.KAKAO_APP_KEY, 'APPKEY')

        if response.status_code == 200 and 'routes' in data and len(data['routes']) > 0:
            route = data['routes'][0]
            distance = route['summary']['distance'] / 1000  # km 단위로 변환
            duration = route['summary']['duration'] // 60  # 분 단위로 변환
            return f"{distance:.2f} km", f"{duration} 분"
        
        print(f"Error: {data.get('msg', 'Unknown error')}")  # 오류 메시지 출력
        
    except Exception as e:
        print(f"Kakao API Error: {str(e)}")
    
    return None, None