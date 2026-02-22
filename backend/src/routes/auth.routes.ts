import { Router } from 'express';
import { startGoogleAuth, handleGoogleCallback } from '../controllers/auth.controller';

const router = Router();

router.get('/google', startGoogleAuth);
router.get('/google/callback', handleGoogleCallback);

export default router;
