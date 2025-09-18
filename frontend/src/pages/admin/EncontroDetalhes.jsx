import { useState, useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { getEncontroById } from "../../services/EncontroService";
import { ArrowLeft } from "lucide-react";
import { OrbitProgress } from "react-loading-indicators";

import Banner from "../../components/home/Banner";
import FaixaRoxa from "../../assets/sections/faixa-roxa.webp";

const EncontroDetalhes = () => {
  const { id } = useParams();
  const [encontro, setEncontro] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEncontro = async () => {
      try {
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

  const todosOsParticipantes = useMemo(() => {
    if (!encontro) return [];

    const listaAchatada = [];
    encontro.inscricoes.forEach((inscricao) => {
      if (inscricao.tipo === "individual") {
        listaAchatada.push({
          ...inscricao,
          time: "Individual",
        });
      } else if (inscricao.tipo === "conjunta") {
        inscricao.membros.forEach((membro) => {
          listaAchatada.push({
            ...membro,
            time: inscricao.nomeTime,
          });
        });
      }
    });
    return listaAchatada;
  }, [encontro]);

  const verifyLoading = () => {
    if (loading) {
      return <Loading cor="#981FBA" txt="Carregando detalhes do encontro..." />;
    }
  };

  if (!encontro) {
    return (
      <div className="mt-16 lg:mt-40 py-4">
        <h1 className="text-center font-black text-5xl">Ops!</h1>
        <p className="text-center mt-2.5">Encontro não encontrado.</p>
      </div>
    );
  }

  const vagasOcupadas = todosOsParticipantes.length;

  return (
    <div className="relative flex flex-col items-center pt-26 lg:pt-30">
      <Banner img={FaixaRoxa} cor={"#981FBA"} txt={encontro.nome} />
      <div className="relative -top-5 mx-auto w-full p-6 md:max-w-[80%] lg:max-w-[70%]">
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

        <div>
          <h2 className="mb-4 text-2xl font-bold">Lista de Participantes</h2>
          {verifyLoading()}
          {!loading && todosOsParticipantes.length === 0 ? (
            <p>Não há pessoas cadastradas neste evento.</p>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-b-0 shadow-sm">
              <table className="min-w-full bg-white text-sm">
                <caption className="sr-only">
                  Lista de participantes inscritos no encontro
                </caption>
                <thead className="bg-gray-100">
                  <tr>
                    <th scope="col" className="px-4 py-2 text-left">
                      Nome do Participante
                    </th>
                    <th scope="col" className="px-4 py-2 text-left">
                      Email
                    </th>
                    <th scope="col" className="px-4 py-2 text-left">
                      CPF
                    </th>
                    <th scope="col" className="px-4 py-2 text-left">
                      Telefone
                    </th>
                    <th scope="col" className="px-4 py-2 text-left">
                      Nascimento
                    </th>
                    <th scope="col" className="px-4 py-2 text-left">
                      Time / Inscrição
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {todosOsParticipantes.map((participante, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-2">{participante.nome}</td>
                      <td className="px-4 py-2">{participante.email}</td>
                      <td className="px-4 py-2">{participante.cpf}</td>
                      <td className="px-4 py-2">{participante.telefone}</td>
                      <td className="px-4 py-2">
                        {participante.dataNascimento}
                      </td>
                      <td className="px-4 py-2">{participante.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <div className="mt-4 flex h-fit w-fit cursor-pointer items-center gap-1 self-start">
          <ArrowLeft color="#981FBA" className="size-6" />
          <Link
            to="/admin/dashboard"
            className="text-[#981FBA] hover:underline"
          >
            Voltar
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EncontroDetalhes;
