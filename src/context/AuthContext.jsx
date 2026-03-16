import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('stackhunt_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password, selectedRole) => {
    const { data } = await axios.post('http://localhost:5000/api/auth/login', { email, password });
    
    // Override role with the one selected in the UI if provided
    const userData = selectedRole ? { ...data, role: selectedRole } : data;
    
    setUser(userData);
    localStorage.setItem('stackhunt_user', JSON.stringify(userData));
    return userData;
  };

  const register = async (userData) => {
    const { data } = await axios.post('http://localhost:5000/api/auth/register', userData);
    setUser(data);
    localStorage.setItem('stackhunt_user', JSON.stringify(data));
    return data;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('stackhunt_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
