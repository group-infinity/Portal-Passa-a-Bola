import { useState, useEffect } from "react";
import { getLigas } from "../../services/LigaService";

import LigaHeader from "./LigaHeader";
import Jogo from "./Jogo";
import Modal from "./Modal";
import Loading from "../utils/Loading";

function Liga() {
  const [modalActive, setModalActive] = useState(false);
  const [jogoSelecionado, setJogoSelecionado] = useState(null);
  const [ligasExibidas, setLigasExibidas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLigas = async () => {
      try {
        setLoading(true);
        const data = await getLigas();
        setLigasExibidas(data);
      } catch (error) {
        console.error("Erro ao buscar dados das ligas:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLigas();
  }, []);

  const handleJogoClick = (jogoApi, infoLiga) => {
    const jogoFormatado = {
      time1: {
        nome: jogoApi.strHomeTeam,
        placar: jogoApi.intHomeScore ?? "-",
        img: jogoApi.strHomeTeamBadge,
      },
      time2: {
        nome: jogoApi.strAwayTeam,
        placar: jogoApi.intAwayScore ?? "-",
        img: jogoApi.strAwayTeamBadge,
      },
      competition: infoLiga.strLeague,
      stage: jogoApi.strRound,
      data: jogoApi.dateEvent,
      status: jogoApi.strStatus,
      horario: jogoApi.strTime,
      estadio: jogoApi.strVenue,
      strLeagueLogo: infoLiga?.strBadge,
    };

    setJogoSelecionado(jogoFormatado);
    setModalActive(true);
    document.body.style.overflow = "hidden";
  };

  const handleCloseModal = () => {
    setModalActive(false);
    setJogoSelecionado(null);
    document.body.style.overflow = "auto";
  };

  if (loading) {
    return <Loading cor="#6EAA38" txt="Buscando ligas..." />;
  }

  return (
    <>
      {/* {loading && <Loading cor="#6EAA38" txt="Buscando ligas..." />} */}
      {ligasExibidas.length === 0 ? (
        <p>Nenhuma liga disponível no momento.</p>
      ) : (
        ligasExibidas.map((liga) => {
          const umMesAtras = new Date();
          umMesAtras.setMonth(umMesAtras.getMonth() - 1);

          const jogosPassadosRecentes = liga.jogosPassados
            .filter((jogo) => new Date(jogo.dateEvent) >= umMesAtras)
            .slice(0, 2);

          const jogosParaExibir =
            liga.jogosFuturos.length > 0
              ? liga.jogosFuturos
              : jogosPassadosRecentes;

          if (jogosParaExibir.length === 0) {
            return null;
          }

          return (
            <div key={liga.id} className="flex w-full flex-col gap-2.5">
              <LigaHeader info={liga.info} />
              <div
                className="flex w-full gap-3 overflow-x-auto pb-4"
                tabIndex="0"
                aria-label={`Lista de jogos da liga ${liga.nome}`}
              >
                {jogosParaExibir.map((jogo) => (
                  <Jogo
                    key={jogo.idEvent}
                    jogoApi={jogo}
                    onClick={() => handleJogoClick(jogo, liga.info)}
                  />
                ))}
              </div>
            </div>
          );
        })
      )}
      <Modal
        active={modalActive}
        jogo={jogoSelecionado}
        onClose={handleCloseModal}
      />
    </>
  );
}

export default Liga;
