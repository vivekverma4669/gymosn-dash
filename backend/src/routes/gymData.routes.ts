import { Router } from 'express';
import * as planController from '../controllers/plan.controller';
import * as memberController from '../controllers/member.controller';
import * as enquiryController from '../controllers/enquiry.controller';
import { authenticate } from '../middlewares/authenticate.middleware';
import { authorize } from '../middlewares/authorize.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createPlanSchema, updatePlanSchema } from '../validators/plan.validator';
import { createMemberSchema, updateMemberSchema } from '../validators/member.validator';
import { createEnquirySchema, updateEnquirySchema } from '../validators/enquiry.validator';

const router = Router();

router.use(authenticate, authorize('GYM_OWNER', 'TRAINER'));

// Membership Plans
router.get('/plans', planController.listPlans);
router.post('/plans', validate(createPlanSchema), planController.createPlan);
router.patch('/plans/:planId', validate(updatePlanSchema), planController.updatePlan);
router.delete('/plans/:planId', planController.deletePlan);

// Members
router.get('/members', memberController.listMembers);
router.post('/members', validate(createMemberSchema), memberController.createMember);
router.patch('/members/:memberId', validate(updateMemberSchema), memberController.updateMember);
router.delete('/members/:memberId', memberController.deleteMember);

// Enquiries
router.get('/enquiries', enquiryController.listEnquiries);
router.post('/enquiries', validate(createEnquirySchema), enquiryController.createEnquiry);
router.patch('/enquiries/:enquiryId', validate(updateEnquirySchema), enquiryController.updateEnquiry);
router.delete('/enquiries/:enquiryId', enquiryController.deleteEnquiry);

export default router;
