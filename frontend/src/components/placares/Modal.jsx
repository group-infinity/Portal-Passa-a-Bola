import React from "react";
import { X } from "lucide-react";

function Modal({ active, jogo, onClose }) {
  if (!active || !jogo) {
    return null;
  }

  const handleModalContentClick = (e) => {
    e.stopPropagation();
  };

  const formatarHorarioLocal = (data, horario) => {
    if (!data || !horario) return null;
    const dataHoraUTC = new Date(`${data}T${horario}Z`);
    return dataHoraUTC.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

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
    <div
      className="fixed inset-0 z-[999] flex h-screen w-screen items-center justify-center bg-[rgba(0,0,0,0.5)] p-4"
      onClick={onClose}
    >
      <div
        className="relative flex w-full max-w-sm flex-col gap-4 rounded-lg bg-white p-4 shadow-lg lg:max-w-lg lg:gap-6 lg:p-6"
        onClick={handleModalContentClick}
      >
        <button onClick={onClose} className="absolute top-3 right-3 z-10 p-1">
          <X className="size-6 cursor-pointer text-[rgba(0,0,0,0.75)]" />
        </button>

        <div className="mt-2 flex items-center gap-3 lg:gap-4">
          <img
            src={jogo.strLeagueLogo}
            alt={jogo.competition}
            className="h-8 w-8 object-contain lg:h-12 lg:w-12"
          />
          <div>
            <h5 className="text-base font-bold lg:text-xl">
              {jogo.competition}
            </h5>
            <p className="text-sm text-gray-500 lg:text-base">{jogo.stage}</p>
          </div>
        </div>

        <div className="flex items-start justify-around text-center">
          <div className="flex w-2/5 flex-col items-center gap-2">
            <img
              src={jogo.time1.img}
              alt={
                jogo.time1.nome.indexOf("Women") === -1
                  ? jogo.time1.nome
                  : jogo.time1.nome.slice(0, -5) + "Feminino"
              }
              className="h-12 w-16 object-contain lg:h-16 lg:w-20"
            />
            <p className="text-base font-bold lg:text-lg">
              {jogo.time1.nome.indexOf("Women") === -1
                ? jogo.time1.nome
                : jogo.time1.nome.slice(0, -5) + "Feminino"}
            </p>
          </div>
          <div className="flex w-2/5 flex-col items-center gap-2">
            <img
              src={jogo.time2.img}
              alt={
                jogo.time2.nome.indexOf("Women") === -1
                  ? jogo.time2.nome
                  : jogo.time2.nome.slice(0, -5) + "Feminino"
              }
              className="h-12 w-16 object-contain lg:h-16 lg:w-20"
            />
            <p className="text-base font-bold lg:text-lg">
              {jogo.time2.nome.indexOf("Women") === -1
                ? jogo.time2.nome
                : jogo.time2.nome.slice(0, -5) + "Feminino"}
            </p>
          </div>
        </div>

        <div className="-mt-2 flex items-center justify-center gap-4">
          <p className="text-5xl font-bold text-black lg:text-6xl">
            {jogo.time1.placar}
          </p>
          <div className="flex flex-col items-center text-center">
            <span className="text-xs whitespace-nowrap text-gray-500 lg:text-sm">
              {getStatusTraduzido(jogo.status)}
            </span>
            <span className="text-xl font-bold text-gray-400 lg:text-2xl">
              X
            </span>
          </div>
          <p className="text-5xl font-bold text-black lg:text-6xl">
            {jogo.time2.placar}
          </p>
        </div>

        <div className="mt-2 flex min-h-[60px] w-full flex-col items-center justify-center gap-1 text-center text-xs text-gray-700 lg:min-h-[80px] lg:text-sm">
          {jogo.data && (
            <p>
              <strong>Data:</strong>{" "}
              {new Date(jogo.data).toLocaleDateString("pt-BR", {
                timeZone: "UTC",
              })}
            </p>
          )}
          {jogo.horario && (
            <p>
              <strong>Horário:</strong>{" "}
              {formatarHorarioLocal(jogo.data, jogo.horario)}
            </p>
          )}
          {jogo.estadio && (
            <p>
              <strong>Estádio:</strong> {jogo.estadio}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Modal;
