# toilet/serializers.py

from rest_framework import serializers
from .models import Toilet, Review, Comment, PoliceStation

class ToiletSerializer(serializers.ModelSerializer):
    """
    화장실 정보를 처리하는 Serializer
    """
    average_rating = serializers.FloatField(read_only=True)  # 평균 별점은 읽기 전용
    comment_count = serializers.IntegerField(read_only=True)  # 댓글 개수는 읽기 전용

    class Meta:
        model = Toilet
        fields = [
            'id',
            'name',
            'address',
            'latitude',
            'longitude',
            'male_stalls',
            'female_stalls',
            'is_accessible',
            'nearby_police_station_name',
            'nearby_police_station_address',
            'distance_to_nearby_police_station',
            'managing_agency_name',
            'managing_agency_phone',
            'opening_hours',
            'opening_hours_detail',  # 상세정보 필드 추가
            'average_rating',  # 읽기 전용
            'comment_count',  # 읽기 전용
        ]


# serializers.py
class ReviewSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    
    class Meta:
        model = Review
        fields = ['id', 'toilet', 'user', 'rating', 'content', 'created_at']
        read_only_fields = ['user', 'created_at']

class CommentSerializer(serializers.ModelSerializer):
    """
    댓글 정보를 처리하는 Serializer
    """
    user = serializers.StringRelatedField(read_only=True)  # 사용자 이름을 반환 (읽기 전용)
    review = serializers.StringRelatedField(read_only=True)  # 리뷰 내용을 반환 (읽기 전용)

    class Meta:
        model = Comment
        fields = [
            'id',
            'review',  # 리뷰 정보 (읽기 전용)
            'user',  # 작성자 정보 (읽기 전용)
            'content',  # 댓글 내용
            'created_at',  # 작성일 (읽기 전용)
        ]


class PoliceStationSerializer(serializers.ModelSerializer):
    """
    경찰서 정보를 처리하는 Serializer
    """
    class Meta:
        model = PoliceStation
        fields = [
            'id',
            'name',  # 경찰서 이름
            'address',  # 경찰서 주소
            'latitude',  # 위도
            'longitude',  # 경도
        ]
