// Firestore Case Service
import { 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  Timestamp,
  writeBatch,
  DocumentReference
} from 'firebase/firestore';
import { db } from '../config/firebase';
import type { 
  Case, 
  CreateCaseInput, 
  UpdateCaseInput, 
  CreateMilestoneInput,
  Milestone 
} from '../types/case';
import { MilestoneStatus, CASES_COLLECTION } from '../types/case';
import { 
  createCase, 
  updateCase, 
  updateMilestone, 
  addMilestone, 
  removeMilestone,
  prepareCaseForFirestore,
  parseCaseFromFirestore,
  validateCase,
  generateMilestoneId
} from '../utils/caseUtils';

/**
 * Create a new case in Firestore
 */
export const createCaseInFirestore = async (input: CreateCaseInput): Promise<string> => {
  try {
    // Validate input
    const errors = validateCase({
      caseTitle: input.caseTitle,
      caseDescription: input.caseDescription,
      clientId: input.clientId,
      milestones: input.milestones.map(m => ({
        ...m,
        milestoneId: generateMilestoneId(),
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      }))
    });
    if (errors.length > 0) {
      throw new Error(`Validation errors: ${errors.join(', ')}`);
    }

    // Create case data
    const caseData = createCase(input);
    const firestoreData = prepareCaseForFirestore(caseData as Case);

    // Debug: Check for undefined values
    const checkForUndefined = (obj: any, path: string = ''): void => {
      for (const [key, value] of Object.entries(obj)) {
        const currentPath = path ? `${path}.${key}` : key;
        if (value === undefined) {
          console.error(`Found undefined value at: ${currentPath}`);
        } else if (value && typeof value === 'object' && !Array.isArray(value)) {
          checkForUndefined(value, currentPath);
        }
      }
    };
    
    checkForUndefined(firestoreData);
    console.log('Firestore data:', firestoreData);

    // Add to Firestore
    const docRef = await addDoc(collection(db, CASES_COLLECTION), firestoreData);
    return docRef.id;
  } catch (error) {
    console.error('Error creating case:', error);
    throw error;
  }
};

/**
 * Get a case by ID
 */
