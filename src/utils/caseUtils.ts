// Utility functions for working with Case schema
import { Timestamp } from 'firebase/firestore';
import type { 
  Case, 
  Milestone, 
  CreateCaseInput, 
  UpdateCaseInput,
  CreateMilestoneInput,
  CaseWithCalculations 
} from '../types/case';
import { MilestoneStatus } from '../types/case';

/**
 * Generate a unique milestone ID
 */
export const generateMilestoneId = (): string => {
  return `milestone_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Create a new milestone with default values
 */
export const createMilestone = (input: CreateMilestoneInput): Milestone => {
  const now = Timestamp.now();
  return {
    milestoneId: generateMilestoneId(),
    title: input.title,
    description: input.description,
    amount: input.amount,
    status: input.status || MilestoneStatus.PENDING,
    createdAt: now,
    updatedAt: now,
    dueDate: input.dueDate ? Timestamp.fromDate(input.dueDate) : undefined,
  };
};

/**
 * Create a new case with default values
 */
export const createCase = (input: CreateCaseInput): Omit<Case, 'caseId'> => {
  const now = Timestamp.now();
  
  // Process milestones to add IDs and timestamps
  const processedMilestones: Milestone[] = input.milestones.map(milestone => ({
    ...milestone,
    milestoneId: generateMilestoneId(),
    createdAt: now,
    updatedAt: now,
  }));

  // Create base case object with required fields
  const caseData: any = {
    clientId: input.clientId,
    caseTitle: input.caseTitle,
    caseDescription: input.caseDescription,
    milestones: processedMilestones,
    createdAt: now,
    updatedAt: now,
    status: input.status || 'Open',
    priority: input.priority || 'Medium',
  };

  // Add optional fields only if they have values
  if (input.category) caseData.category = input.category;
  if (input.assignedLawyerId) caseData.assignedLawyerId = input.assignedLawyerId;
  if (input.tags && input.tags.length > 0) caseData.tags = input.tags;
  if (input.notes) caseData.notes = input.notes;

  return caseData;
};

/**
 * Update a case with new data
 */
export const updateCase = (existingCase: Case, updates: UpdateCaseInput): Case => {
  return {
    ...existingCase,
    ...updates,
    updatedAt: Timestamp.now(),
  };
};

/**
 * Update a specific milestone in a case
 */
export const updateMilestone = (
  caseData: Case, 
  milestoneId: string, 
  updates: Partial<Milestone>
): Case => {
  const updatedMilestones = caseData.milestones.map(milestone => 
    milestone.milestoneId === milestoneId 
      ? { 
          ...milestone, 
          ...updates, 
          updatedAt: Timestamp.now(),
          completedAt: updates.status === MilestoneStatus.COMPLETED 
            ? Timestamp.now() 
            : milestone.completedAt
        }
      : milestone
  );

  return {
    ...caseData,
    milestones: updatedMilestones,
    updatedAt: Timestamp.now(),
  };
};

/**
 * Add a new milestone to a case
 */
export const addMilestone = (caseData: Case, milestoneInput: CreateMilestoneInput): Case => {
  const newMilestone = createMilestone(milestoneInput);
  
  return {
    ...caseData,
    milestones: [...caseData.milestones, newMilestone],
    updatedAt: Timestamp.now(),
  };
};

/**
 * Remove a milestone from a case
 */
export const removeMilestone = (caseData: Case, milestoneId: string): Case => {
  return {
    ...caseData,
    milestones: caseData.milestones.filter(m => m.milestoneId !== milestoneId),
    updatedAt: Timestamp.now(),
  };
};

/**
 * Calculate case statistics and progress
 */
export const calculateCaseStats = (caseData: Case): CaseWithCalculations => {
  const totalMilestones = caseData.milestones.length;
  const completedMilestones = caseData.milestones.filter(
    m => m.status === MilestoneStatus.COMPLETED
  ).length;
  const pendingMilestones = caseData.milestones.filter(
    m => m.status === MilestoneStatus.PENDING
  ).length;
  
  const totalAmount = caseData.milestones.reduce((sum, m) => sum + m.amount, 0);
  const progressPercentage = totalMilestones > 0 
    ? Math.round((completedMilestones / totalMilestones) * 100) 
    : 0;

  return {
    ...caseData,
    totalMilestones,
    completedMilestones,
    pendingMilestones,
    totalAmount,
    progressPercentage,
  };
};

/**
 * Get milestones by status
 */
export const getMilestonesByStatus = (caseData: Case, status: MilestoneStatus): Milestone[] => {
  return caseData.milestones.filter(milestone => milestone.status === status);
};

/**
 * Get overdue milestones
 */
export const getOverdueMilestones = (caseData: Case): Milestone[] => {
  const now = Timestamp.now();
  return caseData.milestones.filter(milestone => 
    milestone.dueDate && 
    milestone.dueDate.toMillis() < now.toMillis() && 
    milestone.status !== MilestoneStatus.COMPLETED
  );
};

/**
 * Validate case data
 */
export const validateCase = (caseData: Partial<Case>): string[] => {
  const errors: string[] = [];

  if (!caseData.caseTitle?.trim()) {
    errors.push('Case title is required');
  }

  if (!caseData.caseDescription?.trim()) {
    errors.push('Case description is required');
  }

  if (!caseData.clientId?.trim()) {
    errors.push('Client ID is required');
  }

  if (caseData.milestones) {
    caseData.milestones.forEach((milestone, index) => {
      if (!milestone.title?.trim()) {
        errors.push(`Milestone ${index + 1}: Title is required`);
      }
      if (!milestone.description?.trim()) {
        errors.push(`Milestone ${index + 1}: Description is required`);
      }
      if (milestone.amount < 0) {
        errors.push(`Milestone ${index + 1}: Amount cannot be negative`);
      }
    });
  }

  return errors;
};

/**
 * Convert case data for Firestore (handle Timestamps)
 */
export const prepareCaseForFirestore = (caseData: Case): any => {
  // Create base object with required fields
  const firestoreData: any = {
    clientId: caseData.clientId,
    caseTitle: caseData.caseTitle,
    caseDescription: caseData.caseDescription,
    milestones: caseData.milestones.map(milestone => ({
      milestoneId: milestone.milestoneId,
      title: milestone.title,
      description: milestone.description,
      amount: milestone.amount,
      status: milestone.status,
      createdAt: milestone.createdAt instanceof Timestamp ? milestone.createdAt : Timestamp.now(),
      updatedAt: milestone.updatedAt instanceof Timestamp ? milestone.updatedAt : Timestamp.now(),
      ...(milestone.dueDate && { dueDate: milestone.dueDate instanceof Timestamp ? milestone.dueDate : undefined }),
      ...(milestone.completedAt && { completedAt: milestone.completedAt instanceof Timestamp ? milestone.completedAt : undefined }),
    })),
    createdAt: caseData.createdAt instanceof Timestamp ? caseData.createdAt : Timestamp.now(),
    updatedAt: caseData.updatedAt instanceof Timestamp ? caseData.updatedAt : Timestamp.now(),
  };

  // Add optional fields only if they have values
  if (caseData.status) firestoreData.status = caseData.status;
  if (caseData.category) firestoreData.category = caseData.category;
  if (caseData.priority) firestoreData.priority = caseData.priority;
  if (caseData.assignedLawyerId) firestoreData.assignedLawyerId = caseData.assignedLawyerId;
  if (caseData.totalAmount !== undefined) firestoreData.totalAmount = caseData.totalAmount;
  if (caseData.tags && caseData.tags.length > 0) firestoreData.tags = caseData.tags;
  if (caseData.documents && caseData.documents.length > 0) firestoreData.documents = caseData.documents;
  if (caseData.notes) firestoreData.notes = caseData.notes;

  return firestoreData;
};

/**
 * Convert Firestore data to Case object
 */
export const parseCaseFromFirestore = (docData: any, docId: string): Case => {
  return {
    caseId: docId,
    clientId: docData.clientId,
    caseTitle: docData.caseTitle,
    caseDescription: docData.caseDescription,
    milestones: docData.milestones || [],
    createdAt: docData.createdAt,
    updatedAt: docData.updatedAt,
    status: docData.status,
    category: docData.category,
    priority: docData.priority,
    assignedLawyerId: docData.assignedLawyerId,
    totalAmount: docData.totalAmount,
    tags: docData.tags || [],
    documents: docData.documents || [],
    notes: docData.notes,
  };
}; 