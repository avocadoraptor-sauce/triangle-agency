from django.db import models
from django.db.models import F

# Determine if relationship between Mission and Player is appropriate
class Mission(models.Model):
    mission_name= models.TextField()
    chaos_pool = models.IntegerField(default=0)
    loose_ends = models.IntegerField(default=0)
    description = models.TextField(blank=True)
    players = models.ManyToManyField("Player", blank=True)

    # Img fields
    url = models.URLField(blank=True)

    def __str__(self) -> str:
        return f"{self.mission_name}"

    def modify_chaos(self, delta:int):
        Mission.objects.filter(pk=self.pk).update(
            chaos_pool=F("chaos_pool") + delta
        )
    def modify_loose_ends(self, delta:int):
        Mission.objects.filter(pk=self.pk).update(
            loose_ends=F("loose_ends") + delta
        )
    def modify_description(self, new_description:str):
        Mission.objects.filter(pk=self.pk).update(
            description=new_description
        )

class QualityAssurance(models.Model):

    class Quality(models.TextChoices):
        ATTENTIVENESS = "Attentiveness", "Attentiveness"
        DUPLICITY = "Duplicity", "Duplicity"
        DYNAMISM = "Dynamism", "Dynamism"
        EMPATHY = "Empathy", "Empathy"
        INITIATIVE = "Initiative", "Initiative"
        PERSISTENCE = "Persistence", "Persistence"
        PRESENCE = "Presence", "Presence"
        PROFESSIONALISM = "Professionalism", "Professionalism"
        SUBTLETY = "Subtlety", "Subtlety"
    quality = models.TextField(choices=Quality.choices, default=Quality.ATTENTIVENESS, blank=False)
    player = models.ForeignKey("Player", editable=False, blank=False, on_delete=models.CASCADE, related_name="qas")
    available_qas = models.IntegerField(default=3, blank=False)
    max_qas = models.IntegerField(default=3, blank=False)

    def __str__(self) -> str:
        return f"{self.player}: {self.quality}"
    
class Player(models.Model):
    player_name= models.TextField(blank=True)
    missions = models.ManyToManyField(Mission, blank=True)

    def __str__(self) -> str:
        return f"{self.player_name}"