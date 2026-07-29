export const isNonEmptyString = (value: string): boolean =>
  value.trim().length > 0;

export const isValidEmail = (value: string): boolean => {
  const trimmed = value.trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
};

export const parsePositiveInteger = (value: string): number | null => {
  const digits = value.replace(/\D/g, '');

  if (!digits) {
    return null;
  }

  const parsed = Number(digits);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
};

export const isValidPhoneNumber = (value: string): boolean =>
  value.replace(/\D/g, '').length >= 8;

export const hasMinimumLength = (value: string, minLength: number): boolean =>
  value.trim().length >= minLength;

export const isValidHttpUrl = (value: string): boolean => {
  const trimmed = value.trim();

  if (!trimmed) {
    return true;
  }

  try {
    const url = new URL(trimmed);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};
