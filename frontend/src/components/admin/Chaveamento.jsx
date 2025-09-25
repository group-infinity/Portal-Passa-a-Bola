import { useState } from "react";
import { getChaveamentoEncontro } from "../../services/EncontroService";
import Loading from "../utils/Loading";

const Chaveamento = ({ encontroId }) => {
  const [chaveamento, setChaveamento] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGerarChaveamento = async () => {
    try {
      setLoading(true);
      const data = await getChaveamentoEncontro(encontroId);
      setChaveamento(data.chaveamento);
    } catch (error){
      console.error("Erro ao gerar chaveamento:", error);
      alert("Não foi possível gerar o chaveamento. Verifique se há times suficientes.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-8">
      <h2 className="mb-4 text-2xl font-bold">Chaveamento dos Jogos</h2>
      <button
        onClick={handleGerarChaveamento}
        disabled={loading}
        className="mb-4 rounded bg-green-500 px-4 py-2 font-bold text-white transition-colors hover:bg-green-700 disabled:bg-gray-400"
      >
        {loading ? "Gerando..." : "Gerar / Atualizar Chaveamento"}
      </button>

      {loading && <Loading cor="#6EAA38" txt="Gerando confrontos..." />}

      {chaveamento && chaveamento.length > 0 && (
        <div className="space-y-4">
          {chaveamento.map((jogo) => (
            <div
              key={jogo.jogo}
              className="rounded-lg border bg-white p-4 shadow-sm"
            >
              <h3 className="mb-2 text-lg font-bold">Jogo {jogo.jogo}</h3>
              <div className="flex items-center justify-between">
                <span className="font-semibold">{jogo.timeA.nome}</span>
                <span className="mx-4 text-gray-500">vs</span>
                <span className="font-semibold">{jogo.timeB.nome}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && chaveamento && chaveamento.length === 0 && (
        <p>Não há times suficientes para gerar o chaveamento.</p>
      )}
    </div>
  );
};

export default Chaveamento;