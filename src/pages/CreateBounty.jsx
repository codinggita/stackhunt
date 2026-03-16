import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Terminal, Send, Github, DollarSign, Tag, Calendar, AlertCircle } from 'lucide-react';
import axios from 'axios';

const CreateBounty = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    reward: '',
    difficulty: 'easy',
    repoLink: '',
    tags: '',
    deadline: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const user = JSON.parse(localStorage.getItem('stackhunt_user'));
      await axios.post('http://localhost:5000/api/bounties', {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()),
        reward: Number(formData.reward)
      }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create bounty');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Post a New Bounty</h1>
          <p className="text-gray-400 mt-1">Incentivize developers to solve your most critical issues.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-indigo-500/10 rounded-xl text-indigo-400 border border-indigo-500/20">
          <Terminal className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-widest">Company Dashboard</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="glass-card p-8 space-y-6">
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/50 text-red-500 text-sm rounded-xl flex items-center gap-3">
                <AlertCircle className="w-5 h-5" /> {error}
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 pl-1">Issue Title</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g., Optimize database queries for analytics dashboard"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 transition-all text-sm"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 pl-1">Description</label>
                <textarea 
                  required
                  rows="5"
                  placeholder="Describe the issue, requirements, and expected outcome..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 transition-all text-sm resize-none"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-500 pl-1">Bounty Reward (USD)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                    <input 
                      type="number" 
                      required
                      placeholder="500"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-10 py-3 outline-none focus:border-indigo-500 transition-all text-sm"
                      value={formData.reward}
                      onChange={(e) => setFormData({...formData, reward: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-500 pl-1">Difficulty</label>
                  <select 
                    className="w-full bg-[#0b0b0b] border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 transition-all text-sm"
                    value={formData.difficulty}
                    onChange={(e) => setFormData({...formData, difficulty: e.target.value})}
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 pl-1">GitHub Repository Link</label>
                <div className="relative">
                  <Github className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                  <input 
                    type="url" 
                    required
                    placeholder="https://github.com/org/repo/issues/1"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-10 py-3 outline-none focus:border-indigo-500 transition-all text-sm"
                    value={formData.repoLink}
                    onChange={(e) => setFormData({...formData, repoLink: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-500 pl-1">Tags (Comma separated)</label>
                  <div className="relative">
                    <Tag className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                    <input 
                      type="text" 
                      placeholder="React, MongoDB, Node.js"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-10 py-3 outline-none focus:border-indigo-500 transition-all text-sm"
                      value={formData.tags}
                      onChange={(e) => setFormData({...formData, tags: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-500 pl-1">Deadline</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                    <input 
                      type="date" 
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-10 py-3 outline-none focus:border-indigo-500 transition-all text-sm"
                      value={formData.deadline}
                      onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            </div>

            <button 
              disabled={loading}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-xl font-bold transition-all transform hover:scale-[1.01] flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20"
            >
              {loading ? "Posting..." : "Post Bounty"} <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

        <div className="space-y-6">
          <div className="glass-card p-6 space-y-4">
            <h3 className="font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-indigo-400" /> Posting Guidelines
            </h3>
            <ul className="space-y-3 text-xs text-gray-400 list-disc pl-4">
              <li>Verified GitHub repo link is mandatory.</li>
              <li>Provide clear implementation details.</li>
              <li>Set a realistic reward and deadline.</li>
              <li>Funds will be held in escrow via Stripe.</li>
            </ul>
          </div>

          <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-600 to-indigo-800 text-white space-y-4 shadow-xl shadow-indigo-500/10">
            <h3 className="font-bold">Bounty Calculator</h3>
            <p className="text-xs opacity-80">Estimated reach for your bounty based on the reward.</p>
            <div className="space-y-4 pt-2">
              <div className="flex justify-between items-center border-b border-white/10 pb-2">
                <span className="text-sm">Reach</span>
                <span className="font-bold">2,400+ Devs</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/10 pb-2">
                <span className="text-sm">Difficulty</span>
                <span className="font-bold uppercase tracking-widest text-[10px]">{formData.difficulty}</span>
              </div>
              <p className="text-[10px] opacity-70 italic text-center">Increase reward to reach more top-tier developers.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateBounty;
