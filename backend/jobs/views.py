from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly

from .models import Job
from .serializers import JobSerializer
from .permissions import IsEmployerOwnerOrReadOnly


class JobViewSet(viewsets.ModelViewSet):
    queryset = Job.objects.all()
    serializer_class = JobSerializer
    permission_classes = [IsEmployerOwnerOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(employer=self.request.user.employer)

    def get_queryset(self):
        return Job.objects.filter(is_active=True)