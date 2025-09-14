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

import Banner from "../assets/sections/banner-roxo.png"

const loginSchema = z.object({
  email: z.string().email({ message: "Por favor, insira um e-mail válido." }),
  senha: z.string().min(8, { message: "A senha deve ter no mínimo 8 caracteres." }),
});

const Login = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(loginSchema),
  });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (data) => {
    try {
      const result = await loginUser(data);
      alert(`Login bem-sucedido! Bem-vindo, ${result.user.role}.`);
      login(result.user, result.token);
      navigate('/');
    } catch (error) {
      alert(`Erro no login: ${error.message}`);
    }
  };

  return (
    <div className="flex w-full flex-col items-center mt-16 py-16 lg:py-30">
      <div className="w-full px-6 md:max-w-[60%] lg:max-w-[45%]">
        <Faixa txt={'login'} bg={Banner} />

        <form
          onSubmit={handleSubmit(handleLogin)}
          className="mt-12 flex w-full flex-col gap-7"
        >
          <div className="flex flex-col gap-5">
            <Input
              label="Digite seu endereço de e-mail"
              type="email"
              placeholder="seuemail@exemplo.com"
              register={{...register("email")}}
              error={errors.email}
            />

            <Input
              label="Senha"
              type="password"
              placeholder="Crie uma senha forte"
              register={{...register("senha")}}
              error={errors.senha}
            />
          </div>

          <Botao txt={'entrar'} disabled={isSubmitting} color={"#981FBA"} colorHover={"#5b1587"}/>
        </form>

        <div className="mt-3 flex flex-col gap-2.5 text-[#981FBA] underline lg:text-xl">
          <p>
            <a href="#">Esqueceu a senha?</a>
          </p>
          <p>
            <Link to="/cadastro" href="#">Nova por aqui? Cadastre-se!</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;