import { app } from './app.js';
import { env } from './config/env.js';
import { prisma } from './config/database.js';
import { initializeFirebase } from './config/firebase.js';

const PORT = env.PORT || 5000;

async function bootstrap() {
  try {
    // 1. Initialize Firebase Admin
    initializeFirebase();

    // 2. Connect Database
    await prisma.$connect();
    console.log('🐘 PostgreSQL connected successfully');

    // 3. Start Express HTTP Server
    const server = app.listen(PORT, () => {
      console.log(`🚀 SAMADHAAN Backend running on http://localhost:${PORT}`);
      console.log(`📖 API Docs available at http://localhost:${PORT}/api/docs`);
      console.log(`🩺 Health check at http://localhost:${PORT}/api/v1/health`);
    });

    // 4. Graceful Shutdown
    const shutdown = async (signal: string) => {
      console.log(`\n🛑 Received ${signal}. Gracefully shutting down...`);
      server.close(async () => {
        await prisma.$disconnect();
        console.log('✅ Server and Database connections closed cleanly.');
        process.exit(0);
      });

      // Force shutdown after 10s if stuck
      setTimeout(() => {
        console.error('⚠️ Forcefully terminating server.');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
  } catch (error) {
    console.error('❌ Failed to bootstrap SAMADHAAN backend:', error);
    process.exit(1);
  }
}

bootstrap();
