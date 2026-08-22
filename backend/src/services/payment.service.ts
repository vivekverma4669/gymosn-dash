import { PaymentTransaction, IPaymentTransaction } from '../models/PaymentTransaction.model';
import { Member } from '../models/Member.model';
import { ApiError } from '../common/ApiError';
import { CreatePaymentInput } from '../validators/payment.validator';

type PopulatedPayment = IPaymentTransaction & {
  member: { name: string; phone: string; plan: { name: string } | null } | null;
};

const toPaymentDto = (payment: PopulatedPayment) => ({
  id: payment.id,
  invoiceNo: payment.invoiceNo,
  memberName: payment.member?.name ?? 'Unknown Member',
  phone: payment.member?.phone ?? '',
  plan: payment.member?.plan?.name ?? 'Unknown Plan',
  amount: payment.amount,
  method: payment.method,
  date: payment.date.toISOString(),
  notes: payment.notes ?? '',
});

const generateInvoiceNo = async (gymId: string): Promise<string> => {
  const year = new Date().getFullYear();
  const countThisYear = await PaymentTransaction.countDocuments({
    gym: gymId,
    invoiceNo: { $regex: `^INV-${year}-` },
  });
  const seq = String(countThisYear + 1).padStart(4, '0');
  return `INV-${year}-${seq}`;
};

export const listPayments = async (gymId: string) => {
  const payments = await PaymentTransaction.find({ gym: gymId })
    .populate({ path: 'member', select: 'name phone plan', populate: { path: 'plan', select: 'name' } })
    .sort({ date: -1 });

  return (payments as unknown as PopulatedPayment[]).map(toPaymentDto);
};

export const createPayment = async (gymId: string, input: CreatePaymentInput) => {
  const member = await Member.findOne({ _id: input.memberId, gym: gymId });
  if (!member) {
    throw ApiError.badRequest('Selected member does not belong to this gym');
  }

  const invoiceNo = await generateInvoiceNo(gymId);

  const payment = await PaymentTransaction.create({
    gym: gymId,
    member: input.memberId,
    invoiceNo,
    amount: input.amount,
    method: input.method,
    date: new Date(),
    notes: input.notes,
  });

  member.dueAmount = Math.max(0, member.dueAmount - input.amount);
  await member.save();

  const populated = await payment.populate<{
    member: { name: string; phone: string; plan: { name: string } | null };
  }>({ path: 'member', select: 'name phone plan', populate: { path: 'plan', select: 'name' } });

  return toPaymentDto(populated as unknown as PopulatedPayment);
};
