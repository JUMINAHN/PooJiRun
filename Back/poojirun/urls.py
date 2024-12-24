# poojirun/urls.py

from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('accounts/', include('account.urls')),  # 사용자 관련 URL 추가
    path('', include('toilet.urls')),  # toilet.urls로 변경

    ]
