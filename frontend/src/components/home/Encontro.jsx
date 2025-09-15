import { Link } from "react-router-dom";
import BannerVermelho from "../../assets/sections/banner-verm.webp";

function Encontro({ id, nome, diaI, diaF, encontro, atual, vagas, isFull }) {
  return (
    <div
      className={`rounded-[10px] ${encontro ? "max-w-full" : "max-w-[90%] md:max-w-[50%]"} flex h-fit w-full flex-shrink-0 flex-col gap-2 border-1 border-[rgba(0,0,0,0.25)] p-4`}
    >
      <h3 className="!text-2xl font-bold uppercase">{nome}</h3>
      <div className="w-full flex-col">
        <div className="flex justify-between">
          <div className="flex items-center justify-center py-2">
            <p>
              <strong>Data: </strong>
              {diaI}
            </p>
          </div>

          <div className="flex items-center justify-center py-2">
            <p>
              <strong>Inscrições até: </strong>
              {diaF}
            </p>
          </div>
        </div>

        <div className="flex items-center py-2">
          <p>
            <strong>Vagas: </strong>
            {`${atual}/${vagas}`}
          </p>
        </div>
      </div>

      {isFull ? (
        <button
          disabled
          style={{ backgroundImage: `url(${BannerVermelho})` }}
          className={`w-full cursor-not-allowed rounded-sm bg-gray-500 bg-cover bg-no-repeat p-3 text-center text-xl font-bold text-white uppercase opacity-60`}
        >
          Inscrições Encerradas
        </button>
      ) : (
        <Link
          to={`/encontros/${id}/inscrever`}
          style={{ backgroundImage: `url(${BannerVermelho})` }}
          className={`w-full rounded-sm bg-cover bg-no-repeat p-3 text-center text-xl font-bold text-white uppercase`}
        >
          Inscreva-se
        </Link>
      )}
    </div>
  );
}

export default Encontro;
