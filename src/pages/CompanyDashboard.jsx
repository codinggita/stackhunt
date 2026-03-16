import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  DollarSign, 
  Target, 
  Users, 
  PlusCircle, 
  ArrowUpRight,
  TrendingUp,
  Clock
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { dashboardAPI, bountyAPI } from '../api';

const CompanyDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentBounties, setRecentBounties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const [statsRes, bountiesRes] = await Promise.all([
          dashboardAPI.getCompanyStats(),
          bountyAPI.getCompanyBounties()
        ]);
        setStats(statsRes.data);
        setRecentBounties(bountiesRes.data.slice(0, 5));
      } catch (error) {
        console.error('Error fetching company dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyData();
  }, []);

  const statsCards = [
    { label: 'Total Funded', value: `$${stats?.totalFunded || 0}`, icon: DollarSign, color: 'text-green-400', bg: 'bg-green-400/10' },
    { label: 'Live Bounties', value: stats?.liveBounties || 0, icon: Target, color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
    { label: 'Active Developers', value: stats?.activeDevelopers || 0, icon: Users, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { label: 'Solutions Verified', value: stats?.solutionsVerified || 0, icon: TrendingUp, color: 'text-pink-400', bg: 'bg-pink-400/10' },
  ];

  return (
    <div className="space-y-10">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Company Dashboard</h1>
          <p className="text-gray-400 mt-1">Manage your open source investments and review contributions.</p>
        </div>
        <Link to="/create-bounty" className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg shadow-indigo-600/20">
          <PlusCircle className="w-5 h-5" /> Post New Bounty
        </Link>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, i) => (
          <div key={i} className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-black">{stat.value}</p>
              <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Posted Bounties */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Your Live Bounties</h2>
              <Link to="/company-bounties" className="text-sm text-indigo-400 hover:text-indigo-300">View all</Link>
            </div>
            <div className="space-y-4">
              {recentBounties.length > 0 ? recentBounties.map((bounty) => (
                <div key={bounty._id} className="glass-card p-5 flex items-center justify-between border border-white/5 hover:border-white/10 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center">
                      <Target className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div>
                      <h3 className="font-bold">{bounty.title}</h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-green-400 flex items-center gap-1">
                          <DollarSign className="w-3 h-3" /> {bounty.reward}
                        </span>
                        <span className="text-[10px] text-gray-500 uppercase tracking-widest border-l border-white/10 pl-3">
                          {bounty.submissions} Submissions
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded ${
                      bounty.status === 'open' ? 'bg-green-500/10 text-green-500' : 'bg-indigo-500/10 text-indigo-500'
                    }`}>
                      {bounty.status}
                    </span>
                    <Link to={`/bounty/${bounty._id}`} className="p-2 hover:bg-white/5 rounded-lg transition-all">
                      <ArrowUpRight className="w-5 h-5 text-gray-500 hover:text-white" />
                    </Link>
                  </div>
                </div>
              )) : (
                <div className="text-center py-10 glass-card">
                  <p className="text-gray-500">No active bounties. Start investments!</p>
                </div>
              )}
            </div>
          </div>

        {/* Quick Actions / Integration */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold">GitHub Integration</h2>
          <div className="glass-card p-6 space-y-4">
            <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
              <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center border border-white/10">
                <PlusCircle className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold">Connect Repository</p>
                <p className="text-[10px] text-gray-500">Auto-sync issues as bounties</p>
              </div>
            </div>
            <button className="w-full py-3 bg-white/5 hover:bg-white/10 rounded-xl text-center text-xs font-bold transition-all border border-white/5">
              Manage Integrations
            </button>
          </div>
        </div>
      </div>
      )}
    </div>
  );
};

export default CompanyDashboard;
