import { Enquiry, IEnquiry } from '../models/Enquiry.model';
import { ApiError } from '../common/ApiError';
import { toDateOnly } from '../utils/date';
import { CreateEnquiryInput, UpdateEnquiryInput } from '../validators/enquiry.validator';

const toEnquiryDto = (enquiry: IEnquiry) => ({
  id: enquiry.id,
  name: enquiry.name,
  phone: enquiry.phone,
  email: enquiry.email ?? '',
  source: enquiry.source,
  interestedPlan: enquiry.interestedPlan,
  visitDate: toDateOnly(enquiry.visitDate),
  followUpDate: enquiry.followUpDate ? toDateOnly(enquiry.followUpDate) : '-',
  status: enquiry.status,
  assignedTo: enquiry.assignedTo ?? '',
  notes: enquiry.notes,
});

export const listEnquiries = async (gymId: string) => {
  const enquiries = await Enquiry.find({ gym: gymId }).sort({ createdAt: -1 });
  return enquiries.map(toEnquiryDto);
};

export const createEnquiry = async (gymId: string, input: CreateEnquiryInput) => {
  const enquiry = await Enquiry.create({ ...input, gym: gymId });
  return toEnquiryDto(enquiry);
};

export const updateEnquiry = async (gymId: string, enquiryId: string, input: UpdateEnquiryInput) => {
  const enquiry = await Enquiry.findOne({ _id: enquiryId, gym: gymId });
  if (!enquiry) {
    throw ApiError.notFound('Enquiry not found');
  }

  Object.assign(enquiry, input);
  await enquiry.save();
  return toEnquiryDto(enquiry);
};

export const deleteEnquiry = async (gymId: string, enquiryId: string) => {
  const enquiry = await Enquiry.findOne({ _id: enquiryId, gym: gymId });
  if (!enquiry) {
    throw ApiError.notFound('Enquiry not found');
  }
  await enquiry.deleteOne();
};
