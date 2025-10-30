import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import { CircleUserRound, Copy, Edit, Save, XCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { getUserProfileByNick, updateUserProfile } from "../../services/AuthService";

import Loading from "../../components/utils/Loading";
import Input from "../../components/ui/Input";
import Botao from "../../components/ui/Botao";
import AvisoModal from "../../components/utils/AvisoModal";
import HealthDashboard from "../../components/user/HealthDashboard";


const profileSchema = z.object({
    nome: z.string().min(3, { message: "O nome deve ter no mínimo 3 caracteres." }).optional(),
    email: z.string().email({ message: "Por favor, insira um formato de e-mail válido." }).optional(),
    altura: z.preprocess(
      (val) => (val === "" ? null : Number(val)),
      z.number({ invalid_type_error: "Altura deve ser um número." }).positive({ message: "Altura deve ser um número positivo." }).nullable().optional()
    ),
    peso: z.preprocess(
      (val) => (val === "" ? null : Number(val)),
      z.number({ invalid_type_error: "Peso deve ser um número." }).positive({ message: "Peso deve ser um número positivo." }).nullable().optional()
    ),
    posicao_preferida: z.enum(["", "gol", "defesa", "ataque"]).optional(),
    foto_perfil_url: z.any().optional(),
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

  const [modalState, setModalState] = useState({
    isOpen: false,
    title: "",
    body: "",
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(profileSchema),
  });

  const loadProfile = useCallback(async () => {
    const targetNick = nick || user?.nick;
    if (!targetNick) {
      if(!authLoading) navigate("/login");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await getUserProfileByNick(targetNick, token);
      setProfileData(data);
      setIsOwnProfile(user?.nick === data.nick);
      reset(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [nick, user, token, reset, authLoading, navigate]);

  useEffect(() => {
    if (nick && token && !authLoading) {
      loadProfile();
    } else if (!authLoading && !token) {
        navigate('/login')
    }
  }, [nick, token, reset, user, authLoading, navigate]);

  const handleEditToggle = () => {
    if (isOwnProfile) {
      setIsEditing(!isEditing);
      reset(profileData);
    }
  };

  const onSubmit = async (formData) => {
    const data = new FormData();

    Object.keys(formData).forEach(key => {
        if (formData[key] !== profileData[key]) {
            if (key === 'foto_perfil_url' && formData[key] && formData[key][0]) {
                data.append('foto_perfil_url', formData[key][0]);
            } else if (key !== 'foto_perfil_url') {
                data.append(key, formData[key]);
            }
        }
    });

    if (data.entries().next().done) {
        setIsEditing(false);
        return;
    }

    try {
        const updatedUser = await updateUserProfile(user.id, data, token);
        updateUser(updatedUser);
        setProfileData(updatedUser);
        setIsEditing(false);
        setModalState({ isOpen: true, title: "Sucesso", body: "Perfil atualizado com sucesso!" });
    } catch (error) {
        setModalState({ isOpen: true, title: "Erro", body: `Não foi possível atualizar o perfil: ${error.message}` });
    }
  };

  if (loading || authLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loading cor="#981FBA" txt="A carregar perfil..." />
      </div>
    );
  }

  if (!profileData) {
      return null;
  }

  const renderInfoItem = (label, value, unit = "") => (
    <div className="flex flex-col">
      <span className="text-sm font-semibold text-gray-500">{label}</span>
      <span className="text-lg font-bold">{value || "N/A"} {value && unit}</span>
    </div>
  );

  return (
    <>
    <AvisoModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ ...modalState, isOpen: false })}
        title={modalState.title}
      >
        <p>{modalState.body}</p>
      </AvisoModal>

    <section className="flex w-full flex-col items-center py-16 lg:py-30">
        <div className="w-full px-6 md:max-w-[80%] lg:max-w-[70%]">

        {isEditing ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
             <div className="flex flex-col items-center gap-6 md:flex-row">
             {profileData.foto_perfil_url ? (
                  <img src={profileData.foto_perfil_url} alt="Foto de perfil" className="size-40 rounded-full object-cover" />
                ) : (
                  <CircleUserRound color="#981FBA" className="size-40 text-gray-300" />
                )}
                <div className="w-full">
                     <Input label="Alterar Foto de Perfil" type="file" register={register("foto_perfil_url")} error={errors.profile_pic_url} />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Input label="Nome Completo" type="text" register={register("nome")} error={errors.nome} />
                <Input label="E-mail" type="email" register={register("email")} error={errors.email} />
                <Input label="Altura (cm)" type="number" register={register("altura")} error={errors.altura} />
                <Input label="Peso (kg)" type="number" register={register("peso")} error={errors.peso} />
                <div>
                  <label htmlFor="posicao_preferida" className="block text-lg font-black text-gray-700">Posição Preferida</label>
                   <select {...register("posicao_preferida")} className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-lg">
                        <option value="">Não especificado</option>
                        <option value="gol">Goleira</option>
                        <option value="defesa">Defesa</option>
                        <option value="ataque">Ataque</option>
                    </select>
                </div>
            </div>

            <div className="flex justify-end gap-4">
                 <button type="button" onClick={handleEditToggle} className="flex items-center gap-2 rounded-md bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"> <XCircle/> Cancelar</button>
                 <Botao txt="Salvar Alterações" color={"#981FBA"} colorHover={"#5b1587"} disabled={isSubmitting} icon={<Save/>}/>
            </div>
        </form>
        ) : (

        <div className="space-y-8">
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                 <div className="flex flex-col items-center gap-4 text-center md:flex-row md:text-left">
                    {profileData.foto_perfil_url ? (
                      <img src={profileData.foto_perfil_url} alt="Foto de perfil" className="size-40 rounded-full object-cover" />
                    ) : (
                      <CircleUserRound color="#981FBA" className="size-40" />
                    )}
                    <div>
                        <h2 className="text-4xl font-bold">{profileData.nome}</h2>
                        <h3 className="text-xl text-gray-500">#{profileData.nick}</h3>
                    </div>
                 </div>
                 {isOwnProfile && (
                    <button onClick={handleEditToggle} className="flex items-center gap-2 rounded-md bg-[#981FBA] px-4 py-2 font-semibold text-white hover:bg-[#7d199c]"> <Edit/> Editar Informações </button>
                 )}
            </div>

            <div className="grid grid-cols-2 gap-8 rounded-lg border bg-gray-50 p-6 shadow-sm md:grid-cols-3">
                {renderInfoItem("Posição Preferida", profileData.posicao_preferida)}
                {renderInfoItem("Altura", profileData.altura, "cm")}
                {renderInfoItem("Peso", profileData.peso, "kg")}
            </div>

            <div className="mt-12">
              <HealthDashboard userId={profileData.id} />
            </div>
        </div>
        )}
      </div>
    </section>
    </>
  );
};

export default Perfil;

