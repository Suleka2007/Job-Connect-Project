from rest_framework import generics
from .models import JobApplication
from .serializers import JobApplicationSerializer


class JobApplicationListCreateView(generics.ListCreateAPIView):
    queryset = JobApplication.objects.all()
    serializer_class = JobApplicationSerializer
