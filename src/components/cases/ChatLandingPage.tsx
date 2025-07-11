import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getCasesByClientId, getCasesByLawyerId } from '../../services/caseService';
import ChatBox from '../chat/ChatBox';

// Extend the case type for local use
interface CaseItem {
  id: string;
  title: string;
  clientId: string;
  clientName?: string;
  assignedLawyerId?: string;
  assignedLawyerName?: string;
  [key: string]: any;
}

const ChatLandingPage: React.FC = () => {
  const { user, userData } = useAuth();
  const [cases, setCases] = useState<CaseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openChat, setOpenChat] = useState<null | CaseItem>(null);

  useEffect(() => {
    const fetchCases = async () => {
      if (!user || !userData) return;
      setLoading(true);
      setError(null);
      try {
        let userCases: CaseItem[] = [];
        if (userData.userType === 'client') {
          const clientCases = await getCasesByClientId(user.uid);
          userCases = clientCases.map(c => ({
            ...c,
            id: c.caseId,
            title: c.caseTitle,
            clientName: (userData as any).firstName ? `${(userData as any).firstName} ${(userData as any).lastName || ''}` : userData.email,
            assignedLawyerId: c.assignedLawyerId,
            assignedLawyerName: c.assignedLawyerName,
          }));
        } else if (userData.userType === 'lawyer') {
          const lawyerCases = await getCasesByLawyerId(user.uid);
          userCases = lawyerCases.map(c => ({
            ...c,
            id: c.caseId,
            title: c.caseTitle,
            clientId: c.clientId,
            clientName: c.clientName,
            assignedLawyerId: user.uid,
            assignedLawyerName: (userData as any).firstName ? `${(userData as any).firstName} ${(userData as any).lastName || ''}` : userData.email,
          }));
        }
        setCases(userCases);
      } catch (err) {
        setError('Failed to load your cases.');
      } finally {
        setLoading(false);
      }
    };
    fetchCases();
  }, [user, userData]);

  if (loading) return <div className="p-4">Loading your cases...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;

  return (
    <div className="max-w-2xl mx-auto mt-8 p-4 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Your Case Chats</h2>
      {cases.length === 0 ? (
        <div className="text-gray-500">You have no cases yet. Cases you are involved in will appear here.</div>
      ) : (
        <ul className="space-y-4">
          {cases.map((c) => (
            <li key={c.id} className="flex items-center justify-between border-b pb-2">
              <div>
                <div className="font-semibold text-lg">{c.title || `Case #${c.id}`}</div>
                <div className="text-xs text-gray-500">
                  {c.assignedLawyerName || c.assignedLawyerId ? (
                    <>
                      Assigned Lawyer: <span className="font-medium text-gray-700">{c.assignedLawyerName || c.assignedLawyerId}</span>
                    </>
                  ) : (
                    <span className="italic text-gray-400">Unassigned</span>
                  )}
                </div>
                <div className="text-xs text-gray-400">Case ID: {c.id}</div>
              </div>
              <button
                className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 transition"
                onClick={() => setOpenChat(c)}
              >
                Open Chat
              </button>
            </li>
          ))}
        </ul>
      )}
      {openChat && userData && user && (
        <ChatBox
          caseId={openChat.id}
          clientId={userData.userType === 'client' ? user.uid : openChat.clientId}
          clientName={userData.userType === 'client'
            ? ((userData as any).firstName ? `${(userData as any).firstName} ${(userData as any).lastName || ''}` : userData.email)
            : openChat.clientName || openChat.clientId || ''}
          lawyerId={userData.userType === 'lawyer' ? user.uid : openChat.assignedLawyerId || ''}
          lawyerName={userData.userType === 'lawyer'
            ? ((userData as any).firstName ? `${(userData as any).firstName} ${(userData as any).lastName || ''}` : userData.email)
            : openChat.assignedLawyerName || openChat.assignedLawyerId || ''}
          userType={userData.userType}
          onClose={() => setOpenChat(null)}
        />
      )}
    </div>
  );
};

export default ChatLandingPage; 