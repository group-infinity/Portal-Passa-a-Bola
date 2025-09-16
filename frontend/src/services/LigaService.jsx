const API_URL = `${import.meta.env.VITE_API_URL}api/ligas`;

export const getLigas = async () => {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Falha ao buscar os dados das ligas.");
  }

  const data = await response.json();
  return data;
};
