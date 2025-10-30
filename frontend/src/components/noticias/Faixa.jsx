const Faixa = ({txt, bg}) => {
  return (
    <div className="relative flex items-center justify-center overflow-hidden p-6">
      <img
        src={bg}
        alt={txt}
        className="absolute -z-999 select-none"
      />

      <h1 className="font-[Anton] !text-5xl text-white uppercase text-center">{txt}</h1>
    </div>
  );
};

export default Faixa;
