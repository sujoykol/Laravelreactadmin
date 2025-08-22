import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'admin-lte/dist/css/adminlte.min.css';
import 'admin-lte/dist/js/adminlte.min.js';
import { AuthProvider } from './context/AuthContext.jsx'
import "@fortawesome/fontawesome-free/css/all.min.css";



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>   {/* ✅ Wrap App */}
      <App />
    </AuthProvider>
  </StrictMode>,
)
