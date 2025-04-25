// Desativa o aviso do React DevTools em desenvolvimento
if (process.env.NODE_ENV === 'development') {
  const originalError = console.error;
  console.error = (...args) => {
    if (typeof args[0] === 'string' && args[0].includes('Download the React DevTools')) {
      return;
    }
    originalError.call(console, ...args);
  };
} 