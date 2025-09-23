import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getEncontros, deleteEncontro } from "../../services/EncontroService";
import { useAuth } from "../../context/AuthContext";
import Loading from "../../components/utils/Loading";

import Faixa from "../../components/noticias/Faixa";

const AdminDashboard = () => {
  const [encontros, setEncontros] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

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

  const verifyLoading = () => {
    if (loading) {
      return <Loading cor="#981FBA" txt="Buscando encontros..." />;
    }
  };

  const handleDelete = async (encontroId) => {
    // Adiciona uma confirmação para evitar exclusões acidentais
    const isConfirmed = window.confirm(
      "Você tem certeza que deseja deletar este encontro? Todos os dados de inscrição serão perdidos permanentemente.",
    );

    if (isConfirmed) {
      try {
        await deleteEncontro(encontroId, token);
        // Atualiza a lista de encontros na tela removendo o que foi deletado
        setEncontros(
          encontros.filter((encontro) => encontro.id !== encontroId),
        );
        alert("Encontro deletado com sucesso!");
      } catch (error) {
        alert(`Erro ao deletar encontro: ${error.message}`);
      }
    }
  };

  return (
    <div className="flex w-full flex-col items-center py-26 lg:py-30">
      <div className="w-full px-6 md:max-w-[80%] lg:max-w-[70%]">
        <Faixa bg={"/images/sections/banner-roxo.webp"} txt={"Painel Administrativo"} />

        <div className="mt-12">
          <h2 className="mb-6 text-center text-3xl font-bold">
            Gerenciamento de Encontros
          </h2>
          <ul className="space-y-4">
            {verifyLoading()}
            {loading ||
              (encontros.length === 0 && <p>Não há encontros cadastrados.</p>)}
            {encontros.map((encontro) => {
              const vagasOcupadas = calcularVagasOcupadas(encontro);
              return (
                <li
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

                  <div className="flex flex-col gap-2.5">
                    <Link
                      to={`/admin/encontros/${encontro.id}`}
                      className="w-full rounded bg-[#981FBA] px-4 py-2 text-center font-bold text-white transition-colors hover:bg-[#5b1587] sm:w-auto"
                    >
                      Ver Detalhes
                    </Link>
                    <button
                      onClick={() => handleDelete(encontro.id)}
                      className="w-full rounded bg-red-600 px-4 py-2 text-center font-bold text-white transition-colors hover:bg-red-800 sm:w-auto"
                    >
                      Deletar
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
