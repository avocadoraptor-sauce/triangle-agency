from django.db import models


class Player(models.Model):
    player_id = models.IntegerField(unique=True)
    name = models.CharField(max_length=255, blank=True)
    anomaly = models.CharField(max_length=255, blank=True)
    powers = models.ManyToManyField(
        "Power",
        blank=True,
        related_name="players",
    )
    reality = models.CharField(max_length=255, blank=True)
    reality_connection_power = models.ForeignKey(
        "Power",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="players_reality_connection",
    )
    competency = models.CharField(max_length=255, blank=True)
    requisition = models.CharField(max_length=255, blank=True)

    def __str__(self) -> str:
        return self.name or f"Player {self.player_id}"


class PlayerQA(models.Model):
    player = models.ForeignKey(
        "Player",
        related_name="qas",
        on_delete=models.CASCADE,
    )
    quality = models.CharField(max_length=255, blank=True)
    uses = models.IntegerField(default=0)

    def __str__(self) -> str:
        return self.quality
