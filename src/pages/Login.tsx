// src/Login.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './lib/AuthContext';
import { fetchStudents } from './lib/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email) {
      setMessage('Please enter your email');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      // Fetch students from Google Sheet via Apps Script
      const students = await fetchStudents();

      // Case-sensitive match for email
      const student = students.find((s: any) => s.email === email);

      if (!student) {
        setMessage('Email not found. Please check and try again.');
        setLoading(false);
        return;
      }

      // Save student in AuthContext and localStorage
      login(student);
      setMessage(`Welcome, ${student.name || 'Student'}!`);

      // Auto-redirect to dashboard after a short delay
      setTimeout(() => navigate('/dashboard'), 1000);

    } catch (err) {
      console.error(err);
      setMessage('Error connecting to server. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 bg-gray-50">
      <h2 className="text-2xl font-semibold text-gray-700">Student Login</h2>

      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="p-2 border border-gray-300 rounded w-72 focus:outline-none focus:ring-2 focus:ring-green-400"
      />

      <button
        onClick={handleLogin}
        disabled={loading}
        className={`px-6 py-2 rounded text-white font-medium ${
          loading ? 'bg-green-300 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'
        }`}
      >
        {loading ? 'Logging in...' : 'Login'}
      </button>

      {message && (
        <p className={`text-sm mt-2 ${message.includes('Welcome') ? 'text-green-600' : 'text-red-600'}`}>
          {message}
        </p>
      )}
    </div>
  );
};

export default Login;