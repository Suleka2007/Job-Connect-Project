
from django.urls import path
from .views import (
    JobApplicationListCreateView,
    EmployerApplicationListView,
    EmployerApplicationStatusUpdateView,
)

urlpatterns = [
    path(
        "",
        JobApplicationListCreateView.as_view(),
        name="application-list-create",
    ),
    path(
        "employer/",
        EmployerApplicationListView.as_view(),
        name="employer-applications",
    ),
    path(
        "employer/<int:pk>/status/",
        EmployerApplicationStatusUpdateView.as_view(),
        name="employer-application-status",
    ),
]