import * as React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { createCaseInFirestore } from '../../services/caseService';
import { MilestoneStatus } from '../../types/case';

const CreateCase: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    caseTitle: '',
    caseDescription: '',
    milestoneTitle: 'Initial Milestone',
    milestoneDescription: 'Starting work',
    milestoneAmount: ''
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers and decimal points
    if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
      setFormData(prev => ({
        ...prev,
        milestoneAmount: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setError('You must be logged in to create a case');
      return;
    }

    // Validate form
    if (!formData.caseTitle.trim()) {
      setError('Case title is required');
      return;
    }

    if (!formData.caseDescription.trim()) {
      setError('Case description is required');
      return;
    }

    if (!formData.milestoneTitle.trim()) {
      setError('Milestone title is required');
      return;
    }

    if (!formData.milestoneDescription.trim()) {
      setError('Milestone description is required');
      return;
    }

    if (!formData.milestoneAmount || parseFloat(formData.milestoneAmount) <= 0) {
      setError('Milestone amount must be greater than 0');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const caseData = {
        clientId: user.uid,
        caseTitle: formData.caseTitle.trim(),
        caseDescription: formData.caseDescription.trim(),
        milestones: [
          {
            title: formData.milestoneTitle.trim(),
            description: formData.milestoneDescription.trim(),
            amount: parseFloat(formData.milestoneAmount),
            status: MilestoneStatus.PENDING
          }
        ],
        status: 'Open' as const,
        priority: 'Medium' as const
      };

      const caseId = await createCaseInFirestore(caseData);
      
      setSuccess('Case created successfully!');
      
      // Redirect to the new case after a short delay
      setTimeout(() => {
        navigate(`/cases/${caseId}`);
      }, 1500);

    } catch (err) {
      console.error('Error creating case:', err);
      setError(err instanceof Error ? err.message : 'Failed to create case');
      } finally {
        setLoading(false);
      }
    };

  return (
    <motion.div
      className="min-h-screen bg-gray-50 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="bg-white rounded-lg shadow-lg p-6 md:p-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Case</h1>
            <p className="text-gray-600">Fill out the form below to create a new legal case with an initial milestone.</p>
          </div>

          {error && (
            <motion.div
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              </div>
            </motion.div>
          )}

          {success && (
            <motion.div
              className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-800">{success}</p>
                  </div>
                  </div>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Case Information Section */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Case Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="caseTitle" className="block text-sm font-medium text-gray-700 mb-2">
                    Case Title *
                  </label>
                  <input
                    type="text"
                    id="caseTitle"
                    name="caseTitle"
                    value={formData.caseTitle}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter case title"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="caseDescription" className="block text-sm font-medium text-gray-700 mb-2">
                    Case Description *
                  </label>
                  <textarea
                    id="caseDescription"
                    name="caseDescription"
                    value={formData.caseDescription}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Describe the case details..."
                    required
                  />
                </div>
              </div>
            </div>

            {/* Initial Milestone Section */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Initial Milestone</h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="milestoneTitle" className="block text-sm font-medium text-gray-700 mb-2">
                    Milestone Title *
                  </label>
                  <input
                    type="text"
                    id="milestoneTitle"
                    name="milestoneTitle"
                    value={formData.milestoneTitle}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter milestone title"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="milestoneDescription" className="block text-sm font-medium text-gray-700 mb-2">
                    Milestone Description *
                  </label>
                  <textarea
                    id="milestoneDescription"
                    name="milestoneDescription"
                    value={formData.milestoneDescription}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Describe what this milestone involves..."
                    required
                  />
                </div>

                <div>
                  <label htmlFor="milestoneAmount" className="block text-sm font-medium text-gray-700 mb-2">
                    Milestone Amount (USD) *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="text"
                      id="milestoneAmount"
                      name="milestoneAmount"
                      value={formData.milestoneAmount}
                      onChange={handleAmountChange}
                      className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0.00"
                      required
                    />
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    Enter the cost for this milestone
                  </p>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Case...
                  </div>
                ) : (
                  'Create Case'
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default CreateCase;
