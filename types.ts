export enum Role {
  ADMIN = 'ADMIN',
  TRAINER = 'TRAINER',
  STUDENT = 'STUDENT',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  password?: string;
  expertise?: string;
  experience?: number;
  phone?: string;
  course?: string;
  college?: string;
  assignedMaterialIds?: string[];
  assignedAssessmentIds?: string[];
}

export interface TrainerApplication {
  id: string;
  name: string;
  email: string;
  phone: string;
  expertise: string;
  experience: number;
  idProof: string; // Filename or path
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export enum MaterialType {
  PDF = 'PDF',
  PPT = 'PPT',
  DOC = 'DOC',
  VIDEO = 'VIDEO',
}

export interface Material {
  id: string;
  title: string;
  course: string;
  type: MaterialType;
  // In a real app, this would be a URL to the file
  content: string; 
}

export interface Schedule {
  id: string;
  trainerId: string;
  college: string;
  course: string;
  startDate: Date;
  endDate: Date;
  materialIds: string[];
}

export enum AssessmentType {
  TEST = 'TEST',
  ASSIGNMENT = 'ASSIGNMENT',
}

export interface AssessmentQuestion {
  question: string;
  options?: string[];
  correctAnswer?: string;
}

export interface Assessment {
  id: string;
  materialId: string;
  course: string;
  title: string;
  type: AssessmentType;
  questions: AssessmentQuestion[];
}


export interface StudentAttempt {
  studentName: string;
  course: string;
  score: number;
  timestamp: Date;
}

export interface LeaderboardEntry {
  studentName: string;
  totalScore: number;
}

export enum BillStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
}

export enum ExpenseType {
  TRAVEL = 'Travel',
  ACCOMMODATION = 'Accommodation',
  FOOD = 'Food',
  MATERIALS = 'Materials',
  OTHER = 'Other',
}

export interface Expense {
  type: ExpenseType;
  description: string;
  amount: number;
}

export interface TrainerBill {
  id: string;
  trainerId: string;
  amount: number;
  expenses: Expense[];
  date: Date;
  status: BillStatus;
  invoiceNumber: string;
}

export interface College {
  id: string;
  name: string;
  address: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
}