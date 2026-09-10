import React, { useState } from 'react';

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const storedUser = localStorage.getItem('pawsconnect_user');
    
    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (user.email === email && user.password === password) {
        onLogin(user);
      } else {
        setError('Invalid email or password');
      }
    } else {
      setError('No user found. Please sign up first.');
    }
  };

  return (
    <div className="bg-secondary min-h-screen font-sans py-12 px-4 sm:px-6 lg:px-8 flex justify-center items-center">
      <div className="bg-white/80 backdrop-blur-md border border-white/40 shadow-xl rounded-2xl p-8 max-w-md w-full text-accent">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-heading font-extrabold tracking-tight">Welcome Back</h2>
          <p className="mt-2 text-sm text-gray-500">Log in to PawsConnect</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input 
              type="email" 
              required 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-transparent border border-gray-300 rounded-lg focus:ring-brand focus:border-brand outline-none transition" 
              placeholder="you@example.com" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input 
              type="password" 
              required 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-transparent border border-gray-300 rounded-lg focus:ring-brand focus:border-brand outline-none transition" 
              placeholder="••••••••" 
            />
          </div>
          <div className="pt-4">
            <button type="submit" className="w-full bg-brand text-white font-bold py-3 px-4 rounded-xl shadow-lg hover:bg-brand-dark transition-all duration-200 outline-none">
              Log In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;