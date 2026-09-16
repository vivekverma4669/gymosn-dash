export const normalizePhone = (phone: string): string => phone.replace(/\D/g, '');

// Members are stored as bare 10-digit Indian numbers (see frontend sanitizePhoneInput).
// WhatsApp Cloud API requires the number in country-code-prefixed form with no leading "+".
export const toWhatsAppNumber = (phone: string): string => {
  const digits = normalizePhone(phone);
  return digits.length === 10 ? `91${digits}` : digits;
};

export const phonesMatch = (a: string, b: string): boolean => {
  const normA = normalizePhone(a);
  const normB = normalizePhone(b);
  if (normA.length < 10 || normB.length < 10) return false;
  return normA.slice(-10) === normB.slice(-10);
};
