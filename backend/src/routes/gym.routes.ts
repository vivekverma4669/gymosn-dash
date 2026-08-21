import { Router } from 'express';
import * as trainerController from '../controllers/trainer.controller';
import { authenticate } from '../middlewares/authenticate.middleware';
import { authorize } from '../middlewares/authorize.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createTrainerSchema, setTrainerActiveSchema } from '../validators/trainer.validator';
import { resetPasswordSchema } from '../validators/superadmin.validator';

const router = Router();

router.use(authenticate, authorize('GYM_OWNER'));

router.post('/trainers', validate(createTrainerSchema), trainerController.createTrainer);
router.get('/trainers', trainerController.listTrainers);
router.patch('/trainers/:trainerId/active', validate(setTrainerActiveSchema), trainerController.setTrainerActive);
router.post(
  '/trainers/:trainerId/reset-password',
  validate(resetPasswordSchema),
  trainerController.resetTrainerPassword
);

export default router;
