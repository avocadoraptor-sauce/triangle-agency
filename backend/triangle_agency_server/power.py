from django.db import models


class Power(models.Model):
    power_id = models.IntegerField(unique=True)
    success = models.TextField(blank=True)
    extra_success = models.TextField(blank=True)
    fail = models.TextField(blank=True)
    power_questions = models.ManyToManyField(
        "PowerQuestion",
        blank=True,
        related_name="powers",
    )

    def __str__(self) -> str:
        return f"Power {self.power_id}"
