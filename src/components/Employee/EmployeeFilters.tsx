// src/components/EmployeeFilters.tsx
import React from 'react';
import { Department } from '@models/employee';
import { FilterState } from '@models/form';
import { Input } from '@components/ui/Input';
import { Select } from '@components/ui/Select';
import { Button } from '@components/ui/Button';

interface EmployeeFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: Partial<FilterState>) => void;
  departments: Department[];
  onClearFilters: () => void;
}

export const EmployeeFilters: React.FC<EmployeeFiltersProps> = ({
  filters,
  onFiltersChange,
  departments,
  onClearFilters,
}) => {
  const departmentOptions = [
    { value: '', label: 'All Departments' },
    ...departments.map((dept) => ({ value: dept.name, label: dept.name })),
  ];

  const experienceLevelOptions = [
    { value: '', label: 'All Experience Levels' },
    { value: 'Junior', label: 'Junior (0-2 years)' },
    { value: 'Mid', label: 'Mid (3-5 years)' },
    { value: 'Senior', label: 'Senior (6-8 years)' },
    { value: 'Expert', label: 'Expert (9+ years)' },
  ];

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'active', label: 'Active Only' },
    { value: 'inactive', label: 'Inactive Only' },
  ];

  const hasActiveFilters =
    filters.department ||
    filters.experienceLevel ||
    filters.searchTerm ||
    filters.isActive !== null;

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    let isActive: boolean | null = null;

    if (value === 'active') {
      isActive = true;
    } else if (value === 'inactive') {
      isActive = false;
    }

    onFiltersChange({ isActive });
  };

  const getStatusValue = () => {
    if (filters.isActive === true) return 'active';
    if (filters.isActive === false) return 'inactive';
    return '';
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Filters</h3>
        {hasActiveFilters && (
          <Button variant="outline" size="sm" onClick={onClearFilters}>
            Clear Filters
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search Input */}
        <div className="lg:col-span-2">
          <Input
            placeholder="Search by name, email, or role..."
            value={filters.searchTerm}
            onChange={(e) => onFiltersChange({ searchTerm: e.target.value })}
            className="w-full"
          />
        </div>

        {/* Department Filter */}
        <Select
          value={filters.department}
          onChange={(e) => onFiltersChange({ department: e.target.value })}
          options={departmentOptions}
        />

        {/* Experience Level Filter */}
        <Select
          value={filters.experienceLevel}
          onChange={(e) => onFiltersChange({ experienceLevel: e.target.value })}
          options={experienceLevelOptions}
        />

        {/* Status Filter */}
        <Select value={getStatusValue()} onChange={handleStatusChange} options={statusOptions} />
      </div>

      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-gray-500">Active filters:</span>

            {filters.searchTerm && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Search: "{filters.searchTerm}"
                <button
                  onClick={() => onFiltersChange({ searchTerm: '' })}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            )}

            {filters.department && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Department: {filters.department}
                <button
                  onClick={() => onFiltersChange({ department: '' })}
                  className="ml-1 text-green-600 hover:text-green-800"
                >
                  ×
                </button>
              </span>
            )}

            {filters.experienceLevel && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                Experience: {filters.experienceLevel}
                <button
                  onClick={() => onFiltersChange({ experienceLevel: '' })}
                  className="ml-1 text-purple-600 hover:text-purple-800"
                >
                  ×
                </button>
              </span>
            )}

            {filters.isActive !== null && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                Status: {filters.isActive ? 'Active' : 'Inactive'}
                <button
                  onClick={() => onFiltersChange({ isActive: null })}
                  className="ml-1 text-yellow-600 hover:text-yellow-800"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
