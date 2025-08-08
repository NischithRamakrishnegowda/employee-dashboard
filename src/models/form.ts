import { Employee } from './employee';

export interface EmployeeFormData {
  firstName: string;
  lastName: string;
  email: string;
  roleId: string;
  departmentId: string;
  experienceYears: number;
  specialization: string[];
  salary: number;
  location: string;
  startDate: string;
  skills: string[];
  performanceRating: number;
  isActive: boolean;
}

export interface FilterState {
  department: string;
  experienceLevel: string;
  searchTerm: string;
  isActive: boolean | null;
}

export interface SortState {
  field: keyof Employee | null;
  direction: 'asc' | 'desc';
}
