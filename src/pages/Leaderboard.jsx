import { useState, useEffect } from 'react';
import axios from 'axios';
import { Trophy, TrendingUp, DollarSign, Award, Star } from 'lucide-react';
import { leaderboardAPI } from '../api';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';

const Leaderboard = () => {
  const [developers, setDevelopers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { socket } = useSocket();
  const { user } = useAuth();

  const fetchLeaderboard = async () => {
    try {
      const res = await leaderboardAPI.getTop();
      setDevelopers(res.data);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();

    if (socket) {
      socket.on('leaderboardUpdate', fetchLeaderboard);
      return () => socket.off('leaderboardUpdate', fetchLeaderboard);
    }
  }, [socket]);

  const userRank = developers.findIndex(d => d._id === user?._id || d._id === user?.id) + 1;
  const topThree = developers.slice(0, 3);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="relative p-12 glass-card overflow-hidden border-indigo-500/20 shadow-2xl shadow-indigo-500/5 rounded-[40px]">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/10 blur-[120px] rounded-full"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-500/10 blur-[120px] rounded-full"></div>
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-12">
          <div className="max-w-xl">
            <h1 className="text-5xl font-black bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">Top Talent</h1>
            <p className="text-gray-400 mt-4 text-xl font-medium leading-relaxed">Recognizing the most impactful contributors driving innovation in the open source ecosystem.</p>
            
            <div className="flex gap-4 mt-8">
               <div className="text-center bg-white/5 backdrop-blur-md p-5 rounded-[24px] min-w-[140px] border border-white/10 relative group hover:border-indigo-500/30 transition-all">
                  <Trophy className="w-6 h-6 text-yellow-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <p className="text-[10px] text-gray-500 uppercase font-black tracking-[0.2em]">Global Rank</p>
                  <p className="text-2xl font-black mt-1 text-white">{userRank > 0 ? `#${userRank}` : 'N/A'}</p>
               </div>
               <div className="text-center bg-white/5 backdrop-blur-md p-5 rounded-[24px] min-w-[140px] border border-white/10 relative group hover:border-indigo-500/30 transition-all">
                  <Award className="w-6 h-6 text-indigo-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <p className="text-[10px] text-gray-500 uppercase font-black tracking-[0.2em]">Reputation</p>
                  <p className="text-2xl font-black mt-1 text-white">
                    {developers.find(d => (d._id === user?._id || d._id === user?.id))?.reputation?.toLocaleString() || 0}
                  </p>
               </div>
            </div>
          </div>

          <div className="flex items-end gap-4 pb-4">
             {topThree.map((dev, i) => (
                <div key={dev._id} className={`flex flex-col items-center gap-3 ${i === 0 ? 'order-2' : i === 1 ? 'order-1' : 'order-3'}`}>
                   <div className="relative group">
                      <div className={`absolute inset-0 rounded-full blur-md opacity-50 group-hover:opacity-80 transition-opacity ${i === 0 ? 'bg-yellow-500' : i === 1 ? 'bg-gray-400' : 'bg-amber-700'}`}></div>
                      <div className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 p-1 ${i === 0 ? 'border-yellow-500 w-24 h-24 sm:w-28 sm:h-28' : i === 1 ? 'border-gray-400' : 'border-amber-700'}`}>
                         <div className="w-full h-full rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center overflow-hidden border border-white/10">
                            {dev.avatar ? (
                               <img src={dev.avatar} alt={dev.name} className="w-full h-full object-cover" />
                            ) : (
                               <span className={`font-black text-2xl ${i === 0 ? 'text-yellow-500 text-4xl' : i === 1 ? 'text-gray-400' : 'text-amber-700'}`}>
                                  {dev.name[0].toUpperCase()}
                               </span>
                            )}
                         </div>
                         <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full flex items-center justify-center font-black text-xs border-2 border-black ${i === 0 ? 'bg-yellow-500 text-black' : i === 1 ? 'bg-gray-400 text-black' : 'bg-amber-700 text-white'}`}>
                            {i + 1}
                         </div>
                      </div>
                   </div>
                   <p className="text-[10px] font-black uppercase tracking-widest text-white/60">{dev.name.split(' ')[0]}</p>
                </div>
             ))}
          </div>
        </div>
      </div>

      <div className="glass-card overflow-hidden border border-white/5 rounded-3xl">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/5 bg-white/[0.02]">
              <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">Developer</th>
              <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-500 text-center">Reputation</th>
              <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-500 text-center">Earnings</th>
              <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">Main Skills</th>
              <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-500 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {developers.map((dev, i) => (
              <tr key={dev._id} className="hover:bg-white/[0.02] transition-colors group">
                <td className="px-8 py-5">
                  <div className="flex items-center gap-4">
                    <span className={`text-lg font-black w-6 text-center ${i < 3 ? 'text-indigo-400' : 'text-gray-600'}`}>0{i + 1}</span>
                    <div className="w-10 h-10 rounded-full bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center font-bold text-indigo-400 overflow-hidden">
                      {dev.avatar ? (
                        <img src={dev.avatar} alt={dev.name} className="w-full h-full object-cover" />
                      ) : (
                        dev.name.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div>
                      <p className="font-bold group-hover:text-indigo-400 transition-colors uppercase tracking-tight">{dev.name}</p>
                      <div className="flex items-center gap-1 text-[10px] text-green-500 mt-0.5">
                        <TrendingUp className="w-3 h-3" /> Trending Up
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-5 text-center font-black text-gray-300">
                  {dev.reputation.toLocaleString()}
                </td>
                <td className="px-8 py-5 text-center">
                  <span className="text-indigo-400 font-bold flex items-center justify-center gap-1">
                    <DollarSign className="w-3 h-3" /> {dev.earnings.toLocaleString()}
                  </span>
                </td>
                <td className="px-8 py-5">
                  <div className="flex gap-2 flex-wrap max-w-xs">
                    {dev.skills && dev.skills.length > 0 ? dev.skills.map(skill => (
                      <span key={skill} className="text-[10px] px-2 py-1 bg-white/5 rounded-md text-gray-500">{skill}</span>
                    )) : (
                      <span className="text-[10px] text-gray-600 italic">No skills listed</span>
                    )}
                  </div>
                </td>
                <td className="px-8 py-5 text-right">
                  <button className="text-xs font-bold text-gray-500 hover:text-white transition-colors">View Profile</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;
