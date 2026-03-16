import { useAuth } from '../context/AuthContext';
import { 
  MessageSquare, 
  Target, 
  CheckCircle2, 
  TrendingUp, 
  Clock,
  ArrowUpRight,
  Shield,
  FileSearch
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { dashboardAPI, submissionAPI } from '../api';
import React, { useState, useEffect } from 'react';

const MaintainerDashboard = () => {
  const { user } = useAuth();
  const [statsData, setStatsData] = useState(null);
  const [pendingReviews, setPendingReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, reviewsRes] = await Promise.all([
          dashboardAPI.getMaintainerStats(),
          submissionAPI.getAllForReview()
        ]);
        setStatsData(statsRes.data);
        setPendingReviews(reviewsRes.data.slice(0, 2)); // Show only first 2 in dashboard
      } catch (error) {
        console.error('Error fetching maintainer data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = [
    { label: 'Open Submissions', value: statsData?.openSubmissions || '0', icon: MessageSquare, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
    { label: 'Managed Repos', value: statsData?.managedRepos || '0', icon: Shield, color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
    { label: 'Verified PRs', value: statsData?.verifiedPRs || '0', icon: CheckCircle2, color: 'text-green-400', bg: 'bg-green-400/10' },
    { label: 'Avg Review Time', value: statsData?.avgReviewTime || '0h', icon: Clock, color: 'text-pink-400', bg: 'bg-pink-400/10' },
  ];

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-3xl font-bold font-black">Maintainer Dashboard</h1>
        <p className="text-gray-400 mt-1">Review pull requests and manage repository health.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="glass-card p-6 border border-white/5 hover:border-white/10 transition-all rounded-2xl">
            <div className="flex items-center justify-between">
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <TrendingUp className="w-4 h-4 text-green-500" />
            </div>
            <div className="mt-4">
              <p className="text-2xl font-black">{stat.value}</p>
              <p className="text-xs text-gray-500 uppercase tracking-widest mt-1 font-bold">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Review Queue */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Pending Reviews</h2>
            <Link to="/review-queue" className="text-sm text-indigo-400 hover:text-indigo-300 font-bold">Go to queue</Link>
          </div>
          <div className="space-y-4">
            {loading ? (
              <div className="h-24 glass-card animate-pulse rounded-2xl"></div>
            ) : pendingReviews.length > 0 ? pendingReviews.map((review) => (
              <div key={review._id} className="glass-card p-5 flex items-center justify-between border border-white/5 hover:border-white/10 transition-all rounded-2xl">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center">
                    <FileSearch className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="font-bold">{review.bountyId?.title}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-indigo-400 font-semibold truncate max-w-[150px]">{review.description}</span>
                      <span className="text-[10px] text-gray-500 uppercase tracking-widest border-l border-white/10 pl-3">
                        by {review.developerId?.name} • {new Date(review.submittedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Link to="/review-queue" className="px-4 py-2 bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 rounded-lg text-xs font-bold transition-all">
                    Review
                  </Link>
                  <a href={review.prLink} target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-white/5 rounded-lg transition-all text-gray-500 hover:text-white">
                    <ArrowUpRight className="w-5 h-5" />
                  </a>
                </div>
              </div>
            )) : (
              <div className="glass-card p-8 text-center text-gray-400 rounded-2xl border border-white/5">
                No pending reviews
              </div>
            )}
          </div>
        </div>

        {/* Repository Management */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold">Your Repositories</h2>
          <div className="glass-card p-6 space-y-6 rounded-2xl border border-white/5">
          <div className="text-center py-4">
            <p className="text-gray-500 text-xs">No repositories managed yet.</p>
          </div>
            <Link to="/my-repo" className="block w-full py-3 bg-white/5 hover:bg-white/10 rounded-xl text-center text-xs font-bold transition-all mt-4 border border-white/5">
              Manage Repos
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaintainerDashboard;
