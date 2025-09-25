import { useEffect, useState, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { getEncontroById, createInscricao } from "../services/EncontroService";
import { gerarDadosJogadora } from "../components/utils/faker";

import Faixa from "../components/noticias/Faixa";
import Input from "../components/cadastro/Input";
import Botao from "../components/cadastro/Botao";
import AvisoModal from "../components/utils/AvisoModal";

const fileSchema = z
  .any()
  .refine((files) => files?.length == 1, "Arquivo é obrigatório.")
  .refine(
    (files) => files?.[0]?.size <= 5000000,
    `Tamanho máximo do arquivo é 5MB.`,
  )
  .refine(
    (files) =>
      ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
        files?.[0]?.type,
      ),
    "Apenas formatos .jpg, .jpeg, .png e .webp são suportados.",
  );

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
  posicaoPreferida: z.enum(["gol", "defesa", "ataque"], {
    required_error: "Você precisa selecionar uma posição.",
  }),
  fotoDocumento: fileSchema,
  selfiePessoal: fileSchema,
});

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
  posicaoPreferida: z.enum(["gol", "defesa", "ataque"], {
    required_error: "Você precisa selecionar uma posição.",
  }),
  fotoDocumento: fileSchema,
  selfiePessoal: fileSchema,
});

const criarConjuntaSchema = (numJogadoras) =>
  z.object({
    nomeTime: z.string().min(3, "Nome do time é obrigatório"),
    responsavel: z.string().min(3, "Nome do responsável é obrigatório"),
    emailResponsavel: z.string().email("E-mail do responsável inválido"),
    membros: z
      .array(jogadoraSchema)
      .min(1, "É necessário inscrever pelo menos uma jogadora.")
      .length(
        numJogadoras,
        `O time deve ter exatamente ${numJogadoras} jogadoras.`,
      ),
  });

const formSchema = (isIndividual, numJogadoras) =>
  z
    .object({
      termos: z.literal(true, {
        errorMap: () => ({
          message: "Você deve aceitar os termos para continuar.",
        }),
      }),
    })
    .merge(
      isIndividual ? individualSchema : criarConjuntaSchema(numJogadoras || 11),
    );

