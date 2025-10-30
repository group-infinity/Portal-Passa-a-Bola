import Noticia from "./Noticia";
import { useLocation } from "react-router-dom";

function GrupoNoticias() {
  const location = useLocation();
  const isNewsPage = location.pathname === "/noticias";

  const dados = {
    noticias: [
      {
        id: 1,
        fonte: {
          nome: "Antenados no Futebol",
          logoUrl: "/images/noticias/favicon.webp",
          link: "https://www.antenadosnofutebol.com.br/futebol-feminino/com-titulo-do-santos-brasileirao-feminino-a2-se-encerra-com-acesso-de-botafogo-atletico-mg-e-fortaleza"
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
          nome: "Globo Esporte",
          logoUrl: "/images/noticias/favicon-ge.webp",
          link: "https://ge.globo.com/sp/ribeirao-preto-e-regiao/futebol/futebol-feminino/copa-do-brasil-feminina/noticia/2025/09/25/copa-do-brasil-feminina-2025-veja-classificados-para-semifinais.ghtml"
        },
        titulo:
          "Copa do Brasil Feminina 2025: veja classificados para semifinais",
        resumo:
          "Duelos da próxima fase serão definidos por sorteio, que ainda não tem data marcada.",
        tempoPublicacao: "7 dias atrás",
        imagemUrl: "/images/noticias/ge-bg.webp",
      },
      {
        id: 3,
        fonte: {
          nome: "Globo Esporte",
          logoUrl: "/images/noticias/favicon-ge.webp",
          link: "https://ge.globo.com/futebol/times/corinthians/noticia/2025/09/22/conheca-ana-morganti-promessa-do-corinthians-de-16-anos-que-ja-foi-convocada-para-a-selecao.ghtml"
        },
        titulo:
          "Conheça Ana Morganti, promessa do Corinthians de 16 anos que já foi convocada para a Seleção",
        resumo:
          "Jogadora chegou ao Timão com 13 anos e, recentemente, conquistou o Brasileirão Feminino Sub-17.",
        tempoPublicacao: "7 dias atrás",
        imagemUrl: "/images/noticias/ge-bg2.webp",
      },
    ],
  };

  const [noticia1, noticia2, noticia3] = dados.noticias;

  return (
    <div className={isNewsPage ? "flex flex-col gap-4" : "flex h-min flex-col gap-4 lg:grid lg:grid-cols-4 lg:grid-rows-2 lg:gap-4"}>
      <div className="h-fit md:col-span-4">
        <Noticia
          key={noticia1.id}
          {...noticia1}
          img={noticia1.imagemUrl}
          tempo={noticia1.tempoPublicacao}
          link={noticia1.fonte.link}
        />
      </div>

      <div className="md:col-span-2">
        <Noticia
          key={noticia2.id}
          {...noticia2}
          img={noticia2.imagemUrl}
          tempo={noticia2.tempoPublicacao}
          link={noticia2.fonte.link}
        />
      </div>

      <div className="md:col-span-2">
        <Noticia
          key={noticia3.id}
          {...noticia3}
          img={noticia3.imagemUrl}
          tempo={noticia3.tempoPublicacao}
          link={noticia3.fonte.link}
        />
      </div>
    </div>
  );
}

export default GrupoNoticias;
