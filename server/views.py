import json
import os
from typing import List, Optional
from django.conf import settings
from django.shortcuts import get_object_or_404
from ninja import ModelSchema, NinjaAPI, Schema
from pydantic import computed_field
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

from .models import Mission, Player, QualityAssurance


def load_json_data(file_name):
    file_path = os.path.join(settings.BASE_DIR.parent, 'static', file_name)
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


class MissionPatchBody(Schema):
    chaos_pool: Optional[int] = None
    loose_ends: Optional[int] = None
    description: Optional[str] = None
    player_id: Optional[int] = None
    qa_delta: Optional[int] = None
    quality: Optional[str] = None
    commendations: Optional[int] = None
    demerits: Optional[int] = None
    additional_burnout: Optional[int] = None
    competency_level: Optional[int] = None
    max_competency_level: Optional[int] = None
    reality_level: Optional[int] = None
    max_reality_level: Optional[int] = None
    anomaly_level: Optional[int] = None
    max_anomaly_level: Optional[int] = None


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
def patch_mission(request, mission_id: int, body: MissionPatchBody):
    mission_public = get_object_or_404(Mission, pk=mission_id)
    if body.chaos_pool is not None:
        mission_public.modify_chaos(body.chaos_pool)
    if body.loose_ends is not None:
        mission_public.modify_loose_ends(body.loose_ends)
    if body.description is not None:
        mission_public.modify_description(body.description)
    if body.player_id is not None and body.qa_delta is not None and body.quality is not None:
        mission_public.modify_qa(
            player_id=body.player_id,
            quality=body.quality,
            delta=body.qa_delta
        )
    if body.player_id is not None and body.commendations is not None:
        mission_public.modify_commendations(
            player_id=body.player_id,
            delta=body.commendations
        )
    if body.player_id is not None and body.demerits is not None:
        mission_public.modify_demerits(
            player_id=body.player_id,
            delta=body.demerits
        )
    if body.player_id is not None and body.additional_burnout is not None:
        mission_public.modify_additional_burnout(
            player_id=body.player_id,
            delta=body.additional_burnout
        )
    if body.player_id is not None and body.competency_level is not None:
        mission_public.players.get(pk=body.player_id).modify_competency_level(
            delta=body.competency_level
        )
    if body.player_id is not None and body.max_competency_level is not None:
        mission_public.players.get(pk=body.player_id).modify_max_competency_level(
            delta=body.max_competency_level
        )
    if body.player_id is not None and body.reality_level is not None:
        mission_public.players.get(pk=body.player_id).modify_reality_level(
            delta=body.reality_level
        )
    if body.player_id is not None and body.max_reality_level is not None:
        mission_public.players.get(pk=body.player_id).modify_max_reality_level(
            delta=body.max_reality_level
        )
    if body.player_id is not None and body.anomaly_level is not None:
        mission_public.players.get(pk=body.player_id).modify_anomaly_level(
            delta=body.anomaly_level
        )
    if body.player_id is not None and body.max_anomaly_level is not None:
        mission_public.players.get(pk=body.player_id).modify_max_anomaly_level(
            delta=body.max_anomaly_level
        )

    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        f"mission_{mission_id}",
        {
            "type": "mission.update",
            "mission": MissionSchema.from_orm(Mission.objects.get(id=mission_id)).dict()
        }
    )
    return {}
