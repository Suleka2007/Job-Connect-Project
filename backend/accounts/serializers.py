from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Employer


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    company_name = serializers.CharField(write_only=True)
    company_location = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = [
            "username",
            "email",
            "password",
            "company_name",
            "company_location"
        ]

    def create(self, validated_data):
        company_name = validated_data.pop("company_name")
        company_location = validated_data.pop("company_location")

        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"]
        )

        Employer.objects.create(
            user=user,
            company_name=company_name,
            company_location=company_location
        )

        return user


class EmployerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employer
        fields = "__all__"