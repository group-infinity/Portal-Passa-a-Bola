const Botao = ({ txt, color, colorHover, disabled, ...rest }) => {
  return (
    <button
      type="submit"
      disabled={disabled}
      style={{ "--bg-color": color, "--bg-hover-color": colorHover }}
      className={`cursor-pointer rounded-sm bg-[var(--bg-color)] py-3 font-[Anton] text-xl text-white uppercase transition-colors duration-150 hover:bg-[var(--bg-hover-color)] disabled:cursor-not-allowed disabled:bg-gray-400 lg:py-4 lg:text-3xl`}
      {...rest}
    >
      {disabled ? "entrando..." : txt}
    </button>
  );
};

export default Botao;
