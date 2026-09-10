import React, { useState } from 'react';

const AdminLoginPage = ({ onAdminLogin, onBack, errorMessage }) => {
  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setLocalError('');

    const result = onAdminLogin({ adminId, password });
    if (!result.success) {
      setLocalError(result.message);
    }
  };

  return (
    <div className="bg-secondary min-h-screen font-sans py-12 px-4 sm:px-6 lg:px-8 flex justify-center items-center">
      <div className="bg-white/90 border border-gray-200 shadow-xl rounded-2xl p-8 max-w-md w-full text-accent">
        <h2 className="text-3xl font-heading font-extrabold tracking-tight text-center">Admin Login</h2>
        <p className="mt-2 text-sm text-gray-500 text-center">Restricted access</p>

        {(localError || errorMessage) && (
          <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg mt-5 mb-2">
            {localError || errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 mt-6">
          <div>
            <label className="block text-sm font-medium mb-1">Admin ID</label>
            <input
              type="text"
              required
              value={adminId}
              onChange={(e) => setAdminId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none"
              placeholder="Enter admin ID"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none"
              placeholder="Enter password"
            />
          </div>
          <button type="submit" className="w-full bg-brand text-white font-bold py-3 px-4 rounded-xl hover:bg-brand-dark transition">
            Sign In as Admin
          </button>
          <button type="button" onClick={onBack} className="w-full bg-gray-100 text-gray-700 font-medium py-3 px-4 rounded-xl hover:bg-gray-200 transition">
            Back
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginPage;
