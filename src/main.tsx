import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { ThemeProvider } from './components/ThemeProvider';
import { useAuth } from './lib/auth';
import './index.css';

// Enable React concurrent features
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

const root = createRoot(rootElement);

function AppWrapper() {
  useAuth();
  return (
    <StrictMode>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </StrictMode>
  );
}

// Use automatic batching for all updates
root.render(<AppWrapper />);