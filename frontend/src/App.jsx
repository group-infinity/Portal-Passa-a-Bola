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

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div id="root" className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Cadastro />} />
            <Route path="/encontros" element={<Encontros />} />
            <Route path="/placares" element={<Placares />} />
            <Route path="/noticias" element={<Noticias />} />
            <Route path="/sobre" element={<Sobre />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
