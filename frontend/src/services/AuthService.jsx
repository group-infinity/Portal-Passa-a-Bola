const API_URL = `${import.meta.env.VITE_API_URL}api`;

// NOVA FUNÇÃO DE REGISTO
export const registerUser = async (userData) => {
  const response = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.error || "Erro desconhecido no registo.");
  }
  return result;
};


export const loginUser = async (credentials) => {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Erro desconhecido no login.");
  }

  return result;
};

// FUNÇÃO PARA PROCURAR PERFIL POR NICK
export const getUserProfileByNick = async (nick, token) => {
    const response = await fetch(`${API_URL}/profile/${nick}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const result = await response.json();
      throw new Error(result.error || 'Falha ao procurar perfil do utilizador.');
    }

    return await response.json();
};

// NOVA FUNÇÃO PARA ATUALIZAR O PERFIL
export const updateUserProfile = async (formData, token) => {
    const response = await fetch(`${API_URL}/profile`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error || "Erro ao atualizar o perfil.");
    }
    return result;
  };
