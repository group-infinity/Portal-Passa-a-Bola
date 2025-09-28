const API_URL = `${import.meta.env.VITE_API_URL}api/encontros`;

export const getEncontros = async () => {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error("Falha ao buscar os encontros.");
  return await response.json();
};

export const getEncontroById = async (id) => {
  const response = await fetch(`${API_URL}/${id}`);
  if (!response.ok) throw new Error("Falha ao buscar o encontro.");
  return await response.json();
};

export const getChaveamentoEncontro = async (id) => {
  const response = await fetch(`${API_URL}/${id}/chaveamento`);
  if (!response.ok) throw new Error("Falha ao buscar o chaveamento do encontro.");
  return await response.json();
}

export const createEncontro = async (encontroData, token) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(encontroData),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || "Erro ao criar o encontro.");
  return result;
};

export const createInscricao = async (id, inscricaoData) => {
    const response = await fetch(`${API_URL}/${id}/inscricoes`, {
      method: "POST",
      body: inscricaoData,
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Erro ao realizar inscrição.");
    return result;
};

export const deleteEncontro = async (id, token) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const result = await response.json();
    throw new Error(result.error || 'Falha ao deletar o encontro.');
  }

  return await response.json();
};

export const deleteParticipante = async (data, token) => {
    const response = await fetch(`${API_URL}/participante`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const result = await response.json();
      throw new Error(result.error || 'Falha ao deletar o participante.');
    }

    return await response.json();
  };
