# Face Recognition System - Deployment Checklist

## Pre-Deployment (Development)

### Database Setup
- [ ] MySQL database created and running
- [ ] Database credentials configured in `.env`
- [ ] Prisma migrations run: `npm run prisma:migrate`
- [ ] FaceData table created successfully
- [ ] Student table updated with `face_enrolled` column
- [ ] Database indexes created

### Backend Setup
- [ ] Dependencies installed: `npm install`
- [ ] Prisma client generated: `npm run prisma:generate`
- [ ] Environment variables configured in `.env`
- [ ] Face API URL configured and accessible
- [ ] JWT secret configured
- [ ] Backend starts without errors: `npm run dev`

### Face Recognition System
- [ ] Face Recognition service running on port 8000
- [ ] Face API health check passes: `curl http://localhost:8000/health`
- [ ] Setup script runs successfully: `npm run setup:face`
- [ ] All face endpoints accessible
- [ ] Face verification working with test images

### Testing
- [ ] Student login works: `POST /auth/student-login`
- [ ] Face capture works: `POST /face/capture`
- [ ] Enrollment status retrieves: `GET /face/enrollment-status`
- [ ] Face verification works: `POST /face/verify`
- [ ] Attendance marking works: `POST /attendance/mark`
- [ ] All endpoints return proper error messages

---

## Pre-Production Deployment

### Security
- [ ] JWT_SECRET changed from default
- [ ] Database password is strong
- [ ] CORS origins configured for production domain
- [ ] HTTPS enabled on all endpoints
- [ ] Rate limiting implemented
- [ ] Input validation on all endpoints
- [ ] Error messages don't expose sensitive info

### Configuration
- [ ] NODE_ENV set to `production`
- [ ] DATABASE_URL points to production database
- [ ] FACE_API points to production Face API
- [ ] FACE_MATCH_THRESHOLD set appropriately (0.6-0.7)
- [ ] FRONTEND_URL set to production domain
- [ ] All environment variables documented

### Database
- [ ] Production database backed up
- [ ] Migrations tested on production schema
- [ ] Database indexes verified
- [ ] Connection pooling configured
- [ ] Slow query logging enabled

### Face API
- [ ] Production Face API deployed and tested
- [ ] API endpoint verified and accessible
- [ ] API authentication configured (if required)
- [ ] API rate limits set
- [ ] API monitoring enabled
- [ ] Fallback strategy defined

### Monitoring & Logging
- [ ] Application logging configured
- [ ] Error tracking setup (e.g., Sentry)
- [ ] Database monitoring enabled
- [ ] Face API monitoring enabled
- [ ] Uptime monitoring configured
- [ ] Alert system configured

### Performance
- [ ] Database queries optimized
- [ ] Indexes verified on production
- [ ] Caching strategy implemented
- [ ] API response times acceptable
- [ ] Database connection pooling working
- [ ] Load testing completed

---

## Deployment Steps

### 1. Prepare Production Environment
```bash
# SSH into production server
ssh user@production-server

# Clone repository
git clone <repo-url>
cd VISTA/backend

# Install dependencies
npm install --production

# Generate Prisma client
npm run prisma:generate
```

### 2. Configure Environment
```bash
# Copy environment template
cp .env.example .env

# Edit with production values
nano .env
# Set:
# - DATABASE_URL (production database)
# - JWT_SECRET (strong random secret)
# - FACE_API (production Face API URL)
# - NODE_ENV=production
# - FRONTEND_URL (production domain)
```

### 3. Database Migration
```bash
# Run migrations on production database
npm run prisma:migrate:deploy

# Verify schema
npm run prisma:studio
```

### 4. Setup Face Recognition
```bash
# Verify face system setup
npm run setup:face
```

### 5. Start Application
```bash
# Using PM2 (recommended for production)
npm install -g pm2
pm2 start server.js --name "vista-backend"
pm2 save
pm2 startup

# Or using systemd
sudo systemctl start vista-backend
sudo systemctl enable vista-backend
```

### 6. Verify Deployment
```bash
# Check health endpoint
curl https://your-api.com/health

# Check Face API connection
curl https://your-api.com/debug/geolocation

# Test student login
curl -X POST https://your-api.com/auth/student-login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@jklu.edu.in", "password": "123"}'
```

---

## Post-Deployment Verification

### API Endpoints
- [ ] All endpoints respond with correct status codes
- [ ] Authentication required on protected routes
- [ ] CORS headers present for frontend domain
- [ ] Error responses are consistent

### Face Recognition
- [ ] Face capture stores data correctly
- [ ] Face verification returns accurate results
- [ ] Attendance marking works end-to-end
- [ ] Face match scores are reasonable

### Database
- [ ] Data persists correctly
- [ ] Relationships maintained
- [ ] Indexes performing well
- [ ] No connection errors

### Monitoring
- [ ] Logs are being generated
- [ ] Error tracking is working
- [ ] Performance metrics available
- [ ] Alerts configured and tested

---

## Rollback Plan

### If Deployment Fails

```bash
# Stop current deployment
pm2 stop vista-backend
# or
sudo systemctl stop vista-backend

# Rollback database
npm run prisma:migrate:resolve

# Restore previous version
git checkout <previous-commit>
npm install
npm run prisma:generate

# Restart with previous version
pm2 start server.js --name "vista-backend"
# or
sudo systemctl start vista-backend
```

