from django.urls import path
from .views import (
    ToiletListView,
    ToiletDetailView,
    ReviewListView,
    ReviewDetailView,
    CommentListView,
    CommentDetailView,
    PoliceStationListView,
    PoliceStationDetailView,
    emergency_request,
    search_toilets
)

urlpatterns = [
    path('toilets/', ToiletListView.as_view(), name='toilet-list'),
    path('toilets/<int:pk>/', ToiletDetailView.as_view(), name='toilet-detail'),
    path('toilets/search/', search_toilets, name='search_toilets'),
    # /api/toilets/search/?keyword=포항시
    #/api/toilets/search/?keyword=장량동
    #/api/toilets/search/?keyword=체육관
    path('reviews/', ReviewListView.as_view(), name='review-list'),
    path('reviews/<int:pk>/', ReviewDetailView.as_view(), name='review-detail'),
    
    path('comments/', CommentListView.as_view(), name='comment-list'),
    path('comments/<int:pk>/', CommentDetailView.as_view(), name='comment-detail'),
    
    path('police-stations/', PoliceStationListView.as_view(), name='police-station-list'),
    path('police-stations/<int:pk>/', PoliceStationDetailView.as_view(), name='police-station-detail'),

    path('emergency/', emergency_request, name='emergency_request'),
]
