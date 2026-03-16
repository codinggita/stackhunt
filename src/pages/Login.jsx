import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, Briefcase, Shield, Target, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Login = () => {
  const [role, setRole] = useState('developer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password, role);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login');
    }
  };

  const roles = [
    { value: 'developer', label: 'Developer', icon: User, placeholder: 'name@developer.com' },
    { value: 'company', label: 'Company', icon: Briefcase, placeholder: 'hr@company.com' },
    { value: 'maintainer', label: 'Maintainer', icon: Shield, placeholder: 'admin@repo.org' }
  ];

  const currentRole = roles.find(r => r.value === role) || roles[0];

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#050505] relative overflow-hidden font-sans">
      {/* Background Gradients & Animated Shapes */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/20 blur-[120px] rounded-full animate-pulse-glow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/20 blur-[120px] rounded-full animate-pulse-glow delay-2000" />
        
        {/* Floating Code Bits / Shapes */}
        <motion.div 
          animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 right-[15%] text-purple-500/20 text-xs font-mono hidden md:block"
        >
          {"<stackhunt />"}
        </motion.div>
        <motion.div 
          animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-40 left-[10%] text-blue-500/20 text-xs font-mono hidden md:block"
        >
          {"const bounty = await hunt();"}
        </motion.div>
      </div>

      {/* Main Content */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md px-4"
      >
        <div className="glass-card p-8 md:p-10 rounded-[32px] shadow-2xl space-y-8 relative border border-white/10">
          {/* Logo & Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 shadow-lg shadow-purple-500/20 mb-2">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div className="space-y-1">
              <h1 className="text-3xl font-black text-white tracking-tight">Welcome Back</h1>
              <p className="text-gray-400 text-sm">Sign in to continue hunting open-source bounties.</p>
            </div>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-xs rounded-xl text-center"
            >
              {error}
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Role Tabs */}
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] ml-1">Account Type</label>
              <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5 backdrop-blur-sm">
                {roles.map((r) => {
                  const Icon = r.icon;
                  return (
                    <button
                      key={r.value}
                      type="button"
                      onClick={() => setRole(r.value)}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold transition-all duration-300 ${
                        role === r.value 
                        ? 'bg-white/10 text-white shadow-[0_0_20px_rgba(255,255,255,0.05)] border border-white/10' 
                        : 'text-gray-500 hover:text-gray-300'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">{r.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Inputs */}
            <div className="space-y-4">
              <div className="group space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] ml-1">Email</label>
                <div className="relative group/input">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within/input:text-purple-500 transition-colors">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={currentRole.placeholder}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-12 py-4 outline-none focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/10 hover:bg-white/[0.07] transition-all text-sm text-white placeholder:text-gray-600"
                  />
                </div>
              </div>

              <div className="group space-y-2">
                <div className="flex items-center justify-between ml-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Password</label>
                  <Link to="#" className="text-[10px] font-bold text-purple-400 hover:text-purple-300 transition-colors uppercase tracking-[0.1em]">Forgot?</Link>
                </div>
                <div className="relative group/input">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within/input:text-purple-500 transition-colors">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input 
                    type="password" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-12 py-4 outline-none focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/10 hover:bg-white/[0.07] transition-all text-sm text-white placeholder:text-gray-600"
                  />
                </div>
              </div>
            </div>

            <button className="w-full relative group overflow-hidden py-4 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl font-bold text-sm text-white transition-all transform active:scale-95 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40">
              <div className="relative z-10 flex items-center justify-center gap-2">
                Sign in <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </form>

          {/* Footer */}
          <div className="text-center pt-4">
            <p className="text-gray-500 text-xs font-medium">
              New to Stackhunt? <Link to="/signup" className="text-white hover:text-purple-400 transition-colors underline-offset-4 hover:underline">Create an account</Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
