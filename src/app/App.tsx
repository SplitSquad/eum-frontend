import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import '../App.css';
import AppRoutes from '@/routes';
import ComponentTest from '@/tests/unit/componentPageTest/ComponentTest';

function logPageView(path: string) {
  const rawData = {
    event: 'page_view',
    path,
    timestamp: new Date().toISOString(),
  };
  console.log('Web Log:', rawData);
}

function App() {
  const location = useLocation();

  useEffect(() => {
    logPageView(location.pathname);
  }, [location.pathname]);

  return <AppRoutes />;
  /*return <ComponentTest />;*/
}

export default App;
