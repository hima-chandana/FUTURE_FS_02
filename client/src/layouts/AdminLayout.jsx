import { useState, useEffect, useRef } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Users, Calendar, Settings, LogOut, Layers, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const AdminLayout = () => {
  const { admin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [pendingFollowUps, setPendingFollowUps] = useState([]);
  const dropdownRef = useRef(null);
  const profileMenuRef = useRef(null);

  useEffect(() => {
    const fetchFollowUps = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/followups`);
        const pending = data.filter(f => f.status === 'Pending');
        setPendingFollowUps(pending);
      } catch (error) {
        console.error('Failed to fetch notifications', error);
      }
    };
    fetchFollowUps();

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [location.pathname]); // Refetch when navigation occurs

  const handleLogout = () => {
    logout();
    navigate('/admin');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Leads', path: '/admin/leads', icon: <Users size={20} /> },
    { name: 'Follow-ups', path: '/admin/follow-ups', icon: <Calendar size={20} /> },
    { name: 'Settings', path: '/admin/settings', icon: <Settings size={20} /> },
  ];

  return (
    <div className="min-h-screen flex bg-[#0B1120] text-slate-300">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-gray-100 hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-gray-100">
          <Link to="/admin/dashboard" className="flex items-center gap-2 text-white font-bold text-xl">
            <Layers className="text-electric-blue" />
            Sales Bridge
          </Link>
        </div>
        <nav className="flex-1 py-6 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname.includes(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  isActive ? 'bg-electric-blue/10 text-electric-blue font-medium' : 'hover:bg-slate-card hover:text-white'
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-gray-100">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg hover:bg-slate-card text-slate-400 hover:text-red-400 transition-colors"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-slate-900/50 backdrop-blur border-b border-gray-100 flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-40">
          <h1 className="text-xl font-semibold text-white capitalize">
            {location.pathname.split('/').pop().replace('-', ' ')}
          </h1>
          <div className="flex items-center gap-4">
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-slate-400 hover:text-white transition-colors relative"
              >
                <Bell size={20} />
                {pendingFollowUps.length > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-electric-blue rounded-full border-2 border-slate-900"></span>
                )}
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-80 bg-slate-card border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50"
                  >
                    <div className="p-4 border-b border-slate-700">
                      <h3 className="font-bold text-white">Notifications</h3>
                    </div>
                    <div className="max-h-[300px] overflow-y-auto">
                      {pendingFollowUps.length === 0 ? (
                        <p className="p-4 text-sm text-slate-400 text-center">No new notifications.</p>
                      ) : (
                        pendingFollowUps.map(followUp => (
                          <div key={followUp.id} className="p-4 border-b border-slate-700 hover:bg-slate-700/30 transition-colors">
                            <p className="text-sm font-medium text-white mb-1">{followUp.purpose}</p>
                            <p className="text-xs text-electric-blue">
                              {new Date(followUp.date).toLocaleDateString()} at {followUp.time}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                    {pendingFollowUps.length > 0 && (
                      <Link 
                        to="/admin/follow-ups"
                        onClick={() => setShowNotifications(false)}
                        className="block w-full text-center p-3 text-sm text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors"
                      >
                        View all follow-ups
                      </Link>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <div className="relative" ref={profileMenuRef}>
              <button 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-3 pl-4 border-l border-slate-700 hover:opacity-80 transition-opacity text-left"
              >
                <div className="w-8 h-8 rounded-full bg-electric-blue flex items-center justify-center text-white font-bold">
                  {admin?.name?.charAt(0) || 'A'}
                </div>
                <div className="hidden sm:block text-sm">
                  <p className="text-white font-medium">{admin?.name}</p>
                  <p className="text-slate-400 text-xs">Administrator</p>
                </div>
              </button>

              <AnimatePresence>
                {showProfileMenu && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-48 bg-slate-card border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50 py-1"
                  >
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
