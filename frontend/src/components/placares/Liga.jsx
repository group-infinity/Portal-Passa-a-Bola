import { useState, useEffect } from "react";
import LigaHeader from "./LigaHeader";
import Jogo from "./Jogo";
import Modal from "./Modal";

const BACKEND_URL = import.meta.env.VITE_API_URL;

function Liga() {
  const [modalActive, setModalActive] = useState(false);
  const [jogoSelecionado, setJogoSelecionado] = useState(null);
  const [ligasExibidas, setLigasExibidas] = useState([]);
  const [loading, setLoading] = useState(true); // Estado de carregamento

  useEffect(() => {
    const fetchLigas = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${BACKEND_URL}api/ligas`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setLigasExibidas(data.slice(0, 3));
        console.log(data)
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
      competition: jogoApi.strLeague,
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
    return <p>Carregando placares...</p>;
  }

  return (
    <>
      {ligasExibidas.length === 0 ? (
        <p>Nenhuma liga disponível no momento.</p>
      ) : (
        ligasExibidas.map((liga) => (
          <div key={liga.id} className="flex w-full flex-col gap-2.5">
            <LigaHeader info={liga.info} />
            <div
              className="flex w-full gap-3 overflow-x-auto p-1"
              tabIndex="0"
              aria-label={`Lista de jogos da liga ${liga.nome}`}
            >
              {(liga.jogosFuturos.length > 0
                ? liga.jogosFuturos
                : liga.jogosPassados
              ).map((jogo) => (
                <Jogo
                  key={jogo.idEvent}
                  jogoApi={jogo}
                  onClick={() => handleJogoClick(jogo, liga.info)}
                />
              ))}
            </div>
          </div>
        ))
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