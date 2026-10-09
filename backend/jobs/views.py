
from django.db.models import Q
from rest_framework import viewsets
from rest_framework.exceptions import PermissionDenied

from .models import Job
from .serializers import JobSerializer
from .permissions import IsEmployerOwnerOrReadOnly


class JobViewSet(viewsets.ModelViewSet):
    serializer_class = JobSerializer
    permission_classes = [IsEmployerOwnerOrReadOnly]

    def get_queryset(self):
        user = self.request.user
        mine = self.request.query_params.get("mine") == "true"

        if not user.is_authenticated:
            if mine:
                raise PermissionDenied("Login as an employer to manage jobs.")
            return Job.objects.filter(is_active=True)

        try:
            role = user.profile.role
        except AttributeError:
            role = None

        if role == "employer":
            if mine:
                return Job.objects.filter(employer__user=user)

            return Job.objects.filter(
                Q(is_active=True) | Q(employer__user=user)
            ).distinct()

        if mine:
            raise PermissionDenied("Only employers can manage jobs.")

        return Job.objects.filter(is_active=True)

    def perform_create(self, serializer):
        try:
            employer = self.request.user.employer
        except AttributeError:
            raise PermissionDenied(
                "Your account is not linked to an employer profile."
            )

        serializer.save(employer=employer)