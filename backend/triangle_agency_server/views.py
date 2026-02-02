import json
import os
from typing import List
from django.shortcuts import get_object_or_404
from pydantic import computed_field
from .models import Mission, Player, QualityAssurance
from django.conf import settings
from ninja import ModelSchema, NinjaAPI

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
api = NinjaAPI()

class QualityAssuranceSchema(ModelSchema):
    @computed_field
    def description(self) -> str:
        return QUALITIES['qualities'][self.quality]['description'] # pyright: ignore[reportOptionalSubscript, reportAttributeAccessIssue]

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



@api.get("mission-public/{mission_public_id}/", response=MissionSchema)
def get_mission(request, mission_public_id: int):
    if mission_public_id is None:
        return None
    mission_public = get_object_or_404(Mission, pk=mission_public_id)
    serialized_data = MissionSchema.from_orm(mission_public).dict()
    print("Serialized Data:", serialized_data)
    return serialized_data

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
    
