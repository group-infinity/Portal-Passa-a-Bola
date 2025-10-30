const PORTAL_API_URL = `${import.meta.env.VITE_API_URL}api/monitor`;

const MONITOR_CONTROL_API_URL = 'http://localhost:5001/api';

export const getHealthDataByUserId = async (userId, token) => {
  const response = await fetch(`${PORTAL_API_URL}/${userId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: "Erro desconhecido" }));
    throw new Error(errorData.error || "Falha ao buscar os dados de saúde.");
  }
  return await response.json();
};


export const startMonitoring = async (userId) => {
    const response = await fetch(`${MONITOR_CONTROL_API_URL}/start-monitoring/${userId}`, {
      method: 'POST',
    });
    if (!response.ok) {
      throw new Error("Falha ao iniciar o monitoramento.");
    }
    return await response.json();
};

export const stopMonitoring = async (userId) => {
    const response = await fetch(`${MONITOR_CONTROL_API_URL}/stop-monitoring/${userId}`, {
      method: 'POST',
    });
    if (!response.ok) {
      throw new Error("Falha ao parar o monitoramento.");
    }
    return await response.json();
};