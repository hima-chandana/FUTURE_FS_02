import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = () => {
  const { admin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-dark">
        <Loader2 className="w-10 h-10 text-electric-blue animate-spin" />
      </div>
    );
  }

  return admin ? <Outlet /> : <Navigate to="/admin" replace />;
};

export default ProtectedRoute;
