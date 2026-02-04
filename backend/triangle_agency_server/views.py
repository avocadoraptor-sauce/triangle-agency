import json
import os
from typing import List
from django.conf import settings
from django.shortcuts import get_object_or_404
from ninja import ModelSchema, NinjaAPI
from pydantic import computed_field

from .models import Mission, Player, QualityAssurance


def load_json_data(file_name):
    file_path = os.path.join(settings.BASE_DIR, 'triangle_agency', 'static', file_name)
    try:
        with open(file_path, 'r') as f:
            data = json.load(f) # deserializes the JSON data into a Python dictionary or list
        return data
    except FileNotFoundError:
        print(f"Error: The file {file_name} was not found at {file_path}")
        return None


QUALITIES = load_json_data('qualities.json')


class QualityAssuranceSchema(ModelSchema):
    @computed_field
    @property
    def description(self) -> str:
        return QUALITIES["qualities"][self.quality]['description']

    class Meta:
        model = QualityAssurance
        fields = "__all__"


class PlayerSchema(ModelSchema):
    qas: List[QualityAssuranceSchema]

    class Meta:
        model = Player
        fields = "__all__"


class MissionSchema(ModelSchema):
    players: List[PlayerSchema]
    class Meta:
        model = Mission
        fields = "__all__"


class MissionSummarySchema(ModelSchema):
    class Meta:
        model = Mission
        fields = ["id", "mission_name", "description"]


api = NinjaAPI()


@api.get("missions/", response=List[MissionSummarySchema])
def get_missions(request):
    return Mission.objects.all()


@api.get("mission/{mission_id}/", response=MissionSchema)
def get_mission(request, mission_id: int):
    if mission_id is None:
        return None
    mission = get_object_or_404(Mission, pk=mission_id)
    return mission

@api.patch("mission/{mission_id}/")
def patch_mission(request, mission_id: int):
    mission_public = get_object_or_404(Mission, pk=mission_id)
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