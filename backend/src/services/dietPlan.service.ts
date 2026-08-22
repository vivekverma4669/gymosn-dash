import { DietPlan } from '../models/DietPlan.model';
import { Member } from '../models/Member.model';
import { ApiError } from '../common/ApiError';
import { CreateDietPlanInput, UpdateDietPlanInput } from '../validators/dietPlan.validator';

const toDietPlanDto = (plan: InstanceType<typeof DietPlan>, assignedMembers: number) => ({
  id: plan.id,
  name: plan.name,
  goal: plan.goal,
  dailyCalories: plan.dailyCalories ?? null,
  description: plan.description,
  meals: plan.meals,
  isActive: plan.isActive,
  assignedMembers,
});

export const listDietPlans = async (gymId: string) => {
  const plans = await DietPlan.find({ gym: gymId }).sort({ createdAt: -1 });

  const counts = await Member.aggregate([
    { $match: { dietPlan: { $in: plans.map((p) => p._id) } } },
    { $group: { _id: '$dietPlan', count: { $sum: 1 } } },
  ]);
  const countByPlan = new Map(counts.map((c) => [c._id.toString(), c.count as number]));

  return plans.map((plan) => toDietPlanDto(plan, countByPlan.get(plan.id) ?? 0));
};

export const createDietPlan = async (gymId: string, input: CreateDietPlanInput) => {
  const plan = await DietPlan.create({ ...input, gym: gymId });
  return toDietPlanDto(plan, 0);
};

export const updateDietPlan = async (gymId: string, planId: string, input: UpdateDietPlanInput) => {
  const plan = await DietPlan.findOne({ _id: planId, gym: gymId });
  if (!plan) {
    throw ApiError.notFound('Diet plan not found');
  }

  Object.assign(plan, input);
  await plan.save();

  const assignedMembers = await Member.countDocuments({ dietPlan: plan._id });
  return toDietPlanDto(plan, assignedMembers);
};

export const deleteDietPlan = async (gymId: string, planId: string) => {
  const plan = await DietPlan.findOne({ _id: planId, gym: gymId });
  if (!plan) {
    throw ApiError.notFound('Diet plan not found');
  }

  const assignedMembers = await Member.countDocuments({ dietPlan: plan._id });
  if (assignedMembers > 0) {
    throw ApiError.conflict('Cannot delete a diet plan assigned to members. Unassign or deactivate it instead.');
  }

  await plan.deleteOne();
};
