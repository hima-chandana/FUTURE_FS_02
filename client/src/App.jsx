import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Public Pages
import Landing from './pages/public/Landing';
import Contact from './pages/public/Contact';

// Layouts
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';

// Components

// Admin Pages
import Dashboard from './pages/admin/Dashboard';
import Leads from './pages/admin/Leads';
import LeadDetails from './pages/admin/LeadDetails';
import FollowUps from './pages/admin/FollowUps';
import Settings from './pages/admin/Settings';

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        {/* Public Routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/contact" element={<Contact />} />
        </Route>

        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

        {/* Admin Routes (Bypassed Login) */}
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/leads" element={<Leads />} />
          <Route path="/admin/leads/:id" element={<LeadDetails />} />
          <Route path="/admin/follow-ups" element={<FollowUps />} />
          <Route path="/admin/settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
