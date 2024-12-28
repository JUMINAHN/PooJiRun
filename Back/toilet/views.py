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

def emergency_request(request):
    try:
        user_latitude = float(request.GET.get('latitude'))
        user_longitude = float(request.GET.get('longitude'))
        nearest_toilet, distance = get_nearest_toilet(user_latitude, user_longitude)

        if nearest_toilet:
            distance_text, duration_text = get_distance_and_duration(
                user_latitude, user_longitude,
                nearest_toilet.latitude, nearest_toilet.longitude
            )

            # 운영 시간 정보 처리
            opening_hours = nearest_toilet.opening_hours if nearest_toilet.opening_hours and nearest_toilet.opening_hours.lower() != 'nan' else "정보 없음"
            opening_hours_detail = nearest_toilet.opening_hours_detail if nearest_toilet.opening_hours_detail and nearest_toilet.opening_hours_detail.lower() != 'nan' else "상세 정보 없음"

            return JsonResponse({
                'name': nearest_toilet.name,
                'address': nearest_toilet.address,
                'latitude': nearest_toilet.latitude,  # 위도 추가
                'longitude': nearest_toilet.longitude,  # 경도 추가
                'total_stalls': {
                    'male': nearest_toilet.male_stalls + nearest_toilet.male_urinals,
                    'female': nearest_toilet.female_stalls
                },
                'is_accessible': nearest_toilet.is_accessible,
                'management': {
                    'agency': nearest_toilet.managing_agency_name or "정보 없음",
                    'phone': nearest_toilet.managing_agency_phone or "정보 없음"
                },
                'security': {
                    'cctv': nearest_toilet.cctv_installed,
                    'emergency_bell': nearest_toilet.emergency_bell_installed
                },
                'facilities': {
                    'diaper_table': nearest_toilet.diaper_change_table_location or "없음",
                    'opening_hours': opening_hours,
                    'opening_hours_detail': opening_hours_detail
                },
                'distance': round(distance, 2),
                'estimated_distance': distance_text,
                'estimated_duration': duration_text,
                'user_location': {  # 사용자 위치 정보 추가
                    'latitude': user_latitude,
                    'longitude': user_longitude
                }
            })
        else:
            return JsonResponse({'error': 'No toilets found'}, status=404)
    except (ValueError, TypeError):
        return JsonResponse({'error': 'Invalid coordinates provided'}, status=400)

import requests

def get_distance_and_duration(origin_lat, origin_lng, dest_lat, dest_lng):
    try:
        # 직선 거리 계산 (Haversine 공식 사용)
        R = 6371  # 지구 반경 (km)
        dlat = radians(dest_lat - origin_lat)
        dlon = radians(dest_lng - origin_lng)
        a = (sin(dlat/2) * sin(dlat/2) +
             cos(radians(origin_lat)) * cos(radians(dest_lat)) *
             sin(dlon/2) * sin(dlon/2))
        c = 2 * atan2(sqrt(a), sqrt(1-a))
        distance = R * c

        # 도보 이동 시간 계산 (평균 도보 속도: 4km/h)
        walking_duration = int((distance * 1000) / (4000/60))  # 분 단위
        
        return f"{distance:.2f} km", f"{walking_duration} 분"
        
    except Exception as e:
        print(f"Distance calculation error: {str(e)}")
        return None, None