function InscricaoEncontro() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [encontro, setEncontro] = useState(null);
  const [tipoInscricao, setTipoInscricao] = useState("individual");
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: "",
    body: "",
    imageUrl: null,
  });
  const [onModalClose, setOnModalClose] = useState(() => () => {});

  const isIndividual = tipoInscricao === "individual";

  const currentSchema = useMemo(() => {
    return formSchema(isIndividual, encontro?.jogadorasPorTime);
  }, [isIndividual, encontro]);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm({
    resolver: zodResolver(currentSchema),
    defaultValues: useMemo(() => {
      return isIndividual
        ? {}
        : {
            membros: Array(encontro?.jogadorasPorTime || 0).fill({
              nome: "",
              email: "",
              cpf: "",
              telefone: "",
              dataNascimento: "",
            }),
          };
    }, [isIndividual, encontro]),
  });

  const { fields } = useFieldArray({ control, name: "membros" });

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    if (onModalClose) {
      onModalClose();
    }
  }, [onModalClose]);

  useEffect(() => {
    const fetchEncontroData = async () => {
      try {
        if (!id) return;
        setLoading(true);
        const data = await getEncontroById(id);
        setEncontro(data);
      } catch (err) {
        console.error(err);
        alert("Encontro não encontrado!");
        navigate("/encontros");
      } finally {
        setLoading(false);
      }
    };
    fetchEncontroData();
  }, [id, navigate]);

  useEffect(() => {
    const defaultMembers = Array(encontro?.jogadorasPorTime || 0).fill({
      nome: "",
      email: "",
      cpf: "",
      telefone: "",
      dataNascimento: "",
    });
    reset(isIndividual ? {} : { membros: defaultMembers });
  }, [isIndividual, encontro, reset]);

  useEffect(() => {
    if (!loading) {
      setModalContent({
        title: "Aviso Importante!",
        body: "Este é um projeto de demonstração. Os dados de inscrição, como nomes e CPFs, são temporários e serão resetados periodicamente devido à natureza do ambiente serverless utilizado e pelo funcionamento do Vercel. Nenhuma informação inserida aqui é armazenada permanentemente. Podem haver inconsistências na exibição de dados sobre as inscrições nas outras páginas do site.",
        imageUrl: null,
      });
      setIsModalOpen(true);
    }
  }, [loading]);

  const onSubmit = async (data) => {
    const formData = new FormData();

    // Adiciona o tipo de inscrição
    formData.append("tipo", tipoInscricao);

    // Adiciona os outros campos de dados ao FormData
    for (const key in data) {
      if (
        key !== "fotoDocumento" &&
        key !== "selfiePessoal" &&
        key !== "membros"
      ) {
        formData.append(key, data[key]);
      }
    }

    // Adiciona os arquivos de imagem
    if (data.fotoDocumento?.[0]) {
      formData.append("fotoDocumento", data.fotoDocumento[0]);
    }
    if (data.selfiePessoal?.[0]) {
      formData.append("selfiePessoal", data.selfiePessoal[0]);
    }

    // Lógica para inscrição conjunta
    if (tipoInscricao === "conjunta" && data.membros) {
      formData.append("nomeTime", data.nomeTime);
      formData.append("responsavel", data.responsavel);
      formData.append("emailResponsavel", data.emailResponsavel);

      data.membros.forEach((membro, index) => {
        // Adiciona os dados de cada membro
        Object.keys(membro).forEach((key) => {
          if (key !== "fotoDocumento" && key !== "selfiePessoal") {
            formData.append(`membros[${index}][${key}]`, membro[key]);
          }
        });
        // Adiciona os arquivos de cada membro
        if (membro.fotoDocumento?.[0]) {
          formData.append(
            `membros[${index}][fotoDocumento]`,
            membro.fotoDocumento[0],
          );
        }
        if (membro.selfiePessoal?.[0]) {
          formData.append(
            `membros[${index}][selfiePessoal]`,
            membro.selfiePessoal[0],
          );
        }
      });
    }

    try {
      // A função createInscricao precisará ser ajustada para enviar FormData
      await createInscricao(id, formData);
      setModalContent({
        title: "Inscrição Realizada com Sucesso!",
        body: "A inscrição foi registrada. Futuramente, as jogadoras receberão uma confirmação por email, no qual também receberão um QR Code para permitir seu acesso ao encontro.",
        imageUrl: "/qrCode.png",
      });
      setOnModalClose(() => () => navigate("/encontros"));
      setIsModalOpen(true);
      // ... resto da sua lógica de sucesso
    } catch (error) {
      setModalContent({
        title: "Erro na Inscrição",
        body: `Não foi possível completar sua inscrição. Motivo: ${error.message}`,
        imageUrl: null,
      });
      setOnModalClose(() => () => {});
      setIsModalOpen(true);
      // ... resto da sua lógica de erro
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
    <>
      <AvisoModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={modalContent.title}
        imageUrl={modalContent.imageUrl}
      >
        <p>{modalContent.body}</p>
      </AvisoModal>

      <div className="mt-16 flex w-full flex-col items-center py-16 lg:py-30">
        <div className="w-full px-6 md:max-w-[80%] lg:max-w-[60%]">
          <Faixa
            txt={`Inscrição: ${encontro?.nome}`}
            bg={"/images/sections/banner-verm.webp"}
          />

          <div className="my-8 flex items-center justify-center gap-8">
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setTipoInscricao("individual")}
                className={`cursor-pointer rounded px-4 py-2 font-bold ${isIndividual ? "bg-[#BA1B31] text-white" : "bg-gray-200"}`}
              >
                Inscrição Individual
              </button>
              <button
                onClick={() => setTipoInscricao("conjunta")}
                className={`cursor-pointer rounded px-4 py-2 font-bold ${!isIndividual ? "bg-[#BA1B31] text-white" : "bg-gray-200"}`}
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
              <fieldset>
                <legend className="sr-only">
                  Formulário de Inscrição Individual
                </legend>
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
                  <Input
                    label="Foto do Documento (Frente e Verso)"
                    type="file"
                    register={register("fotoDocumento")}
                    error={errors.fotoDocumento}
                  />
                  <Input
                    label="Selfie Pessoal"
                    type="file"
                    register={register("selfiePessoal")}
                    error={errors.selfiePessoal}
                  />
                  <fieldset>
                    <legend className="mb-2 block text-sm font-medium text-gray-700">
                      Prefere jogar:
                    </legend>
                    <div className="flex items-center gap-4">
                      {["No gol", "Na defesa", "No ataque"].map((pos) => {
                        const posValue = pos
                          .split(" ")[1]
                          .toLowerCase()
                          .normalize("NFD")
                          .replace(/[\u0300-\u036f]/g, "");
                        return (
                          <label key={pos} className="flex items-center gap-2">
                            <input
                              type="radio"
                              value={posValue}
                              {...register("posicaoPreferida")}
                              className="h-4 w-4 text-[#BA1B31] focus:ring-[#BA1B31]"
                            />
                            {pos}
                          </label>
                        );
                      })}
                    </div>
                    {errors.posicaoPreferida && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.posicaoPreferida.message}
                      </p>
                    )}
                  </fieldset>
                </div>
              </fieldset>
            ) : (
              <div className="flex flex-col gap-8">
                <fieldset>
                  <legend className="mb-4 border-b-2 border-[#BA1B31] pb-2 text-2xl font-bold">
                    Dados do Time
                  </legend>
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
                </fieldset>

                <fieldset>
                  <legend className="mb-4 border-b-2 border-[#BA1B31] pb-2 text-2xl font-bold">
                    Dados das Jogadoras ({encontro?.jogadorasPorTime} jogadoras)
                  </legend>
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
                            register={register(
                              `membros.${index}.dataNascimento`,
                            )}
                            error={errors.membros?.[index]?.dataNascimento}
                          />
                          <Input
                            label="Foto do Documento"
                            type="file"
                            register={register(
                              `membros.${index}.fotoDocumento`,
                            )}
                            error={errors.membros?.[index]?.fotoDocumento}
                          />
                          <Input
                            label="Selfie Pessoal"
                            type="file"
                            register={register(
                              `membros.${index}.selfiePessoal`,
                            )}
                            error={errors.membros?.[index]?.selfiePessoal}
                          />
                        </div>
                        <fieldset className="mt-4">
                          <legend className="mb-2 block text-sm font-medium text-gray-700">
                            Prefere jogar:
                          </legend>
                          <div className="flex items-center gap-4">
                            {["No gol", "Na defesa", "No ataque"].map((pos) => {
                              const posValue = pos
                                .split(" ")[1]
                                .toLowerCase()
                                .normalize("NFD")
                                .replace(/[\u0300-\u036f]/g, "");
                              return (
                                <label
                                  key={pos}
                                  className="flex items-center gap-2"
                                >
                                  <input
                                    type="radio"
                                    value={posValue}
                                    {...register(
                                      `membros.${index}.posicaoPreferida`,
                                    )}
                                    className="h-4 w-4 text-[#BA1B31] focus:ring-[#BA1B31]"
                                  />
                                  {pos}
                                </label>
                              );
                            })}
                          </div>
                          {errors.membros?.[index]?.posicaoPreferida && (
                            <p className="mt-1 text-sm text-red-600">
                              {errors.membros[index].posicaoPreferida.message}
                            </p>
                          )}
                        </fieldset>
                      </div>
                    ))}
                  </div>
                </fieldset>
              </div>
            )}

            <div className="mt-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  {...register("termos")}
                  className="h-4 w-4 rounded text-[#BA1B31] focus:ring-[#BA1B31]"
                />
                <span className="text-sm text-gray-700">
                  Eu li e concordo com os{" "}
                  <a href="#" className="text-[#BA1B31] hover:underline">
                    termos de uso
                  </a>{" "}
                  e a{" "}
                  <a href="#" className="text-[#BA1B31] hover:underline">
                    política de privacidade
                  </a>
                  .
                </span>
              </label>
              {errors.termos && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.termos.message}
                </p>
              )}
            </div>

            <Botao
              txt={"confirmar inscrição"}
              disabled={isSubmitting}
              color={"#BA1B31"}
              colorHover={"#7D1220"}
            />
          </form>
        </div>
      </div>
    </>
  );
}

export default InscricaoEncontro;
