import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../contexts/AuthContext';

interface Case {
  id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  budget: string;
  deadline: string;
  clientId: string;
  clientName: string;
  createdAt: string;
  applications?: Application[];
}

interface Application {
  id: string;
  lawyerId: string;
  lawyerName: string;
  proposal: string;
  status: string;
  createdAt: string;
}

const CaseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [caseData, setCaseData] = useState<Case | null>(null);
  const [loading, setLoading] = useState(true);
  const [proposal, setProposal] = useState('');
  const [showProposalForm, setShowProposalForm] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchCase = async () => {
      try {
        if (!id) return;

        const caseDoc = await getDoc(doc(db, 'cases', id));
        if (!caseDoc.exists()) {
          throw new Error('Case not found');
        }

        const caseData = caseDoc.data();
        
        // Fetch applications for this case
        const applicationsQuery = query(
          collection(db, 'applications'),
          where('caseId', '==', id)
        );
        const applicationsSnapshot = await getDocs(applicationsQuery);
        const applications = applicationsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate().toLocaleDateString() || 'N/A'
        })) as Application[];

        setCaseData({
          id: caseDoc.id,
          ...caseData,
          createdAt: caseData.createdAt?.toDate().toLocaleDateString() || 'N/A',
          applications
        });
      } catch (error) {
        console.error('Error fetching case:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCase();
  }, [id]);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !id) return;

    try {
      await addDoc(collection(db, 'applications'), {
        caseId: id,
        lawyerId: user.uid,
        lawyerName: user.displayName,
        proposal,
        status: 'pending',
        createdAt: new Date()
      });

      setProposal('');
      setShowProposalForm(false);
      // Refresh case data to show new application
      window.location.reload();
    } catch (error) {
      console.error('Error submitting application:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600">Case not found</p>
        </div>
      </div>
    );
  }

  const isClient = user?.uid === caseData.clientId;
  const hasApplied = caseData.applications?.some(app => app.lawyerId === user?.uid);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{caseData.title}</h1>
                <div className="flex items-center space-x-4">
                  <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                    caseData.status === 'open' ? 'bg-green-100 text-green-800' :
                    caseData.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {caseData.status}
                  </span>
                  <span className="text-gray-500">Posted by {caseData.clientName}</span>
                </div>
              </div>
              {isClient && (
                <button
                  onClick={() => navigate(`/cases/${id}/edit`)}
                  className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  Edit Case
                </button>
              )}
            </div>

            <div className="prose max-w-none mb-8">
              <p className="text-gray-600">{caseData.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Category</h3>
                <p className="mt-1 text-gray-900">{caseData.category}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Budget</h3>
                <p className="mt-1 text-gray-900">{caseData.budget}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Deadline</h3>
                <p className="mt-1 text-gray-900">{caseData.deadline}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Posted On</h3>
                <p className="mt-1 text-gray-900">{caseData.createdAt}</p>
              </div>
            </div>

            {user?.userType === 'lawyer' && !isClient && !hasApplied && (
              <div className="mt-8">
                {!showProposalForm ? (
                  <button
                    onClick={() => setShowProposalForm(true)}
                    className="w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Apply for this Case
                  </button>
                ) : (
                  <form onSubmit={handleApply} className="space-y-4">
                    <div>
                      <label htmlFor="proposal" className="block text-sm font-medium text-gray-700">
                        Your Proposal
                      </label>
                      <textarea
                        id="proposal"
                        rows={4}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        value={proposal}
                        onChange={(e) => setProposal(e.target.value)}
                        required
                      />
                    </div>
                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => setShowProposalForm(false)}
                        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Submit Application
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {isClient && caseData.applications && caseData.applications.length > 0 && (
              <div className="mt-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Applications</h2>
                <div className="space-y-4">
                  {caseData.applications.map((application) => (
                    <div key={application.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-medium text-gray-900">{application.lawyerName}</h3>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          application.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          application.status === 'accepted' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {application.status}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-2">{application.proposal}</p>
                      <div className="text-sm text-gray-500">
                        Applied on {application.createdAt}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseDetail; 