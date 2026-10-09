
from rest_framework import serializers
from .models import JobApplication


class JobApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobApplication
        fields = [
            "id",
            "job",
            "applicant",
            "resume",
            "cover_letter",
            "status",
            "applied_at",
        ]
        read_only_fields = [
            "id",
            "applicant",
            "status",
            "applied_at",
        ]

    def validate(self, data):
        request = self.context.get("request")
        job = data.get("job")

        if request and request.user.is_authenticated:
            already_applied = JobApplication.objects.filter(
                job=job,
                applicant=request.user
            ).exists()

            if already_applied:
                raise serializers.ValidationError(
                    "You have already applied for this job."
                )

        return data