import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(5000),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  FIREBASE_PROJECT_ID: z.string().default('samadhaan-govtech'),
  FIREBASE_CLIENT_EMAIL: z.string().default('firebase-adminsdk@samadhaan-govtech.iam.gserviceaccount.com'),
  FIREBASE_PRIVATE_KEY: z.string().default(''),
  AI_ENGINE_URL: z.string().url().default('http://127.0.0.1:8000'),
  CORS_ORIGIN: z.string().default('http://localhost:5173,http://localhost:3000'),
  ALLOW_DEV_AUTH: z.preprocess((val) => val === 'true' || val === true, z.boolean()).default(false),
  MAX_FILE_SIZE: z.coerce.number().default(25000000), // 25MB
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(900000), // 15 mins
  RATE_LIMIT_MAX: z.coerce.number().default(500),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('❌ Invalid environment variables:', parsedEnv.error.format());
  throw new Error('Invalid environment variables');
}

export const env = parsedEnv.data;
