import { ArrowRight } from 'lucide-react';

// O componente agora espera a prop 'info', que é o objeto com os dados da liga
function LigaHeader({ info }) {
  // Adicionamos uma verificação de segurança. Se, por algum motivo,
  // os dados da liga não chegarem, o componente simplesmente não renderiza, evitando erros.
  if (!info) {
    return null;
  }

  return (
    <div className="flex items-center gap-2.5 lg:gap-4">
      {/* {console.log(info)} */}
      <div className="relative flex min-h-10 min-w-10 flex-shrink-0 items-center justify-center rounded-lg border border-[rgba(0,0,0,0.25)] p-1 lg:min-h-12 lg:min-w-12">
        <img
          src={info.strBadge} // <-- DADO DINÂMICO
          alt={`Logo da ${info.strLeague}`} // <-- DADO DINÂMICO (bom para acessibilidade)
          className="size-7.5 lg:size-9 object-contain" // object-contain garante que a imagem não distorça
        />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate font-bold lg:text-lg">{info.strLeague}</p> {/* <-- DADO DINÂMICO */}
        <p className="lg:text-base text-sm text-gray-600">{info.strCountry}</p> {/* <-- DADO DINÂMICO (Exemplo: "Brazil") */}
      </div>

      <div className="flex h-fit w-fit cursor-pointer items-center gap-1 self-end">
        <a className="text-[#6EAA38] hover:underline">Ver tudo</a>
        <ArrowRight color="#6EAA38" className="size-6" />
      </div>
    </div>
  );
}

export default LigaHeader;