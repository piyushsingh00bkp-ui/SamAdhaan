# SAMADHAAN Authentication & Token Verification

## Responsibility Model

```
+-------------------------------------------------------------+
|                     FRONTEND (React)                        |
|                                                             |
|  - Firebase Client SDK (Email, Google, Phone OTP)           |
|  - User Login / Signup UI                                   |
|  - Session Persistence                                      |
|  - Acquires Firebase ID Token: user.getIdToken()            |
+------------------------------+------------------------------+
                               |
                   Authorization: Bearer <TOKEN>
                               |
                               v
+-------------------------------------------------------------+
|                 BACKEND (Node.js + Express)                 |
|                                                             |
|  - Firebase Admin SDK: admin.auth().verifyIdToken(token)    |
|  - Extracts firebaseUid, email, name                        |
|  - Synchronizes user row in PostgreSQL                      |
|  - Queries user's true RBAC Role from PostgreSQL            |
|  - Enforces Role Authorization (Never trusts frontend role) |
+-------------------------------------------------------------+
```

---

## Development Authentication Header

For fast local integration testing without obtaining live Firebase ID tokens:

```http
X-Dev-User-ID: arjun.mehta@citizen.in
X-Dev-Role: CITIZEN
```

> **Security Rule:** This mechanism strictly only evaluates when `NODE_ENV=development` AND `ALLOW_DEV_AUTH=true`. It is unconditionally disabled in production builds.
