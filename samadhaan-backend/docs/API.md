# SAMADHAAN Backend API Reference

Base URL: `http://localhost:5000/api/v1`  
Interactive Swagger UI: `http://localhost:5000/api/docs`

---

## 🔐 Authentication & Roles

### 1. Production Authentication (Firebase ID Token)
Include the Firebase token obtained from the frontend Firebase Client SDK:
```http
Authorization: Bearer <FIREBASE_ID_TOKEN>
```

### 2. Development-Only Auth Headers
When `NODE_ENV=development` and `ALLOW_DEV_AUTH=true`:
```http
X-Dev-User-ID: user-uuid-or-email
X-Dev-Role: CITIZEN | UNIVERSITY | INDUSTRY | GOVERNMENT | ADMIN
```

---

## 📡 API Endpoints Summary

### System
- `GET /health` — Check server and database health

### Users
- `GET /users/me` — Authenticated user profile
- `PUT /users/me` — Update user bio and contact
- `GET /users/:id` — Public profile of expert/industry

### Challenges
- `GET /challenges` — Paginated, searchable challenge list
- `POST /challenges` — Create new civic problem report
- `GET /challenges/:id` — Full problem dossier with AI triage and linked projects
- `PUT /challenges/:id` — Update challenge status and details
- `DELETE /challenges/:id` — Soft-delete challenge
- `GET /challenges/nearby` — PostGIS radius search (`?lat=18.59&lng=73.73&radius=10`)
- `POST /challenges/:id/evidence` — Multipart file attachment (image/video/pdf)
- `GET /challenges/:id/timeline` — Status audit trail

### Universities & Research
- `GET /universities` — List universities with departments
- `GET /universities/:id` — University profile with faculty experts
- `GET /universities/:id/challenges` — Assigned challenge feed
- `GET /universities/:id/projects` — Research projects

### Industry & CSR
- `GET /industries` — List corporate & MSME partners
- `GET /industries/:id/projects` — Supported CSR projects

### Research Projects & Solutions
- `POST /projects` — Create R&D project (Universities)
- `GET /projects` — List active projects
- `POST /projects/:id/team` — Add student/faculty member
- `POST /solutions` — Propose technical solution blueprint
- `POST /solutions/:id/deploy` — Field deployment tracking

### Government & Municipal
- `GET /government/dashboard` — Municipal SLA compliance and escalations
- `GET /government/hotspots` — Geospatial problem clusters for heatmaps
- `GET /government/departments` — ULBs and municipal divisions

### Analytics
- `GET /analytics/overview` — Platform high-level counters
- `GET /analytics/categories` — Problem distribution by category
- `GET /analytics/severity` — Critical/High/Medium/Low breakdown
- `GET /analytics/trends` — Month-on-month resolution velocity
