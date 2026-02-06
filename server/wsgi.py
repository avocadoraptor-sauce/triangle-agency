import os

from django.core.wsgi import get_wsgi_application

# NOTE: WSGI NOT INTENDED TO BE USED. USE ASGI INSTEAD!
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "server.settings")
application = get_wsgi_application()
