// src/components/dashboard/DashboardCharts.tsx
import React, { useMemo } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ScatterChart,
  Scatter,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Employee } from '@models/employee';
import { Card } from '@components/ui/Card';
import {
  generateDepartmentData,
  generateSalaryData,
  generateScatterData,
  generateDepartmentMetrics,
} from '@utils/chartData';
import { COLORS } from '@utils/constants';

interface DashboardChartsProps {
  employees: Employee[];
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    color: string;
    dataKey: string;
    value: string | number;
  }>;
  label?: string;
}

interface ScatterTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: {
      name: string;
      department: string;
      experience: number;
      salary: number;
      rating: number;
    };
  }>;
}

export const DashboardCharts: React.FC<DashboardChartsProps> = ({ employees }) => {
  // Chart data using utils
  const departmentData = useMemo(() => generateDepartmentData(employees), [employees]);
  const salaryData = useMemo(() => generateSalaryData(employees), [employees]);
  const scatterData = useMemo(() => generateScatterData(employees), [employees]);
  const departmentMetrics = useMemo(() => generateDepartmentMetrics(employees), [employees]);

  const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.dataKey}: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const ScatterTooltip: React.FC<ScatterTooltipProps> = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium">{data.name}</p>
          <p>Department: {data.department}</p>
          <p>Experience: {data.experience} years</p>
          <p>Salary: ${data.salary.toLocaleString()}</p>
          <p>Rating: {data.rating.toFixed(1)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Department Distribution Pie Chart */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Employee Distribution by Department
        </h3>
        <ResponsiveContainer width="100%" height={420}>
          <PieChart>
            <Pie
              data={departmentData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percentage }) => `${name}: ${percentage}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {departmentData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Card>

      {/* Salary Distribution Bar Chart */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Salary Distribution</h3>
        <ResponsiveContainer width="100%" height={420}>
          <BarChart data={salaryData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="range" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Experience vs Salary Scatter Plot */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Experience vs Salary Correlation
        </h3>
        <ResponsiveContainer width="100%" height={420}>
          <ScatterChart data={scatterData}>
            <CartesianGrid />
            <XAxis type="number" dataKey="experience" name="Experience" unit=" years" />
            <YAxis
              type="number"
              dataKey="salary"
              name="Salary"
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<ScatterTooltip />} />
            <Scatter name="Employees" dataKey="salary" fill="#8884d8" fillOpacity={0.6} />
          </ScatterChart>
        </ResponsiveContainer>
      </Card>

      {/* Department Metrics */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Department Metrics</h3>
        <ResponsiveContainer width="100%" height={420}>
          <BarChart data={departmentMetrics}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-25} textAnchor="end" height={100} interval={0} />
            <YAxis tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`} />
            <Tooltip
              formatter={(value: number) => [`${value.toLocaleString()}`, 'Avg Salary']}
              labelFormatter={(label) => `Department: ${label}`}
            />
            <Bar dataKey="avgSalary" fill="#00C49F" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};
