from django.urls import path

from . import views

urlpatterns = [
    path("mission-public/", views.mission_public_dossier, name="mission-public"),
]
