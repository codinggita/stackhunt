import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Target, 
  Clock, 
  DollarSign, 
  Github, 
  Calendar, 
  AlertCircle,
  Terminal,
  Send,
  CheckCircle2,
  ChevronLeft
} from 'lucide-react';
import { bountyAPI, submissionAPI } from '../api';
import { useAuth } from '../context/AuthContext';

const BountyDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bounty, setBounty] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    prLink: '',
    description: ''
  });

  const fetchData = async () => {
    try {
      const [bountyRes, submissionsRes] = await Promise.all([
        bountyAPI.getBountyById(id),
        submissionAPI.getMySubmissions()
      ]);
      setBounty(bountyRes.data);
      
      const mySubmission = submissionsRes.data.find(s => s.bountyId._id === id);
      setSubmission(mySubmission);
    } catch (err) {
      console.error('Error fetching bounty details:', err);
      setError('Failed to load bounty details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleStartWork = async () => {
    setActionLoading(true);
    try {
      await submissionAPI.startWork(id);
      await fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to start work');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSubmitSolution = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      await submissionAPI.submitSolution({
        bountyId: id,
        ...formData
      });
      await fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit solution');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-[calc(100vh-10rem)]">
      <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
    </div>
  );

  if (!bounty) return (
    <div className="text-center py-20 glass-card">
      <p className="text-gray-500">Bounty not found.</p>
      <Link to="/marketplace" className="text-indigo-400 hover:text-indigo-300 text-sm font-bold mt-2 inline-block">Back to Marketplace</Link>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <Link to="/marketplace" className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors text-sm font-medium w-fit">
        <ChevronLeft className="w-4 h-4" /> Back to Marketplace
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <div className="glass-card p-8 space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded ${
                bounty.difficulty === 'hard' ? 'bg-red-500/10 text-red-500' : 
                bounty.difficulty === 'medium' ? 'bg-yellow-500/10 text-yellow-500' : 
                'bg-green-500/10 text-green-500'
              }`}>
                {bounty.difficulty}
              </span>
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <Clock className="w-3 h-3" /> {bounty.deadline ? new Date(bounty.deadline).toLocaleDateString() : 'No deadline'}
              </span>
              <span className="text-xs text-gray-500 flex items-center gap-1 border-l border-white/10 pl-3">
                Posted by {bounty.creatorId?.name || 'StackHunt'}
              </span>
            </div>

            <h1 className="text-3xl font-black">{bounty.title}</h1>

            <div className="flex flex-wrap gap-2 pt-2">
              {bounty.tags?.map(tag => (
                <span key={tag} className="text-xs px-3 py-1 bg-white/5 rounded-lg text-gray-400 capitalize border border-white/5">{tag}</span>
              ))}
            </div>

            <div className="pt-6 space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-widest text-indigo-400">Description</h2>
              <div className="text-gray-300 leading-relaxed whitespace-pre-wrap text-sm">
                {bounty.description}
              </div>
            </div>

            <div className="pt-6">
              <h2 className="text-sm font-bold uppercase tracking-widest text-indigo-400 mb-4">Resources</h2>
              <a 
                href={bounty.repoLink} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-3 p-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 transition-all text-sm group"
              >
                <Github className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                <span className="flex-1 font-medium overflow-hidden text-ellipsis whitespace-nowrap">{bounty.repoLink}</span>
                <Send className="w-4 h-4 text-gray-600 group-hover:text-indigo-400 transition-colors" />
              </a>
            </div>
          </div>

          {/* Engagement Section */}
          {user?.role === 'developer' && (
            <div className="glass-card p-8 space-y-6 bg-gradient-to-br from-indigo-500/[0.03] to-purple-500/[0.03]">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-500/10 rounded-lg">
                  <Terminal className="w-5 h-5 text-indigo-400" />
                </div>
                <h2 className="text-xl font-bold">Manage Your Work</h2>
              </div>

              {!submission ? (
                <div className="space-y-4">
                  <p className="text-sm text-gray-400">Clicking "Start Work" will add this bounty to your active dashboard.</p>
                  <button 
                    disabled={actionLoading}
                    onClick={handleStartWork}
                    className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-2xl font-bold transition-all shadow-lg shadow-indigo-600/20"
                  >
                    {actionLoading ? 'Initializing...' : 'Start Personal Work'}
                  </button>
                </div>
              ) : submission.status === 'pending' || submission.status === 'changes-requested' ? (
                <form onSubmit={handleSubmitSolution} className="space-y-6">
                  {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/50 text-red-500 text-sm rounded-xl flex items-center gap-3">
                      <AlertCircle className="w-5 h-5" /> {error}
                    </div>
                  )}
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-gray-500 pl-1">Pull Request Link</label>
                      <input 
                        type="url" 
                        required
                        placeholder="https://github.com/org/repo/pull/1"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 transition-all text-sm"
                        value={formData.prLink}
                        onChange={(e) => setFormData({...formData, prLink: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-gray-500 pl-1">Submission Notes</label>
                      <textarea 
                        required
                        rows="4"
                        placeholder="Explain your changes and how you've solved the issue..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 transition-all text-sm resize-none"
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                      />
                    </div>
                  </div>

                  <button 
                    disabled={actionLoading}
                    className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-indigo-500/20 disabled:opacity-50 rounded-2xl font-bold transition-all shadow-lg flex items-center justify-center gap-2"
                  >
                    {actionLoading ? 'Submitting...' : 'Submit Solution'} <Send className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <div className="p-6 bg-green-500/5 border border-green-500/20 rounded-2xl space-y-4">
                  <div className="flex items-center gap-3 text-green-400">
                    <CheckCircle2 className="w-6 h-6" />
                    <h3 className="font-bold">Solution Submitted</h3>
                  </div>
                  <p className="text-sm text-gray-400">
                    Your solution is currently under **{submission.status}**. We'll notify you once the maintainers review it.
                  </p>
                  <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs">
                    <span className="text-gray-500">Status</span>
                    <span className="font-bold uppercase tracking-widest text-indigo-400">{submission.status}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="glass-card p-8 text-center space-y-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/10 blur-3xl -mr-16 -mt-16 rounded-full" />
            <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Bounty Reward</p>
            <div className="flex items-center justify-center gap-1 text-5xl font-black text-indigo-400">
              <span className="text-2xl font-medium">$</span>{bounty.reward}
            </div>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest">Guaranteed by StackHunt Escrow</p>
          </div>

          <div className="glass-card p-6 space-y-4">
            <h3 className="font-bold flex items-center gap-2 text-sm">
              <AlertCircle className="w-4 h-4 text-indigo-400" /> Hunt Smart
            </h3>
            <ul className="space-y-3 text-xs text-gray-400">
              <li className="flex gap-2">
                <span className="text-indigo-500 font-bold">•</span>
                Read the description carefully.
              </li>
              <li className="flex gap-2">
                <span className="text-indigo-500 font-bold">•</span>
                Ensure your PR follows repo contribution guides.
              </li>
              <li className="flex gap-2">
                <span className="text-indigo-500 font-bold">•</span>
                Only "Start Work" if you're committed to solving.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BountyDetails;
