import { Router } from 'express';
import { getStats } from '../stats/stats.controller.js';
import { tieneRole } from '../middlewares/validar-roles.js';
import { validarJWT } from '../middlewares/validar-jwt.js';

const router = Router();
router.get(
    '/',
    getStats
);

export default router;