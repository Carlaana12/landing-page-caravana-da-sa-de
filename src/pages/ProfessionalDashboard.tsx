import React from 'react';
import { useAuthStore } from '../lib/store';
import { USER_TYPES } from '../lib/constants';
import { Navigate } from 'react-router-dom';

const ProfessionalDashboard = () => {
  const { user, userType } = useAuthStore();

  if (!user || userType !== USER_TYPES.SPECIALIST) {
    return <Navigate to="/especialista/login" replace />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Dashboard do Profissional</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Conteúdo do dashboard será implementado aqui */}
      </div>
    </div>
  );
};

export default ProfessionalDashboard; 