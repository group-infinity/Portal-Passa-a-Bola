import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Banner from "../components/home/Banner";
import Encontro from "../components/home/Encontro";
import SobreSecoes from "../components/home/SobreSecoes";
import { useAuth } from "../context/AuthContext";
import FaixaVermelha from "../assets/sections/faixa-vermelha.png";

function Encontros() {
  const { isAdmin } = useAuth();
  const [encontros, setEncontros] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEncontros = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_API_URL}api/encontros`);
        const data = await response.json();
        setEncontros(data);
      } catch (error) {
        console.error("Erro ao buscar encontros:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEncontros();
  }, []);

  return (
    <div className="relative flex flex-col items-center pt-26 lg:pt-30">
      <section className="h-fit w-full">
        <Banner
          img={FaixaVermelha}
          cor={"#BA1B31"}
          txt={"próximos encontros"}
        />
        <div className="relative -top-5 mx-auto flex w-full flex-col items-center gap-2 p-6 md:max-w-[80%] lg:max-w-[70%]">
          <SobreSecoes
            cor="#BA1B31"
            txt="Jogue com a gente! Gratuito e para todas."
          />

          {isAdmin && (
            <Link to="/admin/criar-encontro" className="bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-700 transition-colors">
              + Novo Encontro
            </Link>
          )}

          <div className="relative mt-4 flex flex-col w-full gap-4 md:grid md:grid-cols-2">
            {loading ? (
              <p>Carregando encontros...</p>
            ) : (
              encontros.map((encontroItem) => (
                <Encontro
                  key={encontroItem.id}
                  nome={encontroItem.nome}
                  diaI={encontroItem.diaI}
                  diaF={encontroItem.diaF}
                  encontro={true}
                />
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Encontros;