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

// NOVA FUNÇÃO PARA PROCURAR PERFIL
export const getUserProfile = async (token) => {
    const response = await fetch(`${API_URL}/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Falha ao procurar perfil do utilizador.');
    }

    return await response.json();
  };

