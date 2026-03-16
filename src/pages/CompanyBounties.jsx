import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, MessageSquare, DollarSign, ArrowUpRight } from 'lucide-react';
import { bountyAPI } from '../api';

const CompanyBounties = () => {
  const [bounties, setBounties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBounties = async () => {
      try {
        const res = await bountyAPI.getCompanyBounties();
        setBounties(res.data);
      } catch (error) {
        console.error('Error fetching company bounties:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBounties();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">My Bounties</h1>
        <p className="text-gray-400 mt-1">Track and manage the status of your posted open source issues.</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
          </div>
        ) : bounties.length > 0 ? bounties.map((bounty) => (
          <div key={bounty._id} className="glass-card p-6 flex flex-col md:flex-row md:items-center justify-between hover:border-indigo-500/50 transition-all group">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded ${
                  bounty.status === 'open' ? 'bg-green-500/10 text-green-500' : 
                  bounty.status === 'in-progress' ? 'bg-indigo-500/10 text-indigo-500' : 
                  'bg-white/10 text-gray-400'
                }`}>
                  {bounty.status}
                </span>
                <span className="text-[10px] text-gray-500 flex items-center gap-1 uppercase tracking-widest">
                  <Clock className="w-3 h-3" /> {new Date(bounty.createdAt).toLocaleDateString()}
                </span>
              </div>
              <h3 className="text-xl font-bold group-hover:text-indigo-400 transition-colors">{bounty.title}</h3>
              <div className="flex items-center gap-6 mt-4">
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <MessageSquare className="w-4 h-4" /> {bounty.submissions} Submissions
                </div>
                <div className="flex items-center gap-2 text-xs text-green-400 font-bold">
                  <DollarSign className="w-4 h-4" /> {bounty.reward}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 mt-6 md:mt-0">
              <Link to={`/bounty/${bounty._id}`} className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-600/20">
                Manage
              </Link>
              <button className="p-2 hover:bg-white/5 rounded-lg border border-white/5 transition-all">
                <ArrowUpRight className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>
        )) : (
          <div className="text-center py-20 glass-card">
            <p className="text-gray-500">You haven't posted any bounties yet.</p>
            <Link to="/create-bounty" className="text-indigo-400 hover:text-indigo-300 text-sm font-bold mt-2 inline-block">Post your first bounty</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyBounties;
