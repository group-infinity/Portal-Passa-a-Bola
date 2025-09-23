import { useState, useEffect } from "react";
import { SunDim, X, CircleUserRound, Menu, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, isAdmin, logout } = useAuth();
  const [ativo, setAtivo] = useState(false);

  useEffect(() => {
    if (ativo) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [ativo]);

  return (
    <header className="fixed z-50 flex h-16 w-screen items-center justify-between bg-[#981FBA] px-6 py-2.5 lg:h-20">
      <div className="flex gap-1">
        <Link to="/" aria-label="Página inicial do Passa a Bola">
          <img src={"/images/logos/logo.webp"} alt="Logo do Passa a Bola" className="h-11" />
        </Link>
      </div>

      <div className="flex items-center gap-2.5">
        {user ? (
          <button onClick={logout} title="Sair" aria-label="Sair da conta">
            <LogOut
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
        <button
          onClick={() => setAtivo(true)}
          aria-controls="menu-navegacao"
          aria-expanded={ativo}
          aria-label="Abrir menu de navegação"
        >
          <Menu
            color="#ffffff"
            className="size-6 cursor-pointer text-white lg:size-8"
            aria-hidden="true"
          />
        </button>
      </div>

      {ativo && (
        <button
          className={`bg-opacity-50 absolute inset-0 h-dvh bg-black transition-opacity duration-300 ease-in-out ${ativo ? "opacity-50" : "pointer-events-none opacity-0"}`}
          onClick={() => setAtivo(false)}
          aria-label="Fechar menu de navegação"
          tabIndex={-1}
        ></button>
      )}

      <div
        id="menu-navegacao"
        className={`absolute top-0 right-0 flex h-dvh w-2/3 flex-col items-end justify-between bg-[#981fba] p-6 transition-transform duration-300 ease-in-out md:w-2/5 lg:w-1/4 ${ativo ? "translate-x-0" : "translate-x-full"}`}
        aria-hidden={!ativo}
      >
        {ativo && (
          <>
            <button
              onClick={() => setAtivo(false)}
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
                    <p className="text-sm">Controle de Admin: </p>
                    <li>
                      <Link
                        to="/admin/dashboard"
                        onClick={() => setAtivo(false)}
                      >
                        Painel
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/admin/criar-encontro"
                        onClick={() => setAtivo(false)}
                      >
                        Criar Encontro
                      </Link>
                    </li>
                  </div>
                )}
                <li>
                  <Link to="/encontros" onClick={() => setAtivo(false)}>
                    Próximos Encontros
                  </Link>
                </li>
                <li>
                  <Link to="/placares" onClick={() => setAtivo(false)}>
                    Placares
                  </Link>
                </li>
                <li>
                  <Link to="/noticias" onClick={() => setAtivo(false)}>
                    Notícias
                  </Link>
                </li>
                <li>
                  <Link to="/sobre" onClick={() => setAtivo(false)}>
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
