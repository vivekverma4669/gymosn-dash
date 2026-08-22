import { WorkoutPlan } from '../models/WorkoutPlan.model';
import { Member } from '../models/Member.model';
import { ApiError } from '../common/ApiError';
import { CreateWorkoutPlanInput, UpdateWorkoutPlanInput } from '../validators/workoutPlan.validator';

const toWorkoutPlanDto = (plan: InstanceType<typeof WorkoutPlan>, assignedMembers: number) => ({
  id: plan.id,
  name: plan.name,
  goal: plan.goal,
  description: plan.description,
  days: plan.days,
  isActive: plan.isActive,
  assignedMembers,
});

export const listWorkoutPlans = async (gymId: string) => {
  const plans = await WorkoutPlan.find({ gym: gymId }).sort({ createdAt: -1 });

  const counts = await Member.aggregate([
    { $match: { workoutPlan: { $in: plans.map((p) => p._id) } } },
    { $group: { _id: '$workoutPlan', count: { $sum: 1 } } },
  ]);
  const countByPlan = new Map(counts.map((c) => [c._id.toString(), c.count as number]));

  return plans.map((plan) => toWorkoutPlanDto(plan, countByPlan.get(plan.id) ?? 0));
};

export const createWorkoutPlan = async (gymId: string, input: CreateWorkoutPlanInput) => {
  const plan = await WorkoutPlan.create({ ...input, gym: gymId });
  return toWorkoutPlanDto(plan, 0);
};

export const updateWorkoutPlan = async (gymId: string, planId: string, input: UpdateWorkoutPlanInput) => {
  const plan = await WorkoutPlan.findOne({ _id: planId, gym: gymId });
  if (!plan) {
    throw ApiError.notFound('Workout plan not found');
  }

  Object.assign(plan, input);
  await plan.save();

  const assignedMembers = await Member.countDocuments({ workoutPlan: plan._id });
  return toWorkoutPlanDto(plan, assignedMembers);
};

export const deleteWorkoutPlan = async (gymId: string, planId: string) => {
  const plan = await WorkoutPlan.findOne({ _id: planId, gym: gymId });
  if (!plan) {
    throw ApiError.notFound('Workout plan not found');
  }

  const assignedMembers = await Member.countDocuments({ workoutPlan: plan._id });
  if (assignedMembers > 0) {
    throw ApiError.conflict('Cannot delete a workout plan assigned to members. Unassign or deactivate it instead.');
  }

  await plan.deleteOne();
};
