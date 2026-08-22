import { Router } from 'express';
import authRoutes from './auth.routes';
import superadminRoutes from './superadmin.routes';
import gymRoutes from './gym.routes';
import gymDataRoutes from './gymData.routes';
import publicRoutes from './public.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/superadmin', superadminRoutes);
router.use('/gym', gymRoutes);
router.use('/gym', gymDataRoutes);
router.use('/public', publicRoutes);

export default router;
