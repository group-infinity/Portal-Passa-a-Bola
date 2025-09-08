import Navbar from "./layouts/Navbar";
import Footer from "./layouts/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";

function App() {
  return (
    <>
      <div id="root" className="flex min-h-screen flex-col">
        <Navbar />

        <main className="flex-grow">
          <Home/>
          {/* <Login /> */}
          {/* <Cadastro/> */}
        </main>

        <Footer />
      </div>
    </>
  );
}

export default App;
