import Banner from "../components/home/Banner";
import Encontro from "../components/home/Encontro";
import SobreSecoes from "../components/home/SobreSecoes";

import FaixaVermelha from "../assets/sections/faixa-vermelha.png";

function Encontros() {
  return (
    <div className="relative flex flex-col items-center pt-26 lg:pt-30">
      <section className="h-fit w-full">
        <Banner
          img={FaixaVermelha}
          cor={"#BA1B31"}
          txt={"próximos encontros"}
        />
        <div className="relative -top-5 mx-auto flex w-full flex-col items-center gap-2 p-6 md:max-w-[80%] lg:max-w-[70%]">
          <SobreSecoes
            cor="#BA1B31"
            txt="Jogue com a gente! Gratuito e para todas."
          />

          <div className="relative mt-4 flex flex-col w-full gap-4 md:grid md:grid-cols-2">
            {[...Array(9)].map((_, i) => (
              <Encontro
                key={i}
                nome={`Encontro nº${i + 1}`}
                diaI="27/10/2025"
                diaF="30/10/2025"
                encontro={true}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Encontros;
