from django.contrib import admin

from .mission import Mission, MissionGM, MissionImage, MissionPublic
from .player import Player, PlayerQA
from .power import Power
from .power_question import PowerQuestion, PowerQuestionAnswer

admin.site.register(Mission)
admin.site.register(MissionPublic)
admin.site.register(MissionImage)
admin.site.register(MissionGM)
admin.site.register(Player)
admin.site.register(PlayerQA)
admin.site.register(Power)
admin.site.register(PowerQuestion)
admin.site.register(PowerQuestionAnswer)
