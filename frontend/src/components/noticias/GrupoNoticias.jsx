import Noticia from "./Noticia";

function GrupoNoticias() {
  const dados = {
    noticias: [
      {
        id: 1,
        fonte: {
          nome: "Antenados no Futebol",
          logoUrl: "/images/noticias/favicon.webp",
        },
        titulo:
          "Com título do Santos, Brasileirão Feminino A2 se encerra com acesso de Botafogo, Atlético-MG e Fortaleza",
        resumo:
          "Santos e Botafogo se enfrentaram na Vila Belmiro na tarde deste sábado (30), com a equipe santista ficando com a taça após empate de 1 a 1.",
        tempoPublicacao: "1 dia atrás",
        imagemUrl: "/images/noticias/santos.webp",
      },
      {
        id: 2,
        fonte: {
          nome: "Antenados no Futebol",
          logoUrl: "/images/noticias/favicon.webp",
        },
        titulo:
          "Com título do Santos, Brasileirão Feminino A2 se encerra com acesso de Botafogo, Atlético-MG e Fortaleza",
        resumo:
          "Santos e Botafogo se enfrentaram na Vila Belmiro na tarde deste sábado (30), com a equipe santista ficando com a taça após empate de 1 a 1.",
        tempoPublicacao: "1 dia atrás",
        imagemUrl: "/images/noticias/santos.webp",
      },
      {
        id: 3,
        fonte: {
          nome: "Antenados no Futebol",
          logoUrl: "/images/noticias/favicon.webp",
        },
        titulo:
          "Com título do Santos, Brasileirão Feminino A2 se encerra com acesso de Botafogo, Atlético-MG e Fortaleza",
        resumo:
          "Santos e Botafogo se enfrentaram na Vila Belmiro na tarde deste sábado (30), com a equipe santista ficando com a taça após empate de 1 a 1.",
        tempoPublicacao: "1 dia atrás",
        imagemUrl: "/images/noticias/santos.webp",
      },
    ],
  };

  const [noticia1, noticia2, noticia3] = dados.noticias;

  return (
    <div className="flex h-min flex-col gap-4 lg:grid lg:grid-cols-4 lg:grid-rows-2 lg:gap-4">
      <div className="h-fit md:col-span-4">
        <Noticia
          key={noticia1.id}
          {...noticia1}
          img={noticia1.imagemUrl}
          tempo={noticia1.tempoPublicacao}
        />
      </div>

      <div className="md:col-span-2">
        <Noticia
          key={noticia2.id}
          {...noticia2}
          img={noticia2.imagemUrl}
          tempo={noticia2.tempoPublicacao}
        />
      </div>

      <div className="md:col-span-2">
        <Noticia
          key={noticia3.id}
          {...noticia3}
          img={noticia3.imagemUrl}
          tempo={noticia3.tempoPublicacao}
        />
      </div>
    </div>
  );
}

export default GrupoNoticias;
