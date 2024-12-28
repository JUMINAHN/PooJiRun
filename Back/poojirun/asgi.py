# poojirun/asgi.py
from django.urls import path  # 추가된 부분
import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from toilet.consumers import LocationConsumer  # 소비자 임포트

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'poojirun.settings')

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AuthMiddlewareStack(
        URLRouter([
            path("ws/location/", LocationConsumer.as_asgi()),  # WebSocket 경로 설정
        ])
    ),
})
