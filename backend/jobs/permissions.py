
from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsEmployerOwnerOrReadOnly(BasePermission):
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True

        if not request.user.is_authenticated:
            return False

        try:
            return request.user.profile.role == "employer"
        except AttributeError:
            return False

    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True

        return obj.employer.user_id == request.user.id