import React from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import Input from "../components/cadastro/Input";
import Botao from "../components/cadastro/Botao";
import Faixa from "../components/noticias/Faixa";

const loginSchema = z.object({
  email: z.string().email({ message: "Por favor, insira um e-mail válido." }),
  senha: z.string().min(8, { message: "A senha deve ter no mínimo 8 caracteres." }),
});


const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const handleLogin = (data) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log("Dados do formulário:", data);
        alert(`Login enviado com sucesso para: ${data.email}`);
        resolve();
      }, 2000);
    });
  };

  return (
    <main className="flex w-full flex-col items-center mt-16 py-16 lg:py-30">
      <div className="w-full px-6 md:max-w-[60%] lg:max-w-[45%]">
        <Faixa txt={'login'} />

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

          <Botao txt={'entrar'} disabled={isSubmitting} />
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
    </main>
  );
};

export default Login;