from django.contrib import admin
from django.forms import BaseInlineFormSet, ModelForm, ValidationError

from .models import Mission, Player, QualityAssurance

class MissionAdmin(admin.ModelAdmin):
    filter_horizontal = ('players',)

class QAFormset(BaseInlineFormSet):
    def clean(self):
        super(QAFormset, self).clean()
        # Find all non-deleted quality rows.
        qualities = [
            form.cleaned_data.get("quality") for form in self.forms
            if not form.cleaned_data.get("DELETE")
        ]
        # Detect duplicate qualities
        if len(set(qualities)) < len(qualities):
            raise ValidationError(
                "A player cannot have two qas for the same quality."
            )



class QualityAssuranceInline(admin.TabularInline):
    # From https://stackoverflow.com/a/34567383
    # This lets us leave new QAs unchanged.
    class AlwaysChangedModelForm(ModelForm):
        def has_changed(self):
            return True

    formset = QAFormset
    model = QualityAssurance
    extra = 0
    form = AlwaysChangedModelForm


class PlayerAdmin(admin.ModelAdmin):
    filter_horizontal = ('missions',)
    inlines = [
        QualityAssuranceInline
    ]


admin.site.register(Mission, MissionAdmin)
admin.site.register(Player, PlayerAdmin)
