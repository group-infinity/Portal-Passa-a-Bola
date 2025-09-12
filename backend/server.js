import express from "express";
import cors from "cors";
import ligaRoutes from './routes/ligaRoutes.js';
import authRoutes from './routes/authRoutes.js'; // Importa rotas de autenticação
import encontroRoutes from './routes/encontroRoutes.js'; // Importa rotas de encontros
 
const app = express();
app.use(cors());
app.use(express.json()); // Adicionado para parsear o corpo das requisições POST
 
const PORT = 5000;
 
app.use('/api', ligaRoutes);
app.use('/api', authRoutes); // Usa as novas rotas
app.use('/api', encontroRoutes); // Usa as novas rotas
 
app.use((req, res) => {
  res.status(404).json({ error: "Rota não encontrada." });
});
 
app.listen(PORT, () => {
  console.log(`Backend rodando em http://localhost:${PORT}`);
});
 