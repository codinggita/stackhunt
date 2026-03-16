import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Target, 
  Trophy, 
  Settings, 
  PlusCircle, 
  History, 
  MessageSquare,
  LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const developerLinks = [
    { label: 'Marketplace', icon: Target, path: '/marketplace' },
    { label: 'My Submissions', icon: History, path: '/my-work' },
    { label: 'Leaderboard', icon: Trophy, path: '/leaderboard' },
  ];

  const maintainerLinks = [
    { label: 'Open Submissions', icon: MessageSquare, path: '/review-queue' },
    { label: 'My Repo', icon: Target, path: '/my-repo' },
  ];

  const companyLinks = [
    { label: 'Post Bounty', icon: PlusCircle, path: '/create-bounty' },
    { label: 'My Bounties', icon: Target, path: '/company-bounties' },
  ];

  return (
    <aside className="fixed left-0 top-20 h-[calc(100vh-5rem)] w-64 glass border-r border-white/5 p-4 flex flex-col pt-8">
      <div className="space-y-2 flex-1">
        <Link 
          to="/dashboard" 
          className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
            isActive('/dashboard') ? 'bg-indigo-600 shadow-lg shadow-indigo-600/20' : 'hover:bg-white/5'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="font-medium">Dashboard</span>
        </Link>

        <div className="pt-4 pb-2 px-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Explorer</p>
        </div>

        {user?.role === 'developer' && developerLinks.map((link) => (
          <Link 
            key={link.path}
            to={link.path} 
            className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
              isActive(link.path) ? 'bg-indigo-600 shadow-lg shadow-indigo-600/20' : 'hover:bg-white/5'
            }`}
          >
            <link.icon className="w-5 h-5" />
            <span className="font-medium">{link.label}</span>
          </Link>
        ))}

        {user?.role === 'maintainer' && maintainerLinks.map((link) => (
          <Link 
            key={link.path}
            to={link.path} 
            className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
              isActive(link.path) ? 'bg-indigo-600 shadow-lg shadow-indigo-600/20' : 'hover:bg-white/5'
            }`}
          >
            <link.icon className="w-5 h-5" />
            <span className="font-medium">{link.label}</span>
          </Link>
        ))}

        {user?.role === 'company' && companyLinks.map((link) => (
          <Link 
            key={link.path}
            to={link.path} 
            className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
              isActive(link.path) ? 'bg-indigo-600 shadow-lg shadow-indigo-600/20' : 'hover:bg-white/5'
            }`}
          >
            <link.icon className="w-5 h-5" />
            <span className="font-medium">{link.label}</span>
          </Link>
        ))}
      </div>

      <div className="pt-4 border-t border-white/5">
        <Link 
          to="/settings" 
          className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
            isActive('/settings') ? 'bg-indigo-600' : 'hover:bg-white/5'
          }`}
        >
          <Settings className="w-5 h-5" />
          <span className="font-medium">Settings</span>
        </Link>
        <button 
          onClick={logout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all hover:bg-red-500/10 hover:text-red-500 mt-2"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
