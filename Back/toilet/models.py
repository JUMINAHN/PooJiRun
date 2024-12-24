#toilet/models.py

from django.db import models
from django.conf import settings  # Custom User 모델을 참조하기 위해 settings 모듈 가져오기
# 화장실 정보

class Toilet(models.Model):
    name = models.CharField(max_length=100)  # 화장실 이름
    address = models.CharField(max_length=255)  # 화장실 주소
    latitude = models.FloatField()  # 위도
    longitude = models.FloatField()  # 경도
    male_stalls = models.IntegerField()  # 남성용 칸 수
    female_stalls = models.IntegerField()  # 여성용 칸 수
    male_urinals = models.IntegerField(default=0)  # 남성용 소변기 수
    female_accessible_stalls = models.IntegerField(default=0)  # 여성용 장애인 칸 수
    male_accessible_urinals = models.IntegerField(default=0)  # 남성용 장애인 소변기 수
    female_children_stalls = models.IntegerField(default=0)  # 여성 어린이용 칸 수
    male_children_stalls = models.IntegerField(default=0)  # 남성 어린이용 칸 수
    is_accessible = models.BooleanField(default=False)  # 장애인 이용 가능 여부
    opening_hours = models.CharField(max_length=100, blank=True)  # 운영 시간
    nearby_police_station_name = models.CharField(max_length=100, blank=True)  # 인근 경찰서 이름
    nearby_police_station_address = models.CharField(max_length=255, blank=True)  # 인근 경찰서 주소
    distance_to_nearby_police_station = models.FloatField(null=True, blank=True)  # 인근 경찰서와의 거리 (km)
    managing_agency_name = models.CharField(max_length=100, blank=True)  # 관리 기관명
    managing_agency_phone = models.CharField(max_length=20, blank=True)  # 관리 기관 전화번호
    average_rating = models.FloatField(default=0.0)  # 평균 별점
    comment_count = models.IntegerField(default=0)  # 댓글 개수
    waste_management_method = models.CharField(max_length=100, blank=True)  # 오물 처리 방식
    cctv_installed = models.BooleanField(default=False)  # CCTV 설치 여부
    emergency_bell_installed = models.BooleanField(default=False)  # 비상벨 설치 여부
    diaper_change_table_location = models.CharField(max_length=255, blank=True)  # 기저귀 교환대 위치

    def __str__(self):
        return self.name  # 화장실 이름 반환



class Review(models.Model):
    toilet = models.ForeignKey(Toilet, related_name='reviews', on_delete=models.CASCADE)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='reviews'
    )
    rating = models.IntegerField()  # 평점 (1~5)
    content = models.TextField()  # 리뷰 내용
    created_at = models.DateTimeField(auto_now_add=True)  # 작성일

class Comment(models.Model):
    review = models.ForeignKey(Review, related_name='comments', on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='comments', on_delete=models.CASCADE)  # Custom User 모델 참조
    content = models.TextField()  # 댓글 내용
    created_at = models.DateTimeField(auto_now_add=True)  # 작성일

class PoliceStation(models.Model):
    name = models.CharField(max_length=100)  # 경찰서 이름
    address = models.CharField(max_length=255)  # 경찰서 주소
    latitude = models.FloatField()  # 위도
    longitude = models.FloatField()  # 경도

    def __str__(self):
        return self.name  # 경찰서 이름 반환