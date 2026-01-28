import json
from django.forms import model_to_dict
from django.http import JsonResponse
from django.shortcuts import get_object_or_404, render

from .models import Mission, MissionPublic
from django.views import View
from django.utils.decorators import method_decorator
from ninja import ModelSchema, NinjaAPI

api = NinjaAPI()

class MissionSchema(ModelSchema):
    class Meta:
        model = Mission
        fields = "__all__"


class MissionPublicSchema(ModelSchema):
    class Meta:
        model = MissionPublic
        fields = "__all__"


@api.get("mission-public/{mission_public_id}/", response=MissionPublicSchema)
def get_mission(request, mission_public_id: int):
    if mission_public_id is None:
        return None
    mission_public = get_object_or_404(MissionPublic, pk=mission_public_id)
    # Hack to recursively serialize.
    partial_mission = model_to_dict(mission_public)
    print(partial_mission)
    partial_mission["mission_id"] = 1
    return partial_mission

@api.patch("mission-public/{mission_public_id}/")
def patch_mission(request, mission_public_id: int):
    mission_public = get_object_or_404(MissionPublic, pk=mission_public_id)
    raw = request.body  # bytes
    data = json.loads(raw.decode("utf-8")) if raw else {}
    if "chaos_pool" in data:
        mission_public.modify_chaos(data["chaos_pool"])
        return {}
    