// src/hooks/useEmployeeForm.ts
import { useState, useEffect } from 'react';
import { Employee } from '@models/employee';
import { EmployeeFormData } from '@models/form';

export const useEmployeeForm = (employee?: Employee) => {
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [specializationInput, setSpecializationInput] = useState('');
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

  return {
    formData,
    setFormData,
    selectedSkills,
    specializationInput,
    setSpecializationInput,
    handleInputChange,
    handleSkillToggle,
    handleAddSpecialization,
    handleRemoveSpecialization,
  };
};
