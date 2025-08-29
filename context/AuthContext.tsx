
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { User, Role } from '../types';
import { useData } from './DataContext';

interface AuthContextType {
  currentUserId: string | null;
  switchUser: (userId: string) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { users } = useData();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  
  const switchUser = (userId: string) => {
    const selectedUser = users.find(u => u.id === userId);
    if (selectedUser) {
      setCurrentUserId(selectedUser.id);
    }
  };

  const login = (email: string, password: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      // Simulate network delay
      setTimeout(() => {
        const foundUser = users.find(u => u.email === email && u.password === password);
        if (foundUser) {
          setCurrentUserId(foundUser.id);
          resolve();
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 500);
    });
  };

  const logout = () => {
    setCurrentUserId(null);
  };

  return (
    <AuthContext.Provider value={{ currentUserId, switchUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  const { users } = useData();
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  const user = users.find(u => u.id === context.currentUserId) || null;

  return { 
    user, 
    users, 
    switchUser: context.switchUser,
    login: context.login,
    logout: context.logout
  };
};