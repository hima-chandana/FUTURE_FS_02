import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Public Pages
import Landing from './pages/public/Landing';
import Contact from './pages/public/Contact';
import Login from './pages/public/Login';

// Layouts
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';

// Components
import ProtectedRoute from './components/ProtectedRoute';

// Admin Pages
import Dashboard from './pages/admin/Dashboard';
import Leads from './pages/admin/Leads';
import LeadDetails from './pages/admin/LeadDetails';
import FollowUps from './pages/admin/FollowUps';
import Settings from './pages/admin/Settings';

function App() {
  return (
    <HashRouter>
      <Toaster position="top-right" />
      <Routes>
        {/* Public Routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/contact" element={<Contact />} />
        </Route>

        <Route path="/admin" element={<Login />} />

        {/* Protected Admin Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/leads" element={<Leads />} />
            <Route path="/admin/leads/:id" element={<LeadDetails />} />
            <Route path="/admin/follow-ups" element={<FollowUps />} />
            <Route path="/admin/settings" element={<Settings />} />
            {/* Redirect /admin root to dashboard if logged in, otherwise it's handled by ProtectedRoute/Login */}
          </Route>
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
