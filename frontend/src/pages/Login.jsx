import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { useAuth } from "../context/AuthContext";
import { loginUser } from "../services/AuthService";

import Input from "../components/cadastro/Input";
import Botao from "../components/cadastro/Botao";
import Faixa from "../components/noticias/Faixa";

const loginSchema = z.object({
  nick: z.string().min(1, { message: "O nick é obrigatório." }),
  senha: z
    .string()
    .min(1, { message: "A palavra-passe é obrigatória." }),
});

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });
  const { login,  } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (data) => {
    try {
      const result = await loginUser(data);
      login(result.user, result.token);
      alert(`Login bem-sucedido! Bem-vindo(a), ${result.user.nome}.`);

      if (result.user.role === 'admin') {
        navigate("/admin/dashboard");
      } else {
        navigate(`/perfil/${result.user.nick}`);
      }
    } catch (error) {
      alert(`Erro no login: ${error.message}`);
    }
  };

  return (
    <div className="mt-16 flex w-full flex-col items-center py-16 lg:py-30">
      <div className="w-full px-6 md:max-w-[60%] lg:max-w-[45%]">
        <Faixa txt={"login"} bg={"/images/sections/banner-roxo.webp"} />

        <form
          onSubmit={handleSubmit(handleLogin)}
          className="mt-12 flex w-full flex-col gap-7"
        >
          <div className="flex flex-col gap-5">
            <Input
              label="Digite o seu nick"
              type="text"
              placeholder="seu nick"
              register={{ ...register("nick") }}
              error={errors.nick}
            />

            <Input
              label="Palavra-passe"
              type="password"
              placeholder="Digite a sua palavra-passe"
              register={{ ...register("senha") }}
              error={errors.senha}
            />
          </div>

          <Botao
            txt={"entrar"}
            disabled={isSubmitting}
            color={"#981FBA"}
            colorHover={"#5b1587"}
          />
        </form>

        <div className="mt-3 flex flex-col gap-2.5 text-[#981FBA] underline lg:text-xl">
          <p>
            <a href="#">Esqueceu a palavra-passe?</a>
          </p>
          <p>
            <Link to="/cadastro">
              É novo por aqui? Registe-se!
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

