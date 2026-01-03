
export enum TestCategory {
  PERSONALITY = 'Personality',
  WELLNESS = 'Wellness',
  COGNITIVE = 'Cognitive',
  SOCIAL = 'Social',
  PROFESSIONAL = 'Professional',
  CLINICAL = 'Clinical',
  DEVELOPMENTAL = 'Developmental'
}

export type QuestionType = 'likert' | 'text' | 'abstract' | 'scenario' | 'puzzle';

export interface QuestionOption {
  label: string;
  value: number | string;
  image?: string; // For abstract/visual questions
}

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  category?: string; 
  weight?: number;
  options?: QuestionOption[]; // For scenario/abstract/puzzle
  placeholder?: string; // For text inputs
}

export interface Activity {
  title: string;
  duration: string;
  type: 'Mental' | 'Physical' | 'Social' | 'Journaling';
}

export interface PsychologicalTest {
  id: string;
  title: string;
  description: string;
  category: TestCategory;
  questions: Question[];
  isPremium: boolean;
  durationMinutes: number;
  image: string;
  activities: Activity[];
}

export interface UserTestResult {
  testId: string;
  date: string;
  score: number;
  maxScore: number;
  breakdown: Record<string, number>;
  richAnswers?: Record<string, string | number>; // Store text/choice answers
  aiInterpretation?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  completedTests: string[];
  unlockedTests: string[];
  credits: number;
  isSubscribed: boolean; 
  history: UserTestResult[];
  streak: number;
  lastDailyTestDate?: string;
  dailyHistory: { date: string; score: number }[];
}

export interface PricingPlan {
  id: string;
  name: string;
  priceUSD: number;
  priceINR: number;
  value: string;
  description: string;
  billingPeriod?: 'monthly' | 'one-time' | 'annual';
  isBusiness?: boolean;
  features?: string[];
}

// Business Hub Types
export interface AssignedTask {
  id: string;
  testId: string; // ID of the test in ALL_TESTS
  title: string;
  assignedDate: string;
  dueDate: string;
  complete: boolean;
  completionDate?: string;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Employee';
  status: 'Active' | 'Pending' | 'Needs Attention';
  department: string;
  wellnessScore: number;
  assignedTasks: AssignedTask[];
  lastCheckIn?: string;
}

export interface AnalyticsLog {
  id: string;
  employeeName: string;
  testName: string;
  date: string; // ISO timestamp
  score: number;
  department: string;
}

export interface BusinessProfile {
  companyName: string;
  employees: Employee[];
  weeklyFocus: string;
  announcements: { id: string; text: string; date: string }[];
}
