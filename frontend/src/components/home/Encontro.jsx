import { Link } from "react-router-dom";
import BannerVermelho from "../../assets/sections/banner-verm.png";

function Encontro({ id, nome, diaI, diaF, encontro, atual, vagas, isFull }) {
  return (
    <div className={`rounded-[10px] ${encontro ? "max-w-full" : "max-w-[90%] md:max-w-[50%]"} w-full h-fit p-4 flex flex-col gap-2 border-1 border-[rgba(0,0,0,0.25)] flex-shrink-0`}>
      <h3 className="!text-2xl font-bold uppercase">{nome}</h3>
      <div className="flex-col w-full">
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
          className={`w-full p-3 font-bold text-white rounded-sm uppercase text-center text-xl bg-cover bg-no-repeat bg-gray-500 opacity-60 cursor-not-allowed`}
        >
          Inscrições Encerradas
        </button>
      ) : (
        <Link
          to={`/encontros/${id}/inscrever`}
          style={{ backgroundImage: `url(${BannerVermelho})` }}
          className={`w-full p-3 font-bold text-white rounded-sm uppercase text-center text-xl bg-cover bg-no-repeat`}
        >
          Inscreva-se
        </Link>
      )}
    </div>
  );
}

export default Encontro;