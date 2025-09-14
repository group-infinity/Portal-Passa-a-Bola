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
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}api/encontros`,
        );
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

  const calcularVagasOcupadas = (encontro) => {
    return encontro.inscricoes.reduce((total, insc) => {
      return total + (insc.tipo === "conjunta" ? insc.membros.length : 1);
    }, 0);
  };

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
            <Link
              to="/admin/criar-encontro"
              className="self-end rounded bg-green-500 px-4 py-2 font-bold text-white transition-colors hover:bg-green-700"
            >
              + Novo Encontro
            </Link>
          )}

          <div className="relative mt-4 flex w-full flex-col gap-4 md:grid md:grid-cols-2">
            {loading ? (
                  <p>Carregando encontros...</p>
                ) : (
                  encontros.map((encontroItem, index) => {
                    const vagasOcupadas = calcularVagasOcupadas(encontroItem);
                    const isFull = vagasOcupadas >= encontroItem.totalVagas;

                    return (
                      <Encontro
                        key={index}
                        id={encontroItem.id}
                        nome={encontroItem.nome}
                        diaI={encontroItem.diaI}
                        diaF={encontroItem.diaF}
                        vagas={encontroItem.totalVagas}
                        atual={vagasOcupadas}
                        isFull={isFull}
                        encontro={true}
                      />
                    );
                  })
                )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Encontros;
