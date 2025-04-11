import { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosConfig';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if admin is already logged in (token in localStorage)
    const token = localStorage.getItem('admin_token');
    if (token) {
      verifyToken(token);
    } else {
      setLoading(false);
    }
  }, []);

  const verifyToken = async (token) => {
    try {
      const response = await axiosInstance.get('/admin/verify');
      setCurrentAdmin(response.data.admin);
      setLoading(false);
    } catch (err) {
      console.error('Token verification failed', err);
      localStorage.removeItem('admin_token');
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setError(null);
      const response = await axiosInstance.post('/admin/login', { email, password });
      
      const { token, admin } = response.data;
      localStorage.setItem('admin_token', token);
      setCurrentAdmin(admin);
      
      // Set token on axios instance
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      return admin;
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    setCurrentAdmin(null);
    delete axiosInstance.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ 
      currentAdmin, 
      loading, 
      error,
      login, 
      logout, 
      isAuthenticated: !!currentAdmin 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
