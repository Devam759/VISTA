# VISTA – Verified Intelligent Student Tracking & Attendance (Frontend)

A React + Vite + Tailwind frontend scaffold with role-protected routes, access checks, and basic pages for Student and Warden flows.

## Tech
- React + Vite
- React Router DOM
- Tailwind CSS
- Context API for Auth + Role

## Run locally
```bash
npm install
npm run dev
```

## Structure
```
src/
 ├─ components/
 ├─ pages/
 │   ├─ CheckAccess.jsx
 │   ├─ Login.jsx
 │   ├─ student/
 │   │   ├─ Dashboard.jsx
 │   │   ├─ MarkAttendance.jsx
 │   │   ├─ History.jsx
 │   └─ warden/
 │       ├─ Dashboard.jsx
 │       └─ Students.jsx
 ├─ context/
 │   ├─ AuthContext.jsx
 ├─ utils/
 │   ├─ geoCheck.js
 │   ├─ wifiCheck.js
 ├─ router.jsx
 └─ App.jsx
```

## Notes
- Access checks are mocked in `utils/geoCheck.js` and `utils/wifiCheck.js`.
- Login is case-insensitive and routes by role. Use any password. Include the word `warden` in the ID to login as Warden; anything else logs in as Student.
- Camera uses browser `getUserMedia` and captures an image.
- Time window for marking attendance: 10:00 PM – 10:30 PM. After that, "Mark Late" is enabled.
- Replace mocks with real APIs later.
