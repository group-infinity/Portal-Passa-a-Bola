import express from 'express';
import multer from 'multer';
const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

import { register, login, getUserProfile, updateUserProfile } from '../controllers/authController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

router.post('/register', register);
router.post('/login', login);

router.get('/profile/:nick', verifyToken, getUserProfile);
router.put('/profile', verifyToken, upload.single('fotoPerfil'), updateUserProfile);


export default router;
