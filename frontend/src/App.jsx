import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import ScrollToTop from "./components/utils/ScrollToTop";

import Navbar from "./layouts/Navbar";
import Footer from "./layouts/Footer";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import Encontros from "./pages/Encontros";
import Placares from "./pages/Placares";
import Noticias from "./pages/Noticias";
import Sobre from "./pages/Sobre";
import Perfil from "./pages/user/Perfil"; // Import da nova página

import CriarEncontro from "./pages/admin/CriarEncontro";
import InscricaoEncontro from "./pages/InscricaoEncontro";
import AdminDashboard from "./pages/admin/AdminDashboard";
import EncontroDetalhes from "./pages/admin/EncontroDetalhes";


// Componente para proteger rotas de admin
const AdminRoute = ({ children }) => {
    const { isAdmin, loading } = useAuth();
    if (loading) return null; // ou um spinner
    return isAdmin ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div id="root" className="flex min-h-screen flex-col">
        <Navbar />
        <main id="main-content" className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Cadastro />} />
            <Route path="/encontros" element={<Encontros />} />
            <Route path="/encontros/:id/inscrever" element={<InscricaoEncontro />} />
            <Route path="/placares" element={<Placares />} />
            <Route path="/noticias" element={<Noticias />} />
            <Route path="/sobre" element={<Sobre />} />
            <Route path="/perfil/:id" element={<Perfil />} />

            {/* Rotas de Admin Protegidas */}
            <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/admin/encontros/:id" element={<AdminRoute><EncontroDetalhes /></AdminRoute>} />
            <Route path="/admin/criar-encontro" element={<AdminRoute><CriarEncontro /></AdminRoute>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

