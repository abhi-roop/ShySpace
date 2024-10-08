import React from 'react';
import Header from './_component/Header';

function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900 text-white">
      {/* Header section */}
      <Header />

      {/* Main content section */}
      <div className="mx-5 md:mx-20 lg:mx-36 py-8">
        {children}
      </div>
    </div>
  );
}

export default DashboardLayout;
