import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState({ name: 'Admin User', role: 'admin' });
  const [token, setToken] = useState('dummy-token');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // In a real app, you might want to verify the token with the backend here.
      // For now, we'll assume the token is valid if it exists.
      // We'd ideally fetch the user profile here.
      // We'll decode the token or rely on localStorage for admin info.
      const storedAdmin = localStorage.getItem('adminData');
      if (storedAdmin) {
        setAdmin(JSON.parse(storedAdmin));
      }
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
    setLoading(false);
  }, [token]);

  const login = (newToken, adminData) => {
    localStorage.setItem('adminToken', newToken);
    localStorage.setItem('adminData', JSON.stringify(adminData));
    setToken(newToken);
    setAdmin(adminData);
  };

  const updateAdmin = (newToken, adminData) => {
    localStorage.setItem('adminToken', newToken);
    localStorage.setItem('adminData', JSON.stringify(adminData));
    setToken(newToken);
    setAdmin(adminData);
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    setToken(null);
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, token, login, logout, updateAdmin, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
