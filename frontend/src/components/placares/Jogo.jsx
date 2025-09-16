import React from "react";

function Jogo({ jogoApi, onClick }) {
  const getStatusTraduzido = (status) => {
    const statusMap = {
      "Not Started": "Não Iniciado",
      "Match Finished": "Encerrado",
      "1H": "1º Tempo",
      "2H": "2º Tempo",
      Postponed: "Adiado",
      Cancelled: "Cancelado",
      "Match Abandoned": "Jogo Suspenso",
    };

    return statusMap[status];
  };

  return (
    <button
      className="flex w-fit cursor-pointer items-center gap-3 rounded-lg border border-[rgba(0,0,0,0.25)] p-2.5 text-left lg:gap-5 lg:p-4"
      onClick={onClick}
    >
      <div className="flex w-max flex-col gap-1 lg:gap-2">
        <div className="flex items-center justify-between gap-4 lg:gap-8">
          <div className="flex items-center gap-1.5 lg:gap-2">
            <img
              src={jogoApi.strHomeTeamBadge}
              alt={jogoApi.strHomeTeam}
              className="size-5 object-contain lg:size-7"
            />
            <p className="text-sm font-bold lg:text-base">
              {jogoApi.strHomeTeam.indexOf("Women") === -1
                ? jogoApi.strHomeTeam
                : jogoApi.strHomeTeam.slice(0, -5) + "Feminino"}
            </p>
          </div>
          <p className="text-sm font-bold lg:text-base">
            {jogoApi.intHomeScore ?? "-"}
          </p>
        </div>

        <div className="flex items-center justify-between gap-4 lg:gap-8">
          <div className="flex items-center gap-1.5 lg:gap-2">
            <img
              src={jogoApi.strAwayTeamBadge}
              alt={jogoApi.strAwayTeam}
              className="size-5 object-contain lg:size-7"
            />
            <p className="text-sm font-bold lg:text-base">
              {jogoApi.strAwayTeam.indexOf("Women") === -1
                ? jogoApi.strAwayTeam
                : jogoApi.strAwayTeam.slice(0, -5) + "Feminino"}
            </p>
          </div>
          <p className="text-sm font-bold lg:text-base">
            {jogoApi.intAwayScore ?? "-"}
          </p>
        </div>
      </div>

      <span className="h-10 self-center border-l border-[rgba(0,0,0,0.25)] lg:h-14"></span>

      <div className="flex flex-col items-center justify-center text-center">
        {[
          "Not Started",
          "Match Finished",
          "Postponed",
          "Cancelled",
          "Match Abandoned",
        ].includes(jogoApi.strStatus) ? (
          <p className="text-[12px] font-bold whitespace-nowrap lg:text-sm">
            {new Date(jogoApi.dateEvent).toLocaleDateString("pt-BR", {
              timeZone: "UTC",
            })}
          </p>
        ) : null}
        <p className="text-[12px] whitespace-nowrap lg:text-sm">
          <strong>{getStatusTraduzido(jogoApi.strStatus)}</strong>
        </p>
      </div>
    </button>
  );
}

export default Jogo;
