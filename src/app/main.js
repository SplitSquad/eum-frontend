import { jsx as _jsx } from "react/jsx-runtime";
import { createRoot } from 'react-dom/client';
import '../index.css';
import Routes from '../routes/routes';
createRoot(document.getElementById('root')).render(
//<StrictMode>
_jsx(Routes, {})
//</StrictMode>,
);
