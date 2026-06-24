import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Shield, LogIn, Edit2, Save, X } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Settings = () => {
  const { admin, updateAdmin } = useAuth();
  
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(admin?.name || '');
  const [email, setEmail] = useState(admin?.email || '');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!name || !email) {
      toast.error('Name and email are required');
      return;
    }
    
    setLoading(true);
    try {
      const { data } = await axios.put(`${API_URL}/auth/profile/${admin.id}`, { name, email });
      updateAdmin(data.token, data.admin);
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div className="bg-slate-card p-8 rounded-xl border border-slate-700 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Admin Profile</h2>
          {!isEditing ? (
            <button 
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 bg-slate-card hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-slate-700"
            >
              <Edit2 size={16} /> Edit Profile
            </button>
          ) : (
            <div className="flex gap-2">
              <button 
                onClick={() => setIsEditing(false)}
                className="flex items-center gap-2 bg-slate-card hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-slate-700"
              >
                <X size={16} /> Cancel
              </button>
              <button 
                onClick={handleSave}
                disabled={loading}
                className="flex items-center gap-2 bg-electric-blue hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                <Save size={16} /> {loading ? 'Saving...' : 'Save'}
              </button>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-6 mb-8 pb-8 border-b border-slate-700">
          <div className="w-24 h-24 rounded-full bg-electric-blue flex items-center justify-center text-white text-4xl font-bold shadow-lg">
            {admin?.name?.charAt(0) || 'A'}
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">{admin?.name || 'Admin User'}</h3>
            <p className="text-slate-400 text-sm mt-1 flex items-center gap-2">
              <Shield size={14} className="text-electric-blue" />
              System Administrator
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Full Name</label>
              <div className={`flex items-center gap-3 px-4 py-3 rounded-lg border transition-all ${isEditing ? 'bg-slate-card border-electric-blue/50' : 'bg-slate-card/50 border-slate-700/50'}`}>
                <User size={18} className={isEditing ? 'text-electric-blue' : 'text-slate-500'} />
                {isEditing ? (
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-transparent border-none outline-none text-white w-full"
                  />
                ) : (
                  <span className="text-white">{admin?.name || 'N/A'}</span>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Email Address</label>
              <div className={`flex items-center gap-3 px-4 py-3 rounded-lg border transition-all ${isEditing ? 'bg-slate-card border-electric-blue/50' : 'bg-slate-card/50 border-slate-700/50'}`}>
                <Mail size={18} className={isEditing ? 'text-electric-blue' : 'text-slate-500'} />
                {isEditing ? (
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-transparent border-none outline-none text-white w-full"
                  />
                ) : (
                  <span className="text-white">{admin?.email || 'N/A'}</span>
                )}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Account ID</label>
            <div className="flex items-center gap-3 bg-slate-card/50 px-4 py-3 rounded-lg border border-slate-700/50 text-slate-300 font-mono text-sm">
              <LogIn size={18} className="text-slate-500" />
              {admin?.id || 'N/A'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
