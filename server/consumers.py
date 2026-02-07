# chat/consumers.py
import json
from channels.generic.websocket import AsyncWebsocketConsumer

class MissionUpdateConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.mission_id = self.scope['url_route']['kwargs']['mission_id']
        self.group_name = 'mission_%s' % self.mission_id
        # Join group
        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        # Leave group
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )

    # Receive message from WebSocket (client)
    async def receive(self, _):
        # Do nothing.
        pass

    # Receive message from group (channel layer) and send to WebSocket (React client)
    async def mission_update(self, event):
        mission = event['mission']
        # Send message to WebSocket
        await self.send(text_data=json.dumps(mission))