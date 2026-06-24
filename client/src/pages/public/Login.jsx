import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { LogIn, Layers, UserPlus, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  
  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (isLogin) {
        // Handle Login
        const response = await axios.post(`${API_URL}/auth/login`, { email, password });
        login(response.data.token, response.data.admin);
        toast.success('Logged in successfully!');
        navigate('/admin/dashboard');
      } else {
        // Handle Register
        await axios.post(`${API_URL}/auth/register`, { name, email, password });
        toast.success('Admin account created! Please log in.');
        setIsLogin(true); // Switch to login view
      }
    } catch (error) {
      toast.error(error.response?.data?.message || `${isLogin ? 'Login' : 'Registration'} failed.`);
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-dark p-4 relative">
      <Link 
        to="/" 
        className="absolute top-8 left-8 flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft size={20} />
        Back to Website
      </Link>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-slate-card w-full max-w-md p-8 rounded-2xl border border-slate-700 shadow-2xl"
      >
        <div className="flex justify-center mb-6">
          <div className="bg-slate-card p-3 rounded-xl border border-slate-700">
            <Layers className="text-electric-blue" size={32} />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-center text-white mb-2">
          {isLogin ? 'Admin Login' : 'Create Admin Account'}
        </h2>
        <p className="text-slate-400 text-center mb-8">
          {isLogin ? 'Enter your credentials to access the CRM' : 'Sign up to create your first admin account'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
              <input 
                required 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                className="w-full bg-slate-card border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-electric-blue transition-all" 
                placeholder="Admin Name" 
              />
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
            <input 
              required 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="w-full bg-slate-card border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-electric-blue transition-all" 
              placeholder="admin@example.com" 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
            <input 
              required 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="w-full bg-slate-card border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-electric-blue transition-all" 
              placeholder="••••••••" 
            />
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-electric-blue hover:bg-blue-600 text-white font-semibold py-3 rounded-lg flex justify-center items-center gap-2 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? (isLogin ? 'Authenticating...' : 'Creating...') : (
              <>
                {isLogin ? 'Sign In' : 'Sign Up'} {isLogin ? <LogIn size={20} /> : <UserPlus size={20} />}
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button 
            onClick={() => {
              setIsLogin(!isLogin);
              setName('');
              setEmail('');
              setPassword('');
            }}
            className="text-slate-400 hover:text-white transition-colors text-sm"
          >
            {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
