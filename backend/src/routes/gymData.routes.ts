import { Router } from 'express';
import * as planController from '../controllers/plan.controller';
import * as memberController from '../controllers/member.controller';
import * as enquiryController from '../controllers/enquiry.controller';
import * as attendanceController from '../controllers/attendance.controller';
import * as paymentController from '../controllers/payment.controller';
import * as workoutPlanController from '../controllers/workoutPlan.controller';
import * as dietPlanController from '../controllers/dietPlan.controller';
import * as analyticsController from '../controllers/analytics.controller';
import * as reportsController from '../controllers/reports.controller';
import * as reminderController from '../controllers/reminder.controller';
import { authenticate } from '../middlewares/authenticate.middleware';
import { authorize } from '../middlewares/authorize.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createPlanSchema, updatePlanSchema } from '../validators/plan.validator';
import { createMemberSchema, updateMemberSchema } from '../validators/member.validator';
import { createEnquirySchema, updateEnquirySchema } from '../validators/enquiry.validator';
import { checkInSchema } from '../validators/attendance.validator';
import { createPaymentSchema } from '../validators/payment.validator';
import { createWorkoutPlanSchema, updateWorkoutPlanSchema } from '../validators/workoutPlan.validator';
import { createDietPlanSchema, updateDietPlanSchema } from '../validators/dietPlan.validator';
import { sendReminderSchema } from '../validators/reminder.validator';

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

// Attendance
router.get('/attendance', attendanceController.getAttendance);
router.post('/attendance/check-in', validate(checkInSchema), attendanceController.checkIn);
router.delete('/attendance/:memberId', attendanceController.undoCheckIn);

// Payments
router.get('/payments', paymentController.listPayments);
router.post('/payments', validate(createPaymentSchema), paymentController.createPayment);

// Workout Plans
router.get('/workout-plans', workoutPlanController.listWorkoutPlans);
router.post('/workout-plans', validate(createWorkoutPlanSchema), workoutPlanController.createWorkoutPlan);
router.patch('/workout-plans/:planId', validate(updateWorkoutPlanSchema), workoutPlanController.updateWorkoutPlan);
router.delete('/workout-plans/:planId', workoutPlanController.deleteWorkoutPlan);

// Diet Plans
router.get('/diet-plans', dietPlanController.listDietPlans);
router.post('/diet-plans', validate(createDietPlanSchema), dietPlanController.createDietPlan);
router.patch('/diet-plans/:planId', validate(updateDietPlanSchema), dietPlanController.updateDietPlan);
router.delete('/diet-plans/:planId', dietPlanController.deleteDietPlan);

// Analytics
router.get('/analytics', analyticsController.getAnalytics);

// Reports
router.get('/reports', reportsController.getReport);

// Reminders (manual WhatsApp sends from the Reminder Center + their history)
router.post('/reminders/send', validate(sendReminderSchema), reminderController.sendReminders);
router.get('/reminders/history', reminderController.listReminderHistory);

export default router;
