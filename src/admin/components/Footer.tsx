import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-green-900 text-white py-6 text-center text-sm">
      <p>&copy; {new Date().getFullYear()} Anuário Saúde. Todos os direitos reservados.</p>
    </footer>
  );
};

export default Footer;
