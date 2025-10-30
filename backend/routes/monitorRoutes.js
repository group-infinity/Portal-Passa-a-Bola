import express from 'express';
const router = express.Router();

import { addHealthData, getHealthData } from '../controllers/monitorController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

router.post('/monitor', addHealthData);

router.get('/monitor/:userId', verifyToken, getHealthData);

export default router;
