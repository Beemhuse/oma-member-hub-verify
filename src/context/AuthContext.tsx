import React, { createContext, useContext, useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Cookies } from 'react-cookie';

type AuthContextType = {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (redirectPath?: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  login: () => {},
  logout: () => {},
});

const cookies = new Cookies();
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    const authStatus = cookies.get("auth") === 'true';
    setIsAuthenticated(authStatus);
    setIsLoading(false);
  }, []);

  const login = (redirectPath: string = '/dashboard') => {
    cookies.set('auth', 'true', { path: '/', maxAge: 86400 }); 
    setIsAuthenticated(true);
    return redirectPath; 
  };

  const logout = () => {
    cookies.remove('auth', { path: '/' });
    cookies.remove('oma-token', { path: '/' });
    setIsAuthenticated(false);
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
    window.location.href = '/login'; 
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);