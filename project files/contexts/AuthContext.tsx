
import React, { createContext, useState, useEffect, useCallback } from 'react';
import { User } from '../types';
import * as api from '../services/mockApi';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<User | null>;
  logout: () => void;
  register: (user: Omit<User, 'id'>) => Promise<User | null>;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkLoggedIn = async () => {
      setIsLoading(true);
      try {
        const currentUser = await api.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error("No user logged in");
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    checkLoggedIn();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const loggedInUser = await api.login(email, password);
      setUser(loggedInUser);
      return loggedInUser;
    } catch (error) {
      console.error(error);
      setUser(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    api.logout();
    setUser(null);
  }, []);

  const register = useCallback(async (newUser: Omit<User, 'id'>) => {
    setIsLoading(true);
    try {
        const registeredUser = await api.register(newUser);
        return registeredUser;
    } catch(error) {
        console.error(error);
        throw error;
    } finally {
        setIsLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, register, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
