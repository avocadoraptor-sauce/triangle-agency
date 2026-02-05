import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from triangle_agency_server import routing

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'triangle_agency.settings')

# Fetch Django's ASGI application (handles standard HTTP requests)
django_asgi_app = get_asgi_application()

application = ProtocolTypeRouter({
    "http": django_asgi_app,
    "websocket": AuthMiddlewareStack(
        URLRouter(
            routing.websocket_urlpatterns
        )
    ),
    # You can add other protocols here
})