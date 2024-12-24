# toilet/consumers.py
from channels.generic.websocket import AsyncWebsocketConsumer
import json

class LocationConsumer(AsyncWebsocketConsumer):
    connected_users = set()  # 연결된 사용자 관리

    async def connect(self):
        await self.accept()
        LocationConsumer.connected_users.add(self)  # 현재 연결된 사용자 추가

    async def disconnect(self, close_code):
        LocationConsumer.connected_users.remove(self)  # 연결 해제 시 사용자 제거

    async def receive(self, text_data):
        data = json.loads(text_data)
        latitude = data['latitude']
        longitude = data['longitude']
        
        # 위치 정보 처리 및 다른 클라이언트에게 전송
        await self.send_location_update(latitude, longitude)

    async def send_location_update(self, latitude, longitude):
        # 모든 연결된 사용자에게 위치 정보 전송
        location_data = {
            'status': 'location update',
            'latitude': latitude,
            'longitude': longitude
        }
        
        # 모든 연결된 사용자에게 위치 데이터 전송
        for user in LocationConsumer.connected_users:
            await user.send(text_data=json.dumps(location_data))

    async def notify_users(self, notification):
        # 특정 이벤트 발생 시 사용자에게 알림 전송
        await self.send(text_data=json.dumps({'notification': notification}))
