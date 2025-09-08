function Encontro({nome, diaI, diaF, img}){
  return(
    <div className="rounded-[10px] max-w-fit h-fit p-4 flex flex-col gap-2 shadow-[0px_0px_7px_5px_#cbd5e0] flex-shrink-0">
      <h3 className="text-xl font-bold uppercase">{nome}</h3>

      <div className="w-full flex justify-between">
        <div className="flex justify-center items-center p-2">
          <p><strong>Data: </strong>{diaI}</p>
        </div>

        <div className="flex justify-center items-center p-2">
          <p><strong>Inscrições até: </strong>{diaF}</p>
        </div>
      </div>

      <a href="#" style={{backgroundImage: `url(${img})`}} className={`w-full p-3 font-bold text-white rounded-sm uppercase text-center text-xl bg-cover bg-no-repeat`}>Inscreva-se</a>
    </div>
  )
}

export default Encontro;
