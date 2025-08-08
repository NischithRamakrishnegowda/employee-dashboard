// src/components/DashboardCharts.tsx
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

interface DashboardChartsProps {
  employees: Employee[];
}

export const DashboardCharts: React.FC<DashboardChartsProps> = ({ employees }) => {
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  // Department distribution data
  const departmentData = useMemo(() => {
    const departmentCounts = employees.reduce(
      (acc, emp) => {
        const deptName = emp.department.name;
        acc[deptName] = (acc[deptName] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    return Object.entries(departmentCounts).map(([name, value]) => ({
      name: name.replace(' & ', ' & \n'), // Break long department names
      value,
      percentage: ((value / employees.length) * 100).toFixed(1),
    }));
  }, [employees]);

  // Salary distribution data
  const salaryData = useMemo(() => {
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
  }, [employees]);

  // Experience vs Salary scatter plot data
  const scatterData = useMemo(() => {
    return employees.map((emp) => ({
      experience: emp.experienceYears,
      salary: emp.salary,
      name: `${emp.firstName} ${emp.lastName}`,
      department: emp.department.name,
      rating: emp.performanceRating,
    }));
  }, [employees]);

  // Department metrics data
  const departmentMetrics = useMemo(() => {
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
      {} as Record<string, any>,
    );

    return Object.values(metrics).map((dept: any) => ({
      name: dept.name,
      avgSalary: Math.round(dept.totalSalary / dept.count),
      avgExperience: Math.round((dept.totalExperience / dept.count) * 10) / 10,
      avgRating: Math.round((dept.totalRating / dept.count) * 10) / 10,
      count: dept.count,
    }));
  }, [employees]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.dataKey}: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const ScatterTooltip = ({ active, payload }: any) => {
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
        <ResponsiveContainer width="100%" height={300}>
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
        <ResponsiveContainer width="100%" height={300}>
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
        <ResponsiveContainer width="100%" height={300}>
          <ScatterChart data={scatterData}>
            <CartesianGrid />
            <XAxis type="number" dataKey="experience" name="Experience" unit=" years" />
            <YAxis
              type="number"
              dataKey="salary"
              name="Salary"
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<ScatterTooltip />} />
            <Scatter name="Employees" dataKey="salary" fill="#8884d8" fillOpacity={0.6} />
          </ScatterChart>
        </ResponsiveContainer>
      </Card>

      {/* Department Metrics */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Department Metrics</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={departmentMetrics}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} interval={0} />
            <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
            <Tooltip
              formatter={(value: number) => [`$${value.toLocaleString()}`, 'Avg Salary']}
              labelFormatter={(label) => `Department: ${label}`}
            />
            <Bar dataKey="avgSalary" fill="#00C49F" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};
