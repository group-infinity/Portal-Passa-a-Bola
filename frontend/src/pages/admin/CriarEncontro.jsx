import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { createEncontro } from "../../services/EncontroService";

import Input from "../../components/cadastro/Input";
import Botao from "../../components/cadastro/Botao";
import Faixa from "../../components/noticias/Faixa";

const formatarDataParaBR = (data) => {
  if (!data) return "";
  const [ano, mes, dia] = data.split("-");
  return `${dia}/${mes}/${ano}`;
};

const getHoje = () => {
  const hoje = new Date();
  hoje.setMinutes(hoje.getMinutes() - hoje.getTimezoneOffset());
  return hoje.toISOString().split("T")[0];
};

const encontroSchema = z
  .object({
    nome: z.string(),
    diaI: z.string(),
    diaF: z.string(),
    jogadorasPorTime: z.string(),
    totalVagas: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.nome.length < 3) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["nome"],
        message: "O nome do encontro é obrigatório.",
      });
    }

    if (!data.diaI) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["diaI"],
        message: "A data de início é obrigatória.",
      });
    } else if (data.diaI < getHoje()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["diaI"],
        message: "A data de início não pode ser anterior a hoje.",
      });
    }

    if (!data.diaF) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["diaF"],
        message: "A data de fim é obrigatória.",
      });
    } else if (data.diaF < data.diaI) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["diaF"],
        message: "A data de fim não pode ser anterior à data de início.",
      });
    }

    if (!["5", "7", "11"].includes(data.jogadorasPorTime)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["jogadorasPorTime"],
        message: "Selecione uma opção válida.",
      });
    }

    if (!/^\d+$/.test(data.totalVagas)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["totalVagas"],
        message: "Deve ser um número.",
      });
    } else {
      const totalVagas = Number(data.totalVagas);
      const numJogadoras = Number(data.jogadorasPorTime);

      if (totalVagas <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["totalVagas"],
          message: "O total de vagas deve ser maior que zero.",
        });
      }

      if (numJogadoras > 0 && totalVagas % numJogadoras !== 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["totalVagas"],
          message: `Total de vagas deve ser divisível por ${numJogadoras}.`,
        });
      } else if (numJogadoras > 0) {
        const numeroDeTimes = totalVagas / numJogadoras;
        if (numeroDeTimes % 2 !== 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["totalVagas"],
            message: `Cria um número ímpar de times (${numeroDeTimes}). Ajuste as vagas para formar um número par de times.`,
          });
        }
      }
    }
  });

const CriarEncontro = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(encontroSchema),
  });
  const { token } = useAuth();
  const navigate = useNavigate();

  const diaInicioSelecionado = watch("diaI");

  const handleCreateEncontro = async (data) => {
    try {
      const dadosFormatados = {
        ...data,
        diaI: formatarDataParaBR(data.diaI),
        diaF: formatarDataParaBR(data.diaF),
        jogadorasPorTime: Number(data.jogadorasPorTime),
      };
      await createEncontro(dadosFormatados, token);
      alert("Encontro criado com sucesso!");
      navigate("/encontros");
    } catch (error) {
      alert(`Erro ao criar encontro: ${error.message}`);
    }
  };

  return (
    <div className="mt-16 flex w-full flex-col items-center py-16 lg:py-30">
      <div className="w-full px-6 md:max-w-[60%] lg:max-w-[45%]">
        <Faixa txt={"novo encontro"} bg={"/images/sections/banner-verm.webp"} />

        <form
          onSubmit={handleSubmit(handleCreateEncontro)}
          className="mt-12 flex w-full flex-col gap-7"
        >
          <div className="flex flex-col gap-5">
            <Input
              label="Nome do Encontro"
              type="text"
              register={{ ...register("nome") }}
              error={errors.nome}
            />
            <Input
              label="Data do Encontro"
              type="date"
              min={getHoje()}
              register={{ ...register("diaI") }}
              error={errors.diaI}
            />
            <Input
              label="Data de Término das Inscrições"
              type="date"
              min={diaInicioSelecionado || getHoje()}
              register={{ ...register("diaF") }}
              error={errors.diaF}
            />

            <div className="flex w-full flex-col gap-2">
              <label
                htmlFor="jogadorasPorTime"
                className="w-fit text-lg font-black"
              >
                Jogadoras por Time
              </label>
              <select
                {...register("jogadorasPorTime")}
                id="jogadorasPorTime"
                className="w-full border-b-2 px-1.5 pt-2.5 pb-1 text-left text-lg font-bold outline-0"
              >
                <option value="">Selecione...</option>
                <option value="5">5 jogadoras</option>
                <option value="7">7 jogadoras</option>
                <option value="11">11 jogadoras</option>
              </select>
              {errors.jogadorasPorTime && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.jogadorasPorTime.message}
                </p>
              )}
            </div>

            <Input
              label="Total de Vagas"
              type="number"
              placeholder="Ex: 40"
              register={{ ...register("totalVagas") }}
              error={errors.totalVagas}
            />
          </div>
          <Botao
            txt={"criar encontro"}
            color={"#BA1B31"}
            colorHover={"#7D1220"}
            disabled={isSubmitting}
          />
        </form>
      </div>
    </div>
  );
};

export default CriarEncontro;
