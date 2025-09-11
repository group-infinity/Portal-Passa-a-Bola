import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import Input from "../components/cadastro/Input";
import Faixa from "../components/noticias/Faixa";
import Botao from "../components/cadastro/Botao";

const cadastroSchema = z
    .object({
      nome: z.string().min(3, {
        message: "O nome completo deve ter no mínimo 3 caracteres.",
      }),

      email: z
        .string()
        .trim()
        .email({ message: "Por favor, insira um formato de e-mail válido." }),

      senha: z
        .string()
        .min(8, { message: "A senha deve ter no mínimo 8 caracteres." }),

      senha_confirm: z
        .string(),
    })
    .superRefine(({ senha, senha_confirm }, ctx) => {
      if (senha !== senha_confirm) {
        ctx.addIssue({
          code: "custom",
          message: "As senhas não coincidem.",
          path: ["senha_confirm"],
        });
      }
    });

const Cadastro = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(cadastroSchema),
    mode: "onBlur",
  });

  const handleCadastro = (data) => {
    const { senha_confirm, ...dadosParaEnvio } = data;

    console.log(
      "Formulário válido! Enviando dados para o backend:",
      dadosParaEnvio,
    );
    alert(
      `Cadastro enviado com sucesso para o e-mail: ${dadosParaEnvio.email}`,
    );

    // logica p enviaer
  };

  return (
    <main className="flex w-full flex-col items-center py-16 lg:py-30">
      <div className="w-full px-6 pt-6 lg:max-w-[45%]">
        <Faixa txt={"cadastro"} />

        <form
          onSubmit={handleSubmit(handleCadastro)}
          className="mt-12 flex w-full flex-col gap-12"
        >
          <div className="flex flex-col gap-5">
            <Input
              label="Digite seu nome completo"
              type="text"
              placeholder="ex. Maria Fernanda dos Santos"
              register={{ ...register("nome") }}
              error={errors.nome}
            />

            <Input
              label="Digite seu endereço de e-mail"
              type="email"
              placeholder="seuemail@exemplo.com"
              register={{ ...register("email") }}
              error={errors.email}
            />

            <Input
              label="Senha"
              type="password"
              placeholder="Crie uma senha forte (mín. 8 caracteres)"
              register={{ ...register("senha") }}
              error={errors.senha}
            />

            <Input
              label="Confirme sua senha"
              type="password"
              placeholder="Digite sua senha novamente"
              register={{ ...register("senha_confirm") }}
              error={errors.senha_confirm}
            />
          </div>

          <Botao txt={"cadastre-se"} disabled={isSubmitting} />
        </form>
      </div>
    </main>
  );
};

export default Cadastro;
