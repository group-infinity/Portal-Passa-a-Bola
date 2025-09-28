import { useState, useEffect } from "react";
import { getChaveamentoEncontro } from "../../services/EncontroService";
import Loading from "../utils/Loading";

const Chaveamento = ({ encontroId }) => {
  const [chaveamento, setChaveamento] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChaveamento = async () => {
      try {
        setLoading(true);
        const data = await getChaveamentoEncontro(encontroId);
        setChaveamento(data.chaveamento);
      } catch (error) {
        console.error("Erro ao buscar chaveamento:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChaveamento();
  }, [encontroId]);

  return (
    <div className="mb-8">
      <h2 className="mb-4 text-2xl font-bold">Chaveamento dos Jogos</h2>

      {loading && <Loading cor="#6EAA38" txt="Carregando confrontos..." />}

      {!loading && chaveamento && chaveamento.length > 0 && (
        <div className="flex flex-wrap gap-2.5">
          {chaveamento.map((jogo) => (
            <div
              key={jogo.jogo}
              className="h-full max-h-[115px] min-w-fit flex-1 rounded-lg border bg-white p-4 shadow-sm"
            >
              <h3 className="mb-2 text-lg font-bold">Jogo {jogo.jogo}</h3>
              <div className="flex items-center justify-between px-4">
                <span className="min-w-fit text-lg font-semibold capitalize">{jogo.timeA.nome}</span>
                <span className="mx-4 text-gray-500">vs</span>
                <span className="min-w-fit text-lg font-semibold capitalize">{jogo.timeB.nome}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && (!chaveamento || chaveamento.length === 0) && (
        <p>Não há times suficientes para exibir o chaveamento.</p>
      )}
    </div>
  );
};

export default Chaveamento;

