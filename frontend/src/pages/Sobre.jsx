import Banner from "../components/home/Banner";

function Sobre() {
  return (
    <div className="relative flex flex-col items-center pt-26 lg:pt-30">
      <Banner img={"/images/sections/faixa-roxa.webp"} cor={"#981FBA"} txt={"Sobre Nós"} />
      <div className="relative -top-5 mx-auto flex w-full flex-col items-center gap-6 p-6 md:max-w-[80%] lg:max-w-[70%]">
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
