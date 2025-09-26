# VISTA Backend API

Flask-based REST API for the VISTA College Night Attendance System.

## Features

- 🔐 JWT-based authentication
- 👥 Role-based access control (Student, Warden, ChiefWarden)
- 📱 Face recognition attendance marking
- 📍 GPS location verification
- 📶 WiFi network verification
- 📊 Comprehensive attendance tracking
- 🏠 Hostel management
- 📈 Real-time statistics

## API Endpoints

### Authentication
- `POST /auth/login` - User login
- `GET /auth/me` - Get current user info

### Students
- `GET /students` - Get students list (with hostel filter)

### Attendance
- `GET /attendance` - Get attendance records
- `POST /attendance/mark` - Mark attendance

### Hostels
- `GET /hostels` - Get hostels list

### Face Recognition
- `POST /face/enroll` - Enroll student face

### System
- `GET /health` - Health check

## Installation

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Environment Setup
Create a `.env` file with your configuration:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=vista_attendance
JWT_SECRET_KEY=your-secret-key
```

### 3. Database Setup
Make sure MySQL is running and the database is created:
```sql
mysql -u root -p < ../database/vista_schema.sql
```

### 4. Run the Application
```bash
python app.py
```

The API will be available at `http://localhost:8000`

## API Usage Examples

### Login
```bash
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "devamgupta@jklu.edu.in", "password": "password"}'
```

### Get Students
```bash
curl -X GET http://localhost:8000/students \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Mark Attendance
```bash
curl -X POST http://localhost:8000/attendance/mark \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"face_image": "base64_image_data", "wifi_verified": true, "gps_verified": true}'
```

## Configuration

### Database Configuration
- `DB_HOST` - Database host (default: localhost)
- `DB_USER` - Database username (default: root)
- `DB_PASSWORD` - Database password
- `DB_NAME` - Database name (default: vista_attendance)
- `DB_PORT` - Database port (default: 3306)

### JWT Configuration
- `JWT_SECRET_KEY` - Secret key for JWT tokens
- `JWT_ACCESS_TOKEN_EXPIRES` - Token expiration time in seconds

### Face Recognition
- `FACE_RECOGNITION_TOLERANCE` - Face recognition tolerance (default: 0.6)
- `FACE_RECOGNITION_MODEL` - Recognition model (default: hog)

### GPS Configuration
- `HOSTEL_LATITUDE` - Hostel latitude (default: 26.2389)
- `HOSTEL_LONGITUDE` - Hostel longitude (default: 73.0243)
- `GPS_ACCURACY_RADIUS` - GPS accuracy radius in meters (default: 100)

### WiFi Configuration
- `REQUIRED_WIFI_SSID` - Required WiFi SSID (default: JKLU-Hostel)

## Security Features

- JWT token authentication
- Password hashing with bcrypt
- Role-based access control
- Input validation
- SQL injection prevention
- CORS configuration

## Error Handling

The API returns consistent error responses:
```json
{
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

Common HTTP status codes:
- `200` - Success
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Development

### Project Structure
```
backend/
├── app.py              # Main Flask application
├── config.py           # Configuration management
├── database.py         # Database utilities
├── requirements.txt    # Python dependencies
└── README.md          # This file
```

### Adding New Endpoints

1. Define the route in `app.py`
2. Add database queries in `database.py`
3. Update this README with endpoint documentation

### Testing

Run the health check endpoint:
```bash
curl http://localhost:8000/health
```

Expected response:
```json
{
  "status": "healthy",
  "database": "connected"
}
```

## Deployment

### Production Considerations

1. **Environment Variables**: Set all sensitive configuration via environment variables
2. **Database Security**: Use strong passwords and restrict database access
3. **JWT Secret**: Use a strong, random JWT secret key
4. **HTTPS**: Always use HTTPS in production
5. **Logging**: Configure proper logging for monitoring
6. **Backup**: Regular database backups

### Docker Deployment (Optional)

Create a `Dockerfile`:
```dockerfile
FROM python:3.9-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 8000

CMD ["python", "app.py"]
```

Build and run:
```bash
docker build -t vista-backend .
docker run -p 8000:8000 vista-backend
```

## Monitoring

### Health Checks
- Database connectivity
- Application status
- Memory usage
- Response times

### Logging
- Request/response logging
- Error logging
- Authentication events
- Database queries

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check database credentials
   - Ensure MySQL is running
   - Verify database exists

2. **JWT Token Invalid**
   - Check JWT secret key
   - Verify token expiration
   - Ensure proper Authorization header

3. **Face Recognition Errors**
   - Check OpenCV installation
   - Verify image format
   - Check face detection parameters

### Debug Mode

Enable debug mode for development:
```bash
export FLASK_DEBUG=True
python app.py
```

## Support

For issues or questions:
1. Check the logs for error messages
2. Verify database connectivity
3. Test with health check endpoint
4. Review configuration settings

## License

This project is part of the VISTA College Night Attendance System.
