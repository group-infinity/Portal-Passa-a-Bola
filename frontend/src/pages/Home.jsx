import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import Banner from "../components/home/Banner";
import Encontro from "../components/home/Encontro";
import Liga from "../components/placares/Liga";
import GrupoNoticias from "../components/noticias/GrupoNoticias";
import SobreSecoes from "../components/home/SobreSecoes";
import Faq from "../components/home/Faq";

import HeroBg from "../assets/hero/hero.png";
import Logo from "../assets/hero/logoPb.png";
import FaixaVerde from "../assets/sections/faixa-verde.png";
import FaixaVermelha from "../assets/sections/faixa-vermelha.png";
import FaixaRoxa from "../assets/sections/faixa-roxa.png";

function Home() {
  return (
    <div className="relative flex flex-col items-center pt-16 lg:pt-20">
      <section className="relative h-[85lvh] w-full overflow-hidden -z-999">
        <video
          autoPlay
          loop
          muted
          className="absolute inset-0  h-full w-full object-cover"
        >
          <source src="/passaabola.mp4" type="video/mp4" />
        </video>

        <div className="absolute inset-0 z-1 bg-gradient-to-b from-black/100 via-transparent to-black/100"></div>

        <div className="relative z-30 inline-grid h-full w-full p-6">
          <div className="w-full  text-white self-start">
            <h1 className="font-[Anton] text-4xl">
              A <span className="text-[#981FBA] text-5xl">{" "} CASA {" "}</span> DO FUTEBOL FEMININO!
            </h1>
            <p className="max-w-4/5 text-sm mt-2">A paixão pelo futebol feminino ganha força e se une em um só lugar! Junte-se a nós e faça parte desta transformação.</p>
          </div>
          <img
            src={Logo}
            alt="Logo do Passa a Bola"
            className="h-15 w-15 opacity-70 self-end justify-self-center"
          />
        </div>
      </section>

      <div className="flex w-full flex-col items-center gap-4">
        <section className="h-fit w-full">
          <Banner
            img={FaixaVermelha}
            cor={"#BA1B31"}
            txt={"próximos encontros"}
          />
          <div className="relative -top-5 mx-auto flex w-full flex-col items-center gap-2 p-6 md:max-w-[80%] lg:max-w-[70%] lg:gap-10">
            <SobreSecoes
              cor="#BA1B31"
              txt="Jogue com a gente! Gratuito e para todas."
            />

            <div className="relative mt-4 flex w-full flex-col gap-4">
              <div className="flex gap-3 overflow-x-auto pb-4">
                {[...Array(5)].map((_, i) => (
                  <Encontro
                    key={i}
                    nome={`Encontro nº${i + 1}`}
                    diaI="27/10/2025"
                    diaF="30/10/2025"
                  />
                ))}
              </div>
              <div className="flex w-full justify-between">
                <div className="flex max-w-1/2 flex-col gap-1 opacity-50">
                  <p className="w-full text-left text-xs">*Vagas limitadas.</p>
                  <p className="w-full text-left text-xs">
                    *As inscrições podem encerrar antes do prazo.
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
            img={FaixaVerde}
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
            img={FaixaRoxa}
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
