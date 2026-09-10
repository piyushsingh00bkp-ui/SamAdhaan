import { z } from 'zod';

export const createProjectSchema = z.object({
  challengeId: z.string().uuid(),
  name: z.string().min(5).max(200),
  description: z.string().min(20).max(5000),
  createdByUniversityId: z.string().uuid(),
  startDate: z.string().datetime().optional().nullable(),
  targetDate: z.string().datetime().optional().nullable(),
  budget: z.coerce.number().positive().optional().nullable(),
  fundingSource: z.string().max(200).optional().nullable(),
});

export const updateProjectSchema = z.object({
  name: z.string().min(5).max(200).optional(),
  description: z.string().min(20).max(5000).optional(),
  status: z
    .enum(['PLANNING', 'RESEARCH', 'PROTOTYPE', 'PILOT', 'DEPLOYMENT', 'COMPLETED', 'CANCELLED'])
    .optional(),
  targetDate: z.string().datetime().optional().nullable(),
  completedAt: z.string().datetime().optional().nullable(),
  budget: z.coerce.number().positive().optional().nullable(),
  fundingSource: z.string().max(200).optional().nullable(),
});

export const addTeamMemberSchema = z.object({
  userId: z.string().uuid(),
  role: z.enum(['FACULTY', 'STUDENT', 'EXPERT', 'PROJECT_MANAGER']).default('STUDENT'),
});
