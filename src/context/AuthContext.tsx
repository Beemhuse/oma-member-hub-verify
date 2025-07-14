import React, { createContext, useContext, useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Cookies } from 'react-cookie';

type AuthContextType = {
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => void;
  refreshAuth: () => void;
};

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  logout: () => {},
  refreshAuth: () => {},
});

const cookies = new Cookies();

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const refreshAuth = () => {
    const token = cookies.get('oma-token');
    setIsAuthenticated(!!token);
  };

  useEffect(() => {
    refreshAuth();
    setIsLoading(false);
  }, []);

  const logout = () => {
    cookies.remove('oma-token', { path: '/' });
    setIsAuthenticated(false);
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, logout, refreshAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
