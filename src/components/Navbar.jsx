import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Search, Bell, User, LogOut } from 'lucide-react';
import { useState } from 'react';
import NotificationCenter from './NotificationCenter';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isNotifyOpen, setNotifyOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 glass border-b border-white/5 px-6 py-4 flex items-center justify-between">
      <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
        StackHunt
      </Link>

      <div className="flex items-center space-x-6">
        <div className="relative group">
          <input 
            type="text" 
            placeholder="Search bounties..." 
            className="bg-white/5 border border-white/10 rounded-full px-10 py-2 focus:outline-none focus:border-indigo-500 transition-all w-64"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
        </div>

        {user ? (
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button 
                onClick={() => setNotifyOpen(!isNotifyOpen)}
                className="relative p-2 hover:bg-white/5 rounded-full transition-colors"
              >
                <Bell className="w-5 h-5 text-gray-400" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-pink-500 rounded-full border-2 border-[#050505]"></span>
              </button>
              <NotificationCenter isOpen={isNotifyOpen} onClose={() => setNotifyOpen(false)} />
            </div>
            
            <div className="flex items-center space-x-3 pl-4 border-l border-white/10">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user.role}</p>
              </div>
              <Link to="/profile">
                <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center font-bold">
                  {user.name[0]}
                </div>
              </Link>
              <button 
                onClick={logout}
                className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-all"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center space-x-4">
            <Link to="/login" className="text-sm hover:text-indigo-400 transition-colors">Login</Link>
            <Link to="/signup" className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-sm font-medium transition-colors">
              Get Started
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
