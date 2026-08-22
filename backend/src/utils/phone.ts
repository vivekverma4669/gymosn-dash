export const normalizePhone = (phone: string): string => phone.replace(/\D/g, '');

export const phonesMatch = (a: string, b: string): boolean => {
  const normA = normalizePhone(a);
  const normB = normalizePhone(b);
  if (normA.length < 10 || normB.length < 10) return false;
  return normA.slice(-10) === normB.slice(-10);
};
