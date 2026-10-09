from django.contrib.auth import authenticate
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token

from .serializers import RegisterSerializer


class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.save()
            token, created = Token.objects.get_or_create(user=user)

            return Response(
                {
                    "message": "Registration successful",
                    "token": token.key,
                    "username": user.username,
                    "email": user.email,
                    "role": user.profile.role,
                },
                status=status.HTTP_201_CREATED
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )



class LoginView(APIView):
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        user = authenticate(
            username=username,
            password=password
        )

        if user is not None:
            token, created = Token.objects.get_or_create(user=user)

            profile = getattr(user, "profile", None)

            if profile:
                role = profile.role
            elif hasattr(user, "employer"):
                role = "employer"
            else:
                role = "unassigned"

            return Response(
                {
                    "message": "Login successful",
                    "token": token.key,
                    "username": user.username,
                    "role": role,
                },
                status=status.HTTP_200_OK
            )

        return Response(
            {"error": "Invalid username or password"},
            status=status.HTTP_401_UNAUTHORIZED
        )