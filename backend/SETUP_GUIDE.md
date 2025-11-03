# VISTA Backend Setup Guide

Complete step-by-step guide to set up the VISTA backend.

## Prerequisites

- Node.js (v18 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

## Step-by-Step Setup

### 1. Navigate to Backend Directory
```bash
cd backend
```

### 2. Install Dependencies
```bash
npm install
```

This will install:
- Express.js
- Prisma ORM
- JWT for authentication
- bcryptjs for password hashing
- axios for API calls
- cors for cross-origin requests

### 3. Create MySQL Database
```bash
# Login to MySQL
mysql -u root -p

# Create database
CREATE DATABASE IF NOT EXISTS vista;
EXIT;
```

Or use command line:
```bash
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS vista;"
```

### 4. Configure Environment Variables
```bash
# Copy example env file
cp .env.example .env
```

Edit `.env` file:
```env
PORT=5000
DATABASE_URL="mysql://root:YOUR_PASSWORD@localhost:3306/vista"
JWT_SECRET=your_super_secret_jwt_key_change_in_production
FACE_API=http://localhost:8000/verify-face
```

**Important:** Replace `YOUR_PASSWORD` with your MySQL root password.

### 5. Generate Prisma Client
```bash
npm run prisma:generate
```

This generates the Prisma Client based on your schema.

### 6. Run Database Migrations
```bash
npm run prisma:migrate
```

When prompted for migration name, enter: `init`

This creates all tables:
- students
- wardens
- hostels
- rooms
- attendance
- campus_polygon

### 7. Seed Sample Data
```bash
npm run prisma:seed
```

This creates:
- 2 Hostels (Hostel A, Hostel B)
- 20 Rooms (10 per hostel)
- 3 Sample Students
- 2 Sample Wardens
- Campus polygon coordinates

**Sample Credentials Created:**
- Student: `student1@jklu.edu.in` / `123`
- Warden: `karan@jklu.edu.in` / `123`

### 8. Start the Server
```bash
# Production mode
npm start

# Development mode (with auto-reload)
npm run dev
```

Server will start on `http://localhost:5000`

### 9. Verify Setup
Test the health endpoint:
```bash
curl http://localhost:5000
```

Expected response:
```json
{
  "message": "VISTA Backend API",
  "version": "1.0.0",
  "status": "running"
}
```

### 10. Test Login
```bash
curl -X POST http://localhost:5000/auth/student-login \
  -H "Content-Type: application/json" \
  -d '{"email":"student1@jklu.edu.in","password":"123"}'
```

You should receive a JWT token.

## Optional: Prisma Studio

View and edit your database in a GUI:
```bash
npm run prisma:studio
```

Opens at `http://localhost:5555`

## Troubleshooting

### Error: "Can't reach database server"
- Check MySQL is running: `sudo service mysql status`
- Verify DATABASE_URL in `.env`
- Check MySQL credentials

### Error: "Prisma Client not generated"
```bash
npm run prisma:generate
```

### Error: "Migration failed"
- Drop database and recreate:
```bash
mysql -u root -p -e "DROP DATABASE vista; CREATE DATABASE vista;"
npm run prisma:migrate
```

### Error: Port 5000 already in use
Change PORT in `.env` to another port (e.g., 5001)

### Seed fails
```bash
# Reset database
npx prisma migrate reset
# This will drop, recreate, migrate, and seed
```

## Next Steps

1. **Connect Frontend**: Update frontend API base URL to `http://localhost:5000`
2. **Setup Face API**: Ensure DeepFace API is running on port 8000
3. **Test APIs**: Use Postman or see `API_DOCS.md`
4. **Update Campus Polygon**: Edit coordinates in seed file for actual campus location

## Database Management

### View all tables
```bash
mysql -u root -p vista -e "SHOW TABLES;"
```

### Reset database
```bash
npx prisma migrate reset
```

### Create new migration
```bash
npx prisma migrate dev --name your_migration_name
```

### Update Prisma Client after schema changes
```bash
npm run prisma:generate
```

## Production Deployment

1. Set strong JWT_SECRET
2. Use environment-specific DATABASE_URL
3. Enable HTTPS
4. Set NODE_ENV=production
5. Use process manager (PM2)
6. Configure firewall rules
7. Set up database backups

## Support

For issues, check:
- `README.md` - General documentation
- `API_DOCS.md` - API endpoints and examples
- Prisma docs: https://www.prisma.io/docs
