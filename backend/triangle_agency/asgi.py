import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from backend import triangle_agency_server

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'triangle_agency.settings')

# Fetch Django's ASGI application (handles standard HTTP requests)
django_asgi_app = get_asgi_application()

application = ProtocolTypeRouter({
    "http": django_asgi_app,
    "websocket": AuthMiddlewareStack(
        URLRouter(
            triangle_agency_server.routing.websocket_urlpatterns
        )
    ),
    # You can add other protocols here
})