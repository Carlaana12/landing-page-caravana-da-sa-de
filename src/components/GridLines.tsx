import React from 'react';

const GridLines = () => {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-grid bg-[length:40px_40px] opacity-10"></div>
    </div>
  );
};

export default GridLines; 