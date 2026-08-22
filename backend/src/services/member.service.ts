import { Member, IMember } from '../models/Member.model';
import { Plan } from '../models/Plan.model';
import { User } from '../models/User.model';
import { WorkoutPlan } from '../models/WorkoutPlan.model';
import { DietPlan } from '../models/DietPlan.model';
import { ApiError } from '../common/ApiError';
import { addDuration, toDateOnly } from '../utils/date';
import { CreateMemberInput, UpdateMemberInput } from '../validators/member.validator';

type PopulatedMember = IMember & {
  plan: { name: string; price: number } | null;
  trainer: { name: string } | null;
  workoutPlan: { name: string } | null;
  dietPlan: { name: string } | null;
};

const POPULATE_PATHS = [
  { path: 'plan', select: 'name price' },
  { path: 'trainer', select: 'name' },
  { path: 'workoutPlan', select: 'name' },
  { path: 'dietPlan', select: 'name' },
];

const initialsOf = (name: string): string =>
  name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

const computeStatus = (member: IMember): 'Active' | 'Expired' | 'Expiring Soon' | 'Inactive' => {
  if (!member.isActive) return 'Inactive';
  const now = Date.now();
  const expiry = member.expiryDate.getTime();
  if (expiry < now) return 'Expired';
  const daysLeft = (expiry - now) / (1000 * 60 * 60 * 24);
  if (daysLeft <= 7) return 'Expiring Soon';
  return 'Active';
};

const toMemberDto = (member: PopulatedMember) => ({
  id: member.id,
  name: member.name,
  phone: member.phone,
  email: member.email ?? '',
  plan: member.plan?.name ?? 'Unknown Plan',
  listPrice: member.plan?.price ?? 0,
  agreedPrice: member.agreedPrice,
  status: computeStatus(member),
  joiningDate: toDateOnly(member.joiningDate),
  expiryDate: toDateOnly(member.expiryDate),
  dateOfBirth: member.dateOfBirth ? toDateOnly(member.dateOfBirth) : null,
  dueAmount: member.dueAmount,
  lastCheckIn: member.lastCheckIn ? member.lastCheckIn.toISOString() : '-',
  trainer: member.trainer?.name ?? 'Unassigned',
  workoutPlan: member.workoutPlan?.name ?? null,
  dietPlan: member.dietPlan?.name ?? null,
  gender: member.gender,
  age: member.age,
  avatar: initialsOf(member.name),
});

export const listMembers = async (gymId: string) => {
  const members = await Member.find({ gym: gymId })
    .populate(POPULATE_PATHS)
    .sort({ createdAt: -1 });

  return (members as unknown as PopulatedMember[]).map(toMemberDto);
};

const assertPlanBelongsToGym = async (gymId: string, planId: string) => {
  const plan = await Plan.findOne({ _id: planId, gym: gymId });
  if (!plan) {
    throw ApiError.badRequest('Selected plan does not belong to this gym');
  }
  return plan;
};

const assertTrainerBelongsToGym = async (gymId: string, trainerId: string) => {
  const trainer = await User.findOne({ _id: trainerId, gym: gymId, role: 'TRAINER' });
  if (!trainer) {
    throw ApiError.badRequest('Selected trainer does not belong to this gym');
  }
};

const assertWorkoutPlanBelongsToGym = async (gymId: string, workoutPlanId: string) => {
  const plan = await WorkoutPlan.findOne({ _id: workoutPlanId, gym: gymId });
  if (!plan) {
    throw ApiError.badRequest('Selected workout plan does not belong to this gym');
  }
};

const assertDietPlanBelongsToGym = async (gymId: string, dietPlanId: string) => {
  const plan = await DietPlan.findOne({ _id: dietPlanId, gym: gymId });
  if (!plan) {
    throw ApiError.badRequest('Selected diet plan does not belong to this gym');
  }
};

export const createMember = async (gymId: string, input: CreateMemberInput) => {
  const plan = await assertPlanBelongsToGym(gymId, input.plan);
  if (input.trainer) {
    await assertTrainerBelongsToGym(gymId, input.trainer);
  }

  const expiryDate = addDuration(input.joiningDate, plan.durationValue, plan.durationUnit);

  const member = await Member.create({
    gym: gymId,
    name: input.name,
    phone: input.phone,
    email: input.email || undefined,
    plan: input.plan,
    trainer: input.trainer || undefined,
    joiningDate: input.joiningDate,
    expiryDate,
    dateOfBirth: input.dateOfBirth,
    agreedPrice: input.agreedPrice ?? plan.price,
    dueAmount: input.dueAmount ?? 0,
    gender: input.gender,
    age: input.age,
  });

  const populated = await member.populate<{
    plan: { name: string; price: number };
    trainer: { name: string } | null;
    workoutPlan: { name: string } | null;
    dietPlan: { name: string } | null;
  }>(POPULATE_PATHS);

  return toMemberDto(populated as unknown as PopulatedMember);
};

export const updateMember = async (gymId: string, memberId: string, input: UpdateMemberInput) => {
  const member = await Member.findOne({ _id: memberId, gym: gymId });
  if (!member) {
    throw ApiError.notFound('Member not found');
  }

  if (input.plan) {
    await assertPlanBelongsToGym(gymId, input.plan);
  }
  if (input.trainer) {
    await assertTrainerBelongsToGym(gymId, input.trainer);
  }
  if (input.workoutPlan) {
    await assertWorkoutPlanBelongsToGym(gymId, input.workoutPlan);
  }
  if (input.dietPlan) {
    await assertDietPlanBelongsToGym(gymId, input.dietPlan);
  }

  const { trainer, workoutPlan, dietPlan, ...rest } = input;
  Object.assign(member, rest);
  if (trainer !== undefined) {
    member.trainer = trainer ? (trainer as unknown as typeof member.trainer) : undefined;
  }
  if (workoutPlan !== undefined) {
    member.workoutPlan = workoutPlan ? (workoutPlan as unknown as typeof member.workoutPlan) : undefined;
  }
  if (dietPlan !== undefined) {
    member.dietPlan = dietPlan ? (dietPlan as unknown as typeof member.dietPlan) : undefined;
  }

  await member.save();

  const populated = await member.populate<{
    plan: { name: string; price: number };
    trainer: { name: string } | null;
    workoutPlan: { name: string } | null;
    dietPlan: { name: string } | null;
  }>(POPULATE_PATHS);

  return toMemberDto(populated as unknown as PopulatedMember);
};

export const deleteMember = async (gymId: string, memberId: string) => {
  const member = await Member.findOne({ _id: memberId, gym: gymId });
  if (!member) {
    throw ApiError.notFound('Member not found');
  }
  await member.deleteOne();
};
