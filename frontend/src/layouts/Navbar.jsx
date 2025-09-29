import { useState, useEffect, useRef } from "react";
import { SunDim, X, CircleUserRound, Menu, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, isAdmin, logout } = useAuth();
  const [menuAberto, setMenuAberto] = useState(false);
  const [popoutAberto, setPopoutAberto] = useState(false);
  const popoutRef = useRef(null);
  const navigate = useNavigate();

  // Efeito para fechar o popout se clicar fora dele
  useEffect(() => {
    function handleClickFora(event) {
      if (popoutRef.current && !popoutRef.current.contains(event.target)) {
        setPopoutAberto(false);
      }
    }
    document.addEventListener("mousedown", handleClickFora);
    return () => {
      document.removeEventListener("mousedown", handleClickFora);
    };
  }, [popoutRef]);

  // Efeito para controlar o scroll do body quando o menu lateral está aberto
  useEffect(() => {
    if (menuAberto) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [menuAberto]);

  const handleLogout = () => {
    setPopoutAberto(false);
    logout();
  }

  const handlePerfilClick = () => {
    setPopoutAberto(false);
    navigate(`/perfil/${user.id}`);
  }

  return (
    <header className="fixed z-50 flex h-16 w-screen items-center justify-between bg-[#981FBA] px-6 py-2.5 lg:h-20">
      <div className="flex gap-1">
        <Link to="/" aria-label="Página inicial do Passa a Bola">
          <img src={"/images/logos/logo.webp"} alt="Logo do Passa a Bola" className="h-11" />
        </Link>
      </div>

      <div className="flex items-center gap-2.5" ref={popoutRef}>
          {user ? (
            <button  onClick={() => setPopoutAberto(!popoutAberto)} title="Perfil" aria-label="Abrir menu do perfil">
               <CircleUserRound
                color="#ffffff"
                className="size-6 cursor-pointer text-white lg:size-8"
                aria-hidden="true"
              />
            </button>
          ) : (
            <Link to="/login" aria-label="Página de login">
              <CircleUserRound
                color="#ffffff"
                className="size-6 cursor-pointer text-white lg:size-8"
                aria-hidden="true"
              />
            </Link>
          )}

          {/* Popout do Perfil */}
          <div className="relative" >
          {user && popoutAberto && (
            <div className="absolute right-0 mt-5 w-48 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
              <div>
                <div className="px-4 py-2 text-sm text-gray-700">
                  Olá, <span className="font-bold">{user.nome.split(" ")[0]}!</span>
                </div>
                <button
                  onClick={handlePerfilClick}
                  className="cursor-pointer block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-400"
                >
                  Perfil
                </button>
                <button
                  onClick={handleLogout}
                  className="cursor-pointer block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-400"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={() => setMenuAberto(true)}
          aria-controls="menu-navegacao"
          aria-expanded={menuAberto}
          aria-label="Abrir menu de navegação"
        >
          <Menu
            color="#ffffff"
            className="size-6 cursor-pointer text-white lg:size-8"
            aria-hidden="true"
          />
        </button>
      </div>

      {menuAberto && (
        <button
          className={`bg-opacity-50 absolute inset-0 h-dvh bg-black transition-opacity duration-300 ease-in-out ${menuAberto ? "opacity-50" : "pointer-events-none opacity-0"}`}
          onClick={() => setMenuAberto(false)}
          aria-label="Fechar menu de navegação"
          tabIndex={-1}
        ></button>
      )}

      <div
        id="menu-navegacao"
        className={`absolute top-0 right-0 flex h-dvh w-2/3 flex-col items-end justify-between bg-[#981fba] p-6 transition-transform duration-300 ease-in-out md:w-2/5 lg:w-1/4 ${menuAberto ? "translate-x-0" : "translate-x-full"}`}
        aria-hidden={!menuAberto}
      >
        {menuAberto && (
          <>
            <button
              onClick={() => setMenuAberto(false)}
              aria-label="Fechar menu de navegação"
            >
              <X
                color="#ffffff"
                className="size-6 cursor-pointer text-white lg:size-8"
                aria-hidden="true"
              />
            </button>

            <nav aria-label="Navegação principal" className="self-start">
              <ul className="flex w-full flex-col gap-3.5  text-left text-2xl font-bold text-white uppercase">
                {isAdmin && (
                  <div className="mb-20 flex flex-col gap-3.5">
                    <p className="text-sm">Controlo de Admin: </p>
                    <li>
                      <Link
                        to="/admin/dashboard"
                        onClick={() => setMenuAberto(false)}
                      >
                        Painel
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/admin/criar-encontro"
                        onClick={() => setMenuAberto(false)}
                      >
                        Criar Encontro
                      </Link>
                    </li>
                  </div>
                )}
                <li>
                  <Link to="/encontros" onClick={() => setMenuAberto(false)}>
                    Próximos Encontros
                  </Link>
                </li>
                <li>
                  <Link to="/placares" onClick={() => setMenuAberto(false)}>
                    Resultados
                  </Link>
                </li>
                <li>
                  <Link to="/noticias" onClick={() => setMenuAberto(false)}>
                    Notícias
                  </Link>
                </li>
                <li>
                  <Link to="/sobre" onClick={() => setMenuAberto(false)}>
                    Sobre
                  </Link>
                </li>
              </ul>
            </nav>

            <button aria-label="Alternar tema claro/escuro">
              <SunDim className="size-8 text-white" aria-hidden="true" />
            </button>
          </>
        )}
      </div>
    </header>
  );
}

export default Navbar;
