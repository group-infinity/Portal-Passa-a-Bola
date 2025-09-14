import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { getEncontroById, createInscricao } from "../services/EncontroService";
import { gerarDadosJogadora } from "../components/utils/faker";

import FaixaVermelha from "../assets/sections/banner-verm.png";

import Faixa from "../components/noticias/Faixa";
import Input from "../components/cadastro/Input";
import Botao from "../components/cadastro/Botao";

// Esquema de Validação para Inscrição Individual
const individualSchema = z.object({
  nome: z.string().min(3, "Nome completo é obrigatório"),
  email: z.string().email("E-mail inválido"),
  cpf: z
    .string()
    .regex(
      /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
      "CPF inválido (formato: 123.456.789-00)",
    ),
  telefone: z.string().min(10, "Telefone inválido"),
  dataNascimento: z
    .string()
    .regex(/^\d{2}\/\d{2}\/\d{4}$/, "Data inválida (formato: DD/MM/AAAA)"),
});

// Esquema de Validação para cada Jogadora do Time
const jogadoraSchema = z.object({
  nome: z.string().min(3, "Nome completo é obrigatório."),
  email: z.string().email("E-mail inválido."),
  cpf: z
    .string()
    .regex(
      /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
      "CPF inválido (formato: 123.456.789-00)",
    ),
  telefone: z.string().min(10, "Telefone inválido."),
  dataNascimento: z
    .string()
    .regex(/^\d{2}\/\d{2}\/\d{4}$/, "Data inválida (formato: DD/MM/AAAA)"),
});

// Função para criar o schema de time dinamicamente
const criarConjuntaSchema = (numJogadoras) =>
  z.object({
    nomeTime: z.string().min(3, "Nome do time é obrigatório"),
    responsavel: z.string().min(3, "Nome do responsável é obrigatório"),
    emailResponsavel: z.string().email("E-mail do responsável inválido"),
    membros: z
      .array(jogadoraSchema)
      .length(
        numJogadoras,
        `O time deve ter exatamente ${numJogadoras} jogadoras.`,
      ),
  });

