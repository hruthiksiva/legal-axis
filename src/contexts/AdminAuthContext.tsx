// src/contexts/AdminAuthContext.tsx
import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { auth } from '../config/firebase';


interface AdminAuthContextType {
  admin: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return context;
};

export const AdminAuthProvider = ({ children }: { children: ReactNode }) => {
  const [admin, setAdmin] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      if (userCredential.user.email !== 'admin@legalaxis.com') {
        await signOut(auth);
        setAdmin(null);
        setError('Access denied: Only the official admin account can log in.');
        throw new Error('Access denied: Only the official admin account can log in.');
      }
      setAdmin(userCredential.user);
      setError(null);
    } catch (error) {
      setError('Invalid credentials or access denied.');
      throw error;
    }
  };

  const logout = async () => {
    await signOut(auth);
    setAdmin(null);
    setError(null);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.email === 'admin@legalaxis.com') {
        setAdmin(user);
        setError(null);
      } else {
        setAdmin(null);
        setError(null);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <AdminAuthContext.Provider value={{ admin, login, logout, error }}>
      {children}
    </AdminAuthContext.Provider>
  );
};
