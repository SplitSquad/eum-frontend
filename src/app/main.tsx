import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // App.tsx 임포트

// ReactDOM.render 대신 createRoot 사용 (React 18 이상)
const rootElement = document.getElementById('root') as HTMLElement;
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
