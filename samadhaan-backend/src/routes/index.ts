import { Router } from 'express';
import { prisma } from '../config/database.js';
import { sendSuccess } from '../utils/response.js';

import usersRoutes from './users.routes.js';
import challengesRoutes from './challenges.routes.js';
import universitiesRoutes from './universities.routes.js';
import industriesRoutes from './industries.routes.js';
import projectsRoutes from './projects.routes.js';
import solutionsRoutes from './solutions.routes.js';
import partnershipsRoutes from './partnerships.routes.js';
import governmentRoutes from './government.routes.js';
import analyticsRoutes from './analytics.routes.js';
import notificationsRoutes from './notifications.routes.js';
import aiRoutes from './ai.routes.js';
import { adminRouter } from './admin.routes.js';

const apiV1Router = Router();

// Health Check Endpoint
apiV1Router.get('/health', async (_req, res) => {
  let dbStatus = 'disconnected';
  try {
    await prisma.$queryRaw`SELECT 1`;
    dbStatus = 'connected';
  } catch (err) {
    dbStatus = 'error';
  }

  sendSuccess(res, {
    status: 'ok',
    service: 'samadhaan-backend',
    database: dbStatus,
    timestamp: new Date().toISOString(),
  });
});

// Mount Resource Routes
apiV1Router.use('/users', usersRoutes);
apiV1Router.use('/challenges', challengesRoutes);
apiV1Router.use('/universities', universitiesRoutes);
apiV1Router.use('/industries', industriesRoutes);
apiV1Router.use('/projects', projectsRoutes);
apiV1Router.use('/solutions', solutionsRoutes);
apiV1Router.use('/partnerships', partnershipsRoutes);
apiV1Router.use('/government', governmentRoutes);
apiV1Router.use('/analytics', analyticsRoutes);
apiV1Router.use('/notifications', notificationsRoutes);
apiV1Router.use('/ai', aiRoutes);
apiV1Router.use('/admin', adminRouter);

export default apiV1Router;
