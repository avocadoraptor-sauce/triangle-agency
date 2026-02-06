from django.contrib import admin
from django.urls import path, re_path
from django.conf.urls.static import static
from django.views.generic import TemplateView, RedirectView
from .views import api

# Serve the favicon from static/images

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", api.urls),
    path("", TemplateView.as_view(template_name="index.html"), name="home"),
    # We assign the catch-all route to react so the BrowserRouter works. 
    re_path(r'^[^/]*/(?!admin/|api/)(?:[^/\n]+/)+$', TemplateView.as_view(template_name='index.html'))
]
