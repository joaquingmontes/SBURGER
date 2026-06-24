export const isValidProductId = (id?: string | null): boolean =>
  typeof id === 'string' && id.includes('-') && id.length >= 32;
