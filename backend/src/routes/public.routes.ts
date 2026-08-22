import { Router } from 'express';
import * as publicController from '../controllers/public.controller';
import { validate } from '../middlewares/validate.middleware';
import { demoRequestLimiter } from '../middlewares/demoRequestLimiter.middleware';
import { publicCheckInSchema, demoRequestSchema } from '../validators/public.validator';

// No authentication — this is the QR self-check-in kiosk flow, reachable by any member's phone.
const router = Router();

router.get('/gyms/:gymId', publicController.getGymPublicInfo);
router.post('/gyms/:gymId/checkin', validate(publicCheckInSchema), publicController.publicCheckIn);

// Landing page "Book Demo" lead form — public, unauthenticated.
router.post('/demo-requests', demoRequestLimiter, validate(demoRequestSchema), publicController.createDemoRequest);

export default router;
