from django.contrib import admin

from .models import Mission, MissionGM, MissionImage, MissionPublic

admin.site.register(Mission)
admin.site.register(MissionPublic)
admin.site.register(MissionImage)
admin.site.register(MissionGM)