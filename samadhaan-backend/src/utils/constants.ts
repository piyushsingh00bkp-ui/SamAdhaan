export const ROLES = {
  CITIZEN: 'CITIZEN',
  UNIVERSITY: 'UNIVERSITY',
  INDUSTRY: 'INDUSTRY',
  GOVERNMENT: 'GOVERNMENT',
  ADMIN: 'ADMIN',
} as const;

export type RoleType = (typeof ROLES)[keyof typeof ROLES];

export const CHALLENGE_STATUSES = {
  SUBMITTED: 'SUBMITTED',
  AI_ANALYZED: 'AI_ANALYZED',
  ROUTED: 'ROUTED',
  UNIVERSITY_ASSIGNED: 'UNIVERSITY_ASSIGNED',
  R_AND_D: 'R_AND_D',
  INDUSTRY_PARTNERED: 'INDUSTRY_PARTNERED',
  PILOT: 'PILOT',
  DEPLOYED: 'DEPLOYED',
  RESOLVED: 'RESOLVED',
  REJECTED: 'REJECTED',
} as const;

export const PRIORITIES = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  CRITICAL: 'CRITICAL',
} as const;

export const CATEGORIES = [
  'Water & Sanitation',
  'Road Infrastructure',
  'Waste Management',
  'Healthcare',
  'Education',
  'Agriculture',
  'Energy',
  'Environment',
  'Public Safety',
  'Urban Planning',
] as const;
