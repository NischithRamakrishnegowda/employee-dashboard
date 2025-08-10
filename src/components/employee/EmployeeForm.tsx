// src/components/employee/EmployeeForm.tsx
import React from 'react';
import { Employee } from '@models/employee';
import { EmployeeFormData } from '@models/form';
import { useEmployeeData } from '@hooks/useEmployeeData';
import { useFormValidation } from '@hooks/useFormValidation';
import { useEmployeeForm } from '@hooks/useEmployeeForm';
import { Input } from '@components/ui/Input';
import { Select } from '@components/ui/Select';
import { Button } from '@components/ui/Button';
import { Badge } from '@components/ui/Badge';

interface EmployeeFormProps {
  employee?: Employee;
  onSubmit: (data: EmployeeFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export const EmployeeForm: React.FC<EmployeeFormProps> = ({
  employee,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const { departments, roles, skills } = useEmployeeData();
  const { errors, validateForm, clearError } = useFormValidation();
  const {
    formData,
    selectedSkills,
    specializationInput,
    setSpecializationInput,
    handleInputChange,
    handleSkillToggle,
    handleAddSpecialization,
    handleRemoveSpecialization,
  } = useEmployeeForm(employee);

  const handleInputChangeWithValidation = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    handleInputChange(e);
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      clearError(e.target.name);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm(formData)) {
      try {
        await onSubmit(formData);
      } catch (error) {
        console.error('Error submitting form:', error);
      }
    }
  };

  const departmentOptions = [
    { value: '', label: 'Select Department' },
    ...departments.map((dept) => ({ value: dept.id, label: dept.name })),
  ];

  const roleOptions = [
    { value: '', label: 'Select Role' },
    ...roles.map((role) => ({ value: role.id, label: `${role.title} (${role.level})` })),
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="First Name"
          name="firstName"
          value={formData.firstName}
          onChange={handleInputChangeWithValidation}
          error={errors.firstName}
          required
        />

        <Input
          label="Last Name"
          name="lastName"
          value={formData.lastName}
          onChange={handleInputChangeWithValidation}
          error={errors.lastName}
          required
        />
      </div>

      <Input
        label="Email"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleInputChangeWithValidation}
        error={errors.email}
        required
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Select
          label="Department"
          name="departmentId"
          value={formData.departmentId}
          onChange={handleInputChangeWithValidation}
          options={departmentOptions}
          error={errors.departmentId}
          required
        />

        <Select
          label="Role"
          name="roleId"
          value={formData.roleId}
          onChange={handleInputChangeWithValidation}
          options={roleOptions}
          error={errors.roleId}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Input
          label="Experience Years"
          name="experienceYears"
          type="number"
          min="0"
          max="50"
          value={formData.experienceYears}
          onChange={handleInputChangeWithValidation}
          error={errors.experienceYears}
          required
        />

        <Input
          label="Salary"
          name="salary"
          type="number"
          min="0"
          step="1000"
          value={formData.salary}
          onChange={handleInputChangeWithValidation}
          error={errors.salary}
          required
        />

        <Input
          label="Performance Rating"
          name="performanceRating"
          type="number"
          min="1"
          max="5"
          step="0.1"
          value={formData.performanceRating}
          onChange={handleInputChangeWithValidation}
          error={errors.performanceRating}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Location"
          name="location"
          value={formData.location}
          onChange={handleInputChangeWithValidation}
          error={errors.location}
          required
        />

        <Input
          label="Start Date"
          name="startDate"
          type="date"
          value={formData.startDate}
          onChange={handleInputChangeWithValidation}
          error={errors.startDate}
          required
        />
      </div>

      {/* Specializations */}
      <div>
        <label
          htmlFor="specialization-input"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Specializations
        </label>
        <div className="flex gap-2 mb-2">
          <Input
            id="specialization-input"
            placeholder="Add specialization"
            value={specializationInput}
            onChange={(e) => setSpecializationInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSpecialization())}
          />
          <Button type="button" onClick={handleAddSpecialization} variant="outline" size="sm">
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.specialization.map((spec) => (
            <Badge key={spec} variant="info">
              {spec}
              <button
                type="button"
                onClick={() => handleRemoveSpecialization(spec)}
                className="ml-2 text-blue-600 hover:text-blue-800"
                aria-label={`Remove ${spec} specialization`}
              >
                ×
              </button>
            </Badge>
          ))}
        </div>
      </div>

      {/* Skills */}
      <fieldset>
        <legend className="block text-sm font-medium text-gray-700 mb-2">Skills</legend>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-40 overflow-y-auto border rounded-md p-3">
          {skills.map((skill) => (
            <label key={skill.id} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedSkills.includes(skill.id)}
                onChange={() => handleSkillToggle(skill.id)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{skill.name}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {/* Active Status */}
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          name="isActive"
          id="isActive"
          checked={formData.isActive}
          onChange={handleInputChangeWithValidation}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
          Active Employee
        </label>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" isLoading={isLoading} disabled={isLoading}>
          {employee ? 'Update' : 'Create'} Employee
        </Button>
      </div>
    </form>
  );
};
