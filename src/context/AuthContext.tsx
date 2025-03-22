import React, { createContext, useContext, useState, useEffect } from 'react';
import { storageService } from '../services/storage.service';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (userData: User, token: string) => void;
  logout: () => void;
  isLoading: boolean;
  hasRole: (role: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Cargar datos del usuario y token al iniciar
    const savedToken = storageService.getToken();
    const savedRole = storageService.getRole();
    
    if (savedToken && savedRole) {
      setToken(savedToken);
      setUser({
        id: '1',
        name: 'Usuario Demo',
        email: 'demo@campusparty.com',
        role: savedRole
      });
    }

    setIsLoading(false);
  }, []);

  const login = (userData: User, token: string) => {
    setUser(userData);
    setToken(token);
    storageService.setToken(token);
    storageService.setRole(userData.role);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    storageService.clear();
  };

  const hasRole = (role: string) => {
    return user?.role === role;
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
