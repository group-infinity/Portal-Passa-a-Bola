import { useState, useEffect, useRef } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

import Banner from "../components/home/Banner";
import Encontro from "../components/home/Encontro";
import Liga from "../components/placares/Liga";
import GrupoNoticias from "../components/noticias/GrupoNoticias";
import SobreSecoes from "../components/home/SobreSecoes";
import Faq from "../components/home/Faq";
import Loading from "../components/utils/Loading";

import { getEncontros } from "../services/EncontroService";

function Home() {
  const [encontros, setEncontros] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.warn("A reprodução automática do vídeo foi bloqueada pelo navegador:", error);
      });
    }
  }, []);

  useEffect(() => {
    const fetchEncontros = async () => {
      try {
        setLoading(true);
        const data = await getEncontros();
        setEncontros(data.slice(0, 5));
      } catch (error) {
        console.error("Erro ao buscar encontros:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEncontros();
  }, []);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === "left" ? -350 : 350;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const calcularVagasOcupadas = (encontro) => {
    return encontro.inscricoes.reduce((total, insc) => {
      return total + (insc.tipo === "conjunta" ? insc.membros.length : 1);
    }, 0);
  };

  return (
    <div className="relative mt-16 flex flex-col items-center lg:mt-20">
      <section className="relative -z-999 h-[85lvh] w-full overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src="/passaabola.webm" type="video/webm" />
          <source src="/passaabola.mp4" type="video/mp4" />
        </video>

        <div className="absolute inset-0 z-1 bg-gradient-to-b from-black/75 via-transparent to-black/75"></div>

        <div className="relative z-30 inline-grid h-full w-full p-6">
          <div className="w-full self-start text-white md:max-w-3/4">
            <h1 className="font-[Anton] text-4xl md:text-6xl">
              A <span className="text-[#981FBA] lg:text-7xl"> CASA </span> DO
              FUTEBOL FEMININO!
            </h1>
            <p className="mt-2 max-w-4/5 text-sm md:text-xl">
              A paixão pelo futebol feminino ganha força e se une em um só
              lugar! Junte-se a nós e faça parte desta transformação.
            </p>
          </div>
          <img
            src="/images/logos/logoPb.webp"
            alt="Logo do Passa a Bola"
            className="h-15 w-15 self-end justify-self-center opacity-70"
          />
        </div>
      </section>

      <div className="flex w-full flex-col items-center gap-4">
        <section className="h-fit w-full">
          <Banner
            img={"/images/sections/faixa-vermelha.webp"}
            cor={"#BA1B31"}
            txt={"próximos encontros"}
          />
          <div className="relative -top-5 mx-auto flex w-full flex-col items-center gap-2 p-6 md:max-w-[80%] lg:max-w-[70%] lg:gap-10">
            <SobreSecoes
              cor="#BA1B31"
              txt="Jogue com a gente! Gratuito e para todas."
            />

            <div className="relative mt-4 flex w-full flex-col items-center gap-4">
              <div className="relative flex w-full items-center justify-center">
                <button
                  onClick={() => scroll("left")}
                  className="absolute top-1/2 -left-16 z-10 hidden -translate-y-1/2 cursor-pointer p-2 md:block"
                  aria-label="Rolar para a esquerda"
                >
                  <ChevronLeft className="size-10 text-gray-500" />
                </button>
                <div
                  ref={scrollContainerRef}
                  className="flex w-full justify-center gap-3 overflow-x-auto scroll-smooth pb-4"
                  style={{ scrollbarWidth: "none" }}
                >
                  {loading && (
                    <Loading cor="#BA1B31" txt="Buscando encontros..." />
                  )}

                  {!loading && encontros.length === 0 ? (
                    <p>Não há encontros ativos.</p>
                  ) : !loading && (
                    <div className="flex w-full">
                      {encontros.map((encontroItem, index) => {
                        const vagasOcupadas =
                          calcularVagasOcupadas(encontroItem);
                        const isFull = vagasOcupadas >= encontroItem.totalVagas;

                        return (
                          <Encontro
                            key={index}
                            id={encontroItem.id}
                            nome={encontroItem.nome}
                            diaI={encontroItem.diaI}
                            diaF={encontroItem.diaF}
                            vagas={encontroItem.totalVagas}
                            local={encontroItem.local}
                            atual={vagasOcupadas}
                            isFull={isFull}
                            encontro={false}
                          />
                        );
                      })}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => scroll("right")}
                  className="absolute top-1/2 -right-16 z-10 hidden -translate-y-1/2 cursor-pointer p-2 md:block"
                  aria-label="Rolar para a direita"
                >
                  <ChevronRight className="size-10 text-gray-500" />
                </button>
              </div>
              <div className="flex w-full justify-between">
                <div className="flex max-w-1/2 flex-col gap-1 opacity-50">
                  <p className="w-full text-left text-xs">* Vagas limitadas.</p>
                  <p className="w-full text-left text-xs">
                    * As inscrições podem encerrar antes do prazo.
                  </p>
                </div>

                <div className="flex h-fit w-fit cursor-pointer items-center gap-1 self-start">
                  <Link
                    to="/encontros"
                    className="text-[#BA1B31] hover:underline"
                  >
                    Ver tudo
                  </Link>
                  <ArrowRight color="#BA1B31" className="size-6" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="h-fit w-full">
          <Banner
            img={"/images/sections/faixa-verde.webp"}
            cor={"#6EAA38"}
            txt={"placares e notícias"}
          />
          <div className="relative -top-5 mx-auto flex w-full flex-col items-center gap-6 p-6 md:max-w-[80%] lg:max-w-[70%]">
            <div className="my-5 flex w-full flex-col gap-10 lg:my-10 lg:gap-10">
              <SobreSecoes cor="#6EAA38" txt="acompanhe as ligas atuais!" />

              <section className="flex flex-col gap-2.5">
                <div className="flex w-full flex-col items-center gap-4 rounded-sm lg:gap-5">
                  <Liga />
                </div>

                <div className="flex h-fit w-fit cursor-pointer items-center gap-1 self-end">
                  <Link
                    to="/placares"
                    className="text-[#6EAA38] hover:underline"
                  >
                    Ver tudo
                  </Link>
                  <ArrowRight color="#6EAA38" className="size-6" />
                </div>
              </section>
            </div>

            <div className="my-5 flex w-full flex-col gap-10 lg:my-10 lg:gap-10">
              <SobreSecoes
                cor="#6EAA38"
                txt="fique ligada no que está acontecendo!"
              />
              <div className="flex w-full flex-col gap-4 lg:max-h-fit">
                <GrupoNoticias />

                <div className="flex h-fit w-fit cursor-pointer items-center gap-1 self-end">
                  <Link
                    to="/noticias"
                    className="text-[#6EAA38] hover:underline"
                  >
                    Ver tudo
                  </Link>
                  <ArrowRight color="#6EAA38" className="size-6" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="h-fit w-full">
          <Banner
            img={"/images/sections/faixa-roxa.webp"}
            cor={"#981FBA"}
            txt={"perguntas frequentes"}
          />

          <div className="relative -top-5 mx-auto flex w-full flex-col items-center gap-6 p-6 md:max-w-[80%] lg:max-w-[70%]">
            <Faq></Faq>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Home;
