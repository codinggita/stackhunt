import { ArrowRight, Github, Zap, Shield, Rocket } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative pt-12 text-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-500/10 blur-[120px] rounded-full -z-10"></div>
        
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none">
          FUELING <br />
          <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            OPEN SOURCE
          </span>
        </h1>
        
        <p className="mt-8 text-xl text-gray-400 max-w-2xl mx-auto">
          The premium marketplace where top developers solve impactful issues and get rewarded in real-time.
        </p>

        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6">
          <Link to="/marketplace" className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 rounded-2xl font-bold text-lg transition-all transform hover:scale-105 flex items-center gap-3">
            Explore Bounties <ArrowRight className="w-5 h-5" />
          </Link>
          <Link to="/signup" className="px-8 py-4 glass hover:bg-white/10 rounded-2xl font-bold text-lg transition-all border border-white/10">
            For Companies
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
        {[
          { label: 'Total Bounties', value: '$240,000+' },
          { label: 'Developers', value: '12,000+' },
          { label: 'Open Issues', value: '840+' },
          { label: 'PRs Merged', value: '4,200+' },
        ].map((stat, i) => (
          <div key={i} className="glass-card p-8 text-center">
            <p className="text-3xl font-black bg-gradient-to-br from-white to-gray-500 bg-clip-text text-transparent">{stat.value}</p>
            <p className="text-xs text-gray-500 uppercase tracking-widest mt-2">{stat.label}</p>
          </div>
        ))}
      </section>

      {/* Features Section */}
      <section className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {[
          { icon: Zap, title: 'Instant Payouts', desc: 'Get paid immediately upon PR acceptance via Stripe integration.' },
          { icon: Shield, title: 'Verified PRs', desc: 'Secure verification flow handled by repository maintainers.' },
          { icon: Github, title: 'GitHub Sync', desc: 'Connect your repos and fetch issues automatically.' },
        ].map((feature, i) => (
          <div key={i} className="group p-8 rounded-3xl border border-white/5 bg-white/2 hover:border-indigo-500/30 transition-all cursor-default">
            <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-6 text-indigo-500 group-hover:bg-indigo-500 group-hover:text-white transition-all">
              <feature.icon className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
            <p className="text-gray-400 leading-relaxed text-sm">{feature.desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Home;
