import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getCasesByLawyerId } from '../../services/caseService';
import ChatBox from '../chat/ChatBox';

interface CaseItem {
  id: string;
  title: string;
  clientId: string;
  clientName?: string;
  assignedLawyerId?: string;
  assignedLawyerName?: string;
  [key: string]: any;
}

const LawyerChatLandingPage: React.FC = () => {
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
        const lawyerCases = await getCasesByLawyerId(user.uid);
        const userCases: CaseItem[] = lawyerCases.map(c => ({
          ...c,
          id: c.caseId,
          title: c.caseTitle,
          clientId: c.clientId,
          clientName: c.clientName,
          assignedLawyerId: user.uid,
          assignedLawyerName: (userData as any).firstName ? `${(userData as any).firstName} ${(userData as any).lastName || ''}` : userData.email,
        }));
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
      <h2 className="text-2xl font-bold mb-4">Client Case Chats</h2>
      {cases.length === 0 ? (
        <div className="text-gray-500">You have no assigned cases yet. Cases you are involved in will appear here.</div>
      ) : (
        <ul className="space-y-4">
          {cases.map((c) => (
            <li key={c.id} className="flex items-center justify-between border-b pb-2">
              <div>
                <div className="font-semibold text-lg">{c.title || `Case #${c.id}`}</div>
                <div className="text-xs text-gray-500">
                  Client: <span className="font-medium text-gray-700">{c.clientName || c.clientId}</span>
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
          clientId={openChat.clientId}
          clientName={openChat.clientName || openChat.clientId || ''}
          lawyerId={user.uid}
          lawyerName={(userData as any).firstName ? `${(userData as any).firstName} ${(userData as any).lastName || ''}` : userData.email}
          userType={userData.userType}
          onClose={() => setOpenChat(null)}
        />
      )}
    </div>
  );
};

export default LawyerChatLandingPage; 