from django.urls import path
from .views import login_view, me_view, enroll_face_view, verify_face_view, students_view

urlpatterns = [
	path("auth/login", login_view),
	path("auth/me", me_view),
	path("face/enroll", enroll_face_view),
	path("face/verify", verify_face_view),
	path("students", students_view),
]
