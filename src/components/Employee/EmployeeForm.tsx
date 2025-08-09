// src/components/Employee/EmployeeForm.tsx
import React, { useState, useEffect } from 'react';
import { Employee, Department, Role, Skill } from '@models/employee';
import { EmployeeFormData } from '@models/form';
import { employeeService } from '@services/employeeService';
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

interface FormErrors {
  [key: string]: string;
}

export const EmployeeForm: React.FC<EmployeeFormProps> = ({
  employee,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [specializationInput, setSpecializationInput] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState<EmployeeFormData>({
    firstName: '',
    lastName: '',
    email: '',
    roleId: '',
    departmentId: '',
    experienceYears: 0,
    specialization: [],
    salary: 0,
    location: '',
    startDate: new Date().toISOString().split('T')[0],
    skills: [],
    performanceRating: 3,
    isActive: true,
  });

  useEffect(() => {
    const loadFormData = async () => {
      try {
        const [departmentsData, rolesData, skillsData] = await Promise.all([
          employeeService.getDepartments(),
          employeeService.getRoles(),
          employeeService.getSkills(),
        ]);

        setDepartments(departmentsData);
        setRoles(rolesData);
        setSkills(skillsData);
      } catch (error) {
        console.error('Error loading form data:', error);
      }
    };

    loadFormData();

    // Populate form if editing existing employee
    if (employee) {
      setFormData({
        firstName: employee.firstName,
        lastName: employee.lastName,
        email: employee.email,
        roleId: employee.role.id,
        departmentId: employee.department.id,
        experienceYears: employee.experienceYears,
        specialization: employee.specialization,
        salary: employee.salary,
        location: employee.location,
        startDate: employee.startDate.toISOString().split('T')[0],
        skills: employee.skills.map((skill) => skill.id),
        performanceRating: employee.performanceRating,
        isActive: employee.isActive,
      });
      setSelectedSkills(employee.skills.map((skill) => skill.id));
    }
  }, [employee]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.roleId) {
      newErrors.roleId = 'Role is required';
    }

    if (!formData.departmentId) {
      newErrors.departmentId = 'Department is required';
    }

    if (formData.experienceYears < 0 || formData.experienceYears > 50) {
      newErrors.experienceYears = 'Experience years must be between 0 and 50';
    }

    if (formData.salary <= 0) {
      newErrors.salary = 'Salary must be greater than 0';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (formData.performanceRating < 1 || formData.performanceRating > 5) {
      newErrors.performanceRating = 'Performance rating must be between 1 and 5';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === 'number'
          ? parseFloat(value) || 0
          : type === 'checkbox'
            ? (e.target as HTMLInputElement).checked
            : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSkillToggle = (skillId: string) => {
    setSelectedSkills((prev) => {
      const newSelection = prev.includes(skillId)
        ? prev.filter((id) => id !== skillId)
        : [...prev, skillId];

      setFormData((prevForm) => ({
        ...prevForm,
        skills: newSelection,
      }));

      return newSelection;
    });
  };

  const handleAddSpecialization = () => {
    if (
      specializationInput.trim() &&
      !formData.specialization.includes(specializationInput.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        specialization: [...prev.specialization, specializationInput.trim()],
      }));
      setSpecializationInput('');
    }
  };

  const handleRemoveSpecialization = (spec: string) => {
    setFormData((prev) => ({
      ...prev,
      specialization: prev.specialization.filter((s) => s !== spec),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
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
          onChange={handleInputChange}
          error={errors.firstName}
          required
        />

        <Input
          label="Last Name"
          name="lastName"
          value={formData.lastName}
          onChange={handleInputChange}
          error={errors.lastName}
          required
        />
      </div>

      <Input
        label="Email"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleInputChange}
        error={errors.email}
        required
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Select
          label="Department"
          name="departmentId"
          value={formData.departmentId}
          onChange={handleInputChange}
          options={departmentOptions}
          error={errors.departmentId}
          required
        />

        <Select
          label="Role"
          name="roleId"
          value={formData.roleId}
          onChange={handleInputChange}
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
          onChange={handleInputChange}
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
          onChange={handleInputChange}
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
          onChange={handleInputChange}
          error={errors.performanceRating}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Location"
          name="location"
          value={formData.location}
          onChange={handleInputChange}
          error={errors.location}
          required
        />

        <Input
          label="Start Date"
          name="startDate"
          type="date"
          value={formData.startDate}
          onChange={handleInputChange}
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
          onChange={handleInputChange}
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
