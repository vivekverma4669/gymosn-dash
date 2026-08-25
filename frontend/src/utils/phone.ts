// Keeps phone inputs to digits only, capped at 10 (Indian mobile numbers, no country code needed).
export const sanitizePhoneInput = (value: string): string => value.replace(/\D/g, '').slice(0, 10);
