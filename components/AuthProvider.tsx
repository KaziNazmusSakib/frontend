'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAuthToken, removeAuthToken, setAuthToken } from '@/lib/auth';
import axiosClient from '@/lib/axiosClient';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  token: string | null;
  user: User | null;
  setToken: (token: string | null) => void;
  setUser: (user: User | null) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setTokenState] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const setToken = (newToken: string | null) => {
    if (newToken) {
      setAuthToken(newToken);
      setTokenState(newToken);
      fetchUserProfile();
    } else {
      removeAuthToken();
      setTokenState(null);
      setUser(null);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const response = await axiosClient.get('/auth/profile');
      setUser(response.data);
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    router.push('/login');
  };

  useEffect(() => {
    const storedToken = getAuthToken();
    if (storedToken) {
      setTokenState(storedToken);
      fetchUserProfile();
    } else {
      setIsLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ token, user, setToken, setUser, logout, isLoading }}>
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