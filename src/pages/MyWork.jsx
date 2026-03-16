import { useState, useEffect } from 'react';
import { History, Clock, CheckCircle2, XCircle, AlertCircle, DollarSign, ExternalLink } from 'lucide-react';
import { submissionAPI } from '../api';

const MyWork = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMySubmissions = async () => {
      try {
        const res = await submissionAPI.getMySubmissions();
        setSubmissions(res.data);
      } catch (error) {
        console.error('Error fetching submissions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMySubmissions();
  }, []);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'submitted': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'review': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'approved': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'paid': return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
      case 'rejected': return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'changes-requested': return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'submitted': return <History className="w-3 h-3" />;
      case 'review': return <AlertCircle className="w-3 h-3" />;
      case 'approved': return <CheckCircle2 className="w-3 h-3" />;
      case 'paid': return <DollarSign className="w-3 h-3" />;
      case 'rejected': return <XCircle className="w-3 h-3" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">My Work</h1>
        <p className="text-gray-400 mt-1">Track the status of your bounty submissions.</p>
      </div>

      <div className="glass-card overflow-hidden border border-white/5 rounded-[32px]">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">Bounty</th>
                <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">Submitted At</th>
                <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">Status</th>
                <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">Reward</th>
                <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-500 text-right">PR Link</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-8 py-20 text-center">
                    <div className="w-8 h-8 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mx-auto"></div>
                  </td>
                </tr>
              ) : submissions.length > 0 ? submissions.map((sub) => (
                <tr key={sub._id} className="hover:bg-white/[0.01] transition-colors group">
                  <td className="px-8 py-5">
                    <p className="font-bold group-hover:text-indigo-400 transition-colors">{sub.bountyId?.title || 'Unknown Bounty'}</p>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Clock className="w-3 h-3" /> {new Date(sub.submittedAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${getStatusStyle(sub.status)}`}>
                      {getStatusIcon(sub.status)}
                      {sub.status.replace('-', ' ')}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <p className="font-black text-white flex items-center gap-1">
                      <span className="text-[10px] text-indigo-400">$</span>{sub.bountyId?.reward || 0}
                    </p>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <a 
                      href={sub.prLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-bold text-gray-500 hover:text-indigo-400 transition-colors"
                    >
                      View PR <ExternalLink className="w-3 h-3" />
                    </a>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="px-8 py-20 text-center">
                    <p className="text-gray-500 italic">No submissions yet. Start contributing to bounties!</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MyWork;
