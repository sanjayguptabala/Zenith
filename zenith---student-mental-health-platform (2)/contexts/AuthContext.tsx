import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, loginAdmin, registerUser, Credentials, findOrCreateGoogleUser, updateUser, findOrCreateGoogleAdmin } from '../services/mockDb';
import type { User, Admin, RegistrationData } from '../types';
import { useNotification } from './NotificationContext';

interface AuthResult {
    success: boolean;
    message: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | Admin | null;
  isAdmin: boolean;
  isLoading: boolean;
  isGoogleLoading: boolean;
  login: (credentials: Credentials) => Promise<AuthResult>;
  adminLogin: (credentials: Credentials) => Promise<AuthResult>;
  loginWithGoogle: () => Promise<void>;
  adminLoginWithGoogle: () => Promise<void>;
  register: (data: RegistrationData) => Promise<AuthResult>;
  logout: () => void;
  updateUserProfile: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | Admin | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const navigate = useNavigate();
  const { addNotification } = useNotification();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem('user');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (credentials: Credentials): Promise<AuthResult> => {
    try {
      const result = await loginUser(credentials);
      if (result.success && result.data) {
        setUser(result.data);
        localStorage.setItem('user', JSON.stringify(result.data));
        navigate('/dashboard');
      } else if (!result.success) {
        addNotification(result.message, 'error');
      }
      return { success: result.success, message: result.message };
    } catch (error) {
        const message = error instanceof Error ? error.message : 'An unknown error occurred.';
        console.error("Login error:", error);
        addNotification(message, 'error');
        return { success: false, message };
    }
  };

  const adminLogin = async (credentials: Credentials): Promise<AuthResult> => {
    try {
        const result = await loginAdmin(credentials);
        if (result.success && result.data) {
            setUser(result.data);
            localStorage.setItem('user', JSON.stringify(result.data));
            navigate('/admin/dashboard');
        } else if (!result.success) {
            addNotification(result.message, 'error');
        }
        return { success: result.success, message: result.message };
    } catch (error) {
        const message = error instanceof Error ? error.message : 'An unknown error occurred.';
        console.error("Admin login error:", error);
        addNotification(message, 'error');
        return { success: false, message };
    }
  };

  const loginWithGoogle = async () => {
    setIsGoogleLoading(true);
    try {
        const googleUser = await findOrCreateGoogleUser();
        setUser(googleUser);
        localStorage.setItem('user', JSON.stringify(googleUser));
        navigate('/dashboard');
    } catch (error) {
        const message = error instanceof Error ? error.message : 'An unknown error occurred.';
        console.error("Google login error:", error);
        addNotification(message, 'error');
    } finally {
        setIsGoogleLoading(false);
    }
  };
  
  const adminLoginWithGoogle = async () => {
    setIsGoogleLoading(true);
    try {
        const googleAdmin = await findOrCreateGoogleAdmin();
        setUser(googleAdmin);
        localStorage.setItem('user', JSON.stringify(googleAdmin));
        navigate('/admin/dashboard');
    } catch (error) {
        const message = error instanceof Error ? error.message : 'An unknown error occurred.';
        console.error("Google admin login error:", error);
        addNotification(message, 'error');
    } finally {
        setIsGoogleLoading(false);
    }
  };

  const register = async (data: RegistrationData): Promise<AuthResult> => {
    try {
        const result = await registerUser(data);
        if (!result.success) {
            addNotification(result.message, 'error');
        }
        return result;
    } catch (error) {
        const message = error instanceof Error ? error.message : 'An unknown error occurred.';
        console.error("Registration error:", error);
        addNotification(message, 'error');
        return { success: false, message };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    navigate('/login');
  };
  
  const updateUserProfile = async (data: Partial<User>) => {
    if (!user || 'role' in user) {
      throw new Error("No valid user profile to update.");
    }

    try {
        const updatedUser = await updateUser(user.id, data);
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        addNotification('Profile updated successfully!', 'success');
    } catch (error) {
        console.error("Update user profile error:", error);
        const message = error instanceof Error ? error.message : 'An unknown error occurred.';
        addNotification(message, 'error');
        throw error;
    }
  };


  const isAuthenticated = !!user;
  const isAdmin = user ? 'role' in user && user.role === 'admin' : false;

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, isAdmin, isLoading, isGoogleLoading, login, adminLogin, register, logout, loginWithGoogle, adminLoginWithGoogle, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};