import express from 'express';
const router = express.Router();

import { addHealthData, getHealthData } from '../controllers/monitorController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

// Rota para o monitor (ponte Python) enviar dados. Não precisa de token.
router.post('/monitor', addHealthData);

// Rota para o frontend (perfil do usuário) buscar os dados. Precisa de token.
router.get('/monitor/:userId', verifyToken, getHealthData);

export default router;
