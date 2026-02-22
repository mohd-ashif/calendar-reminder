import { Router } from 'express';
import { savePhoneNumber, getProfile, getEventLogs } from '../controllers/user.controller';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

router.post('/phone', protect, savePhoneNumber);
router.get('/profile', protect, getProfile);
router.get('/logs', protect, getEventLogs);

export default router;
