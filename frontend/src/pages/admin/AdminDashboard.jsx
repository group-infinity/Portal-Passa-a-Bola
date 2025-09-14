import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getEncontros } from "../../services/EncontroService";
import Faixa from "../../components/noticias/Faixa";
import FaixaRoxa from "../../assets/sections/banner-roxo.png";

const AdminDashboard = () => {
  const [encontros, setEncontros] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEncontros = async () => {
      try {
        const data = await getEncontros();
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

  if (loading) {
    return <p className="mt-40 text-center">Carregando encontros...</p>;
  }

  return (
    <div className="flex w-full flex-col items-center py-26 lg:py-30">
      <div className="w-full px-6 md:max-w-[80%] lg:max-w-[70%]">
        <Faixa bg={FaixaRoxa} txt={"Painel Administrativo"} />

        <div className="mt-12">
          <h2 className="mb-6 text-center text-3xl font-bold">
            Gerenciamento de Encontros
          </h2>
          <div className="space-y-4">
            {encontros.map((encontro) => {
              const vagasOcupadas = calcularVagasOcupadas(encontro);
              return (
                <div
                  key={encontro.id}
                  className="flex flex-col items-start justify-between gap-4 rounded-lg border p-4 shadow-md sm:flex-row sm:items-center"
                >
                  <div>
                    <h3 className="text-xl font-bold">{encontro.nome}</h3>
                    <p>Data: {encontro.diaI}</p>
                    <p>
                      Inscrições:{" "}
                      <strong>
                        {vagasOcupadas} / {encontro.totalVagas}
                      </strong>
                    </p>
                  </div>
                  <Link
                    to={`/admin/encontros/${encontro.id}`}
                    className="w-full rounded bg-[#981FBA] px-4 py-2 text-center font-bold text-white transition-colors hover:bg-[#5b1587] sm:w-auto"
                  >
                    Ver Detalhes
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
