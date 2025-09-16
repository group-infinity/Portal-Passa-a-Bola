import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

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

import CriarEncontro from "./pages/admin/CriarEncontro";
import InscricaoEncontro from "./pages/InscricaoEncontro";
import AdminDashboard from "./pages/admin/AdminDashboard";
import EncontroDetalhes from "./pages/admin/EncontroDetalhes";

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

            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/encontros/:id" element={<EncontroDetalhes />} />
            <Route path="/admin/criar-encontro" element={<CriarEncontro />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;