from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    re_path(r"ws/mission/(?P<mission_id>[^/]+)/$", consumers.MissionUpdateConsumer.as_asgi()),
]