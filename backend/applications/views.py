
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from .models import JobApplication
from .serializers import JobApplicationSerializer


class JobApplicationListCreateView(generics.ListCreateAPIView):
    serializer_class = JobApplicationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return JobApplication.objects.filter(
            applicant=self.request.user
        )

    def perform_create(self, serializer):
        serializer.save(applicant=self.request.user)
