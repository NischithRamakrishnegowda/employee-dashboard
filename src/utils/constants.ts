// src/utils/constants.ts
import { EXPORT_FIELDS } from '@services/exportService';

export const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export const formatOptions = [
  { value: 'csv' as const, label: 'CSV', description: 'Comma-separated values' },
  { value: 'excel' as const, label: 'Excel', description: 'Microsoft Excel format' },
  { value: 'json' as const, label: 'JSON', description: 'JavaScript Object Notation' },
];

export const getFieldsByCategory = () => ({
  basic: EXPORT_FIELDS.filter((field) =>
    ['firstName', 'lastName', 'fullName', 'email'].includes(field.key),
  ),
  role: EXPORT_FIELDS.filter((field) =>
    ['roleTitle', 'roleLevel', 'roleCategory', 'department'].includes(field.key),
  ),
  experience: EXPORT_FIELDS.filter((field) =>
    ['experienceYears', 'experienceLevel', 'performanceRating'].includes(field.key),
  ),
  employment: EXPORT_FIELDS.filter((field) =>
    ['salary', 'location', 'startDate', 'isActive'].includes(field.key),
  ),
  skills: EXPORT_FIELDS.filter((field) =>
    ['specialization', 'skills', 'skillCount'].includes(field.key),
  ),
});
