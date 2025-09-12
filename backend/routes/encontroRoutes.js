import express from 'express';
const router = express.Router();
 
import { getAllEncontros, createEncontro } from '../controllers/encontroController.js';
import { verifyAdmin } from '../middleware/authMiddleware.js'; // Importando o middleware
 
// Rota pública: Qualquer um pode ver os encontros.
router.get('/encontros', getAllEncontros);
 
// Rota protegida: Apenas um usuário autenticado como admin pode criar um encontro.
// O middleware 'verifyAdmin' é executado ANTES da função 'createEncontro'.
router.post('/encontros', verifyAdmin, createEncontro);
 
export default router;