### Database Rollback
```bash
# If migrations failed
npm run prisma:migrate:resolve

# Restore from backup
mysql vista < backup.sql
```

---

## Maintenance Schedule

### Daily
- [ ] Monitor error logs
- [ ] Check Face API availability
- [ ] Monitor database performance
- [ ] Check API response times

### Weekly
- [ ] Review error trends
- [ ] Check database size growth
- [ ] Verify backup completion
- [ ] Review security logs

### Monthly
- [ ] Database optimization
- [ ] Performance analysis
- [ ] Security audit
- [ ] Dependency updates

### Quarterly
- [ ] Full system audit
- [ ] Disaster recovery drill
- [ ] Capacity planning
- [ ] Security penetration testing

---

## Troubleshooting Guide

### Issue: Face API Connection Failed
```bash
# Check if Face API is running
curl http://face-api-server:8000/health

# Check network connectivity
ping face-api-server

# Check firewall rules
sudo ufw status

# Check logs
pm2 logs vista-backend
```

### Issue: Database Connection Error
```bash
# Check MySQL is running
sudo systemctl status mysql

# Test connection
mysql -u user -p -h host -e "SELECT 1"

# Check connection string in .env
cat .env | grep DATABASE_URL
```

### Issue: High Memory Usage
```bash
# Check process memory
pm2 monit

# Check for memory leaks
node --inspect server.js

# Restart application
pm2 restart vista-backend
```

### Issue: Slow Face Verification
```bash
# Check Face API performance
curl -X POST http://face-api:8000/verify-face \
  -H "Content-Type: application/json" \
  -d '{...}'

# Check database query performance
npm run prisma:studio

# Monitor Face API logs
```

---

## Performance Benchmarks

### Expected Performance
- Face capture: < 1 second
- Face verification: 1-3 seconds
- Attendance marking: 2-5 seconds
- Database query: < 100ms
- API response: < 500ms

### Monitoring Metrics
- API response time (p50, p95, p99)
- Error rate (target: < 0.1%)
- Face API availability (target: > 99.9%)
- Database connection pool usage
- Memory usage (target: < 500MB)
- CPU usage (target: < 50%)

---

## Security Hardening

### Before Production
- [ ] Remove debug endpoints
- [ ] Enable HTTPS/TLS
- [ ] Configure firewall rules
- [ ] Set up DDoS protection
- [ ] Enable rate limiting
- [ ] Configure CORS properly
- [ ] Implement API key rotation
- [ ] Set up audit logging

### Ongoing
- [ ] Regular security updates
- [ ] Dependency vulnerability scanning
- [ ] Penetration testing
- [ ] Security audit logs review
- [ ] Incident response plan
- [ ] Disaster recovery drills

---

## Documentation

### Required Documentation
- [ ] API documentation updated
- [ ] Database schema documented
- [ ] Deployment procedure documented
- [ ] Troubleshooting guide created
- [ ] Runbook for common issues
- [ ] Architecture diagram
- [ ] Security policies documented

### Team Communication
- [ ] Deployment notification sent
- [ ] Team trained on new features
- [ ] Support team briefed
- [ ] Documentation shared
- [ ] Runbook distributed

---

## Sign-Off

### Development Team
- [ ] Code review completed
- [ ] All tests passing
- [ ] Documentation complete
- [ ] Ready for production

### QA Team
- [ ] All test cases passed
- [ ] Performance acceptable
- [ ] Security verified
- [ ] Ready for production

### Operations Team
- [ ] Infrastructure ready
- [ ] Monitoring configured
- [ ] Backup verified
- [ ] Ready for production

### Project Manager
- [ ] Stakeholder approval
- [ ] Timeline confirmed
- [ ] Risk assessment complete
- [ ] Go/No-go decision

---

## Post-Deployment Review

### 24 Hours After Deployment
- [ ] No critical errors in logs
- [ ] Face API working correctly
- [ ] Database performing well
- [ ] User feedback collected
- [ ] Performance metrics reviewed

### 1 Week After Deployment
- [ ] System stability verified
- [ ] Performance baseline established
- [ ] No security issues reported
- [ ] User adoption metrics reviewed
- [ ] Lessons learned documented

### 1 Month After Deployment
- [ ] Full system audit completed
- [ ] Performance optimization opportunities identified
- [ ] Capacity planning updated
- [ ] Security audit completed
- [ ] Roadmap for improvements created

---

## Contact Information

### Support Contacts
- **Backend Lead:** [Name] - [Email]
- **DevOps:** [Name] - [Email]
- **Database Admin:** [Name] - [Email]
- **Security:** [Name] - [Email]

### Escalation Path
1. First responder: [Name]
2. Team lead: [Name]
3. Manager: [Name]
4. Director: [Name]

### Emergency Contacts
- **On-call:** [Phone]
- **Backup:** [Phone]
- **Escalation:** [Phone]

---

**Deployment Date:** _______________
**Deployed By:** _______________
**Approved By:** _______________
**Notes:** _______________

---

**Last Updated:** Nov 16, 2025
**Version:** 1.0.0
