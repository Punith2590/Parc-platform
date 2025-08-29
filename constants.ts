import { Role, User, Material, MaterialType, Schedule, TrainerApplication, StudentAttempt, TrainerBill, BillStatus, ExpenseType, College } from './types';

export const MOCK_USERS: User[] = [
  { id: 'admin-1', name: 'Admin User', email: 'admin@parc.com', password: 'password', role: Role.ADMIN },
  { id: 'trainer-1', name: 'Jane Doe', email: 'jane.doe@parc.com', password: 'password', role: Role.TRAINER, expertise: 'React Development', experience: 5, phone: '123-456-7890' },
  { id: 'trainer-2', name: 'John Smith', email: 'john.smith@parc.com', password: 'password', role: Role.TRAINER, expertise: 'Backend with Django', experience: 8, phone: '098-765-4321' },
  { id: 'student-1', name: 'Bob Williams', email: 'bob@example.com', role: Role.STUDENT, course: 'Frontend Development', college: 'State University', assignedMaterialIds: [], assignedAssessmentIds: [] },
  { id: 'student-2', name: 'Charlie Brown', email: 'charlie@example.com', role: Role.STUDENT, course: 'Backend Development', college: 'City College', assignedMaterialIds: [], assignedAssessmentIds: [] },
  { id: 'student-3', name: 'Diana Prince', email: 'diana@example.com', role: Role.STUDENT, course: 'Frontend Development', college: 'State University', assignedMaterialIds: [], assignedAssessmentIds: [] },
];

export const MOCK_MATERIALS: Material[] = [
  { id: 'mat-1', title: 'React Fundamentals', course: 'Frontend Development', type: MaterialType.PDF, content: 'This is the content for React Fundamentals PDF. It covers hooks, state, and props.' },
  { id: 'mat-2', title: 'Advanced React Patterns', course: 'Frontend Development', type: MaterialType.VIDEO, content: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' },
  { id: 'mat-3', title: 'Django Models', course: 'Backend Development', type: MaterialType.DOC, content: 'This document explains how to create and manage Django models for a robust backend.' },
  { id: 'mat-4', title: 'Introduction to PostgreSQL', course: 'Backend Development', type: MaterialType.PPT, content: 'This presentation covers the basics of PostgreSQL databases.' },
];

const createSchedules = (): Schedule[] => {
  const now = new Date();
  
  const schedule1Start = new Date(now);
  schedule1Start.setDate(now.getDate() + 7);
  schedule1Start.setHours(10, 0, 0, 0);
  const schedule1End = new Date(schedule1Start);
  schedule1End.setDate(schedule1Start.getDate() + 2);
  schedule1End.setHours(16, 0, 0, 0);

  const schedule2Start = new Date(now);
  schedule2Start.setDate(now.getDate() + 10);
  schedule2Start.setHours(9, 30, 0, 0);
  const schedule2End = new Date(schedule2Start);
  schedule2End.setDate(schedule2Start.getDate() + 1);
  schedule2End.setHours(17, 0, 0, 0);

  const schedule3Start = new Date(now);
  schedule3Start.setDate(now.getDate() + 14);
  schedule3Start.setHours(13, 0, 0, 0);
  const schedule3End = new Date(schedule3Start);
  schedule3End.setHours(17, 0, 0, 0);

  return [
    { id: 'sch-1', trainerId: 'trainer-1', college: 'State University', course: 'Frontend Development', startDate: schedule1Start, endDate: schedule1End, materialIds: ['mat-1', 'mat-2'] },
    { id: 'sch-2', trainerId: 'trainer-2', college: 'City College', course: 'Backend Development', startDate: schedule2Start, endDate: schedule2End, materialIds: ['mat-3', 'mat-4'] },
    { id: 'sch-3', trainerId: 'trainer-1', college: 'Tech Institute', course: 'Frontend Development', startDate: schedule3Start, endDate: schedule3End, materialIds: ['mat-1'] },
  ];
};


export const MOCK_SCHEDULES: Schedule[] = createSchedules();

export const MOCK_APPLICATIONS: TrainerApplication[] = [
  { id: 'app-1', name: 'Alice Johnson', email: 'alice@example.com', phone: '555-0101', expertise: 'Data Science', experience: 3, idProof: 'id.pdf', status: 'PENDING' },
];

export const MOCK_STUDENT_ATTEMPTS: StudentAttempt[] = [
    { studentName: "Bob Williams", course: "Frontend Development", score: 85, timestamp: new Date() },
    { studentName: "Charlie Brown", course: "Backend Development", score: 92, timestamp: new Date() },
    { studentName: "Bob Williams", course: "Frontend Development", score: 95, timestamp: new Date() },
    { studentName: "Diana Prince", course: "Frontend Development", score: 88, timestamp: new Date() },
];

export const MOCK_BILLS: TrainerBill[] = [
  { 
    id: 'bill-1', 
    trainerId: 'trainer-1', 
    amount: 1500,
    expenses: [
      { type: ExpenseType.OTHER, description: 'Training Fee for Frontend Development', amount: 1000 },
      { type: ExpenseType.TRAVEL, description: 'Travel to State University', amount: 300 },
      { type: ExpenseType.FOOD, description: 'Meals for 2 days', amount: 200 },
    ],
    date: new Date(new Date().setDate(new Date().getDate() - 5)), 
    status: BillStatus.PAID, 
    invoiceNumber: 'INV-2024-001' 
  },
  { 
    id: 'bill-2', 
    trainerId: 'trainer-2', 
    amount: 2000,
    expenses: [
      { type: ExpenseType.OTHER, description: 'Backend Development Series - Week 1', amount: 2000 },
    ],
    date: new Date(new Date().setDate(new Date().getDate() - 2)), 
    status: BillStatus.PENDING, 
    invoiceNumber: 'INV-2024-002' 
  },
];

export const MOCK_COLLEGES: College[] = [
  {
    id: 'col-1',
    name: 'State University',
    address: '123 University Ave, Capital City',
    contactPerson: 'Dr. Eleanor Vance',
    contactEmail: 'evance@stateu.edu',
    contactPhone: '555-0102',
  },
  {
    id: 'col-2',
    name: 'City College',
    address: '456 College Rd, Metroburg',
    contactPerson: 'Prof. Ben Carter',
    contactEmail: 'bcarter@citycollege.com',
    contactPhone: '555-0103',
  },
  {
    id: 'col-3',
    name: 'Tech Institute',
    address: '789 Tech Park, Silicon Valley',
    contactPerson: 'Ms. Olivia Chen',
    contactEmail: 'olivia.chen@techinstitute.io',
    contactPhone: '555-0104',
  },
];