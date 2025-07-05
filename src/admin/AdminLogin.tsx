import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../contexts/AdminAuthContext';

const AdminLogin = () => {
  const { login } = useAdminAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();
  try {
    await login(email, password); // This calls the AdminAuthContext login
    navigate('/admin/dashboard');
  } catch (error) {
    setError('Invalid credentials. Please check your email and password.');
  }
};


  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-96 space-y-4">
        <h2 className="text-2xl font-bold text-center">Admin Login</h2>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <button type="submit" className="w-full bg-black text-white p-2 rounded hover:bg-gray-900">
          Login
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;