function InscricaoEncontro() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [encontro, setEncontro] = useState(null);
  const [tipoInscricao, setTipoInscricao] = useState("individual");
  const [loading, setLoading] = useState(true);

  const isIndividual = tipoInscricao === "individual";

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm();
  const { fields } = useFieldArray({ control, name: "membros" });

  useEffect(() => {
    const fetchAndSetupForm = async () => {
      try {
        if (!id) return;
        setLoading(true);
        const data = await getEncontroById(id);
        setEncontro(data);

        const numJogadoras = data.jogadorasPorTime || 11;
        const defaultMembers = Array(numJogadoras).fill({
          nome: "",
          email: "",
          cpf: "",
          telefone: "",
          dataNascimento: "",
        });

        const newResolver = zodResolver(
          isIndividual ? individualSchema : criarConjuntaSchema(numJogadoras),
        );
        const defaultValues = isIndividual ? {} : { membros: defaultMembers };

        reset(defaultValues, { resolver: newResolver });
      } catch (err) {
        console.error(err);
        alert("Encontro não encontrado!");
        navigate("/encontros");
      } finally {
        setLoading(false);
      }
    };
    fetchAndSetupForm();
  }, [id, navigate, isIndividual, reset]);

  const onSubmit = async (data) => {
    const inscricaoData = { tipo: tipoInscricao, ...data };
    try {
      await createInscricao(id, inscricaoData);
      alert("Inscrição realizada com sucesso!");
      navigate("/encontros");
    } catch (error) {
      alert(`Erro: ${error.message}`);
    }
  };

  const handleSeedForm = () => {
    if (tipoInscricao === "conjunta" && encontro) {
      setValue("nomeTime", "Time das Estrelas FC");
      setValue("responsavel", "Técnica Joana");
      setValue("emailResponsavel", "joana.tecnica@example.com");

      for (let i = 0; i < encontro.jogadorasPorTime; i++) {
        const dados = gerarDadosJogadora(i);
        setValue(`membros.${i}.nome`, dados.nome);
        setValue(`membros.${i}.email`, dados.email);
        setValue(`membros.${i}.cpf`, dados.cpf);
        setValue(`membros.${i}.telefone`, dados.telefone);
        setValue(`membros.${i}.dataNascimento`, dados.dataNascimento);
      }
    } else {
      const dados = gerarDadosJogadora(0);
      setValue("nome", dados.nome);
      setValue("email", dados.email);
      setValue("cpf", dados.cpf);
      setValue("telefone", dados.telefone);
      setValue("dataNascimento", dados.dataNascimento);
    }
  };

  if (loading)
    return <p className="mt-40 text-center">Carregando dados do encontro...</p>;

  return (
    <div className="mt-16 flex w-full flex-col items-center py-16 lg:py-30">
      <div className="w-full px-6 md:max-w-[80%] lg:max-w-[60%]">
        <Faixa txt={`Inscrição: ${encontro?.nome}`} bg={FaixaVermelha} />

        <div className="my-8 flex items-center justify-center gap-8">
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setTipoInscricao("individual")}
              className={`rounded cursor-pointer px-4 py-2 font-bold ${isIndividual ? "bg-[#BA1B31] text-white" : "bg-gray-200"}`}
            >
              Inscrição Individual
            </button>
            <button
              onClick={() => setTipoInscricao("conjunta")}
              className={`rounded cursor-pointer px-4 py-2 font-bold ${!isIndividual ? "bg-[#BA1B31] text-white" : "bg-gray-200"}`}
            >
              Inscrição de Time
            </button>
          </div>
          <button
            type="button"
            onClick={handleSeedForm}
            className="rounded bg-green-600 px-3 py-2 text-sm font-bold text-white transition-colors hover:bg-green-800"
          >
            Preencher Dados de Teste
          </button>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-12 flex w-full flex-col gap-10"
        >
          {isIndividual ? (
            <div className="flex flex-col gap-5">
              <Input
                label="Seu Nome Completo"
                type="text"
                register={register("nome")}
                error={errors.nome}
              />
              <Input
                label="Seu E-mail"
                type="email"
                register={register("email")}
                error={errors.email}
              />
              <Input
                label="Seu CPF"
                type="text"
                placeholder="123.456.789-00"
                register={register("cpf")}
                error={errors.cpf}
              />
              <Input
                label="Seu Telefone"
                type="tel"
                placeholder="(11) 98765-4321"
                register={register("telefone")}
                error={errors.telefone}
              />
              <Input
                label="Sua Data de Nascimento"
                type="text"
                placeholder="DD/MM/AAAA"
                register={register("dataNascimento")}
                error={errors.dataNascimento}
              />
            </div>
          ) : (
            <div className="flex flex-col gap-8">
              <div>
                <h3 className="mb-4 border-b-2 border-[#BA1B31] pb-2 text-2xl font-bold">
                  Dados do Time
                </h3>
                <div className="grid gap-5 md:grid-cols-2">
                  <Input
                    label="Nome do Time"
                    type="text"
                    register={register("nomeTime")}
                    error={errors.nomeTime}
                  />
                  <Input
                    label="Nome do Responsável"
                    type="text"
                    register={register("responsavel")}
                    error={errors.responsavel}
                  />
                  <Input
                    label="E-mail do Responsável"
                    type="email"
                    register={register("emailResponsavel")}
                    error={errors.emailResponsavel}
                  />
                </div>
              </div>

              <div>
                <h3 className="mb-4 border-b-2 border-[#BA1B31] pb-2 text-2xl font-bold">
                  Dados das Jogadoras ({encontro?.jogadorasPorTime} jogadoras)
                </h3>
                <div className="flex flex-col gap-8">
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="rounded-md border p-4 shadow-sm"
                    >
                      <h4 className="mb-4 text-lg font-bold">
                        Jogadora {index + 1}
                      </h4>
                      <div className="grid gap-x-6 gap-y-4 md:grid-cols-2">
                        <Input
                          label="Nome Completo"
                          type="text"
                          register={register(`membros.${index}.nome`)}
                          error={errors.membros?.[index]?.nome}
                        />
                        <Input
                          label="E-mail"
                          type="email"
                          register={register(`membros.${index}.email`)}
                          error={errors.membros?.[index]?.email}
                        />
                        <Input
                          label="CPF"
                          type="text"
                          placeholder="123.456.789-00"
                          register={register(`membros.${index}.cpf`)}
                          error={errors.membros?.[index]?.cpf}
                        />
                        <Input
                          label="Telefone"
                          type="tel"
                          placeholder="(11) 98765-4321"
                          register={register(`membros.${index}.telefone`)}
                          error={errors.membros?.[index]?.telefone}
                        />
                        <Input
                          label="Data de Nascimento"
                          type="text"
                          placeholder="DD/MM/AAAA"
                          register={register(`membros.${index}.dataNascimento`)}
                          error={errors.membros?.[index]?.dataNascimento}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <Botao
            txt={"confirmar inscrição"}
            disabled={isSubmitting}
            color={"#BA1B31"}
            colorHover={"#7D1220"}
          />
        </form>
      </div>
    </div>
  );
}

export default InscricaoEncontro;
