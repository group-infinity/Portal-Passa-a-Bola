import express from 'express';
import multer from 'multer';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

import { getAllEncontros, getEncontroById, createEncontro, createInscricao, deleteEncontro } from '../controllers/encontroController.js';
import { verifyAdmin } from '../middleware/authMiddleware.js';

router.get('/encontros', getAllEncontros);
router.get('/encontros/:id', getEncontroById);
router.post('/encontros/:id/inscricoes', upload.any(), createInscricao);

router.post('/encontros', verifyAdmin, createEncontro);
router.delete('/encontros/:id', verifyAdmin, deleteEncontro);

export default router;