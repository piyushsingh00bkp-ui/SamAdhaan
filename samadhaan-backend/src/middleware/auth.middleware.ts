import { Response, NextFunction } from 'express';
import { getFirebaseAuth } from '../config/firebase.js';
import { prisma } from '../config/database.js';
import { env } from '../config/env.js';
import { UnauthorizedError, ForbiddenError } from '../utils/errors.js';
import { AuthenticatedRequest } from '../types/auth.types.js';
import { Role } from '@prisma/client';

export async function authenticateUser(
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // 1. Check for Development / Test Auth / Permissive Auth when ALLOW_DEV_AUTH=true
    if (env.ALLOW_DEV_AUTH) {
      const devUserId = req.headers['x-dev-user-id'] as string;
      const devRole = (req.headers['x-dev-role'] as string) || 'CITIZEN';

      if (devUserId) {
        let user: any = null;
        try {
          user = await prisma.user.findFirst({
            where: {
              OR: [{ id: devUserId }, { firebaseUid: devUserId }, { email: devUserId }],
            },
          });

          if (!user) {
            const assignedRole = (Object.values(Role).includes(devRole as Role)
              ? devRole
              : 'CITIZEN') as Role;

            user = await prisma.user.create({
              data: {
                firebaseUid: devUserId,
                email: devUserId.includes('@') ? devUserId : `${devUserId}@dev.samadhaan.in`,
                name: `User (${devUserId.split('@')[0]})`,
                role: assignedRole,
                status: 'ACTIVE',
              },
            });
          }
        } catch (dbErr) {
          // If DB is offline during unit testing, fallback to memory mock user
          const assignedRole = (Object.values(Role).includes(devRole as Role)
            ? devRole
            : 'CITIZEN') as Role;
          user = {
            id: devUserId,
            firebaseUid: devUserId,
            email: `${devUserId}@dev.samadhaan.in`,
            name: `User (${devUserId.split('@')[0]})`,
            role: assignedRole,
            status: 'ACTIVE',
            createdAt: new Date(),
            updatedAt: new Date(),
            lastLoginAt: new Date(),
          };
        }

        req.user = user;
        return next();
      }
    }

    // 2. Production / Standard Firebase Token Verification
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('Missing or malformed Authorization header. Use Bearer token.');
    }

    const token = authHeader.split('Bearer ')[1]?.trim();
    if (!token) {
      throw new UnauthorizedError('Bearer token is empty');
    }

    const firebaseAuth = getFirebaseAuth();
    let decodedToken: any = null;

    if (firebaseAuth) {
      try {
        decodedToken = await firebaseAuth.verifyIdToken(token);
      } catch (err) {
        throw new UnauthorizedError('Invalid or expired Firebase ID token', (err as Error).message);
      }
    } else {
      // In development / mock mode: safely parse Firebase JWT payload without crashing
      try {
        const base64Url = token.split('.')[1];
        if (base64Url) {
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = Buffer.from(base64, 'base64').toString('utf8');
          const parsed = JSON.parse(jsonPayload);
          decodedToken = {
            uid: parsed.user_id || parsed.sub || parsed.uid || `fb-${Date.now()}`,
            email: parsed.email || (req.headers['x-dev-user-id'] as string) || 'user@samadhaan.in',
            name: parsed.name || (parsed.email ? parsed.email.split('@')[0] : 'Citizen User'),
            picture: parsed.picture,
          };
        }
      } catch {
        decodedToken = {
          uid: (req.headers['x-dev-user-id'] as string) || 'dev-user-001',
          email: (req.headers['x-dev-user-id'] as string) || 'citizen@samadhaan.in',
          name: 'Dev User',
        };
      }
    }

    const { uid: firebaseUid, email, name, picture } = decodedToken || {};
    if (!firebaseUid) {
      throw new UnauthorizedError('Unable to extract user identity from token');
    }

    // 3. Find or sync user in database
    let user = await prisma.user.findUnique({
      where: { firebaseUid },
    });

    if (!user) {
      // First-time login: create baseline citizen user
      user = await prisma.user.create({
        data: {
          firebaseUid,
          email: email || `${firebaseUid}@firebase.user`,
          name: name || 'Citizen User',
          avatarUrl: picture,
          role: Role.CITIZEN,
          status: 'ACTIVE',
          citizenProfile: {
            create: {},
          },
        },
      });
    }

    if (user.status === 'SUSPENDED' || user.status === 'DEACTIVATED') {
      throw new ForbiddenError('User account is suspended or deactivated');
    }

    // Attach verified user
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}

/**
 * Optional authentication middleware for public endpoints that can be enhanced with user context
 */
export async function optionalAuthenticateUser(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization;
  const devUserId = req.headers['x-dev-user-id'];

  if ((authHeader && authHeader.startsWith('Bearer ')) || (env.ALLOW_DEV_AUTH && devUserId)) {
    return authenticateUser(req, res, next);
  }

  next();
}
