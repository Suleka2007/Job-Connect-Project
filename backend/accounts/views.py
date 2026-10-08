from rest_framework import generics
from .models import Employer
from .serializers import EmployerSerializer


class EmployerListCreateView(generics.ListCreateAPIView):
    queryset = Employer.objects.all()
    serializer_class = EmployerSerializer