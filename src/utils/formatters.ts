// src/utils/formatters.ts
export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

export const getExperienceLevel = (years: number): string => {
  if (years <= 2) return 'Junior';
  if (years <= 5) return 'Mid';
  if (years <= 8) return 'Senior';
  return 'Expert';
};