export const getCaseById = async (caseId: string): Promise<Case | null> => {
  try {
    const docRef = doc(db, CASES_COLLECTION, caseId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    return parseCaseFromFirestore(docSnap.data(), docSnap.id);
  } catch (error) {
    console.error('Error fetching case:', error);
    throw error;
  }
};

/**
 * Get all cases for a client
 */
export const getCasesByClientId = async (clientId: string): Promise<Case[]> => {
  try {
    const q = query(
      collection(db, CASES_COLLECTION),
      where('clientId', '==', clientId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => 
      parseCaseFromFirestore(doc.data(), doc.id)
    );
  } catch (error) {
    console.error('Error fetching client cases:', error);
    throw error;
  }
};

/**
 * Get all cases assigned to a lawyer
 */
export const getCasesByLawyerId = async (lawyerId: string): Promise<Case[]> => {
  try {
    const q = query(
      collection(db, CASES_COLLECTION),
      where('assignedLawyerId', '==', lawyerId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => 
      parseCaseFromFirestore(doc.data(), doc.id)
    );
  } catch (error) {
    console.error('Error fetching lawyer cases:', error);
    throw error;
  }
};

/**
 * Get all cases with optional filters
 */
export const getAllCases = async (filters?: {
  status?: string;
  category?: string;
  priority?: string;
  limit?: number;
}): Promise<Case[]> => {
  try {
    let q = query(collection(db, CASES_COLLECTION), orderBy('createdAt', 'desc'));
    
    if (filters?.status) {
      q = query(q, where('status', '==', filters.status));
    }
    
    if (filters?.category) {
      q = query(q, where('category', '==', filters.category));
    }
    
    if (filters?.priority) {
      q = query(q, where('priority', '==', filters.priority));
    }
    
    if (filters?.limit) {
      q = query(q, limit(filters.limit));
    }
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => 
      parseCaseFromFirestore(doc.data(), doc.id)
    );
  } catch (error) {
    console.error('Error fetching cases:', error);
    throw error;
  }
};

/**
 * Update a case
 */
export const updateCaseInFirestore = async (caseId: string, updates: UpdateCaseInput): Promise<void> => {
  try {
    const docRef = doc(db, CASES_COLLECTION, caseId);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      throw new Error('Case not found');
    }

    const existingCase = parseCaseFromFirestore(docSnap.data(), docSnap.id);
    const updatedCase = updateCase(existingCase, updates);
    const firestoreData = prepareCaseForFirestore(updatedCase);

    await updateDoc(docRef, {
      ...firestoreData,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating case:', error);
    throw error;
  }
};

/**
 * Delete a case
 */
export const deleteCase = async (caseId: string): Promise<void> => {
  try {
    const docRef = doc(db, CASES_COLLECTION, caseId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting case:', error);
    throw error;
  }
};

/**
 * Add a milestone to a case
 */
export const addMilestoneToCase = async (caseId: string, milestoneInput: CreateMilestoneInput): Promise<void> => {
  try {
    const docRef = doc(db, CASES_COLLECTION, caseId);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      throw new Error('Case not found');
    }

    const existingCase = parseCaseFromFirestore(docSnap.data(), docSnap.id);
    const updatedCase = addMilestone(existingCase, milestoneInput);
    const firestoreData = prepareCaseForFirestore(updatedCase);

    await updateDoc(docRef, {
      milestones: firestoreData.milestones,
      updatedAt: Timestamp.now(),
    });

    // After adding milestone, send notification to assigned lawyer (if any)
    const caseDoc = await getDoc(doc(db, CASES_COLLECTION, caseId));
    const caseData = caseDoc.data();
    if (caseData?.assignedLawyerId) {
      await addNotification(
        caseData.assignedLawyerId,
        'milestone_added',
        caseId,
        firestoreData.milestones[firestoreData.milestones.length - 1].milestoneId,
        `A new milestone "${milestoneInput.title}" was added to your assigned case.`
      );
    }
  } catch (error) {
    console.error('Error adding milestone:', error);
    throw error;
  }
};

/**
 * Update a milestone in a case
 */
export const updateMilestoneInCase = async (
  caseId: string, 
  milestoneId: string, 
  updates: Partial<Milestone>
): Promise<void> => {
  try {
    const docRef = doc(db, CASES_COLLECTION, caseId);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      throw new Error('Case not found');
    }

    const existingCase = parseCaseFromFirestore(docSnap.data(), docSnap.id);
    const updatedCase = updateMilestone(existingCase, milestoneId, updates);
    const firestoreData = prepareCaseForFirestore(updatedCase);

    await updateDoc(docRef, {
      milestones: firestoreData.milestones,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating milestone:', error);
    throw error;
  }
};

/**
 * Remove a milestone from a case
 */
export const removeMilestoneFromCase = async (caseId: string, milestoneId: string): Promise<void> => {
  try {
    const docRef = doc(db, CASES_COLLECTION, caseId);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      throw new Error('Case not found');
    }

    const existingCase = parseCaseFromFirestore(docSnap.data(), docSnap.id);
    const updatedCase = removeMilestone(existingCase, milestoneId);
    const firestoreData = prepareCaseForFirestore(updatedCase);

    await updateDoc(docRef, {
      milestones: firestoreData.milestones,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error removing milestone:', error);
    throw error;
  }
};

/**
 * Update milestone status
 */
export const updateMilestoneStatus = async (
  caseId: string, 
  milestoneId: string, 
  status: MilestoneStatus
): Promise<void> => {
  try {
    await updateMilestoneInCase(caseId, milestoneId, { status });

    // After marking completed, send notification to client and lawyer
    if (status === MilestoneStatus.COMPLETED) {
      const caseDoc = await getDoc(doc(db, CASES_COLLECTION, caseId));
      const caseData = caseDoc.data();
      if (caseData) {
        if (caseData.clientId) {
          await addNotification(
            caseData.clientId,
            'milestone_completed',
            caseId,
            milestoneId,
            `A milestone was marked completed in your case.`
          );
        }
        if (caseData.assignedLawyerId) {
          await addNotification(
            caseData.assignedLawyerId,
            'milestone_completed',
            caseId,
            milestoneId,
            `A milestone was marked completed in your assigned case.`
          );
        }
      }
    }
  } catch (error) {
    console.error('Error updating milestone:', error);
    throw error;
  }
};

/**
 * Mark milestone as completed
 */
export const completeMilestone = async (caseId: string, milestoneId: string): Promise<void> => {
  await updateMilestoneInCase(caseId, milestoneId, { 
    status: MilestoneStatus.COMPLETED,
    completedAt: Timestamp.now()
  });
};

/**
 * Get cases by status
 */
export const getCasesByStatus = async (status: string): Promise<Case[]> => {
  return getAllCases({ status });
};

/**
 * Get cases by category
 */
export const getCasesByCategory = async (category: string): Promise<Case[]> => {
  return getAllCases({ category });
};

/**
 * Search cases by title or description
 */
export const searchCases = async (searchTerm: string): Promise<Case[]> => {
  try {
    // Note: Firestore doesn't support full-text search natively
    // This is a simple implementation - for production, consider using Algolia or similar
    const allCases = await getAllCases();
    const searchLower = searchTerm.toLowerCase();
    
    return allCases.filter(caseData => 
      caseData.caseTitle.toLowerCase().includes(searchLower) ||
      caseData.caseDescription.toLowerCase().includes(searchLower) ||
      caseData.tags?.some(tag => tag.toLowerCase().includes(searchLower))
    );
  } catch (error) {
    console.error('Error searching cases:', error);
    throw error;
  }
};

/**
 * Get case statistics
 */
export const getCaseStatistics = async (clientId?: string): Promise<{
  total: number;
  open: number;
  inProgress: number;
  closed: number;
  onHold: number;
}> => {
  try {
    let cases: Case[];
    
    if (clientId) {
      cases = await getCasesByClientId(clientId);
    } else {
      cases = await getAllCases();
    }

    return {
      total: cases.length,
      open: cases.filter(c => c.status === 'Open').length,
      inProgress: cases.filter(c => c.status === 'In Progress').length,
      closed: cases.filter(c => c.status === 'Closed').length,
      onHold: cases.filter(c => c.status === 'On Hold').length,
    };
  } catch (error) {
    console.error('Error getting case statistics:', error);
    throw error;
  }
};

// Add notification helper
const addNotification = async (userId: string, type: string, caseId: string, milestoneId: string | null, message: string) => {
  await addDoc(collection(db, 'notifications'), {
    userId,
    type,
    caseId,
    milestoneId,
    message,
    createdAt: Timestamp.now(),
    read: false
  });
}; 