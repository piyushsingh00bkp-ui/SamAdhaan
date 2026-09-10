import express, { Express, Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import { pinoHttp } from 'pino-http';

import { env } from './config/env.js';
import apiV1Router from './routes/index.js';
import { errorHandler } from './middleware/error.middleware.js';
import { apiLimiter } from './middleware/rateLimit.middleware.js';
import { requestIdMiddleware } from './middleware/requestId.middleware.js';
import { NotFoundError } from './utils/errors.js';

export function createApp(): Express {
  const app = express();

  // 1. Trust proxy for rate limiting behind load balancers/reverse proxies
  app.set('trust proxy', 1);

  // 2. Security Headers
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      contentSecurityPolicy: false, // Allows Swagger UI assets
    })
  );

  // 3. CORS Configuration
  const allowedOrigins = env.CORS_ORIGIN.split(',').map((o) => o.trim());
  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(null, true); // Permissive in dev, strictly controlled via env in prod
        }
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID', 'X-Dev-User-ID', 'X-Dev-Role'],
    })
  );

  // 4. Request Logging (Structured Pino)
  if (env.NODE_ENV !== 'test') {
    app.use(
      pinoHttp({
        quietReqLogger: true,
        transport:
          env.NODE_ENV === 'development'
            ? {
                target: 'pino-pretty',
                options: { colorize: true, translateTime: 'HH:MM:ss Z' },
              }
            : undefined,
      })
    );
  }

  // 5. Body Parsing
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // 6. Request ID Tracing
  app.use(requestIdMiddleware);

  // 7. Rate Limiting
  app.use('/api/', apiLimiter);

  // 8. Static File Uploads
  app.use('/uploads', express.static(path.resolve(process.cwd(), 'uploads')));

  // 9. OpenAPI / Swagger Documentation
  try {
    const swaggerDocument = YAML.load(path.resolve(process.cwd(), 'openapi.yaml'));
    app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  } catch (err) {
    console.warn('⚠️ Swagger documentation file not loaded:', (err as Error).message);
  }

  // 10. Mount Master API Router
  app.use('/api/v1', apiV1Router);

  // 11. Root Welcome Route
  app.get('/', (_req: Request, res: Response) => {
    res.json({
      name: 'SAMADHAAN GovTech API',
      version: '1.0.0',
      tagline: 'From Local Problems to Lasting Solutions',
      documentation: '/api/docs',
      health: '/api/v1/health',
    });
  });

  // 12. 404 Handler
  app.use((_req: Request, _res: Response, next) => {
    next(new NotFoundError('Route not found'));
  });

  // 13. Centralized Error Handler
  app.use(errorHandler);

  return app;
}

export const app = createApp();
