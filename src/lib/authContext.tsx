// src/lib/AuthContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

type Student = {
  email: string;
  name?: string;
  program?: string;
  [key: string]: any;
};

type AuthContextType = {
  student: Student | null;
  login: (student: Student) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [student, setStudent] = useState<Student | null>(
    JSON.parse(localStorage.getItem('student') || 'null')
  );

  const login = (s: Student) => {
    setStudent(s);
    localStorage.setItem('student', JSON.stringify(s));
  };

  const logout = () => {
    setStudent(null);
    localStorage.removeItem('student');
  };

  return (
    <AuthContext.Provider value={{ student, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};