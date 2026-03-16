import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Github, Mail, Lock, User, Briefcase, ArrowRight } from 'lucide-react';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'developer'
  });
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to sign up');
    }
  };

  const roles = [
    { value: 'developer', label: 'Developer', desc: 'Browse and solve bounties' },
    { value: 'company', label: 'Company', desc: 'Post and fund issues' },
    { value: 'maintainer', label: 'Maintainer', desc: 'Review submissions' }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] p-4 py-8 font-sans">
      <div className="max-w-xl w-full bg-[#0a0a0a] border border-white/5 rounded-[32px] p-8 space-y-8 shadow-2xl relative overflow-hidden">
        {/* Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="text-3xl font-black bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            StackHunt
          </Link>
          <h2 className="text-3xl font-black text-white px-4 leading-tight">Create your account</h2>
          <p className="text-gray-500 text-sm">Join the open source marketplace for the best developers.</p>
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/50 text-red-500 text-xs rounded-xl">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-3.5 w-4 h-4 text-gray-600" />
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="John Doe"
                  className="w-full bg-[#121212] border border-white/10 rounded-xl px-12 py-3 outline-none focus:border-white/30 transition-all text-sm text-white placeholder:text-gray-700"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 w-4 h-4 text-gray-600" />
                <input 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="name@company.com"
                  className="w-full bg-[#121212] border border-white/10 rounded-xl px-12 py-3 outline-none focus:border-white/30 transition-all text-sm text-white placeholder:text-gray-700"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 w-4 h-4 text-gray-600" />
              <input 
                type="password" 
                required
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                placeholder="••••••••"
                className="w-full bg-[#121212] border border-white/10 rounded-xl px-12 py-3 outline-none focus:border-white/30 transition-all text-sm text-white placeholder:text-gray-700"
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-bold text-gray-300 uppercase tracking-widest pl-1">Select Role</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {roles.map((role) => (
                <button
                  key={role.value}
                  type="button"
                  onClick={() => setFormData({...formData, role: role.value})}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    formData.role === role.value 
                    ? 'border-indigo-600 bg-indigo-600/10 ring-1 ring-indigo-600 shadow-lg shadow-indigo-600/5' 
                    : 'border-white/5 bg-[#121212] hover:border-white/10'
                  }`}
                >
                  <p className={`text-sm font-black ${formData.role === role.value ? 'text-indigo-400' : 'text-white'}`}>
                    {role.label}
                  </p>
                  <p className="text-[10px] text-gray-500 mt-1 font-medium leading-tight">{role.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <button className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 rounded-2xl font-black text-base transition-all transform active:scale-[0.98] flex items-center justify-center gap-3 shadow-[0_0_40px_rgba(79,70,229,0.2)]">
            Create Account <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        <div className="text-center">
          <p className="text-gray-600 text-xs font-bold">
            Already have an account? <Link to="/login" className="text-white hover:text-indigo-400 ml-1 transition-colors">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
