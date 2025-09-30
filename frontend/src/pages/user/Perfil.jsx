import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import { CircleUserRound, Copy, Edit } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { getUserProfileByNick, updateUserProfile } from "../../services/AuthService";

import Loading from "../../components/utils/Loading";
import Input from "../../components/ui/Input";
import Botao from "../../components/ui/Botao";
import AvisoModal from "../../components/utils/AvisoModal";

const profileSchema = z.object({
  nome: z.string().min(3, "O nome deve ter no mínimo 3 caracteres."),
  nick: z.string().min(3, "O nome de usuário deve ter no mínimo 3 caracteres."),
  email: z.string().email("Formato de e-mail inválido."),
  altura: z.string().optional().or(z.literal('')),
  peso: z.string().optional().or(z.literal('')),
  posicaoPreferida: z.string().optional(),
  fotoPerfil: z.any().optional(),
});


const Perfil = () => {
  const { user, loading: authLoading, token, updateUser } = useAuth();
  const navigate = useNavigate();
  const { nick } = useParams();

  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [preview, setPreview] = useState(null);

  const [modalState, setModalState] = useState({ isOpen: false, title: '', body: '' });

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(profileSchema),
  });

  const fotoPerfilFile = watch("fotoPerfil");

  useEffect(() => {
    if (fotoPerfilFile && fotoPerfilFile.length > 0) {
      const file = fotoPerfilFile[0];
      setPreview(URL.createObjectURL(file));
      return () => URL.revokeObjectURL(preview);
    }
  }, [fotoPerfilFile]);


  useEffect(() => {
    const loadProfile = async () => {
      if (!token) {
        if (!authLoading) navigate("/login");
        return;
      }
      setLoading(true);
      try {
        const data = await getUserProfileByNick(nick, token);
        setProfileData(data);
        setIsOwnProfile(user?.id === data.id);
        reset({
            nome: data.nome || '',
            nick: data.nick || '',
            email: data.email || '',
            altura: data.altura || '',
            peso: data.peso || '',
            posicaoPreferida: data.posicao_preferida || '',
        });
        setPreview(data.foto_perfil_url);

      } catch (err) {
        setError("Perfil não encontrado ou erro ao carregar.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (nick && token && !authLoading) {
      loadProfile();
    } else if (!authLoading && !token) {
        navigate('/login')
    }
  }, [nick, token, reset, user, authLoading, navigate]);

  const handleEditToggle = () => {
    if(!isEditing) {
        reset({
            nome: profileData.nome,
            nick: profileData.nick,
            email: profileData.email,
            altura: profileData.altura || '',
            peso: profileData.peso || '',
            posicaoPreferida: profileData.posicao_preferida || '',
        });
        setPreview(profileData.foto_perfil_url);
    }
    setIsEditing(!isEditing);
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    let hasChanges = false;

    Object.keys(data).forEach(key => {
      const formValue = data[key];
      // Use profileData[key] for comparison, but handle different naming conventions
      const profileKey = key === 'posicaoPreferida' ? 'posicao_preferida' : key;
      const profileValue = profileData[profileKey] || '';

      if (key === 'fotoPerfil' && formValue && formValue.length > 0) {
        formData.append(key, formValue[0]);
        hasChanges = true;
      } else if (key !== 'fotoPerfil' && formValue !== profileValue) {
        formData.append(key, formValue);
        hasChanges = true;
      }
    });

    if (!hasChanges) {
      setIsEditing(false);
      return;
    }

    try {
      const result = await updateUserProfile(formData, token);
      updateUser(result.user);
      setProfileData(result.user);
      setIsEditing(false);
      setModalState({ isOpen: true, title: 'Sucesso', body: 'Perfil atualizado com sucesso!' });
      if(result.user.nick !== nick) {
        navigate(`/perfil/${result.user.nick}`);
      }
    } catch (err) {
      setModalState({ isOpen: true, title: 'Erro', body: err.message || 'Ocorreu um erro ao atualizar o perfil.' });
    }
  };


  if (loading || authLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loading cor="#981FBA" txt="A carregar perfil..." />
      </div>
    );
  }

  if (error) {
    return <div className="pt-40 text-center text-red-500">{error}</div>;
  }

  if (!profileData) {
      return null;
  }

  const renderInfoItem = (label, value, unit = "") => (
    <div className="flex flex-col">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-lg font-semibold">
        {value ? `${value} ${unit}` : "Não informado"}
      </span>
    </div>
  );

  return (
    <>
     <AvisoModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ isOpen: false, title: '', body: '' })}
        title={modalState.title}
      >
        <p>{modalState.body}</p>
      </AvisoModal>

    <section className="flex w-full flex-col items-center py-16 lg:py-30">
        <div className="w-full px-6 md:max-w-[80%] lg:max-w-[70%]">

        {isEditing ? (
        // MODO DE EDIÇÃO
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <h1 className="text-3xl font-bold text-center mb-4">Editar Perfil</h1>
            <div className="flex flex-col items-center gap-4">
                <label htmlFor="fotoPerfil" className="cursor-pointer group relative">
                {preview ? (
                    <img src={preview} alt="Pré-visualização" className="size-40 rounded-full object-cover transition-opacity group-hover:opacity-70"/>
                ) : (
                    <CircleUserRound color="#000" className="size-40 group-hover:opacity-70"/>
                )}
                 <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white font-bold">Alterar Foto</span>
                </div>
                <input type="file" id="fotoPerfil" accept="image/*" {...register("fotoPerfil")} className="hidden"/>
                </label>
                {errors.fotoPerfil && <p className="text-red-500 text-sm">{errors.fotoPerfil.message}</p>}
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Input label="Nome Completo" type="text" register={register("nome")} error={errors.nome}/>
                <Input label="Nome de Usuário (nick)" type="text" register={register("nick")} error={errors.nick}/>
                <Input label="Email" type="email" register={register("email")} error={errors.email}/>

                <div className="flex w-full flex-col gap-2">
                    <label htmlFor="posicaoPreferida" className="w-fit text-lg font-black">Posição Preferida</label>
                    <div className="relative">
                        <select {...register("posicaoPreferida")} id="posicaoPreferida" className="peer w-full appearance-none border-b-2 bg-transparent px-1.5 pt-2.5 pb-1 text-left text-lg font-bold outline-0">
                            <option value="">Não especificado</option>
                            <option value="Goleira">Goleira</option>
                            <option value="Defesa">Defesa</option>
                            <option value="Meio-campo">Meio-campo</option>
                            <option value="Ataque">Ataque</option>
                        </select>
                    </div>
                </div>

                <Input label="Altura (cm)" type="number" step="0.01" register={register("altura")} error={errors.altura}/>
                <Input label="Peso (kg)" type="number" step="0.01" register={register("peso")} error={errors.peso}/>
            </div>

            <div className="flex justify-end gap-4 pt-4">
                <button type="button" onClick={handleEditToggle} className="rounded bg-gray-500 px-6 py-2 font-bold text-white transition-colors hover:bg-gray-600">Cancelar</button>
                <Botao txt={"Salvar"} color={"#981FBA"} colorHover={"#5b1587"} disabled={isSubmitting} />
            </div>

        </form>
        ) : (
        // MODO DE VISUALIZAÇÃO
        <div className="space-y-8">
            <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
                {profileData.foto_perfil_url ? (
                    <img src={profileData.foto_perfil_url} alt="Foto de Perfil" className="size-40 rounded-full object-cover shadow-md"/>
                ) : (
                    <CircleUserRound color="#333" className="size-40"/>
                )}
                <div className="flex-1 text-center md:text-left">
                    <h1 className="text-4xl font-bold">{profileData.nome}</h1>
                    <p className="text-xl text-gray-500">@{profileData.nick}</p>
                    <p className="mt-2 text-gray-700">{profileData.email}</p>
                    {isOwnProfile && (
                        <button onClick={handleEditToggle} className="mt-4 inline-flex items-center gap-2 rounded bg-[#981FBA] px-4 py-2 font-bold text-white transition-colors hover:bg-[#5b1587]">
                        <Edit className="size-4" /> Editar Informações
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-8 rounded-lg border bg-gray-50 p-6 shadow-sm md:grid-cols-3">
                {renderInfoItem("Posição Preferida", profileData.posicao_preferida)}
                {renderInfoItem("Altura", profileData.altura, "cm")}
                {renderInfoItem("Peso", profileData.peso, "kg")}
            </div>
        </div>
        )}
      </div>
    </section>
    </>
  );
};

export default Perfil;
