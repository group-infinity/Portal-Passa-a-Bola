import express from "express";
import cors from "cors";
import ligaRoutes from './routes/ligaRoutes.js';
import authRoutes from './routes/authRoutes.js';
import encontroRoutes from './routes/encontroRoutes.js';

const app = express();
const corsOptions = {
  origin: process.env.FRONTEND_URL,
  optionsSuccessStatus: 200 
};

app.use(cors(corsOptions));

app.options('*', cors(corsOptions));
app.use(express.json());

app.use('/api', ligaRoutes);
app.use('/api', authRoutes);
app.use('/api', encontroRoutes);

app.get('/', (req, res) => {
  res.status(200).send('O servidor está funcionando!');
});

app.use((req, res) => {
  res.status(404).json({ error: "Rota não encontrada." });
});

export default app;
