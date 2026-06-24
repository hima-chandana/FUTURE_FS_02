import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, Phone, Building, Briefcase, Calendar, MessageSquare, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const statusColors = {
  'New': 'bg-blue-500 text-white',
  'Contacted': 'bg-amber-500 text-white',
  'Qualified': 'bg-purple-500 text-white',
  'Proposal Sent': 'bg-indigo-500 text-white',
  'Converted': 'bg-emerald-500 text-white',
  'Closed': 'bg-rose-500 text-white',
};

const LeadDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { admin } = useAuth();
  
  const [lead, setLead] = useState(null);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [newNote, setNewNote] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);

  const fetchLeadData = async () => {
    try {
      const [leadRes, notesRes] = await Promise.all([
        axios.get(`${API_URL}/leads/${id}`),
        axios.get(`${API_URL}/notes/lead/${id}`)
      ]);
      setLead(leadRes.data);
      setNotes(notesRes.data);
    } catch (error) {
      toast.error('Failed to load lead details');
      navigate('/admin/leads');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeadData();
  }, [id]);

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    try {
      await axios.put(`${API_URL}/leads/${id}`, { status: newStatus });
      setLead({ ...lead, status: newStatus });
      toast.success('Status updated');
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    setIsAddingNote(true);
    
    try {
      const res = await axios.post(`${API_URL}/notes/lead/${id}`, {
        content: newNote,
        adminName: admin?.name || 'Admin'
      });
      setNotes([res.data, ...notes]);
      setNewNote('');
      toast.success('Note added');
    } catch (error) {
      toast.error('Failed to add note');
    } finally {
      setIsAddingNote(false);
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (window.confirm('Delete this note?')) {
      try {
        await axios.delete(`${API_URL}/notes/${noteId}`);
        setNotes(notes.filter(n => n.id !== noteId));
        toast.success('Note deleted');
      } catch (error) {
        toast.error('Failed to delete note');
      }
    }
  };

  if (loading) return <div className="text-center py-12 text-slate-400 animate-pulse">Loading lead details...</div>;
  if (!lead) return null;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <button 
        onClick={() => navigate('/admin/leads')}
        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft size={16} /> Back to Leads
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Lead Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-card p-6 rounded-xl border border-slate-700 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold text-white">{lead.name}</h2>
              <select 
                value={lead.status}
                onChange={handleStatusChange}
                className={`text-xs font-semibold px-3 py-1.5 rounded-full appearance-none cursor-pointer outline-none ${statusColors[lead.status] || 'bg-slate-700 text-white'}`}
              >
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Qualified">Qualified</option>
                <option value="Proposal Sent">Proposal Sent</option>
                <option value="Converted">Converted</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
            
            <div className="space-y-4 mt-6">
              <div className="flex items-center gap-3 text-slate-300">
                <Mail size={18} className="text-slate-500" />
                <a href={`mailto:${lead.email}`} className="hover:text-electric-blue transition-colors">{lead.email}</a>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <Phone size={18} className="text-slate-500" />
                <a href={`tel:${lead.phone}`} className="hover:text-electric-blue transition-colors">{lead.phone}</a>
              </div>
              {lead.company && (
                <div className="flex items-center gap-3 text-slate-300">
                  <Building size={18} className="text-slate-500" />
                  <span>{lead.company}</span>
                </div>
              )}
              <div className="flex items-center gap-3 text-slate-300">
                <Briefcase size={18} className="text-slate-500" />
                <span>{lead.serviceRequired}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <Calendar size={18} className="text-slate-500" />
                <span>Added: {new Date(lead.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-card p-6 rounded-xl border border-slate-700 shadow-sm">
            <h3 className="font-semibold text-white mb-3">Initial Message</h3>
            <p className="text-slate-300 text-sm whitespace-pre-wrap bg-slate-card/50 p-4 rounded-lg border border-slate-700/50">
              {lead.message}
            </p>
          </div>
        </div>

        {/* Right Column - Notes */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-card p-6 rounded-xl border border-slate-700 shadow-sm flex flex-col h-full">
            <div className="flex items-center gap-2 mb-6">
              <MessageSquare size={20} className="text-electric-blue" />
              <h3 className="text-lg font-bold text-white">Communication Notes</h3>
            </div>

            <form onSubmit={handleAddNote} className="mb-8">
              <div className="flex gap-3">
                <input 
                  type="text" 
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add a new note..."
                  className="flex-1 bg-slate-card border border-slate-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-electric-blue transition-colors"
                />
                <button 
                  type="submit"
                  disabled={isAddingNote || !newNote.trim()}
                  className="bg-electric-blue hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  <Plus size={16} /> Add
                </button>
              </div>
            </form>

            <div className="flex-1 space-y-4">
              {notes.length === 0 ? (
                <p className="text-center text-slate-500 text-sm py-8">No notes added yet.</p>
              ) : (
                notes.map(note => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={note.id} 
                    className="bg-slate-card/50 p-4 rounded-lg border border-slate-700/50 group relative"
                  >
                    <button 
                      onClick={() => handleDeleteNote(note.id)}
                      className="absolute top-4 right-4 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      Delete
                    </button>
                    <p className="text-slate-200 text-sm whitespace-pre-wrap pr-12">{note.content}</p>
                    <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                      <span className="font-medium text-slate-400">{note.adminName}</span>
                      <span>•</span>
                      <span>{new Date(note.createdAt).toLocaleString()}</span>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadDetails;
