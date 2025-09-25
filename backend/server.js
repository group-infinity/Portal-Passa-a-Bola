import 'dotenv/config';
import express from "express";
import cors from "cors";
import ligaRoutes from './routes/ligaRoutes.js';
import authRoutes from './routes/authRoutes.js';
import encontroRoutes from './routes/encontroRoutes.js';

const app = express();

const allowedOrigins = [
  'http://127.0.0.1:5173',
  'http://localhost:5173',
  'https://passaabola-git-dev-maldak123s-projects.vercel.app',
  'passaabolateste.app'
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Acesso não permitido por CORS'));
    }
  }
};

app.use(cors(corsOptions));

app.options('/*splat', cors(corsOptions));
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

app.listen(5000, (req, res) => {
  console.log(`Servidor aberto em http://localhost:5000`)
})

export default app;
