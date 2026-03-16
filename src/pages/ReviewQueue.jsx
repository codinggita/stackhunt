import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  CheckCircle, 
  XCircle, 
  ExternalLink, 
  User as UserIcon, 
  Clock,
  AlertCircle
} from 'lucide-react';
import { submissionAPI } from '../api';

const ReviewQueue = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState('');

  const fetchSubmissions = async () => {
    try {
      const res = await submissionAPI.getAllForReview();
      setSubmissions(res.data);
    } catch (err) {
      console.error('Error fetching submissions:', err);
      setError('Failed to load submissions for review');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const handleReview = async (submissionId, status) => {
    setActionLoading(submissionId);
    try {
      await submissionAPI.reviewSubmission({
        submissionId,
        status,
        feedback: status === 'approved' ? 'Great work! Approved.' : 'Please fix the identified issues.'
      });
      await fetchSubmissions();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update submission');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black">Review Queue</h1>
        <p className="text-gray-400 mt-1">Review pull requests and approve solutions.</p>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/50 text-red-500 text-sm rounded-xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5" /> {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        {submissions.length > 0 ? submissions.map((submission) => (
          <div key={submission._id} className="glass-card p-6 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-indigo-500/10 flex items-center justify-center font-bold text-indigo-400 border border-indigo-500/20">
                  {submission.developerId?.name?.[0] || 'D'}
                </div>
                <div>
                  <h3 className="font-bold flex items-center gap-2">
                    {submission.developerId?.name} 
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-tighter">for</span>
                    {submission.bountyId?.title}
                  </h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-indigo-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {new Date(submission.submittedAt).toLocaleDateString()}
                    </span>
                    <a 
                      href={submission.prLink} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-xs text-gray-400 hover:text-white flex items-center gap-1 border-l border-white/10 pl-3 transition-colors"
                    >
                      <ExternalLink className="w-3 h-3" /> View Pull Request
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button 
                  disabled={actionLoading === submission._id}
                  onClick={() => handleReview(submission._id, 'rejected')}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2 bg-white/5 hover:bg-red-500/10 hover:text-red-500 rounded-xl text-sm font-bold border border-white/5 transition-all"
                >
                  <XCircle className="w-4 h-4" /> Reject
                </button>
                <button 
                  disabled={actionLoading === submission._id}
                  onClick={() => handleReview(submission._id, 'approved')}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-600/20"
                >
                  {actionLoading === submission._id ? 'Processing...' : <><CheckCircle className="w-4 h-4" /> Approve & Release</>}
                </button>
              </div>
            </div>

            <div className="p-4 bg-white/5 rounded-xl border border-white/5">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Developer's Notes</p>
              <p className="text-sm text-gray-300 italic">"{submission.description}"</p>
            </div>
          </div>
        )) : (
          <div className="glass-card p-12 flex flex-col items-center justify-center text-center space-y-4 rounded-[32px] border border-white/5">
            <div className="w-16 h-16 bg-indigo-600/10 rounded-2xl flex items-center justify-center">
              <MessageSquare className="w-8 h-8 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold">No submissions waiting</h2>
              <p className="text-gray-400 max-w-sm mx-auto mt-2">
                You're all caught up! New pull requests from developers will appear here for your review.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewQueue;
