
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied

from .models import JobApplication
from .serializers import (
    JobApplicationSerializer,
    EmployerApplicationStatusSerializer,
)


class JobApplicationListCreateView(generics.ListCreateAPIView):
    serializer_class = JobApplicationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.profile.role != "job_seeker":
            raise PermissionDenied(
                "Only job seekers can view their applications."
            )

        return JobApplication.objects.filter(
            applicant=self.request.user
        )

    def perform_create(self, serializer):
        if self.request.user.profile.role != "job_seeker":
            raise PermissionDenied(
                "Only job seekers can apply for jobs."
            )

        serializer.save(applicant=self.request.user)


class EmployerApplicationListView(generics.ListAPIView):
    serializer_class = JobApplicationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.profile.role != "employer":
            raise PermissionDenied(
                "Only employers can view job applications."
            )

        return JobApplication.objects.filter(
            job__employer=self.request.user.employer
        ).select_related("job", "applicant")


class EmployerApplicationStatusUpdateView(generics.UpdateAPIView):
    serializer_class = EmployerApplicationStatusSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ["patch", "options", "head"]

    def get_queryset(self):
        if self.request.user.profile.role != "employer":
            raise PermissionDenied(
                "Only employers can update application status."
            )

        return JobApplication.objects.filter(
            job__employer=self.request.user.employer
        )

    def perform_update(self, serializer):
        serializer.save()