import { Outlet, Link } from 'react-router-dom';
import { Layers } from 'lucide-react';

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-dark">
      <header className="border-b border-slate-700 bg-slate-dark/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center gap-2 text-white font-bold text-xl">
                <Layers className="text-electric-blue" />
                Sales Bridge
              </Link>
            </div>
            <nav className="flex gap-4">
              <Link to="/" className="text-slate-300 hover:text-white transition-colors">Home</Link>
              <Link to="/contact" className="text-slate-300 hover:text-white transition-colors">Get in touch</Link>
              <Link to="/admin" className="text-electric-blue hover:text-blue-400 font-medium transition-colors">Admin Login</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      <footer className="border-t border-slate-700 py-8 text-center text-slate-400">
        <p>&copy; {new Date().getFullYear()} Sales Bridge. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default MainLayout;
