import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { AppProvider } from './context/AppContext.tsx';
import { AccessibilityProvider } from './context/AccessibilityContext.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AccessibilityProvider>
      <AppProvider>
        <App />
      </AppProvider>
    </AccessibilityProvider>
  </StrictMode>,
);
