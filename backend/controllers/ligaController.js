import axios from "axios";
import NodeCache from "node-cache";

const BASE_URL = "https://www.thesportsdb.com/api/v1/json/123/";
const cache = new NodeCache({ stdTTL: 600 });

const fetchAndCache = async (endpoint, ttl) => {
  const cacheKey = endpoint;
  const cachedData = cache.get(cacheKey);

  if (cachedData) {
    console.log(`Cache HIT para: ${cacheKey}`);
    return cachedData;
  }

  console.log(`Cache MISS para: ${cacheKey}. Buscando na API...`);

  const response = await axios.get(`${BASE_URL}${endpoint}`);
  const data = response.data;

  cache.set(cacheKey, data, ttl);

  return data;
};

export const getAllLigas = async (req, res) => {
  try {
    const ligas = [
      { id: 5201, nome: "Brasileirão Feminino" },
      { id: 4521, nome: "Liga Nacional de Futebol Feminino (NWSL - EUA)" },
      { id: 4887, nome: "Copa da Liga Feminina da FA" },
      { id: 4849, nome: "Superliga Feminina Inglesa" },
      { id: 4805, nome: "Liga A Feminina da Austrália" },
      { id: 4565, nome: "Copa do Mundo Feminina da FIFA" },
      { id: 5384, nome: "Futebol Feminino nas Olimpíadas" },
    ].slice(0,3);

    let resultados = [];
    for (const liga of ligas) {
      const infoLiga = await fetchAndCache(`lookupleague.php?id=${liga.id}`, 86400);
      const jogosFuturos = await fetchAndCache(`eventsnextleague.php?id=${liga.id}`, 300);
      const jogosPassados = await fetchAndCache(`eventspastleague.php?id=${liga.id}`, 300);

      resultados.push({
        id: liga.id,
        nome: liga.nome,
        info: infoLiga.leagues ? { ...infoLiga.leagues[0], strLeague: liga.nome } : null,
        jogosFuturos: jogosFuturos.events || [],
        jogosPassados: jogosPassados.events || [],
      });
    }
    res.json(resultados);
  } catch (error) {
    console.error("Erro ao buscar dados das ligas:", error.message);
    res.status(500).json({ error: "Erro ao buscar dados das ligas." });
  }
};
