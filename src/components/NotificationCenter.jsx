import { Bell, CheckCircle2, DollarSign, Target, MessageSquare, X, Clock, Eye } from 'lucide-react';
import { useSocket } from '../context/SocketContext';

const NotificationCenter = ({ isOpen, onClose }) => {
  const { notifications, markAsRead } = useSocket();

  const getIcon = (type) => {
    switch (type) {
      case 'bounty_created': return <Target className="w-5 h-5 text-indigo-400" />;
      case 'submission_accepted': return <CheckCircle2 className="w-5 h-5 text-green-400" />;
      case 'payment_released': return <DollarSign className="w-5 h-5 text-yellow-400" />;
      case 'submission_received': return <MessageSquare className="w-5 h-5 text-blue-400" />;
      default: return <Bell className="w-5 h-5 text-gray-400" />;
    }
  };

  const getBg = (type) => {
    switch (type) {
      case 'bounty_created': return 'bg-indigo-500/10';
      case 'submission_accepted': return 'bg-green-500/10';
      case 'payment_released': return 'bg-yellow-500/10';
      case 'submission_received': return 'bg-blue-500/10';
      default: return 'bg-white/5';
    }
  };

  const formatTime = (date) => {
    const d = new Date(date);
    const now = new Date();
    const diff = Math.floor((now - d) / 1000 / 60);
    if (diff < 1) return 'Just now';
    if (diff < 60) return `${diff}m ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
    return d.toLocaleDateString();
  };

  if (!isOpen) return null;

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="absolute right-0 mt-3 w-96 glass-card p-0 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 z-[100] animate-in fade-in slide-in-from-top-2 duration-300 rounded-3xl overflow-hidden">
      <div className="flex items-center justify-between p-5 border-b border-white/5 bg-white/[0.02]">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/20 rounded-lg">
            <Bell className="w-4 h-4 text-indigo-400" />
          </div>
          <h3 className="text-sm font-black uppercase tracking-widest">Notifications</h3>
        </div>
        {unreadCount > 0 && (
          <button 
            onClick={() => markAsRead()}
            className="text-[10px] font-bold text-indigo-400 hover:text-white transition-colors flex items-center gap-1 uppercase tracking-tighter"
          >
            Mark all read <CheckCircle2 className="w-3 h-3" />
          </button>
        )}
      </div>
      
      <div className="max-h-[450px] overflow-y-auto custom-scrollbar">
        {notifications.length === 0 ? (
          <div className="text-center py-16 opacity-50">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/5">
              <MessageSquare className="w-6 h-6 text-white/20" />
            </div>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Inbox is empty</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {notifications.map((notif, i) => (
              <div 
                key={notif._id || i} 
                onClick={() => !notif.isRead && markAsRead(notif._id)}
                className={`flex gap-4 p-5 transition-all cursor-pointer group relative ${!notif.isRead ? 'bg-white/[0.03]' : 'opacity-60 grayscale-[0.5]'}`}
              >
                {!notif.isRead && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500"></div>
                )}
                <div className={`mt-0.5 w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border border-white/5 ${getBg(notif.type)}`}>
                  {getIcon(notif.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-xs leading-relaxed font-medium transition-colors ${!notif.isRead ? 'text-white' : 'text-gray-400'}`}>
                      {notif.message}
                    </p>
                    <span className="text-[9px] font-black text-gray-600 uppercase tracking-tighter shrink-0 mt-0.5">
                      {formatTime(notif.createdAt)}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-[9px] font-black text-indigo-500/60 uppercase tracking-widest bg-indigo-500/5 px-2 py-0.5 rounded-md">
                      {notif.type?.replace('_', ' ')}
                    </span>
                    {!notif.isRead && (
                      <span className="flex items-center gap-1 text-[9px] font-bold text-green-500/80 uppercase">
                        <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse"></div> New
                      </span>
                    )}
                  </div>
                </div>
                {!notif.isRead && (
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <Eye className="w-4 h-4 text-gray-500 hover:text-white" />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-4 bg-white/[0.01] border-t border-white/5 text-center">
        <button className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 hover:text-white transition-all">
          View all activity
        </button>
      </div>
    </div>
  );
};

export default NotificationCenter;
