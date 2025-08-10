// src/utils/summaryCalculations.ts
import { Employee } from '@models/employee';

export const calculateSummaryMetrics = (employees: Employee[]) => {
  const totalEmployees = employees.length;
  const activeEmployees = employees.filter((emp) => emp.isActive).length;
  const averageSalary =
    employees.length > 0
      ? employees.reduce((sum, emp) => sum + emp.salary, 0) / employees.length
      : 0;
  const averageExperience =
    employees.length > 0
      ? employees.reduce((sum, emp) => sum + emp.experienceYears, 0) / employees.length
      : 0;
  const averageRating =
    employees.length > 0
      ? employees.reduce((sum, emp) => sum + emp.performanceRating, 0) / employees.length
      : 0;

  const departmentCounts = employees.reduce(
    (acc, emp) => {
      acc[emp.department.name] = (acc[emp.department.name] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const topDepartment = Object.entries(departmentCounts).sort(([, a], [, b]) => b - a)[0];

  return {
    totalEmployees,
    activeEmployees,
    averageSalary,
    averageExperience,
    averageRating,
    departmentCounts,
    topDepartment,
  };
};
