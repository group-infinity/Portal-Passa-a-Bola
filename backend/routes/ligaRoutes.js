import express from 'express';
const router = express.Router();

import {getAllLigas} from '../controllers/ligaController.js';


router.get('/ligas', getAllLigas);

export default router;
