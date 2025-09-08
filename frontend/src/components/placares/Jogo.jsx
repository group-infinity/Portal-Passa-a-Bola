import React from "react";

function Jogo({ jogoApi, onClick }) {
  return (
    <button
      className="flex w-fit cursor-pointer items-center gap-3 rounded-lg border border-[rgba(0,0,0,0.25)] p-2.5 lg:gap-5 lg:p-4 text-left"
      onClick={onClick}
    >
      <div className="flex w-max flex-col gap-1 lg:gap-2">
        <div className="flex items-center justify-between gap-4 lg:gap-8">
          <div className="flex items-center gap-1.5 lg:gap-2">
            <img
              src={jogoApi.strHomeTeamBadge}
              alt={jogoApi.strHomeTeam}
              className="size-5 lg:size-7 object-contain"
            />
            <p className="text-sm font-bold lg:text-base">{jogoApi.strHomeTeam}</p>
          </div>
          <p className="text-sm font-bold lg:text-base">{jogoApi.intHomeScore ?? "-"}</p>
        </div>

        <div className="flex items-center justify-between gap-4 lg:gap-8">
          <div className="flex items-center gap-1.5 lg:gap-2">
            <img
              src={jogoApi.strAwayTeamBadge}
              alt={jogoApi.strAwayTeam}
              className="size-5 lg:size-7 object-contain"
            />
            <p className="text-sm font-bold lg:text-base">{jogoApi.strAwayTeam}</p>
          </div>
          <p className="text-sm font-bold lg:text-base">{jogoApi.intAwayScore ?? "-"}</p>
        </div>
      </div>

      <span className="h-10 self-center border-l border-[rgba(0,0,0,0.25)] lg:h-14"></span>

      <div className="flex flex-col items-center justify-center text-center">
        <p className="whitespace-nowrap text-[12px] font-bold lg:text-sm">
          {new Date(jogoApi.dateEvent).toLocaleDateString('pt-BR')}
        </p>
        <p className="whitespace-nowrap text-[12px] lg:text-sm">{jogoApi.strStatus}</p>
      </div>
    </button>
  );
}

export default Jogo;