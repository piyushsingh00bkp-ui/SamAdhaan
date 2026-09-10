import { z } from 'zod';

export const createUniversitySchema = z.object({
  name: z.string().min(3).max(200),
  shortName: z.string().max(50).optional().nullable(),
  description: z.string().max(2000).optional().nullable(),
  website: z.string().url().optional().nullable(),
  email: z.string().email().optional().nullable(),
  phone: z.string().optional().nullable(),
  address: z.string().max(300).optional().nullable(),
  city: z.string().min(2).max(100),
  district: z.string().min(2).max(100),
  state: z.string().min(2).max(100),
  latitude: z.coerce.number().min(-90).max(90).optional().nullable(),
  longitude: z.coerce.number().min(-180).max(180).optional().nullable(),
});

export const updateUniversitySchema = createUniversitySchema.partial();
