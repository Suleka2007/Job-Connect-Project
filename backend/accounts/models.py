from django.db import models
from django.contrib.auth.models import User


class Employer(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    company_name = models.CharField(max_length=200)
    company_description = models.TextField(blank=True)
    company_location = models.CharField(max_length=200)
    website = models.URLField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.company_name