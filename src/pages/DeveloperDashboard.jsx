import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  DollarSign, 
  Target, 
  CheckCircle2, 
  TrendingUp, 
  Clock,
  ArrowUpRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { dashboardAPI, bountyAPI, leaderboardAPI } from '../api';

const DeveloperDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [activeBounties, setActiveBounties] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, activeRes, leaderboardRes] = await Promise.all([
          dashboardAPI.getStats(),
          bountyAPI.getActive(),
          leaderboardAPI.getTop()
        ]);
        
        setStats(statsRes.data);
        setActiveBounties(activeRes.data);
        setLeaderboard(leaderboardRes.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statsCards = [
    { label: 'Total Earnings', value: `$${stats?.totalEarnings || 0}`, icon: DollarSign, color: 'text-green-400', bg: 'bg-green-400/10' },
    { label: 'Active Bounties', value: stats?.activeBounties || 0, icon: Target, color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
    { label: 'Solved Issues', value: stats?.solvedIssues || 0, icon: CheckCircle2, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { label: 'Reputation', value: stats?.reputation || 0, icon: TrendingUp, color: 'text-pink-400', bg: 'bg-pink-400/10' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-3xl font-bold">Hello, {user?.name} 👋</h1>
        <p className="text-gray-400 mt-1">Here's what's happening with your bounties today.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, i) => (
          <div key={i} className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <TrendingUp className="w-4 h-4 text-green-500" />
            </div>
            <div className="mt-4">
              <p className="text-2xl font-black">{stat.value}</p>
              <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Active Work */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Ongoing Bounties</h2>
            <Link to="/marketplace" className="text-sm text-indigo-400 hover:text-indigo-300">Browse more</Link>
          </div>
          <div className="space-y-4">
            {activeBounties.length > 0 ? activeBounties.map((bounty) => (
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
                      <span className="text-[10px] text-gray-500 flex items-center gap-1 uppercase tracking-widest">
                        <Clock className="w-3 h-3" /> {bounty.deadline ? new Date(bounty.deadline).toLocaleDateString() : 'No deadline'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded ${
                    bounty.submissionStatus === 'submitted' ? 'bg-indigo-500/10 text-indigo-500' : 'bg-yellow-500/10 text-yellow-500'
                  }`}>
                    {bounty.submissionStatus}
                  </span>
                  <button className="p-2 hover:bg-white/5 rounded-lg transition-all">
                    <ArrowUpRight className="w-5 h-5 text-gray-500 hover:text-white" />
                  </button>
                </div>
              </div>
            )) : (
              <div className="text-center py-10 glass-card">
                <p className="text-gray-500">No ongoing bounties. Start hunting!</p>
              </div>
            )}
          </div>
        </div>

        {/* Leaderboard Sneak Peek */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold">Top Contributors</h2>
          <div className="glass-card p-6 space-y-6">
            {leaderboard.slice(0, 5).map((dev, i) => (
              <div key={dev._id} className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-600/20 flex items-center justify-center font-bold text-sm text-indigo-400 border border-indigo-600/20">
                    {i + 1}
                  </div>
                  <div>
                    <p className="text-sm font-bold group-hover:text-indigo-400 transition-colors">{dev.name}</p>
                    <p className="text-[10px] text-gray-500">Reputation: {dev.reputation}</p>
                  </div>
                </div>
                <p className="text-sm font-bold text-gray-400">#{i + 1}</p>
              </div>
            ))}
            <Link to="/leaderboard" className="block w-full py-3 bg-white/5 hover:bg-white/10 rounded-xl text-center text-xs font-bold transition-all mt-4 border border-white/5">
              View Full Leaderboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeveloperDashboard;
