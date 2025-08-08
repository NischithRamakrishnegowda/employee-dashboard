export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  department: Department;
  experienceYears: number;
  specialization: string[];
  salary: number;
  location: string;
  startDate: Date;
  skills: Skill[];
  performanceRating: number;
  isActive: boolean;
}

export interface Department {
  id: string;
  name: string;
  description: string;
  headCount?: number;
  budget?: number;
}

export interface Role {
  id: string;
  title: string;
  level: 'Junior' | 'Mid' | 'Senior' | 'Lead' | 'Manager' | 'Director';
  category: 'Engineering' | 'Research' | 'Clinical' | 'Regulatory' | 'Sales';
}

export interface Skill {
  id: string;
  name: string;
  category: 'Technical' | 'Domain' | 'Soft';
  proficiency: 1 | 2 | 3 | 4 | 5;
}
