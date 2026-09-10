import { z } from 'zod';

export const createChallengeSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(200),
  description: z.string().min(20, 'Description must be at least 20 characters').max(5000),
  category: z.string().min(2).max(100),
  subcategory: z.string().max(100).optional().nullable(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).default('MEDIUM'),
  affectedPopulation: z.coerce.number().int().positive().optional().nullable(),
  locationName: z.string().min(3).max(200),
  city: z.string().min(2).max(100),
  district: z.string().min(2).max(100),
  state: z.string().min(2).max(100),
  pincode: z.string().max(10).optional().nullable(),
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
});

export const updateChallengeSchema = createChallengeSchema.partial().extend({
  status: z
    .enum([
      'SUBMITTED',
      'AI_ANALYZED',
      'ROUTED',
      'UNIVERSITY_ASSIGNED',
      'R_AND_D',
      'INDUSTRY_PARTNERED',
      'PILOT',
      'DEPLOYED',
      'RESOLVED',
      'REJECTED',
    ])
    .optional(),
  comment: z.string().max(1000).optional(),
});

export const challengeQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  search: z.string().optional(),
  category: z.string().optional(),
  subcategory: z.string().optional(),
  status: z.string().optional(),
  priority: z.string().optional(),
  state: z.string().optional(),
  district: z.string().optional(),
  city: z.string().optional(),
  minSeverity: z.coerce.number().min(0).max(100).optional(),
  sortBy: z.enum(['createdAt', 'severity', 'priority', 'title', 'updatedAt']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export const nearbyChallengeQuerySchema = z.object({
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
  radius: z.coerce.number().positive().max(200).default(10), // km
  limit: z.coerce.number().int().positive().max(100).default(50),
});
