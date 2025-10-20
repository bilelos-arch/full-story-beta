'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import api from './api';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Load token and user from localStorage on mount
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('authUser');

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        // Clear corrupted data
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser');
      }
    }
  }, []);

  const login = async (newToken: string) => {
    console.log('Début du processus de login avec token');
    setToken(newToken);
    localStorage.setItem('authToken', newToken);
    console.log('Token stocké dans localStorage');

    try {
      // Fetch user profile using the token
      console.log('Récupération du profil utilisateur');
      const response = await api.get('/auth/profile');
      console.log('Réponse profil:', response);
      const userData = response.data;
      const user: User = {
        id: userData.sub || userData._id,
        email: userData.email,
        name: userData.name || userData.email, // Fallback to email if name not provided
        role: userData.role,
      };
      console.log('Utilisateur créé:', user);
      setUser(user);
      localStorage.setItem('authUser', JSON.stringify(user));
      console.log('Utilisateur stocké dans localStorage');
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      // Optionally handle error, e.g., logout or show message
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
  };

  const isAuthenticated = !!token && !!user;

  const value: AuthContextType = {
    user,
    token,
    login,
    logout,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};