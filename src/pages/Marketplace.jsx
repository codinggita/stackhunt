import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Clock, DollarSign, Tag, Globe } from 'lucide-react';

import { bountyAPI } from '../api';

const Marketplace = () => {
  const [bounties, setBounties] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchBounties = async (query = '') => {
    setLoading(true);
    try {
      const res = await bountyAPI.search(query);
      setBounties(res.data);
    } catch (error) {
      console.error('Error fetching bounties:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchBounties(searchQuery);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Marketplace</h1>
          <p className="text-gray-400 mt-1">Discover open-source opportunities and earn rewards.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 glass rounded-xl border border-white/10 text-sm font-medium hover:bg-white/10 transition-all">
            <Filter className="w-4 h-4" /> Filters
          </button>
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl px-10 py-2 focus:outline-none focus:border-indigo-500 transition-all w-full md:w-64 text-sm"
            />
            <Search className="absolute left-3 top-2.5 text-gray-500 w-4 h-4" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
          </div>
        ) : bounties.length > 0 ? bounties.map((bounty) => (
          <div key={bounty._id} className="glass-card p-6 flex flex-col md:flex-row items-start md:items-center justify-between hover:border-indigo-500/50 transition-all group gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
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
              </div>
              <h3 className="text-xl font-bold group-hover:text-indigo-400 transition-colors">{bounty.title}</h3>
              <div className="flex flex-wrap items-center gap-4 mt-4">
                <div className="flex flex-wrap gap-2">
                  {bounty.tags.map(tag => (
                    <span key={tag} className="text-[10px] px-2 py-1 bg-white/5 rounded-md text-gray-400 capitalize">{tag}</span>
                  ))}
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500 border-l border-white/10 pl-4 capitalize">
                  <Globe className="w-3 h-3" /> {bounty.creatorId?.name || 'StackHunt'}
                </div>
              </div>
            </div>

            <div className="text-right w-full md:w-auto">
              <div className="flex items-center justify-start md:justify-end gap-1 text-2xl font-black text-indigo-400">
                <span className="text-sm font-medium">$</span>{bounty.reward}
              </div>
              <Link to={`/bounty/${bounty._id}`} className="mt-4 block w-full md:w-auto px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-sm font-bold transition-all transform hover:scale-105 shadow-lg shadow-indigo-600/20 text-center">
                View Details
              </Link>
            </div>
          </div>
        )) : (
          <div className="text-center py-20 glass-card">
            <p className="text-gray-500">No bounties found. Try a different search term.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Marketplace;
