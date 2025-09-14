import express from "express";
import cors from "cors";
import ligaRoutes from './routes/ligaRoutes.js';
import authRoutes from './routes/authRoutes.js';
import encontroRoutes from './routes/encontroRoutes.js';

const app = express();

app.use(cors());

app.use(express.json());

app.use('/api', ligaRoutes);
app.use('/api', authRoutes);
app.use('/api', encontroRoutes);

app.use((req, res) => {
  res.status(404).json({ error: "Rota não encontrada." });
});

const PORT = 5000;
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Backend rodando localmente em http://localhost:${PORT}`);
    });
}

export default app;