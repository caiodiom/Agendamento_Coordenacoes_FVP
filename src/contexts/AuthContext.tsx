import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Coordination, validateCredentials } from '@/lib/coordinations';

interface AuthContextType {
  user: Coordination | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
  isGeneralCoordinator: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Coordination | null>(() => {
    const saved = sessionStorage.getItem('fvp-user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  const login = (username: string, password: string): boolean => {
    const coordination = validateCredentials(username, password);
    if (coordination) {
      setUser(coordination);
      sessionStorage.setItem('fvp-user', JSON.stringify(coordination));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('fvp-user');
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      isAuthenticated: !!user,
      isGeneralCoordinator: user?.id === 'geral'
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
