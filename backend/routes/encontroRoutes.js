import express from 'express';
const router = express.Router();

import { getAllEncontros, getEncontroById, createEncontro, createInscricao } from '../controllers/encontroController.js';
import { verifyAdmin } from '../middleware/authMiddleware.js';

router.get('/encontros', getAllEncontros);
router.get('/encontros/:id', getEncontroById);
router.post('/encontros/:id/inscricoes', createInscricao);

router.post('/encontros', verifyAdmin, createEncontro);

export default router;