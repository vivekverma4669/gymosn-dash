import { Plan } from '../models/Plan.model';
import { Member } from '../models/Member.model';
import { ApiError } from '../common/ApiError';
import { CreatePlanInput, UpdatePlanInput } from '../validators/plan.validator';

const toPlanDto = (plan: InstanceType<typeof Plan>, activeMembers: number) => ({
  id: plan.id,
  name: plan.name,
  price: plan.price,
  durationValue: plan.durationValue,
  durationUnit: plan.durationUnit,
  description: plan.description,
  isActive: plan.isActive,
  activeMembers,
});

export const listPlans = async (gymId: string) => {
  const plans = await Plan.find({ gym: gymId }).sort({ createdAt: -1 });

  const counts = await Member.aggregate([
    { $match: { plan: { $in: plans.map((p) => p._id) }, isActive: true } },
    { $group: { _id: '$plan', count: { $sum: 1 } } },
  ]);
  const countByPlan = new Map(counts.map((c) => [c._id.toString(), c.count as number]));

  return plans.map((plan) => toPlanDto(plan, countByPlan.get(plan.id) ?? 0));
};

export const createPlan = async (gymId: string, input: CreatePlanInput) => {
  const plan = await Plan.create({ ...input, gym: gymId });
  return toPlanDto(plan, 0);
};

export const updatePlan = async (gymId: string, planId: string, input: UpdatePlanInput) => {
  const plan = await Plan.findOne({ _id: planId, gym: gymId });
  if (!plan) {
    throw ApiError.notFound('Plan not found');
  }

  Object.assign(plan, input);
  await plan.save();

  const activeMembers = await Member.countDocuments({ plan: plan._id, isActive: true });
  return toPlanDto(plan, activeMembers);
};

export const deletePlan = async (gymId: string, planId: string) => {
  const plan = await Plan.findOne({ _id: planId, gym: gymId });
  if (!plan) {
    throw ApiError.notFound('Plan not found');
  }

  const memberCount = await Member.countDocuments({ plan: plan._id });
  if (memberCount > 0) {
    throw ApiError.conflict('Cannot delete a plan that has members assigned to it. Deactivate it instead.');
  }

  await plan.deleteOne();
};
