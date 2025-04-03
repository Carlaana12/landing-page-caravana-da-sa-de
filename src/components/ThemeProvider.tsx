import React, { useEffect } from 'react';
import { useThemeStore, loadTheme, subscribeToThemeChanges } from '../lib/theme';
import WebFont from 'webfontloader';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    // Carregar fontes padrão primeiro
    WebFont.load({
      google: {
        families: ['Montserrat:400,500,600,700', 'Inter:400,500,600,700']
      }
    });

    // Carregar tema inicial
    loadTheme().then((theme) => {
      if (theme?.typography) {
        const families = [];
        if (theme.typography.headingFont && theme.typography.headingFont !== 'Montserrat') {
          families.push(`${theme.typography.headingFont}:400,500,600,700`);
        }
        if (theme.typography.bodyFont && theme.typography.bodyFont !== 'Inter') {
          families.push(`${theme.typography.bodyFont}:400,500,600,700`);
        }
        
        if (families.length > 0) {
          WebFont.load({
            google: { families },
            active: () => {
              const root = document.documentElement;
              if (theme.typography.headingFont) {
                root.style.setProperty('--font-heading', `"${theme.typography.headingFont}"`);
              }
              if (theme.typography.bodyFont) {
                root.style.setProperty('--font-body', `"${theme.typography.bodyFont}"`);
              }
            }
          });
        }
      }
    });

    // Inscrever para mudanças de tema
    const subscription = subscribeToThemeChanges();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return <>{children}</>;
};