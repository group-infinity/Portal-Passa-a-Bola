const express = require("express");
const cors = require("cors");
const axios = require("axios");
const NodeCache = require("node-cache");

const app = express();
app.use(cors());

const PORT = 5000;
const BASE_URL = "https://www.thesportsdb.com/api/v1/json/123/";

const cache = new NodeCache({ stdTTL: 600, checkperiod: 120 });

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

app.get("/api/ligas", async (req, res) => {
  const cacheKey = "dados-agregados-ligas";
  const ttl = 300;

  try {
    const cachedResult = cache.get(cacheKey);
    if (cachedResult) {
      console.log(`Cache HIT para a rota principal /api/ligas`);
      return res.json(cachedResult);
    }

    console.log(`Cache MISS para a rota principal /api/ligas. Montando os dados...`);

    const ligas = [
      { id: 5201, nome: "Brazil Brasileiro Women" },
      { id: 4521, nome: "American NWSL" },
      { id: 4887, nome: "FA Womens League Cup" },
      { id: 4849, nome: "English Womens Super League" },
      { id: 4805, nome: "Australian A-League Women" },
      { id: 4565, nome: "FIFA Womens World Cup" },
      { id: 5384, nome: "Olympics Soccer Women" },
    ].slice(0, 3);

    const promises = ligas.map(async (liga) => {
      const infoLiga = await fetchAndCache(`lookupleague.php?id=${liga.id}`, 86400); // Cache de 24h
      const jogosFuturos = await fetchAndCache(`eventsnextleague.php?id=${liga.id}`, 300); // Cache de 5 min
      const jogosPassados = await fetchAndCache(`eventspastleague.php?id=${liga.id}`, 300); // Cache de 5 min

      return {
        id: liga.id,
        nome: liga.nome,
        info: infoLiga.leagues ? infoLiga.leagues[0] : null,
        jogosFuturos: jogosFuturos.events || [],
        jogosPassados: jogosPassados.events || [],
      };
    });

    const resultados = await Promise.all(promises);

    cache.set(cacheKey, resultados, ttl);

    res.json(resultados);
  } catch (error) {
    console.error("Erro ao buscar dados das ligas:", error.message);
    res.status(500).json({ error: "Erro ao buscar dados das ligas." });
  }
});

app.use((req, res) => {
  res.status(404).json({ error: "Rota não encontrada." });
});

app.listen(PORT, () => {
  console.log(`Backend rodando em http://localhost:${PORT}`);
});
