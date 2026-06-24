import { motion } from 'framer-motion';
import { ArrowRight, BarChart3, Users, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="flex flex-col gap-24 py-12">
      {/* Hero Section */}
      <section className="text-center space-y-8">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-7xl font-extrabold tracking-tight"
        >
          Manage Leads with <span className="text-electric-blue">Precision</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl text-slate-400 max-w-2xl mx-auto"
        >
          A modern CRM built for speed and simplicity. Capture, track, and convert your leads effortlessly.
        </motion.p>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center gap-4"
        >
          <Link to="/contact" className="bg-electric-blue hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2">
            Get Started <ArrowRight size={20} />
          </Link>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="grid md:grid-cols-3 gap-8">
        <FeatureCard 
          icon={<Users className="text-electric-blue" size={32} />}
          title="Lead Tracking"
          description="Keep all your contacts organized. Track status and history in one place."
        />
        <FeatureCard 
          icon={<Zap className="text-electric-blue" size={32} />}
          title="Lightning Fast"
          description="Built on modern architecture ensuring your team operates at maximum speed."
        />
        <FeatureCard 
          icon={<BarChart3 className="text-electric-blue" size={32} />}
          title="Analytics"
          description="Real-time insights and conversion rates to help you make better decisions."
        />
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-slate-card p-6 rounded-xl border border-slate-700 shadow-lg"
  >
    <div className="bg-slate-card w-14 h-14 rounded-lg flex items-center justify-center mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-slate-400">{description}</p>
  </motion.div>
);

export default Landing;
