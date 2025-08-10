// src/hooks/useEmployeeData.ts
import { useState, useEffect } from 'react';
import { Department, Role, Skill } from '@models/employee';
import { employeeService } from '@services/employeeService';

export const useEmployeeData = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [departmentsData, rolesData, skillsData] = await Promise.all([
          employeeService.getDepartments(),
          employeeService.getRoles(),
          employeeService.getSkills(),
        ]);

        setDepartments(departmentsData);
        setRoles(rolesData);
        setSkills(skillsData);
      } catch (err) {
        console.error('Error loading form data:', err);
        setError('Failed to load form data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return { departments, roles, skills, loading, error };
};
