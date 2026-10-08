from django.urls import path
from .views import EmployerListCreateView

urlpatterns = [
    path("", EmployerListCreateView.as_view(), name="employer-list-create"),
]