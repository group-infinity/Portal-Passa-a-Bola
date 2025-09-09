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
    <>
      <div id="root" className="flex min-h-screen flex-col">
        <Navbar />

        <main className="flex-grow">
          <Home/>
          {/* <Login /> */}
          {/* <Cadastro/> */}
          {/* <Encontros></Encontros> */}
          {/* <Placares></Placares> */}
          {/* <Noticias></Noticias> */}
          {/* <Sobre></Sobre> */}
        </main>

        <Footer />
      </div>
    </>
  );
}

export default App;
