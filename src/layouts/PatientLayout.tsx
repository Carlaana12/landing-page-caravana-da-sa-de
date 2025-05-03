import React from 'react';
import { Outlet } from 'react-router-dom';
import PatientNav from '../components/patient/PatientNav';

const PatientLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <PatientNav />
      <main className="py-10">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default PatientLayout; 