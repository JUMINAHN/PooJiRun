# poojirun/urls.py

from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('accounts/', include('account.urls')),  # 사용자 관련 URL 추가
    path('api/', include('toilet.urls')),  # 모든 API 엔드포인트에 'api/' 프리픽스 추가

    ]
