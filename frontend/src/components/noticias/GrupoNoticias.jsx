// src/components/noticias/GrupoNoticias.jsx

import Noticia from "./Noticia";

import Imagem from "/noticias/santos.webp";
import Favicon from "/noticias/favicon.png";

function GrupoNoticias() {
  const dados = {
    noticias: [
      {
        id: 1,
        fonte: {
          nome: "Antenados no Futebol",
          logoUrl: Favicon,
        },
        titulo: "Com título do Santos, Brasileirão Feminino A2 se encerra com acesso de Botafogo, Atlético-MG e Fortaleza",
        resumo: "Santos e Botafogo se enfrentaram na Vila Belmiro na tarde deste sábado (30), com a equipe santista ficando com a taça após empate de 1 a 1.",
        tempoPublicacao: "1 dia atrás",
        imagemUrl: Imagem,
      },
      {
        id: 2,
        fonte: {
          nome: "Antenados no Futebol",
          logoUrl: Favicon,
        },
        titulo: "Com título do Santos, Brasileirão Feminino A2 se encerra com acesso de Botafogo, Atlético-MG e Fortaleza",
        resumo: "Santos e Botafogo se enfrentaram na Vila Belmiro na tarde deste sábado (30), com a equipe santista ficando com a taça após empate de 1 a 1.",
        tempoPublicacao: "1 dia atrás",
        imagemUrl: Imagem,
      },
      {
        id: 3,
        fonte: {
          nome: "Antenados no Futebol",
          logoUrl: Favicon,
        },
        titulo: "Com título do Santos, Brasileirão Feminino A2 se encerra com acesso de Botafogo, Atlético-MG e Fortaleza",
        resumo: "Santos e Botafogo se enfrentaram na Vila Belmiro na tarde deste sábado (30), com a equipe santista ficando com a taça após empate de 1 a 1.",
        tempoPublicacao: "1 dia atrás",
        imagemUrl: Imagem,
      },
    ],
  };

  // Pega as 4 primeiras notícias para preencher o grid
  const [noticia1, noticia2, noticia3] = dados.noticias;

  return (
    <div className="flex flex-col gap-4 h-min md:grid md:grid-cols-4 md:grid-rows-2 md:gap-4">

      <div className="md:col-span-4 h-fit">
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