# VISTA Deployment Guide

## Backend Deployment Issue Fix

Your backend is running at `https://vista-ia7c.onrender.com` but returning 404 for the `/debug/geolocation` endpoint.

### Steps to Fix:

#### 1. Redeploy Backend on Render

Go to your Render dashboard and redeploy the backend service:

1. Log in to [Render Dashboard](https://dashboard.render.com/)
2. Find your `vista-backend` service
3. Click **Manual Deploy** → **Deploy latest commit**
4. Wait for deployment to complete (5-10 minutes)

#### 2. Verify Backend Environment Variables

Make sure these environment variables are set in Render:

```
DATABASE_URL=mysql://user:password@host:3306/vista
JWT_SECRET=your-secret-key
FRONTEND_URL=https://your-frontend.vercel.app
AUTO_SEED=false
```

#### 3. Check Database Connection

Your backend needs a MySQL database. Make sure:
- Database is running and accessible
- `DATABASE_URL` is correctly configured
- Campus polygon data is seeded in the database

#### 4. Test Backend Endpoints

After redeployment, test these URLs in your browser:

```
https://vista-ia7c.onrender.com/
https://vista-ia7c.onrender.com/health
```

Both should return JSON responses without 404 errors.

#### 5. Frontend Configuration

The frontend automatically detects the backend URL:
- **Localhost**: Uses `http://localhost:5000`
- **Deployed**: Uses `https://vista-ia7c.onrender.com`

You can override this by creating a `.env.local` file in the root directory:

```bash
# Create .env.local file
VITE_API_URL=https://vista-ia7c.onrender.com
```

## Common Issues

### Issue: Backend returns 404
**Solution**: Redeploy backend with latest code

### Issue: Database connection error
**Solution**: Check `DATABASE_URL` environment variable in Render

### Issue: Campus polygon not configured
**Solution**: Run the seed script:
```bash
cd backend
npm run seed
```

### Issue: CORS errors
**Solution**: Add your frontend URL to `FRONTEND_URL` environment variable in Render

## Quick Deploy Commands

### Backend (Render)
1. Push latest code to GitHub
2. Render will auto-deploy (if enabled)
3. Or manually deploy from Render dashboard

### Frontend (Vercel)
```bash
# Deploy to Vercel
vercel --prod
```

## Testing Locally

### Backend
```bash
cd backend
npm install
npm run prisma:generate
npm run prisma:migrate
npm run seed
npm start
```

### Frontend
```bash
npm install
npm run dev
```

## Support

If issues persist:
1. Check Render logs for backend errors
2. Verify database is accessible
3. Ensure all environment variables are set
4. Check that campus polygon is seeded in database
