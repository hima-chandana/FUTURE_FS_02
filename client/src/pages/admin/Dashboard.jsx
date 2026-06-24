import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Users, CheckCircle2, PhoneCall, TrendingUp, Inbox, CalendarCheck } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    contacted: 0,
    qualified: 0,
    converted: 0,
    closed: 0
  });
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/leads`);
        
        let counts = {
          total: data.length,
          new: 0,
          contacted: 0,
          qualified: 0,
          converted: 0,
          closed: 0
        };

        data.forEach(lead => {
          const status = lead.status.toLowerCase();
          if (counts[status] !== undefined) {
            counts[status]++;
          }
        });

        setStats(counts);

        const chart = [
          { name: 'New', value: counts.new, color: '#3b82f6' },
          { name: 'Contacted', value: counts.contacted, color: '#f59e0b' },
          { name: 'Qualified', value: counts.qualified, color: '#8b5cf6' },
          { name: 'Converted', value: counts.converted, color: '#10b981' },
          { name: 'Closed', value: counts.closed, color: '#ef4444' },
        ];
        
        setChartData(chart);
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statCards = [
    { title: 'Total Leads', value: stats.total, icon: <Users size={24} />, color: 'bg-electric-blue' },
    { title: 'New Leads', value: stats.new, icon: <Inbox size={24} />, color: 'bg-blue-400' },
    { title: 'Contacted', value: stats.contacted, icon: <PhoneCall size={24} />, color: 'bg-amber-500' },
    { title: 'Qualified', value: stats.qualified, icon: <CheckCircle2 size={24} />, color: 'bg-purple-500' },
    { title: 'Converted', value: stats.converted, icon: <TrendingUp size={24} />, color: 'bg-emerald-500' },
    { title: 'Closed', value: stats.closed, icon: <CalendarCheck size={24} />, color: 'bg-rose-500' },
  ];

  if (loading) {
    return <div className="animate-pulse space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-32 bg-slate-card rounded-xl"></div>
        ))}
      </div>
      <div className="h-96 bg-slate-card rounded-xl"></div>
    </div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-slate-card p-6 rounded-xl border border-slate-700 shadow-sm flex items-center gap-4"
          >
            <div className={`${card.color} w-14 h-14 rounded-xl flex items-center justify-center text-white shadow-lg`}>
              {card.icon}
            </div>
            <div>
              <p className="text-slate-400 text-sm font-medium">{card.title}</p>
              <h3 className="text-3xl font-bold text-white mt-1">{card.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-slate-card p-6 rounded-xl border border-slate-700 shadow-sm">
        <h3 className="text-lg font-bold text-white mb-6">Lead Status Distribution</h3>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip 
                cursor={{fill: 'rgba(255,255,255,0.05)'}}
                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px' }}
                itemStyle={{ color: '#fff' }}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
