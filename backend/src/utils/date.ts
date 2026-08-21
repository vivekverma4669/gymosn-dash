import { DurationUnit } from '../models/Plan.model';

export const addDuration = (date: Date, value: number, unit: DurationUnit): Date => {
  const result = new Date(date);
  switch (unit) {
    case 'Days':
      result.setDate(result.getDate() + value);
      break;
    case 'Weeks':
      result.setDate(result.getDate() + value * 7);
      break;
    case 'Months':
      result.setMonth(result.getMonth() + value);
      break;
    case 'Years':
      result.setFullYear(result.getFullYear() + value);
      break;
  }
  return result;
};

export const toDateOnly = (date: Date): string => date.toISOString().slice(0, 10);
