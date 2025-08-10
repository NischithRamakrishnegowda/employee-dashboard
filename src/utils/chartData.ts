// src/utils/chartData.ts
import { Employee } from '@models/employee';

export const generateDepartmentData = (employees: Employee[]) => {
  const departmentCounts = employees.reduce(
    (acc, emp) => {
      const deptName = emp.department.name;
      acc[deptName] = (acc[deptName] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  return Object.entries(departmentCounts).map(([name, value]) => ({
    name: name.replace(' & ', ' & \n'),
    value,
    percentage: ((value / employees.length) * 100).toFixed(1),
  }));
};

export const generateSalaryData = (employees: Employee[]) => {
  const ranges = [
    { range: '$40k-60k', min: 40000, max: 60000 },
    { range: '$60k-80k', min: 60000, max: 80000 },
    { range: '$80k-100k', min: 80000, max: 100000 },
    { range: '$100k-120k', min: 100000, max: 120000 },
    { range: '$120k+', min: 120000, max: Infinity },
  ];

  return ranges
    .map(({ range, min, max }) => {
      const count = employees.filter((emp) => emp.salary >= min && emp.salary < max).length;
      return {
        range,
        count,
        percentage: ((count / employees.length) * 100).toFixed(1),
      };
    })
    .filter((item) => item.count > 0);
};

export const generateScatterData = (employees: Employee[]) => {
  return employees.map((emp) => ({
    experience: emp.experienceYears,
    salary: emp.salary,
    name: `${emp.firstName} ${emp.lastName}`,
    department: emp.department.name,
    rating: emp.performanceRating,
  }));
};

export const generateDepartmentMetrics = (employees: Employee[]) => {
  interface DepartmentMetric {
    name: string;
    count: number;
    totalSalary: number;
    totalExperience: number;
    totalRating: number;
  }

  const metrics = employees.reduce(
    (acc, emp) => {
      const deptName = emp.department.name;
      if (!acc[deptName]) {
        acc[deptName] = {
          name: deptName,
          count: 0,
          totalSalary: 0,
          totalExperience: 0,
          totalRating: 0,
        };
      }
      acc[deptName].count += 1;
      acc[deptName].totalSalary += emp.salary;
      acc[deptName].totalExperience += emp.experienceYears;
      acc[deptName].totalRating += emp.performanceRating;
      return acc;
    },
    {} as Record<string, DepartmentMetric>,
  );

  return Object.values(metrics).map((dept) => ({
    name: dept.name,
    avgSalary: Math.round(dept.totalSalary / dept.count),
    avgExperience: Math.round((dept.totalExperience / dept.count) * 10) / 10,
    avgRating: Math.round((dept.totalRating / dept.count) * 10) / 10,
    count: dept.count,
  }));
};
