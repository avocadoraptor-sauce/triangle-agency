from django.urls import path

from .views import GMMissionView, PublicDossierView

urlpatterns = [
    path(
        "mission-public/",
        GMMissionView.as_view(),
        name="mission-public",
    ),
    path(
        "mission-public/<int:mission_public_id>/",
        GMMissionView.as_view(),
        name="mission-public-detail",
    ),
]
