import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getEncontroById } from "../../services/EncontroService";
import { ArrowLeft } from "lucide-react";

import Loading from "../../components/utils/Loading";
import Banner from "../../components/home/Banner";
import Chaveamento from "../../components/admin/Chaveamento";
import TabelaParticipantes from "../../components/admin/TabelaParticipantes";

const EncontroDetalhes = () => {
  const { id } = useParams();
  const [encontro, setEncontro] = useState(null);
  const [participantes, setParticipantes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEncontro = async () => {
      try {
        setLoading(true);
        const data = await getEncontroById(id);
        setEncontro(data);
      } catch (error) {
        console.error("Erro ao buscar detalhes do encontro:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEncontro();
  }, [id]);

  useEffect(() => {
    if (!encontro) {
        setParticipantes([]);
        return;
    };

    const listaAchatada = [];
    encontro.inscricoes.forEach((inscricao) => {
      if (inscricao.tipo === "individual") {
        listaAchatada.push({
          ...inscricao,
          inscricao_id: inscricao.id,
          jogadoraId: null,
          time: "Individual",
        });
      } else if (inscricao.tipo === "conjunta" && inscricao.membros) {
        inscricao.membros.forEach((membro) => {
          listaAchatada.push({
            ...membro,
            inscricao_id: inscricao.id,
            time: inscricao.nomeTime,
          });
        });
      }
    });
    setParticipantes(listaAchatada);
  }, [encontro]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loading cor="#981FBA" txt="Carregando detalhes do encontro..." />
      </div>
    );
  }

  if (!encontro) {
    return (
      <div className="mt-16 py-4 lg:mt-40">
        <h1 className="text-center text-5xl font-black">Ops!</h1>
        <p className="mt-2.5 text-center">Encontro não encontrado.</p>
      </div>
    );
  }

  const vagasOcupadas = participantes.length;

  return (
    <div className="relative flex flex-col items-center pt-26 lg:pt-30">
      <Banner
        img={"/images/sections/faixa-roxa.webp"}
        cor={"#981FBA"}
        txt={encontro.nome}
      />
      <div className="relative -top-5 mx-auto w-full p-6">
        <div className="my-4 flex h-fit w-fit cursor-pointer items-center gap-1 self-start">
          <ArrowLeft color="#981FBA" className="size-6" />
          <Link
            to="/admin/dashboard"
            className="text-[#981FBA] hover:underline"
          >
            Voltar
          </Link>
        </div>
        <div className="mb-8 rounded-lg border bg-gray-50 p-4 shadow-md">
          <h2 className="mb-2 text-2xl font-bold">Resumo do Encontro</h2>
          <p>
            <strong>Data de Início:</strong> {encontro.diaI}
          </p>
          <p>
            <strong>Fim das Inscrições:</strong> {encontro.diaF}
          </p>
          <p>
            <strong>Vagas Preenchidas:</strong> {vagasOcupadas} de{" "}
            {encontro.totalVagas}
          </p>
        </div>

        <Chaveamento encontroId={id} />

        <div>
          <h2 className="mb-4 text-2xl font-bold">Lista de Participantes</h2>
          {loading ? (
             <Loading cor="#981FBA" txt="Carregando detalhes do encontro..." />
          ) : (
             <TabelaParticipantes
                participantes={participantes}
                setParticipantes={setParticipantes}
                nome={encontro.nome}
                encontroId={id}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default EncontroDetalhes;
