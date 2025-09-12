import { useState, useEffect } from "react";
import { SunDim, X, CircleUserRound, Menu } from 'lucide-react';
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LogOut } from 'lucide-react';

import Logo from "../assets/logo.png";

function Navbar() {

const { isAdmin, logout } = useAuth();   const [ativo, setAtivo] = useState(false);
  useEffect(() => {
    if (ativo) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [ativo]);

  return (
    <header className="fixed z-999 flex h-16 w-screen justify-between items-center bg-[#981FBA] px-6 py-2.5 lg:h-20">
      <div className="flex gap-1">
        <Link to="/">
          <img src={Logo} alt="Logo do Passa a Bola" className="h-11" />
        </Link>
      </div>

      <div className="flex items-center gap-2.5">
       {isAdmin ? (
          <button onClick={logout} title="Sair">
            <LogOut color="#ffffff" className="cursor-pointer size-6 lg:size-8 text-white" />
          </button>
        ) : (
          <Link to="/login">
            <CircleUserRound color="#ffffff" className="cursor-pointer size-6 lg:size-8 text-white" />
          </Link>
        )}
      </div>

      <span
        className={`bg-opacity-100 absolute inset-0 h-dvh bg-black transition-opacity duration-300 ease-in-out ${ativo ? "opacity-50" : "pointer-events-none opacity-0"} `}
        onClick={() => setAtivo(!ativo)}
      ></span>

      <div
        className={`absolute top-0 right-0 flex h-dvh w-2/3 flex-col items-end justify-between bg-[#981fba] p-6 transition-transform duration-300 ease-in-out md:w-2/5 lg:w-1/4 ${ativo ? "translate-x-0" : "translate-x-full"} `}
      >
        {ativo && (
          <>
            <button
              onClick={() => setAtivo(!ativo)}
            >
              <X color="#ffffff" className="cursor-pointer size-6 lg:size-8 text-white" />
            </button>

            <nav className="self-start">
              <ul className="flex w-full flex-col gap-3.5 text-left text-2xl font-bold text-white uppercase">
                {isAdmin && ( // Link Visível apenas para o Admin
              <li><Link to="/admin/criar-encontro" onClick={() => setAtivo(false)}>Criar Encontro</Link></li>
                )}
                <li><Link to="/encontros" onClick={() => setAtivo(false)}>Próximos Encontros</Link></li>
                <li><Link to="/placares" onClick={() => setAtivo(false)}>Placares e Notícias</Link></li>
                <li><Link to="/sobre" onClick={() => setAtivo(false)}>Sobre</Link></li>

              </ul>
            </nav>

            <button><SunDim className='size-8 text-white' /></button>
          </>
        )}
      </div>
    </header>
  );
}

export default Navbar;
