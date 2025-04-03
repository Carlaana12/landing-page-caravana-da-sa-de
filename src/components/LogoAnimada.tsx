import React, { memo } from 'react';
import styles from './LogoAnimada.module.css';

const LogoAnimada = memo(() => {
  return (
    <div className={styles.logoContainer}>
      <img 
        src="/logo-anuario.png" 
        alt="Anuário Saúde - Conectando profissionais de saúde e pacientes"
        className={styles.logoImage}
        loading="lazy"
        width="320"
        height="auto"
      />
    </div>
  );
});

LogoAnimada.displayName = 'LogoAnimada';

export default LogoAnimada; 