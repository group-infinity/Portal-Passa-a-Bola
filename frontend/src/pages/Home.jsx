import { ArrowRight } from "lucide-react";

import Banner from "../components/home/Banner";
import Encontro from "../components/home/Encontro";
import Liga from "../components/placares/Liga";
import GrupoNoticias from "../components/noticias/GrupoNoticias";
import SobreSecoes from "../components/home/SobreSecoes";

import HeroBg from "../assets/hero/hero.png";
import Logo from "../assets/hero/logoPb.png";
import BannerVerm from "../assets/sections/faixa-verm.png";
import BannerVerde from "../assets/sections/faixa-verde.png";
import BannerVerdeDesk from "../assets/sections/faixa-verde-desktop.png";
import BannerRoxa from "../assets/sections/faixa-roxa.png";
import FaixaVerm from "../assets/sections/banner-verm.png";

function Home() {
  return (
    <div className="relative flex flex-col items-center pt-16 lg:pt-20">
      <section className="relative h-[85lvh] w-full">
        <div className="absolute -z-999 flex h-full w-full justify-center overflow-hidden">
          <img
            src={HeroBg}
            alt=""
            className="pointer-events-none h-full w-full object-cover select-none"
          />
        </div>
        <div className="flex h-full w-full flex-col items-center justify-between p-6">
          <div className="w-full font-[Anton] text-4xl text-white">
            <h1>
              A <br />
              <span className="text-8xl text-[#981FBA] lg:text-9xl">
                {" "}
                CASA{" "}
              </span>
              <br />
              DO FUTEBOL FEMININO
            </h1>
          </div>
          <img
            src={Logo}
            alt="Logo do Passa a Bola"
            className="h-15 w-15 opacity-70"
          />
        </div>
      </section>

      <div className="flex w-full flex-col items-center gap-4">
        <section className="h-fit w-full">
          <Banner img={BannerVerm} cor={"#BA1B31"} txt={"próximos encontros"} />
          <div className="relative -top-5 mx-auto flex w-full flex-col items-center gap-2 p-6 md:max-w-[80%] lg:max-w-[70%]">
            <SobreSecoes
              cor="#BA1B31"
              txt="Jogue com a gente! Gratuito e para todas."
            />

            <div className="relative mt-4 flex w-full">
              <div className="flex gap-3 overflow-x-auto scroll-smooth p-4">
                {[...Array(5)].map((_, i) => (
                  <Encontro
                    key={i}
                    nome={`Encontro nº${i + 1}`}
                    diaI="27/10/2025"
                    diaF="30/10/2025"
                    img={FaixaVerm}
                  />
                ))}
              </div>
            </div>

            <div className="flex w-full justify-between">
              <div className="flex max-w-1/2 flex-col gap-1 opacity-50">
                <p className="w-full text-left text-xs">*Vagas limitadas.</p>
                <p className="w-full text-left text-xs">
                  *As inscrições podem encerrar antes do prazo.
                </p>
              </div>

              <div className="flex h-fit w-fit cursor-pointer items-center gap-1 self-end">
                <a className="text-[#BA1B31] hover:underline">Ver tudo</a>
                <ArrowRight color="#BA1B31" className="size-6" />
              </div>
            </div>
          </div>
        </section>

        <section className="h-fit w-full">
          <Banner
            img={BannerVerdeDesk}
            cor={"#6EAA38"}
            txt={"placares e notícias"}
          />
          <div className="relative -top-5 mx-auto flex w-full flex-col items-center gap-6 p-6 md:max-w-[80%] lg:max-w-[70%]">
            <div className="my-5 flex w-full flex-col gap-10 lg:my-10 lg:gap-20">
              <SobreSecoes cor="#6EAA38" txt="acompanhe as ligas atuais!" />

              <section className="flex flex-col gap-2.5">
                <div className="flex w-full flex-col items-center gap-4 p-2 border-1 rounded-sm border-[rgba(0,0,0,0.25)] lg:gap-5">
                  <Liga />
                </div>

                <div className="flex h-fit w-fit cursor-pointer items-center gap-1 self-end">
                  <a className="text-[#6EAA38] hover:underline">Ver tudo</a>
                  <ArrowRight color="#6EAA38" className="size-6" />
                </div>
              </section>
            </div>

            <div className="my-5 flex w-full flex-col gap-10 lg:my-10 lg:gap-20">
              <SobreSecoes
                cor="#6EAA38"
                txt="fique ligada no que está acontecendo!"
              />
              <div className="flex w-full flex-col gap-4 lg:max-h-fit">
                <GrupoNoticias />

                <div className="flex h-fit w-fit cursor-pointer items-center gap-1 self-end">
                  <a className="text-[#6EAA38] hover:underline">Ver tudo</a>
                  <ArrowRight color="#6EAA38" className="size-6" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Home;
