import React, { createContext, useContext, useState, useEffect } from 'react';
import Storage, { User } from '../lib/storage';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  signup: (email: string, password: string, name: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const currentUser = Storage.getCurrentUser();
    setUser(currentUser);
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    const foundUser = Storage.findUserByEmail(email);
    
    if (!foundUser) {
      return { success: false, message: 'User not found' };
    }

    if (foundUser.password !== password) {
      return { success: false, message: 'Incorrect password' };
    }

    Storage.setCurrentUser(foundUser);
    setUser(foundUser);
    return { success: true };
  };

  const signup = async (email: string, password: string, name: string): Promise<{ success: boolean; message?: string }> => {
    // Check if user already exists
    const existingUser = Storage.findUserByEmail(email);
    if (existingUser) {
      return { success: false, message: 'Email already registered' };
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      email,
      password,
      name,
      createdAt: new Date().toISOString()
    };

    Storage.addUser(newUser);
    Storage.setCurrentUser(newUser);
    setUser(newUser);
    return { success: true };
  };

  const logout = () => {
    Storage.setCurrentUser(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
