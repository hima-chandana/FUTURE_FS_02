import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, MoreVertical, Eye, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const statusColors = {
  'New': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  'Contacted': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  'Qualified': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  'Proposal Sent': 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  'Converted': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  'Closed': 'bg-rose-500/10 text-rose-400 border-rose-500/20',
};

const Leads = () => {
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const fetchLeads = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/leads`);
      setLeads(data);
    } catch (error) {
      toast.error('Failed to fetch leads');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      try {
        await axios.delete(`${API_URL}/leads/${id}`);
        setLeads(leads.filter(lead => lead.id !== id));
        toast.success('Lead deleted successfully');
      } catch (error) {
        toast.error('Failed to delete lead');
      }
    }
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (lead.company && lead.company.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter ? lead.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Bar Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-slate-card p-4 rounded-xl border border-slate-700">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Search leads by name, email, or company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-card border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-electric-blue transition-all"
          />
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-48">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-slate-card border border-slate-700 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-electric-blue transition-all appearance-none"
            >
              <option value="">All Statuses</option>
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Qualified">Qualified</option>
              <option value="Proposal Sent">Proposal Sent</option>
              <option value="Converted">Converted</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-card rounded-xl border border-slate-700 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-card/50 text-slate-400 uppercase font-medium">
              <tr>
                <th className="px-6 py-4">Lead</th>
                <th className="px-6 py-4">Company</th>
                <th className="px-6 py-4">Source</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date Added</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-400">
                    Loading leads...
                  </td>
                </tr>
              ) : filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-400">
                    No leads found.
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                  <motion.tr 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    key={lead.id} 
                    className="hover:bg-slate-card/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium text-white">{lead.name}</div>
                      <div className="text-slate-400 text-xs mt-0.5">{lead.email}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-300">
                      {lead.company || '-'}
                    </td>
                    <td className="px-6 py-4 text-slate-300">
                      {lead.source}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${statusColors[lead.status] || statusColors['New']}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end items-center gap-2">
                        <button 
                          onClick={() => navigate(`/admin/leads/${lead.id}`)}
                          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded transition-colors"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(lead.id)}
                          className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Leads;
