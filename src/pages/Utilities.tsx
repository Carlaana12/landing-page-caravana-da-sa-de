import React from 'react';
import HeroParallax from '@/components/HeroParallax';

const Utilities = () => {
  return (
    <div className="min-h-screen">
      <HeroParallax
        title="Utilidades Públicas"
        description="Ferramentas e recursos úteis para profissionais de saúde e pacientes"
        image="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=2000"
        typeSequence={[
          'Calculadoras Médicas',
          2000,
          'Protocolos Clínicos',
          2000,
          'Recursos Úteis',
          2000
        ]}
      />
    </div>
  );
};

export default Utilities; 