'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: number;
  email: string;
  name: string;
  role: 'admin' | 'buyer' | 'guest';
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, name: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Vérifier l'authentification au chargement UNIQUEMENT
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me', {
          credentials: 'include', // Important pour inclure les cookies
        });
        if (response.ok) {
          const data = await response.json();
          if (data.user) {
            setUser(data.user);
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []); // Ne s'exécute qu'une seule fois au montage

  const login = async (email: string, password: string) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // Important pour sauvegarder les cookies
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    const data = await response.json();
    setUser(data.user);
    
    // Refetch user data from /me to ensure we have the latest data
    try {
      const meResponse = await fetch('/api/auth/me', {
        credentials: 'include',
      });
      if (meResponse.ok) {
        const meData = await meResponse.json();
        if (meData.user) {
          setUser(meData.user);
        }
      }
    } catch (error) {
      console.error('Failed to refetch user data:', error);
    }
  };

  const signup = async (email: string, name: string, password: string) => {
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // Important pour sauvegarder les cookies
      body: JSON.stringify({ email, name, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Signup failed');
    }

    const data = await response.json();
    setUser(data.user);
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { 
        method: 'POST',
        credentials: 'include' // Important pour supprimer les cookies
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null); // Toujours déconnecter côté client
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
