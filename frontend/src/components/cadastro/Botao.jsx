const Botao = ({ txt, disabled, ...rest }) => {
  return (
    <button
      type="submit"
      disabled={disabled}
      className="cursor-pointer rounded-sm bg-[#981FBA] py-3 font-[Anton] text-xl text-white uppercase transition-colors duration-150 hover:bg-[#5b1587] lg:py-4 lg:text-3xl disabled:cursor-not-allowed disabled:bg-gray-400"
      {...rest}
    >
      {/* Mostra um texto diferente enquanto está "enviando" */}
      {disabled ? 'entrando...' : txt}
    </button>
  );
};

export default Botao;