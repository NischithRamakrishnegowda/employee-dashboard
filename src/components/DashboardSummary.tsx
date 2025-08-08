// src/components/DashboardSummary.tsx
import React from 'react';
import { Employee } from '@models/employee';
import { Card } from '@components/ui/Card';

interface DashboardSummaryProps {
  employees: Employee[];
}

export const DashboardSummary: React.FC<DashboardSummaryProps> = ({ employees }) => {
  // Calculate metrics
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

  // Department with most employees
  const departmentCounts = employees.reduce(
    (acc, emp) => {
      acc[emp.department.name] = (acc[emp.department.name] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const topDepartment = Object.entries(departmentCounts).sort(([, a], [, b]) => b - a)[0];

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const summaryCards = [
    {
      title: 'Total Employees',
      value: totalEmployees.toLocaleString(),
      subtitle: `${activeEmployees} active (${((activeEmployees / totalEmployees) * 100).toFixed(1)}%)`,
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
      color: 'bg-blue-500',
    },
    {
      title: 'Average Salary',
      value: formatCurrency(averageSalary),
      subtitle: `Across all departments`,
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
          />
        </svg>
      ),
      color: 'bg-green-500',
    },
    {
      title: 'Average Experience',
      value: `${averageExperience.toFixed(1)} years`,
      subtitle: 'Company-wide experience level',
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
          />
        </svg>
      ),
      color: 'bg-purple-500',
    },
    {
      title: 'Average Rating',
      value: `${averageRating.toFixed(1)}/5.0`,
      subtitle: 'Performance rating',
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          />
        </svg>
      ),
      color: 'bg-yellow-500',
    },
    {
      title: 'Top Department',
      value: topDepartment ? topDepartment[0].split(' ')[0] : 'N/A',
      subtitle: topDepartment ? `${topDepartment[1]} employees` : 'No data',
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
      ),
      color: 'bg-indigo-500',
    },
    {
      title: 'Departments',
      value: Object.keys(departmentCounts).length.toString(),
      subtitle: 'Total departments',
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
      color: 'bg-pink-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {summaryCards.map((card, index) => (
        <Card key={index} className="relative overflow-hidden">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div
                className={`inline-flex items-center justify-center p-3 ${card.color} rounded-md text-white`}
              >
                {card.icon}
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">{card.title}</dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900">{card.value}</div>
                </dd>
                <dd className="text-sm text-gray-500">{card.subtitle}</dd>
              </dl>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
