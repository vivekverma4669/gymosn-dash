import { Router } from 'express';
import * as superadminController from '../controllers/superadmin.controller';
import { authenticate } from '../middlewares/authenticate.middleware';
import { authorize } from '../middlewares/authorize.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createGymSchema, resetPasswordSchema, setActiveSchema } from '../validators/superadmin.validator';

const router = Router();

router.use(authenticate, authorize('SUPERADMIN'));

router.post('/gyms', validate(createGymSchema), superadminController.createGym);
router.get('/gyms', superadminController.listGyms);
router.patch('/gyms/:gymId/active', validate(setActiveSchema), superadminController.setGymActive);
router.post(
  '/gym-owners/:gymOwnerId/reset-password',
  validate(resetPasswordSchema),
  superadminController.resetGymOwnerPassword
);

export default router;
