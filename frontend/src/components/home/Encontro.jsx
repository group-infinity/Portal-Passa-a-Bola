import { Link } from "react-router-dom";

function Encontro({ id, nome, diaI, diaF, encontro, atual, vagas, isFull, local }) {
  return (
    <div
      className={`rounded-[10px] ${encontro ? "max-w-full" : "max-w-[90%] md:max-w-[50%]"} flex h-fit w-full flex-shrink-0 flex-col gap-2 border-1 border-[rgba(0,0,0,0.25)] p-4`}
    >
      <h3 className="!text-2xl font-bold uppercase">{nome}</h3>
      <div className="w-full flex-col">
        <div className="flex justify-around">
          <div className="flex flex-col items-center justify-center py-2">
              <strong>Data do Encontro: </strong>
            <p>
              {diaI}
            </p>
          </div>

          <div className="flex flex-col items-center justify-center py-2">
              <strong>Inscrições até: </strong>
            <p>
              {diaF}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center py-2">
            <strong>Vagas restantes: </strong>
          <p>
            {`${atual}/${vagas}`}
          </p>
        </div>
        <div className="flex justify-center gap-1 py-2">
            <strong>Local: </strong>
          <p>
            {local}
          </p>
        </div>
      </div>

      {isFull ? (
        <button
          disabled
          style={{ backgroundImage: `url(/images/sections/banner-verm.webp)` }}
          className={`w-full cursor-not-allowed rounded-sm bg-gray-500 bg-cover bg-no-repeat p-3 text-center text-xl font-bold text-white uppercase opacity-60`}
        >
          Inscrições Encerradas
        </button>
      ) : (
        <Link
          to={`/encontros/${id}/inscrever`}
          style={{ backgroundImage: `url(/images/sections/banner-verm.webp)` }}
          className={`w-full rounded-sm bg-cover bg-no-repeat p-3 text-center text-xl font-bold text-white uppercase`}
        >
          Inscreva-se
        </Link>
      )}
    </div>
  );
}

export default Encontro;
