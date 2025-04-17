import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@/styles/global.css';
import App from './app/App.tsx';
import TestApp from '@/tests/unit/componentPageTest/TestApp';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/*<App />*/}
    <TestApp />
  </StrictMode>
);
