import express from "express";
import cors from "cors";

const app = express();
app.use(cors());

const PORT = 5000;

import ligaRoutes from './routes/ligaRoutes.js';

app.use('/api', ligaRoutes);

app.use((req, res) => {
  res.status(404).json({ error: "Rota não encontrada." });
});

app.listen(PORT, () => {
  console.log(`Backend rodando em http://localhost:${PORT}`);
});