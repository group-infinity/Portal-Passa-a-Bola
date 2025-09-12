import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import "./index.css"
import { AuthProvider } from './context/AuthContext.jsx'; // Importado
 
createRoot(document.getElementById('root')).render(
<StrictMode>
<AuthProvider> {/* Adicionado */}
<App />
</AuthProvider>
</StrictMode>,
)