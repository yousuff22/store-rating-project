const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[!@#$%^&*()\-_=+{};:,<.>/?]).{8,16}$/;

export const validateName = (value: string): string | null => {
  if (!value.trim()) return 'Name is required';
  if (value.trim().length < 20) return 'Name must be at least 20 characters';
  if (value.trim().length > 60) return 'Name must not exceed 60 characters';
  return null;
};

export const validateEmail = (value: string): string | null => {
  if (!value.trim()) return 'Email is required';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value.trim())) return 'Invalid email address';
  return null;
};

export const validateAddress = (value: string): string | null => {
  if (!value.trim()) return 'Address is required';
  if (value.trim().length > 400) return 'Address must not exceed 400 characters';
  return null;
};

export const validatePassword = (value: string): string | null => {
  if (!value) return 'Password is required';
  if (!PASSWORD_REGEX.test(value))
    return 'Password must be 8-16 characters with at least one uppercase letter and one special character';
  return null;
};

export const validateRating = (value: number): string | null => {
  if (!Number.isInteger(value) || value < 1 || value > 5) return 'Rating must be between 1 and 5';
  return null;
};
