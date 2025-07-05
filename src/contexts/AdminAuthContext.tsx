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
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return context;
};

export const AdminAuthProvider = ({ children }: { children: ReactNode }) => {
  const [admin, setAdmin] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    setAdmin(userCredential.user);
  } catch (error) {
    console.error("Firebase login error:", error);
    throw error;
  }
};

  const logout = async () => {
    await signOut(auth);
    setAdmin(null);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setAdmin);
    return () => unsubscribe();
  }, []);

  return (
    <AdminAuthContext.Provider value={{ admin, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
};
