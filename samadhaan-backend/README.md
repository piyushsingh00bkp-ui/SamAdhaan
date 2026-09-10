# 🇮🇳 SAMADHAAN — Backend & Database

> **"From Local Problems to Lasting Solutions."**  
> National AI GovTech & Civic Innovation Platform connecting Citizens, AI Engine, Universities/HEIs, Industry/CSR, and Government.

---

## 🛠️ Technology Stack

- **Runtime:** Node.js (TypeScript)
- **Framework:** Express.js
- **Database:** PostgreSQL 16 + PostGIS
- **ORM:** Prisma
- **Validation:** Zod
- **Authentication:** Firebase Admin SDK (Token verification only)
- **HTTP Client:** Axios (AI Engine Integration)
- **Security:** Helmet, CORS, express-rate-limit, Multer MIME validator
- **Logging:** Pino & Pino-HTTP
- **Documentation:** OpenAPI 3.0 / Swagger UI (`/api/docs`)
- **Testing:** Vitest & Supertest
- **Containerization:** Docker & Docker Compose

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env` and configure your database connection string:
```bash
cp .env.example .env
```

### 3. Generate Prisma Client & Run Migrations
```bash
npx prisma generate
npx prisma db push
# or npx prisma migrate dev
```

### 4. Seed the Database
Populate 10+ universities, 20+ departments, 20+ experts, 20+ industry partners, and 20+ challenges across Indian cities:
```bash
npm run prisma:seed
```

### 5. Start Development Server
```bash
npm run dev
```
- API Base: `http://localhost:5000/api/v1`
- Swagger UI Docs: `http://localhost:5000/api/docs`
- Health Check: `http://localhost:5000/api/v1/health`

---

## 🧪 Running Automated Tests

```bash
npm test
```

---

## 🐳 Running with Docker Compose

To start PostgreSQL with PostGIS and the backend container:
```bash
docker-compose up --build
```
