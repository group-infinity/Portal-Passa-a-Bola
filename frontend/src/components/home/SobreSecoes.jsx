const SobreSecoes = ({cor, txt}) => {
  return (
    <div className="relative w-full py-5 px-2 text-center md:min-w-3/5">
      <span style={{backgroundColor: `${cor}`}} className={`absolute inset-0 h-full w-full`}></span>

      <h3 className="relative font-bold text-white uppercase">
        {txt}
      </h3>
    </div>
  );
};

export default SobreSecoes;
