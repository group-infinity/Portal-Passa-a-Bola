function Noticia({ titulo, resumo, fonte, tempo, img }) {
  return (
    <div className="flex h-fit flex-col gap-2.5 rounded-sm border-1 border-[rgba(0,0,0,0.25)] p-2.5 md:p-5">
      <div>
        <a href="#">
          <img
            src={img}
            alt={titulo}
            loading="lazy"
            className="w-full rounded-[2px] object-cover md:h-60"
          />
        </a>
      </div>

      <div className="flex w-full flex-col gap-2.5">
        <h3 className="line-clamp-2 h-fit w-full !text-xl lg:!text-3xl font-black">
          <a href="#">{titulo}</a>
        </h3>
        <p className="line-clamp-2 text-wrap text-sm lg:text-lg">{resumo}</p>
      </div>

      <div className="flex items-center gap-1">
        <img
          src={fonte.logoUrl}
          alt={`Logo de ${fonte.nome}`}
          loading="lazy"
          className="size-6 rounded-full"
        />
        <div className="flex items-center gap-2">
          <p className="line-clamp-1 truncate text-xs">{fonte.nome}</p>
          <span className="h-1 w-1 rounded-full bg-black opacity-25"></span>
          <p className="text-xs">{tempo}</p>
        </div>
      </div>
    </div>
  );
}

export default Noticia;
