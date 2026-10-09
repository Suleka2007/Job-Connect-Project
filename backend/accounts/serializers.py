
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Employer, UserProfile


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    role = serializers.ChoiceField(
        choices=UserProfile.ROLE_CHOICES
    )
    company_name = serializers.CharField(
        required=False, allow_blank=True
    )
    company_location = serializers.CharField(
        required=False, allow_blank=True
    )

    class Meta:
        model = User
        fields = [
            "username",
            "email",
            "password",
            "role",
            "company_name",
            "company_location",
        ]

    def validate(self, data):
        if data["role"] == "employer":
            if not data.get("company_name", "").strip():
                raise serializers.ValidationError({
                    "company_name": "Company name is required for employers."
                })
            if not data.get("company_location", "").strip():
                raise serializers.ValidationError({
                    "company_location": "Company location is required for employers."
                })

        return data

    def create(self, validated_data):
        role = validated_data.pop("role")
        company_name = validated_data.pop("company_name", "")
        company_location = validated_data.pop("company_location", "")

        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
        )

        UserProfile.objects.create(
            user=user,
            role=role,
        )

        if role == "employer":
            Employer.objects.create(
                user=user,
                company_name=company_name,
                company_location=company_location,
            )

        return user


class EmployerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employer
        fields = "__all__"