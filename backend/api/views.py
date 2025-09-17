from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
import base64
import cv2
import numpy as np
import mysql.connector
from django.conf import settings


def get_db_connection():
	"""Get database connection"""
	try:
		connection = mysql.connector.connect(
			host='localhost',
			user='root',
			password='root',  # Try with 'root' as password
			database='vista_attendance'
		)
		return connection
	except mysql.connector.Error as e:
		print(f"Database connection error: {e}")
		# Try without password if root password fails
		try:
			connection = mysql.connector.connect(
				host='localhost',
				user='root',
				password='',
				database='vista_attendance'
			)
			return connection
		except mysql.connector.Error as e2:
			print(f"Database connection error (no password): {e2}")
			return None

def generate_tokens_for_user(user: User):
	refresh = RefreshToken.for_user(user)
	return {
		"access": str(refresh.access_token),
		"refresh": str(refresh),
	}


@api_view(["POST"])
@permission_classes([AllowAny])
def login_view(request):
	email = request.data.get("email")
	password = request.data.get("password")
	if not email or not password:
		return Response({"message": "Email and password required"}, status=status.HTTP_400_BAD_REQUEST)
	# For demo, username is email
	user = authenticate(username=email, password=password)
	if not user:
		# If user not exists, create one with role logic default
		if not User.objects.filter(username=email).exists():
			user = User.objects.create_user(username=email, email=email, password=password)
		else:
			return Response({"message": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
	tokens = generate_tokens_for_user(user)
	role = "Student"
	return Response({
		"token": tokens["access"],
		"user": {"id": user.id, "email": user.email or user.username, "role": role},
	})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def me_view(request):
	user: User = request.user
	role = "Student"
	return Response({"id": user.id, "email": user.email or user.username, "role": role})


# Helpers for decoding data URL images

def _decode_data_url_image(data_url: str):
	try:
		head, b64 = data_url.split(",", 1)
		binary = base64.b64decode(b64)
		np_arr = np.frombuffer(binary, np.uint8)
		img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
		return img
	except Exception:
		return None


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def enroll_face_view(request):
	# Expect { image: "data:image/jpeg;base64,...", student_id?: string }
	image_data = request.data.get("image")
	img = _decode_data_url_image(image_data) if image_data else None
	if img is None:
		return Response({"message": "Invalid image"}, status=status.HTTP_400_BAD_REQUEST)
	# Placeholder: detect face, extract embedding; store in DB later
	gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
	# Return fake vector length to confirm pipeline
	return Response({"message": "enrolled", "vector_len": int(gray.mean())})


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def verify_face_view(request):
	# Expect { image: "data:image/jpeg;base64,..." }
	image_data = request.data.get("image")
	img = _decode_data_url_image(image_data) if image_data else None
	if img is None:
		return Response({"message": "Invalid image"}, status=status.HTTP_400_BAD_REQUEST)
	# Placeholder: compare embedding with stored one
	confidence = 0.95
	return Response({"match": True, "confidence": confidence})


@api_view(["GET"])
@permission_classes([AllowAny])
def students_view(request):
	"""Get all students from database"""
	try:
		conn = get_db_connection()
		if not conn:
			return Response({"message": "Database connection failed"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
		
		cursor = conn.cursor(dictionary=True)
		
		# Get hostel filter from query params
		hostel_filter = request.GET.get('hostel', 'All Hostels')
		
		if hostel_filter == 'All Hostels':
			query = """
			SELECT 
				s.student_id,
				s.roll_number,
				CONCAT(u.first_name, ' ', u.last_name) as name,
				r.room_number,
				h.name as hostel_name
			FROM students s
			JOIN users u ON s.user_id = u.user_id
			JOIN hostels h ON s.hostel_id = h.hostel_id
			LEFT JOIN rooms r ON s.room_id = r.room_id
			ORDER BY h.name, r.room_number, s.roll_number
			"""
			cursor.execute(query)
		else:
			query = """
			SELECT 
				s.student_id,
				s.roll_number,
				CONCAT(u.first_name, ' ', u.last_name) as name,
				r.room_number,
				h.name as hostel_name
			FROM students s
			JOIN users u ON s.user_id = u.user_id
			JOIN hostels h ON s.hostel_id = h.hostel_id
			LEFT JOIN rooms r ON s.room_id = r.room_id
			WHERE h.name = %s
			ORDER BY r.room_number, s.roll_number
			"""
			cursor.execute(query, (hostel_filter,))
		
		students = cursor.fetchall()
		cursor.close()
		conn.close()
		
		# Format the response to match frontend expectations
		formatted_students = []
		for student in students:
			formatted_students.append({
				"studentId": student['student_id'],
				"rollNo": student['roll_number'],
				"name": student['name'],
				"roomNo": student['room_number'] or "N/A",
				"hostel": student['hostel_name']
			})
		
		return Response({"students": formatted_students})
		
	except Exception as e:
		print(f"Error fetching students: {e}")
		return Response({"message": "Failed to fetch students"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
