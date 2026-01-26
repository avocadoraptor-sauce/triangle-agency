from django.db import models


class PowerQuestion(models.Model):
    power_question_id = models.IntegerField(unique=True)

    def __str__(self) -> str:
        return f"PowerQuestion {self.power_question_id}"


class PowerQuestionAnswer(models.Model):
    power_question = models.ForeignKey(
        "PowerQuestion",
        related_name="answers",
        on_delete=models.CASCADE,
    )
    answer = models.CharField(max_length=255, blank=True)
    count = models.IntegerField(default=0)

    def __str__(self) -> str:
        return self.answer
