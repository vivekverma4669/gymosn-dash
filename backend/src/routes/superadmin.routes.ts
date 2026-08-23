import { Router } from 'express';
import * as superadminController from '../controllers/superadmin.controller';
import { authenticate } from '../middlewares/authenticate.middleware';
import { authorize } from '../middlewares/authorize.middleware';
import { validate } from '../middlewares/validate.middleware';
import {
  createGymSchema,
  resetPasswordSchema,
  setActiveSchema,
  updateEmailSchema,
  updateTierSchema,
} from '../validators/superadmin.validator';

const router = Router();

router.use(authenticate, authorize('SUPERADMIN'));

router.post('/gyms', validate(createGymSchema), superadminController.createGym);
router.get('/gyms', superadminController.listGyms);
router.get('/gyms/:gymId/view', superadminController.viewGym);
router.get('/audit-logs', superadminController.listAuditLogs);
router.patch('/gyms/:gymId/active', validate(setActiveSchema), superadminController.setGymActive);
router.patch('/gyms/:gymId/tier', validate(updateTierSchema), superadminController.setGymTier);
router.post('/reminders/run', superadminController.triggerReminders);
router.post(
  '/gym-owners/:gymOwnerId/reset-password',
  validate(resetPasswordSchema),
  superadminController.resetGymOwnerPassword
);
router.patch(
  '/gym-owners/:gymOwnerId/email',
  validate(updateEmailSchema),
  superadminController.updateGymOwnerEmail
);

export default router;
