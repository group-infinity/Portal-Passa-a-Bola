import Banner from "../components/home/Banner";
import Liga from "../components/placares/Liga";
import GrupoNoticias from "../components/noticias/GrupoNoticias";
import SobreSecoes from "../components/home/SobreSecoes";

import BannerVerde from "../assets/sections/faixa-verde.png";

function Placares() {
  return (
    <div className="relative flex flex-col items-center pt-26 lg:pt-30">
      <section className="h-fit w-full">
        <Banner img={BannerVerde} cor={"#6EAA38"} txt={"placares de jogos"} />
        <div className="relative -top-5 mx-auto flex w-full flex-col items-center gap-6 p-6 md:max-w-[80%] lg:max-w-[70%]">
          <div className="my-5 flex w-full flex-col gap-10 lg:my-10 lg:gap-20">
            {/* <SobreSecoes cor="#6EAA38" txt="acompanhe as ligas atuais!" /> */}

            <section className="flex flex-col gap-2.5">
              <div className="flex w-full flex-col items-center gap-4 rounded-sm  p-2 lg:gap-5">
                <Liga />
              </div>
            </section>
          </div>

          {/* <div className="my-5 flex w-full flex-col gap-10 lg:my-10 lg:gap-20">
            <SobreSecoes
              cor="#6EAA38"
              txt="fique ligada no que está acontecendo!"
            />
            <div className="flex w-full flex-col gap-4 lg:max-h-fit">
              <GrupoNoticias />
            </div>
          </div> */}
        </div>
      </section>
    </div>
  );
}

export default Placares;
