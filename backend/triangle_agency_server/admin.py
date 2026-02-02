from django.contrib import admin

from .models import Mission, Player, QualityAssurance

admin.site.register(Mission)
admin.site.register(Player)
admin.site.register(QualityAssurance)
