import { z } from 'zod';

export const updateUserSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  phone: z.string().regex(/^[0-9+ -]{8,15}$/, 'Invalid phone number format').optional().nullable(),
  avatarUrl: z.string().url().optional().nullable(),
  citizenProfile: z
    .object({
      bio: z.string().max(500).optional().nullable(),
      city: z.string().max(100).optional().nullable(),
      district: z.string().max(100).optional().nullable(),
      state: z.string().max(100).optional().nullable(),
      pincode: z.string().max(10).optional().nullable(),
      preferredLanguage: z.string().max(10).default('en'),
    })
    .optional(),
});

export const adminUpdateRoleSchema = z.object({
  role: z.enum(['CITIZEN', 'UNIVERSITY', 'INDUSTRY', 'GOVERNMENT', 'ADMIN']),
  status: z.enum(['ACTIVE', 'SUSPENDED', 'PENDING', 'DEACTIVATED']).optional(),
});
