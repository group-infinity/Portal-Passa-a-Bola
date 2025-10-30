import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/AuthService";

import Input from "../components/cadastro/Input";
import Botao from "../components/cadastro/Botao";
import Faixa from "../components/noticias/Faixa";
import AvisoModal from "../components/utils/AvisoModal";

const cadastroSchema = z
  .object({
    nome: z.string().min(3, {
      message: "O nome completo deve ter no mínimo 3 caracteres.",
    }),

    nick: z.string().min(3, {
      message: "O nome de usuário deve ter no mínimo 3 caracteres.",
    }),

    email: z
      .string()
      .trim()
      .email({ message: "Por favor, insira um formato de e-mail válido." }),

    senha: z
      .string()
      .min(8, { message: "A palavra-passe deve ter no mínimo 8 caracteres." }),

    senha_confirm: z.string(),
  })
  .superRefine(({ senha, senha_confirm }, ctx) => {
    if (senha !== senha_confirm) {
      ctx.addIssue({
        code: "custom",
        message: "As palavras-passe não coincidem.",
        path: ["senha_confirm"],
      });
    }
  });

const Cadastro = () => {
  const navigate = useNavigate();
  const [modalState, setModalState] = useState({ isOpen: false, title: '', body: '', onConfirm: null });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(cadastroSchema),
    mode: "onBlur",
  });

  const handleCadastro = async (data) => {
    const { senha_confirm, ...dadosParaEnvio } = data;
    try {
      await registerUser(dadosParaEnvio);
      setModalState({
        isOpen: true,
        title: "Registo Realizado!",
        body: "Registo realizado com sucesso! Já pode fazer o login.",
        onConfirm: () => navigate("/login"),
      });
    } catch (error) {
      setModalState({
        isOpen: true,
        title: "Erro no Registo",
        body: error.message,
        onConfirm: null
      });
    }
  };

  const handleCloseModal = () => {
    const action = modalState.onConfirm;
    setModalState({ isOpen: false, title: '', body: '', onConfirm: null });
    if (action) {
      action();
    }
  };

  return (
    <>
      <AvisoModal
        isOpen={modalState.isOpen}
        onClose={handleCloseModal}
        title={modalState.title}
      >
        <p>{modalState.body}</p>
      </AvisoModal>

      <div className="flex w-full flex-col items-center py-16 lg:py-30">
        <div className="w-full px-6 pt-6 lg:max-w-[45%]">
          <Faixa txt={"registo"} bg={"/images/sections/banner-roxo.webp"} />

          <form
            onSubmit={handleSubmit(handleCadastro)}
            className="mt-12 flex w-full flex-col gap-12"
          >
            <div className="flex flex-col gap-5">
              <Input
                label="Digite o seu nome completo"
                type="text"
                placeholder="ex. Maria Fernanda dos Santos"
                register={{ ...register("nome") }}
                error={errors.nome}
              />

              <Input
                label="Digite seu nome de usuário"
                type="text"
                register={{ ...register("nick") }}
                error={errors.nick}
              />

              <Input
                label="Digite o seu endereço de e-mail"
                type="email"
                placeholder="seuemail@exemplo.com"
                register={{ ...register("email") }}
                error={errors.email}
              />

              <Input
                label="Palavra-passe"
                type="password"
                placeholder="Crie uma palavra-passe forte (mín. 8 caracteres)"
                register={{ ...register("senha") }}
                error={errors.senha}
              />

              <Input
                label="Confirme a sua palavra-passe"
                type="password"
                placeholder="Digite a sua palavra-passe novamente"
                register={{ ...register("senha_confirm") }}
                error={errors.senha_confirm}
              />
            </div>

            <Botao
              txt={"registar-se"}
              disabled={isSubmitting}
              color={"#981FBA"}
              colorHover={"#5b1587"}
            />
          </form>
        </div>
      </div>
    </>
  );
};

export default Cadastro;
