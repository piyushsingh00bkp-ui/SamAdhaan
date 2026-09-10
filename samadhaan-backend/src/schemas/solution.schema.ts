import { z } from 'zod';

export const createSolutionSchema = z.object({
  projectId: z.string().uuid(),
  title: z.string().min(5).max(200),
  description: z.string().min(20).max(5000),
  solutionType: z.string().min(2).max(100),
  estimatedCost: z.coerce.number().positive().optional().nullable(),
  estimatedDuration: z.string().max(100).optional().nullable(),
  feasibilityScore: z.coerce.number().min(0).max(100).optional().nullable(),
  expectedImpact: z.string().max(1000).optional().nullable(),
});

export const updateSolutionSchema = createSolutionSchema.partial().extend({
  status: z.string().optional(),
});

export const deploySolutionSchema = z.object({
  location: z.string().min(3).max(200),
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
  startDate: z.string().datetime().optional().nullable(),
  peopleImpacted: z.coerce.number().int().nonnegative().default(0),
  deploymentNotes: z.string().max(2000).optional().nullable(),
});

export const createPartnershipSchema = z.object({
  projectId: z.string().uuid(),
  industryPartnerId: z.string().uuid(),
  type: z.enum(['FUNDING', 'TECHNOLOGY', 'MENTORSHIP', 'PILOT', 'DEPLOYMENT', 'CSR']).default('CSR'),
  fundingAmount: z.coerce.number().positive().optional().nullable(),
  startDate: z.string().datetime().optional().nullable(),
  endDate: z.string().datetime().optional().nullable(),
  notes: z.string().max(2000).optional().nullable(),
});

export const updatePartnershipSchema = createPartnershipSchema.partial().extend({
  status: z.string().optional(),
});
