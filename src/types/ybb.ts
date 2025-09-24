// YBB Platform Type Definitions

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'participant' | 'ambassador' | 'admin';
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Participant extends User {
  role: 'participant';
  profileCompletion: number;
  submissions: Submission[];
  documents: Document[];
  payments: Payment[];
}

export interface Ambassador extends User {
  role: 'ambassador';
  referralCode: string;
  totalReferrals: number;
  totalEarnings: number;
  performanceScore: number;
}

export interface Program {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  image: string;
  startDate: string;
  endDate: string;
  registrationDeadline: string;
  maxParticipants: number;
  currentParticipants: number;
  status: 'active' | 'inactive' | 'completed';
  price: number;
  currency: string;
  location: {
    city: string;
    country: string;
    venue?: string;
  };
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Submission {
  id: string;
  participantId: string;
  programId: string;
  status: 'draft' | 'in_progress' | 'submitted' | 'under_review' | 'approved' | 'rejected';
  currentStep: 'personal-details' | 'essays' | 'miscellaneous' | 'preview';
  data: {
    personalDetails?: PersonalDetails;
    essays?: Essay[];
    miscellaneous?: MiscellaneousInfo;
  };
  submittedAt?: string;
  reviewedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PersonalDetails {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  nationality: string;
  phoneNumber: string;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  emergencyContact: {
    name: string;
    relationship: string;
    phoneNumber: string;
  };
  education: {
    level: string;
    institution: string;
    fieldOfStudy: string;
    graduationYear: number;
  };
}

export interface Essay {
  id: string;
  question: string;
  answer: string;
  wordCount: number;
  maxWords: number;
}

export interface MiscellaneousInfo {
  dietaryRestrictions?: string;
  medicalConditions?: string;
  tshirtSize: string;
  linkedinProfile?: string;
  portfolioUrl?: string;
  additionalInfo?: string;
}

export interface Document {
  id: string;
  participantId: string;
  name: string;
  type: string;
  size: number;
  url: string;
  category: 'id' | 'resume' | 'portfolio' | 'certificate' | 'other';
  uploadedAt: string;
}

export interface Payment {
  id: string;
  participantId: string;
  programId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: string;
  transactionId?: string;
  paidAt?: string;
  createdAt: string;
}

export interface Referral {
  id: string;
  ambassadorId: string;
  participantId?: string;
  programId: string;
  status: 'pending' | 'converted' | 'expired';
  referralCode: string;
  clickCount: number;
  conversionDate?: string;
  commission: number;
  createdAt: string;
}

export interface ReferralStats {
  total: number;
  thisMonth: number;
  conversionRate: number;
  totalEarnings: number;
  monthlyData: Array<{
    month: string;
    referrals: number;
    conversions: number;
  }>;
  recent: Referral[];
  topLinks: Array<{
    programId: string;
    programTitle: string;
    clicks: number;
    conversions: number;
  }>;
  trend: string;
}

export interface PerformanceData {
  score: number;
  trend: string;
  metrics: {
    totalClicks: number;
    conversionRate: number;
    averageCommission: number;
    ranking: number;
  };
}

export interface EarningsData {
  total: number;
  thisMonth: number;
  trend: string;
  breakdown: Array<{
    programId: string;
    programTitle: string;
    amount: number;
    commissionRate: number;
  }>;
}

export interface Activity {
  id: string;
  userId: string;
  type: 'submission' | 'payment' | 'document' | 'referral';
  title: string;
  description: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export interface Insight {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  tags: string[];
  author: {
    name: string;
    avatar: string;
  };
  publishedAt: string;
  readTime: number;
  views: number;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  type: 'info' | 'warning' | 'success' | 'error';
  priority: 'low' | 'medium' | 'high';
  targetAudience: 'all' | 'participants' | 'ambassadors';
  publishedAt: string;
  expiresAt?: string;
  isActive: boolean;
}

export interface Partner {
  id: string;
  name: string;
  logo: string;
  website: string;
  description: string;
  type: 'sponsor' | 'partner' | 'media';
  tier: 'gold' | 'silver' | 'bronze' | 'standard';
  displayOrder: number;
  isActive: boolean;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Form Types
export interface LoginForm {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
  referralCode?: string;
}

export interface ForgotPasswordForm {
  email: string;
}