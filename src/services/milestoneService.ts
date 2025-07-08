// Client-side service for milestone operations using Firebase callable functions
import { getFunctions, httpsCallable } from 'firebase/functions';
import { app } from '../config/firebase';

const functions = getFunctions(app);

// Types for milestone operations
export interface AddMilestoneData {
  title: string;
  description: string;
  amount: number;
  status?: 'Pending' | 'In Progress' | 'Completed';
}

export interface UpdateMilestoneData {
  title?: string;
  description?: string;
  amount?: number;
  status?: 'Pending' | 'In Progress' | 'Completed';
}

export interface MilestoneResponse {
  success: boolean;
  milestoneId: string;
  caseId: string;
}

// Callable function references
const addMilestoneFunction = httpsCallable(functions, 'addMilestone');
const updateMilestoneFunction = httpsCallable(functions, 'updateMilestone');
const deleteMilestoneFunction = httpsCallable(functions, 'deleteMilestone');

/**
 * Add a new milestone to a case
 */
export const addMilestoneToCase = async (
  caseId: string, 
  milestoneData: AddMilestoneData
): Promise<MilestoneResponse> => {
  try {
    const result = await addMilestoneFunction({
      caseId,
      milestoneData
    });

    return result.data as MilestoneResponse;
  } catch (error: any) {
    console.error('Error adding milestone:', error);
    
    // Handle specific error types
    if (error.code === 'functions/unauthenticated') {
      throw new Error('You must be logged in to add milestones');
    } else if (error.code === 'functions/permission-denied') {
      throw new Error('Only case owners can add milestones');
    } else if (error.code === 'functions/invalid-argument') {
      throw new Error(error.message || 'Invalid milestone data');
    } else if (error.code === 'functions/not-found') {
      throw new Error('Case not found');
    } else {
      throw new Error('Failed to add milestone. Please try again.');
    }
  }
};

/**
 * Update an existing milestone
 */
export const updateMilestoneInCase = async (
  caseId: string,
  milestoneId: string,
  updateData: UpdateMilestoneData
): Promise<MilestoneResponse> => {
  try {
    const result = await updateMilestoneFunction({
      caseId,
      milestoneId,
      updateData
    });

    return result.data as MilestoneResponse;
  } catch (error: any) {
    console.error('Error updating milestone:', error);
    
    // Handle specific error types
    if (error.code === 'functions/unauthenticated') {
      throw new Error('You must be logged in to update milestones');
    } else if (error.code === 'functions/permission-denied') {
      throw new Error('Only case owners can update milestones');
    } else if (error.code === 'functions/invalid-argument') {
      throw new Error(error.message || 'Invalid update data');
    } else if (error.code === 'functions/not-found') {
      throw new Error('Case or milestone not found');
    } else {
      throw new Error('Failed to update milestone. Please try again.');
    }
  }
};

/**
 * Delete a milestone from a case
 */
export const deleteMilestoneFromCase = async (
  caseId: string,
  milestoneId: string
): Promise<MilestoneResponse> => {
  try {
    const result = await deleteMilestoneFunction({
      caseId,
      milestoneId
    });

    return result.data as MilestoneResponse;
  } catch (error: any) {
    console.error('Error deleting milestone:', error);
    
    // Handle specific error types
    if (error.code === 'functions/unauthenticated') {
      throw new Error('You must be logged in to delete milestones');
    } else if (error.code === 'functions/permission-denied') {
      throw new Error('Only case owners can delete milestones');
    } else if (error.code === 'functions/invalid-argument') {
      throw new Error('Invalid milestone ID');
    } else if (error.code === 'functions/not-found') {
      throw new Error('Case or milestone not found');
    } else {
      throw new Error('Failed to delete milestone. Please try again.');
    }
  }
};

/**
 * Update milestone status
 */
export const updateMilestoneStatus = async (
  caseId: string,
  milestoneId: string,
  status: 'Pending' | 'In Progress' | 'Completed'
): Promise<MilestoneResponse> => {
  return updateMilestoneInCase(caseId, milestoneId, { status });
};

/**
 * Mark milestone as completed
 */
export const completeMilestone = async (
  caseId: string,
  milestoneId: string
): Promise<MilestoneResponse> => {
  return updateMilestoneStatus(caseId, milestoneId, 'Completed');
};

/**
 * Mark milestone as in progress
 */
export const startMilestone = async (
  caseId: string,
  milestoneId: string
): Promise<MilestoneResponse> => {
  return updateMilestoneStatus(caseId, milestoneId, 'In Progress');
};

/**
 * Reset milestone to pending
 */
export const resetMilestone = async (
  caseId: string,
  milestoneId: string
): Promise<MilestoneResponse> => {
  return updateMilestoneStatus(caseId, milestoneId, 'Pending');
}; 