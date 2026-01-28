from django.db import models

# TODO: Decide if the model names are appropriate
class Mission(models.Model):
    mission_name= models.TextField(blank=True)
    def __str__(self) -> str:
        return f"Mission {self.mission_name}"


class MissionPublic(models.Model):
    mission = models.OneToOneField(
        "Mission",
        related_name="public",
        on_delete=models.CASCADE,
    )
    chaos_pool = models.IntegerField(default=0)
    loose_ends = models.IntegerField(default=0)
    description = models.TextField(blank=True)

    def __str__(self) -> str:
        return f"MissionPublic {self.mission.mission_name}"
    def modify_chaos(self, delta:int):
        MissionPublic.objects.filter(pk=self.pk).update(
            chaos_pool=F("chaos_pool") + delta
        )


class MissionImage(models.Model):
    mission_public = models.OneToOneField(
        "MissionPublic",
        related_name="image",
        on_delete=models.CASCADE,
    )
    image_type = models.CharField(max_length=50, blank=True)
    asset_id = models.CharField(max_length=255, blank=True)
    url = models.URLField(blank=True)

    def __str__(self) -> str:
        return self.asset_id or "MissionImage"

# TODO: decide Structure of this later
class MissionGM(models.Model):
    mission = models.OneToOneField(
        "Mission",
        related_name="gm",
        on_delete=models.CASCADE,
    )
    notes = models.JSONField(default=list, blank=True)
    player_notes = models.JSONField(default=dict, blank=True)
    player_signals = models.JSONField(default=dict, blank=True)

    def __str__(self) -> str:
        return f"MissionGM {self.mission_name}"
