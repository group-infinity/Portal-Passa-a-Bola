import express from 'express';
const router = express.Router();

import { register, login, getUserProfile } from '../controllers/authController.js';
import { verifyToken, verifyAdmin } from '../middleware/authMiddleware.js';

router.post('/register', register);
router.post('/login', login);

router.get('/profile', verifyToken, getUserProfile);


export default router;

