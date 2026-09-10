// ── Roles ─────────────────────────────────────────────────────────────────
export type Role = 'citizen' | 'university' | 'industry' | 'government';

export interface RoleConfig {
  id: Role;
  label: string;
  icon: string;
  color: string;
  bgColor: string;
  description: string;
}

// ── Problem ───────────────────────────────────────────────────────────────
export type ProblemStatus =
  | 'submitted'
  | 'under_review'
  | 'ai_processing'
  | 'assigned'
  | 'in_progress'
  | 'resolved'
  | 'closed';

export type ProblemCategory =
  | 'infrastructure'
  | 'sanitation'
  | 'water'
  | 'electricity'
  | 'healthcare'
  | 'education'
  | 'environment'
  | 'transport'
  | 'safety'
  | 'agriculture'
  | 'digital'
  | 'other';

export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface Problem {
  id: string;
  title: string;
  description: string;
  category: ProblemCategory;
  status: ProblemStatus;
  location: GeoPoint;
  locationName: string;
  state: string;
  district: string;
  ward?: string;
  aiUrgencyScore: number;   // 0-100
  aiTags: string[];
  upvotes: number;
  reportedBy: string;
  reportedAt: string;
  updatedAt: string;
  mediaCount: number;
  commentCount: number;
  similarProblemIds?: string[];
  assignedTo?: StakeholderRef[];
  impactEstimate?: string;
}

// ── Solution ──────────────────────────────────────────────────────────────
export type SolutionStatus = 'proposed' | 'approved' | 'active' | 'completed';

export interface Solution {
  id: string;
  problemId: string;
  problemTitle: string;
  title: string;
  description: string;
  status: SolutionStatus;
  progress: number; // 0-100
  team: StakeholderRef[];
  fundingRequired: number;
  fundingSecured: number;
  startDate: string;
  estimatedCompletion: string;
  impactBeneficiaries: number;
  sdgGoals: number[];
  tags: string[];
}

// ── Stakeholder ────────────────────────────────────────────────────────────
export interface StakeholderRef {
  id: string;
  name: string;
  type: Role;
  logoUrl?: string;
}

// ── Analytics / Stats ──────────────────────────────────────────────────────
export interface PlatformStats {
  totalProblems: number;
  resolvedProblems: number;
  activeProblems: number;
  registeredCitizens: number;
  universitiesPartnered: number;
  industryPartners: number;
  governmentBodies: number;
  citiesActive: number;
  statesActive: number;
  avgResolutionDays: number;
  totalFundingMobilised: number; // in crore INR
  peopleImpacted: number;
}

export interface TrendDataPoint {
  date: string;
  problems: number;
  resolved: number;
  inProgress: number;
}

export interface CategoryBreakdown {
  category: ProblemCategory;
  count: number;
  percentage: number;
  color: string;
}

// ── User ───────────────────────────────────────────────────────────────────
export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  location?: string;
  joinedAt: string;
  problemsReported: number;
  solutionsContributed: number;
  evidenceUploaded?: number;
  totalUpvotes?: number;
  resolvedProblems?: number;
  impactScore: number;
  bio?: string;
  phone?: string;
  citizenProfile?: {
    bio?: string;
    city?: string;
    district?: string;
    state?: string;
    pincode?: string;
  };
}

// ── Notification ───────────────────────────────────────────────────────────
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'danger';
  read: boolean;
  createdAt: string;
  link?: string;
}

// ── API Response wrappers ──────────────────────────────────────────────────
export interface ApiResponse<T> {
  data: T;
  meta?: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
  message?: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string[]>;
}
