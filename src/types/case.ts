// Firestore Case Schema Types
import { Timestamp } from 'firebase/firestore';

// Milestone status enum
export enum MilestoneStatus {
  PENDING = 'Pending',
  IN_PROGRESS = 'In Progress',
  COMPLETED = 'Completed'
}

// Milestone interface
export interface Milestone {
  milestoneId: string;
  title: string;
  description: string;
  amount: number;
  status: MilestoneStatus;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  dueDate?: Timestamp;
  completedAt?: Timestamp;
}

// Main Case interface for Firestore
export interface Case {
  caseId: string;
  clientId: string;
  caseTitle: string;
  caseDescription: string;
  milestones: Milestone[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
  
  // Additional fields that might be useful
  status?: 'Open' | 'In Progress' | 'Closed' | 'On Hold';
  category?: string;
  priority?: 'Low' | 'Medium' | 'High' | 'Urgent';
  assignedLawyerId?: string;
  totalAmount?: number;
  tags?: string[];
  documents?: string[]; // Array of document URLs
  notes?: string;
  // --- Added for chat and display ---
  assignedLawyerName?: string;
  clientName?: string;
}

// Case creation input type (without auto-generated fields)
export interface CreateCaseInput {
  clientId: string;
  caseTitle: string;
  caseDescription: string;
  milestones: Omit<Milestone, 'milestoneId' | 'createdAt' | 'updatedAt'>[];
  status?: Case['status'];
  category?: string;
  priority?: Case['priority'];
  assignedLawyerId?: string;
  tags?: string[];
  notes?: string;
}

// Case update input type
export interface UpdateCaseInput {
  caseTitle?: string;
  caseDescription?: string;
  milestones?: Milestone[];
  status?: Case['status'];
  category?: string;
  priority?: Case['priority'];
  assignedLawyerId?: string;
  totalAmount?: number;
  tags?: string[];
  documents?: string[];
  notes?: string;
}

// Milestone creation input type
export interface CreateMilestoneInput {
  title: string;
  description: string;
  amount: number;
  status?: MilestoneStatus;
  dueDate?: Date;
}

// Milestone update input type
export interface UpdateMilestoneInput {
  title?: string;
  description?: string;
  amount?: number;
  status?: MilestoneStatus;
  dueDate?: Date;
  completedAt?: Date;
}

// Case with calculated fields for display
export interface CaseWithCalculations extends Case {
  totalMilestones: number;
  completedMilestones: number;
  pendingMilestones: number;
  totalAmount: number;
  progressPercentage: number;
}

// Firestore collection name constant
export const CASES_COLLECTION = 'cases';
export const MILESTONES_COLLECTION = 'milestones'; 