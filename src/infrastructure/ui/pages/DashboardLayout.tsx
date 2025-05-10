import React from 'react';
import { Outlet } from 'react-router-dom';
import Nav from '../components/Nav';

/**
 * Layout component for the dashboard pages
 * Uses Outlet from react-router-dom to render child routes
 */
const DashboardLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Nav />
      <main className="container mx-auto py-6 px-4">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
