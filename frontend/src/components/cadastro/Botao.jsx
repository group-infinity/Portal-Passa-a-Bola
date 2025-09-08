const Botao = ({txt}) => {
  return (
    <button
      type="submit"
      className="cursor-pointer rounded-sm bg-[#981FBA] py-3 font-[Anton] text-xl text-white uppercase transition-colors duration-150 hover:bg-[#5b1587] lg:py-4 lg:text-3xl"
    >
      {txt}
    </button>
  );
};

export default Botao;
