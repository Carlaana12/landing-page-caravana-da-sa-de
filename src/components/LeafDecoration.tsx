import React from 'react';

const LeafDecoration = () => {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
      {/* Folha superior direita */}
      <svg
        className="absolute -top-10 right-0 w-64 h-64 text-verde-cia opacity-10 transform rotate-45"
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M50,0 C70,15 95,35 95,50 C95,80 70,100 50,100 C30,100 5,80 5,50 C5,35 30,15 50,0 Z"
          fill="currentColor"
        />
      </svg>

      {/* Folha inferior esquerda */}
      <svg
        className="absolute -bottom-20 -left-20 w-96 h-96 text-verde-cia opacity-5 transform -rotate-15"
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M30,10 C60,10 90,40 90,70 C90,85 75,95 60,95 C30,95 10,75 10,45 C10,25 20,15 30,10 Z"
          fill="currentColor"
        />
      </svg>

      {/* Círculos de bolhas - lado direito do meio */}
      <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
        <div className="w-6 h-6 rounded-full bg-verde-cia opacity-5 mb-4"></div>
        <div className="w-4 h-4 rounded-full bg-verde-cia opacity-5 mb-4 ml-6"></div>
        <div className="w-8 h-8 rounded-full bg-verde-cia opacity-5 mb-4 ml-2"></div>
        <div className="w-5 h-5 rounded-full bg-verde-cia opacity-5 ml-8"></div>
      </div>

      {/* Folha estilizada - meio esquerdo */}
      <svg
        className="absolute top-1/3 -left-10 w-40 h-40 text-verde-cia opacity-10 transform -rotate-15"
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M80,50 C80,75 65,90 50,90 C35,90 20,75 20,50 C20,25 35,10 50,10 C50,10 80,25 80,50 Z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
};

export default LeafDecoration; 