import { doc, updateDoc, writeBatch, getDocs, collection, query, where, addDoc, Timestamp, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

export const handleApprove = async (caseId: string, applicationId: string, lawyerId: string) => {
  // 1. Accept this application
  await updateDoc(doc(db, 'applications', applicationId), { status: 'accepted' });

  // 2. Deny all other applications for this case
  const q = query(collection(db, 'applications'), where('caseId', '==', caseId));
  const snapshot = await getDocs(q);
  const batch = writeBatch(db);
  snapshot.docs.forEach(docSnap => {
    if (docSnap.id !== applicationId) {
      batch.update(doc(db, 'applications', docSnap.id), { status: 'denied' });
    }
  });

  // 3. Assign lawyer to the case
  batch.update(doc(db, 'cases', caseId), {
    assignedLawyerId: lawyerId,
    status: 'In Progress'
  });

  await batch.commit();
};

export const handleDeny = async (applicationId: string) => {
  await updateDoc(doc(db, 'applications', applicationId), { status: 'denied' });
};

const addNotification = async (userId: string, type: string, caseId: string, message: string) => {
  await addDoc(collection(db, 'notifications'), {
    userId,
    type,
    caseId,
    message,
    createdAt: Timestamp.now(),
    read: false
  });
};

export const handleLawyerApplication = async (caseId: string, lawyerId: string, lawyerName: string, proposal: string) => {
  // Add application logic here (not shown for brevity)
  // After application, send notification to client
  const caseDoc = await getDoc(doc(db, 'cases', caseId));
  const caseData = caseDoc.data();
  if (caseData?.clientId) {
    await addNotification(
      caseData.clientId,
      'lawyer_applied',
      caseId,
      `Lawyer ${lawyerName} has applied to your case.`
    );
  }
}; 