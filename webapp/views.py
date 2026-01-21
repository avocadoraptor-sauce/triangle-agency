from django.shortcuts import render


def index(request):
    context = {
        "chaos_pool": 7,
        "loose_ends": 3,
        "image_subtitle": "Evidence Board Snapshot",
    }
    return render(request, "webapp/index.html", context)
