import React, { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { CircleUserRound, Copy } from "lucide-react";

import Loading from "../../components/utils/Loading";
import Faixa from "../../components/noticias/Faixa";

const Perfil = () => {
  const { user, loading: authLoading, isAdmin } = useAuth();
  const navigate = useNavigate();

  // Redireciona se não houver utilizador após o carregamento inicial
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  if (authLoading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loading cor="#981FBA" txt="A carregar perfil..." />
      </div>
    );
  }

  return (
    <section className="flex w-full flex-col items-center">
      <div className="mt-16 flex w-full flex-col items-center gap-4 px-6 py-10 md:max-w-[80%] md:flex-row md:items-start lg:mt-20 lg:max-w-[70%]">
        <div className="flex w-full flex-col items-center justify-between gap-2 md:flex-row md:items-start">
          <div className="flex w-full flex-col items-center gap-2 md:flex-row md:items-start">
            {console.log(user)}
            {user.profilePic ? (
              <img src={user.profilePic} className="rounded-full" />
            ) : (
              <CircleUserRound
                color="#000"
                className="size-25 md:size-40"
                aria-hidden="true"
              />
            )}
            <div className="flex flex-col items-center">
              <h2 className="text-2xl text-black">{user.nome}</h2>
              <h3 className="text-[rgba(0,0,0,0.5)]"># {user.nick}</h3>
            </div>
          </div>

          {isAdmin && (
            <div
              className="flex h-fit max-w-4/5 cursor-pointer items-center gap-2"
              onClick={() => {
                navigator.clipboard.writeText(user.id);
              }}
            >
              <strong className="min-w-max">ID da conta: </strong>
              <small className="truncate underline">{user.id}</small>
              <Copy className="size-6" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Perfil;
