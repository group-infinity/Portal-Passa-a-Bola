import Banner from "../components/home/Banner";
import FaixaRoxa from "../assets/sections/faixa-roxa.webp";
import Logo from "../assets/logoPb.webp";

function Sobre() {
  return (
    <div className="relative flex flex-col items-center pt-26 lg:pt-30">
      <Banner img={FaixaRoxa} cor={"#981FBA"} txt={"Sobre Nós"} />
      <div className="relative -top-5 mx-auto flex w-full flex-col items-center gap-6 p-6 md:max-w-[80%] lg:max-w-[70%]">
        {/* <img
          src={Logo}
          alt="Logo do Passa a Bola"
          className="h-20 w-20 opacity-70"
        /> */}
        <p className="text-center text-lg leading-relaxed">
          O <strong>PASSA A BOLA</strong> é uma marca influente e{" "}
          <strong>
            o maior canal de futebol feminino da América do Sul e Latina
          </strong>
          , fundada por Luana Maluf e Alê Xavier. Com um forte dever social, a
          iniciativa visa impulsionar e melhorar o futebol feminino na sociedade
          brasileira.
        </p>
      </div>
    </div>
  );
}

export default Sobre;
