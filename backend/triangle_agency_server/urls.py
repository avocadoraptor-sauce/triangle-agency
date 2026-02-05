from django.urls import path, re_path
from django.views.generic import TemplateView, RedirectView

from .views import api

favicon_view = RedirectView.as_view(url='/static/images/favicon.ico', permanent=True)

urlpatterns = [
    path("api/", api.urls),
    path("", TemplateView.as_view(template_name="index.html"), name="home"),
    re_path(r"^favicon\.ico$", favicon_view),
    # We assign the catch-all route to react so the BrowserRouter works. 
    # We have to exclude all the admin and api routes though since those are added recursively
    # instead of sequentially, so this one wins.
    re_path(r"^[^/]*/(?!admin/|api/)(?:[^/\n]+/)+$", TemplateView.as_view(template_name='index.html'))
]
