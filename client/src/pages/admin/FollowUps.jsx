import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, CheckCircle2, Clock, Plus, Trash2, Edit } from 'lucide-react';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const FollowUps = () => {
  const [followUps, setFollowUps] = useState([]);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    leadId: '',
    date: '',
    time: '',
    purpose: '',
    notes: ''
  });

  const fetchData = async () => {
    try {
      const [followUpsRes, leadsRes] = await Promise.all([
        axios.get(`${API_URL}/followups`),
        axios.get(`${API_URL}/leads`)
      ]);
      setFollowUps(followUpsRes.data);
      setLeads(leadsRes.data);
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getLeadName = (leadId) => {
    const lead = leads.find(l => l.id === leadId);
    return lead ? lead.name : 'Unknown Lead';
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/followups`, formData);
      setFollowUps([...followUps, res.data]);
      setIsModalOpen(false);
      setFormData({ leadId: '', date: '', time: '', purpose: '', notes: '' });
      toast.success('Follow-up scheduled');
    } catch (error) {
      toast.error('Failed to schedule follow-up');
    }
  };

  const handleStatusToggle = async (followUp) => {
    const newStatus = followUp.status === 'Completed' ? 'Pending' : 'Completed';
    try {
      await axios.put(`${API_URL}/followups/${followUp.id}`, { status: newStatus });
      setFollowUps(followUps.map(f => f.id === followUp.id ? { ...f, status: newStatus } : f));
      toast.success(`Follow-up marked as ${newStatus}`);
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this follow-up?')) {
      try {
        await axios.delete(`${API_URL}/followups/${id}`);
        setFollowUps(followUps.filter(f => f.id !== id));
        toast.success('Follow-up deleted');
      } catch (error) {
        toast.error('Failed to delete');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">Upcoming Follow-Ups</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-electric-blue hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
        >
          <Plus size={16} /> Schedule
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <p className="text-slate-400">Loading follow-ups...</p>
        ) : followUps.length === 0 ? (
          <p className="text-slate-400">No upcoming follow-ups.</p>
        ) : (
          followUps.map(followUp => (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              key={followUp.id}
              className={`bg-slate-card p-6 rounded-xl border ${followUp.status === 'Completed' ? 'border-emerald-500/30 opacity-75' : 'border-slate-700'} shadow-sm relative group`}
            >
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleDelete(followUp.id)} className="text-slate-400 hover:text-red-400 transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="flex items-center justify-between mb-4 pr-8">
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${followUp.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                  {followUp.status}
                </span>
                <button onClick={() => handleStatusToggle(followUp)} className="text-slate-400 hover:text-white transition-colors" title="Toggle Status">
                  {followUp.status === 'Completed' ? <CheckCircle2 size={20} className="text-emerald-500" /> : <Clock size={20} />}
                </button>
              </div>

              <h3 className="text-lg font-bold text-white mb-1">{getLeadName(followUp.leadId)}</h3>
              <p className="text-electric-blue text-sm font-medium mb-4">{followUp.purpose}</p>

              <div className="space-y-2 text-sm text-slate-300">
                <div className="flex items-center gap-2">
                  <CalendarIcon size={16} className="text-slate-500" />
                  <span>{new Date(followUp.date).toLocaleDateString()} at {followUp.time}</span>
                </div>
                {followUp.notes && (
                  <p className="bg-slate-card/50 p-3 rounded-lg mt-3 text-slate-400 border border-slate-700/50">
                    {followUp.notes}
                  </p>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-card w-full max-w-md rounded-2xl border border-slate-700 shadow-2xl overflow-hidden"
          >
            <div className="p-6 border-b border-slate-700 flex justify-between items-center">
              <h3 className="text-lg font-bold text-white">Schedule Follow-up</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">&times;</button>
            </div>
            <div className="p-6">
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Select Lead *</label>
                  <select required value={formData.leadId} onChange={e => setFormData({...formData, leadId: e.target.value})} className="w-full bg-slate-card border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-electric-blue outline-none appearance-none">
                    <option value="" disabled>Select a lead</option>
                    {leads.map(l => (
                      <option key={l.id} value={l.id}>{l.name}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Date *</label>
                    <input required type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full bg-slate-card border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-electric-blue outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Time *</label>
                    <input required type="time" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} className="w-full bg-slate-card border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-electric-blue outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Purpose *</label>
                  <input required type="text" placeholder="e.g. Product Demo" value={formData.purpose} onChange={e => setFormData({...formData, purpose: e.target.value})} className="w-full bg-slate-card border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-electric-blue outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Notes</label>
                  <textarea rows="3" value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} className="w-full bg-slate-card border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-electric-blue outline-none"></textarea>
                </div>
                <div className="pt-4 flex justify-end gap-3">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-300 hover:text-white">Cancel</button>
                  <button type="submit" className="bg-electric-blue hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors">Schedule</button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default FollowUps;
