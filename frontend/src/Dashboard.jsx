import React from 'react';

const Dashboard = ({ user, onLogout }) => {
  return (
    <div className="bg-secondary min-h-screen text-accent font-sans pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="flex justify-between items-center mb-8 border-b pb-4">
            <h1 className="text-3xl font-heading font-extrabold text-accent">
              Welcome to your Dashboard, {user?.firstName}!
            </h1>
            <button 
              onClick={onLogout}
              className="bg-gray-100 text-gray-700 px-5 py-2 rounded-full font-medium hover:bg-gray-200 transition"
            >
              Log Out
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-brand/5 p-6 rounded-xl border border-brand/20">
              <div className="text-brand text-4xl mb-4"><i className="fa-solid fa-calendar-check"></i></div>
              <h3 className="text-xl font-bold mb-2">Upcoming Visits</h3>
              <p className="text-gray-600">You have no upcoming visits scheduled with NGOs at the moment.</p>
            </div>
            
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
              <div className="text-blue-500 text-4xl mb-4"><i className="fa-solid fa-heart"></i></div>
              <h3 className="text-xl font-bold mb-2">Saved Pets</h3>
              <p className="text-gray-600">You haven't saved any pets yet. Start browsing to find your new best friend.</p>
            </div>
            
            <div className="bg-amber-50 p-6 rounded-xl border border-amber-100">
              <div className="text-amber-500 text-4xl mb-4"><i className="fa-solid fa-file-lines"></i></div>
              <h3 className="text-xl font-bold mb-2">Applications</h3>
              <p className="text-gray-600">Your adoption application is complete and ready to be submitted to NGOs.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;