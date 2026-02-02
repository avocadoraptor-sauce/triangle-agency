import json
from django.forms import model_to_dict
from django.http import JsonResponse
from django.shortcuts import get_object_or_404, render

from .models import Mission, Mission
from django.views import View
from django.utils.decorators import method_decorator
from ninja import ModelSchema, NinjaAPI

api = NinjaAPI()

class MissionSchema(ModelSchema):
    class Meta:
        model = Mission
        fields = "__all__"

class MissionSchema(ModelSchema):
    class Meta:
        model = Mission
        fields = "__all__"


@api.get("mission-public/{mission_public_id}/", response=MissionSchema)
def get_mission(request, mission_public_id: int):
    if mission_public_id is None:
        return None
    mission_public = get_object_or_404(Mission, pk=mission_public_id)
    # Hack to recursively serialize.
    # TODO: figure out proper way to do this with ninja
    partial_mission = model_to_dict(mission_public)
    print(partial_mission)
    partial_mission["mission_id"] = 1
    return partial_mission

@api.patch("mission-public/{mission_public_id}/")
def patch_mission(request, mission_public_id: int):
    mission_public = get_object_or_404(Mission, pk=mission_public_id)
    raw = request.body  # bytes
    data = json.loads(raw.decode("utf-8")) if raw else {}
    if "chaos_pool" in data:
        mission_public.modify_chaos(data["chaos_pool"])
        return {}
    if "loose_ends" in data:
        mission_public.modify_loose_ends(data["loose_ends"])
        return {}
    if "description" in data:
        mission_public.modify_description(data["description"])
        return {}
    