import { z } from 'zod';

export const createIndustrySchema = z.object({
  organizationName: z.string().min(2).max(200),
  organizationType: z
    .enum(['STARTUP', 'MSME', 'CORPORATION', 'CSR', 'NGO', 'TECHNOLOGY_PROVIDER', 'FUNDING_PARTNER'])
    .default('CORPORATION'),
  description: z.string().max(2000).optional().nullable(),
  website: z.string().url().optional().nullable(),
  email: z.string().email().optional().nullable(),
  phone: z.string().optional().nullable(),
  address: z.string().max(300).optional().nullable(),
  city: z.string().min(2).max(100),
  district: z.string().min(2).max(100),
  state: z.string().min(2).max(100),
});

export const updateIndustrySchema = createIndustrySchema.partial();
