import React, { useEffect, useState, createContext, useContext } from 'react';
import axios from 'axios';
type UserRole = 'staff' | 'approver' | 'finance' | null;
interface AuthContextType {
  isAuthenticated: boolean;
  userRole: UserRole;
  user: any;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}
const AuthContext = createContext<AuthContextType | null>(null);
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
export const AuthProvider: React.FC<{
  children: React.ReactNode;
}> = ({
  children
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  useEffect(() => {
    // Check if user is authenticated on page load
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setIsAuthenticated(true);
      setUserRole(parsedUser.role);
      setUser(parsedUser);
      // Set default axios auth header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    setIsLoading(false);
  }, []);
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      // This would be a real API call in production
      // const response = await axios.post('/api/auth/login', { email, password });
      // Mock login for demo purposes
      // In production, this would come from the API
      let mockUser;
      if (email.includes('staff')) {
        mockUser = {
          id: 1,
          name: 'Staff User',
          email,
          role: 'staff' as const
        };
      } else if (email.includes('approver')) {
        mockUser = {
          id: 2,
          name: 'Approver User',
          email,
          role: 'approver' as const
        };
      } else if (email.includes('finance')) {
        mockUser = {
          id: 3,
          name: 'Finance User',
          email,
          role: 'finance' as const
        };
      } else {
        // Default to staff for demo
        mockUser = {
          id: 4,
          name: 'Default Staff',
          email,
          role: 'staff' as const
        };
      }
      const mockToken = 'mock-jwt-token-' + Math.random().toString(36).substr(2);
      // Save token and user to localStorage
      localStorage.setItem('token', mockToken);
      localStorage.setItem('user', JSON.stringify(mockUser));
      // Set auth state
      setIsAuthenticated(true);
      setUserRole(mockUser.role);
      setUser(mockUser);
      // Set axios default header
      axios.defaults.headers.common['Authorization'] = `Bearer ${mockToken}`;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  const logout = () => {
    // Remove token and user from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Reset auth state
    setIsAuthenticated(false);
    setUserRole(null);
    setUser(null);
    // Remove axios default header
    delete axios.defaults.headers.common['Authorization'];
  };
  return <AuthContext.Provider value={{
    isAuthenticated,
    userRole,
    user,
    login,
    logout,
    isLoading
  }}>
      {children}
    </AuthContext.Provider>;
};