import json
from django.forms import model_to_dict
from django.http import JsonResponse
from django.shortcuts import get_object_or_404, render

from .mission import MissionPublic
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

@method_decorator(csrf_exempt, name="dispatch")
class PublicDossierView(View):
    http_method_names = ["get", "post", "put", "patch", "delete"]

    def _get(self, request, mission_public_id=None):
        if mission_public_id is None:
            return None
        mission_public = get_object_or_404(MissionPublic, pk=mission_public_id)
        return model_to_dict(mission_public)

    def post(self, request, mission_public_id=None):
        return JsonResponse({})

    def put(self, request, mission_public_id=None):
        return JsonResponse({})

    def _patch(self, request, mission_public_id=None):
        return JsonResponse({})

    def delete(self, request, mission_public_id=None):
        return JsonResponse({})

@method_decorator(csrf_exempt, name="dispatch")
class GMMissionView(PublicDossierView):
    def get(self, request, mission_public_id=None):
        mission = self._get(request, mission_public_id)
        return render(
            request,
            "triangle_agency_server/mission_public.html",
            {"mission": mission},
        )
    
    def patch(self, request, mission_public_id=None):
        mission_public = get_object_or_404(MissionPublic, pk=mission_public_id)
        raw = request.body  # bytes
        data = json.loads(raw.decode("utf-8")) if raw else {}
        if "chaos_pool" in data:
            mission_public.modify_chaos(data["chaos_pool"])
            return JsonResponse({}, status=200)


@method_decorator(csrf_exempt, name="dispatch")
class PlayerMissionView(PublicDossierView):
    def get(self, request, mission_public_id=None):
        self._get(request, mission_public_id)