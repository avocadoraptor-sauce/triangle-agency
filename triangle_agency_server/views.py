from django.shortcuts import render

from .mission import MissionPublic


def mission_public_dossier(request):
    missions = (
        MissionPublic.objects.select_related("mission", "image")
        .order_by("mission_id")
        .all()
    )
    return render(
        request,
        "triangle_agency_server/mission_public.html",
        {"missions": missions},
    )
