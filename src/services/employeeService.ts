// src/services/employeeService.ts
import { Employee, Department, Role, Skill } from '@models/employee';
import { EmployeeFormData } from '@models/form';

// Mock departments
export const mockDepartments: Department[] = [
  {
    id: '1',
    name: 'Research & Development',
    description: 'Drug discovery and development',
    headCount: 45,
    budget: 5000000,
  },
  {
    id: '2',
    name: 'Clinical Research',
    description: 'Clinical trials and studies',
    headCount: 32,
    budget: 3500000,
  },
  {
    id: '3',
    name: 'Regulatory Affairs',
    description: 'Compliance and regulatory submissions',
    headCount: 18,
    budget: 2000000,
  },
  {
    id: '4',
    name: 'Manufacturing',
    description: 'Production and quality control',
    headCount: 28,
    budget: 4000000,
  },
  {
    id: '5',
    name: 'Sales & Marketing',
    description: 'Commercial operations',
    headCount: 25,
    budget: 2800000,
  },
  {
    id: '6',
    name: 'Quality Assurance',
    description: 'Quality systems and compliance',
    headCount: 22,
    budget: 1800000,
  },
];

// Mock roles
export const mockRoles: Role[] = [
  { id: '1', title: 'Research Scientist', level: 'Senior', category: 'Research' },
  { id: '2', title: 'Clinical Research Associate', level: 'Mid', category: 'Clinical' },
  { id: '3', title: 'Regulatory Affairs Specialist', level: 'Senior', category: 'Regulatory' },
  { id: '4', title: 'Manufacturing Engineer', level: 'Mid', category: 'Engineering' },
  { id: '5', title: 'Sales Representative', level: 'Junior', category: 'Sales' },
  { id: '6', title: 'QA Manager', level: 'Manager', category: 'Engineering' },
  { id: '7', title: 'Principal Scientist', level: 'Lead', category: 'Research' },
  { id: '8', title: 'Clinical Data Manager', level: 'Senior', category: 'Clinical' },
  { id: '9', title: 'Regulatory Manager', level: 'Manager', category: 'Regulatory' },
  { id: '10', title: 'Production Supervisor', level: 'Lead', category: 'Engineering' },
];

// Mock skills
export const mockSkills: Skill[] = [
  { id: '1', name: 'Drug Discovery', category: 'Domain', proficiency: 4 },
  { id: '2', name: 'Clinical Trial Design', category: 'Domain', proficiency: 5 },
  { id: '3', name: 'FDA Regulations', category: 'Domain', proficiency: 4 },
  { id: '4', name: 'Good Manufacturing Practice', category: 'Domain', proficiency: 3 },
  { id: '5', name: 'Pharmaceutical Sales', category: 'Domain', proficiency: 4 },
  { id: '6', name: 'Quality Systems', category: 'Domain', proficiency: 5 },
  { id: '7', name: 'Python', category: 'Technical', proficiency: 4 },
  { id: '8', name: 'Statistical Analysis', category: 'Technical', proficiency: 5 },
  { id: '9', name: 'Project Management', category: 'Soft', proficiency: 4 },
  { id: '10', name: 'Leadership', category: 'Soft', proficiency: 3 },
];

// Generate mock employees
const generateMockEmployees = (): Employee[] => {
  const firstNames = [
    'John',
    'Jane',
    'Michael',
    'Sarah',
    'David',
    'Emily',
    'Robert',
    'Jessica',
    'William',
    'Ashley',
    'James',
    'Amanda',
    'Christopher',
    'Jennifer',
    'Daniel',
    'Lisa',
    'Matthew',
    'Karen',
    'Anthony',
    'Nancy',
    'Mark',
    'Betty',
    'Donald',
    'Helen',
    'Steven',
    'Sandra',
    'Paul',
    'Donna',
    'Andrew',
    'Carol',
    'Joshua',
    'Ruth',
    'Kenneth',
    'Sharon',
  ];
  const lastNames = [
    'Smith',
    'Johnson',
    'Williams',
    'Brown',
    'Jones',
    'Garcia',
    'Miller',
    'Davis',
    'Rodriguez',
    'Martinez',
    'Hernandez',
    'Lopez',
    'Gonzalez',
    'Wilson',
    'Anderson',
    'Thomas',
    'Taylor',
    'Moore',
    'Jackson',
    'Martin',
    'Lee',
    'Perez',
    'Thompson',
    'White',
    'Harris',
    'Sanchez',
    'Clark',
    'Ramirez',
    'Lewis',
    'Robinson',
    'Walker',
    'Young',
    'Allen',
    'King',
  ];
  const locations = [
    'New York, NY',
    'San Francisco, CA',
    'Boston, MA',
    'Chicago, IL',
    'Los Angeles, CA',
    'Seattle, WA',
    'Philadelphia, PA',
    'San Diego, CA',
  ];
  const specializations = [
    ['Oncology', 'Immunotherapy'],
    ['Cardiology', 'Diabetes'],
    ['Neurology', 'Psychiatry'],
    ['Infectious Diseases', 'Vaccines'],
    ['Rare Diseases', 'Pediatrics'],
    ["Women's Health", 'Reproductive Medicine'],
    ['Respiratory', 'Allergy'],
    ['Dermatology', 'Rheumatology'],
  ];

  const employees: Employee[] = [];

  for (let i = 1; i <= 35; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const department = mockDepartments[Math.floor(Math.random() * mockDepartments.length)];
    const role = mockRoles[Math.floor(Math.random() * mockRoles.length)];
    const experienceYears = Math.floor(Math.random() * 20) + 1;
    const startDate = new Date();
    startDate.setFullYear(startDate.getFullYear() - Math.floor(Math.random() * 10));

    // Assign skills based on department and role
    const relevantSkills = mockSkills
      .filter((skill) => Math.random() > 0.5 || skill.category === 'Soft')
      .slice(0, 3 + Math.floor(Math.random() * 3));

    const salary = 50000 + experienceYears * 5000 + Math.floor(Math.random() * 30000);

    employees.push({
      id: i.toString(),
      firstName,
      lastName,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@pharma.com`,
      role,
      department,
      experienceYears,
      specialization: specializations[Math.floor(Math.random() * specializations.length)],
      salary,
      location: locations[Math.floor(Math.random() * locations.length)],
      startDate,
      skills: relevantSkills,
      performanceRating: 1 + Math.random() * 4, // 1-5 scale
      isActive: Math.random() > 0.1, // 90% active
    });
  }

  return employees;
};

let mockEmployees = generateMockEmployees();

// Simulate API delays
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const employeeService = {
  async getAllEmployees(): Promise<Employee[]> {
    await delay(800);
    return [...mockEmployees];
  },

  async getEmployeeById(id: string): Promise<Employee | null> {
    await delay(300);
    return mockEmployees.find((emp) => emp.id === id) || null;
  },

  async createEmployee(data: EmployeeFormData): Promise<Employee> {
    await delay(500);

    const department = mockDepartments.find((d) => d.id === data.departmentId);
    const role = mockRoles.find((r) => r.id === data.roleId);

    if (!department || !role) {
      throw new Error('Invalid department or role');
    }

    const newEmployee: Employee = {
      id: (mockEmployees.length + 1).toString(),
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      role,
      department,
      experienceYears: data.experienceYears,
      specialization: data.specialization,
      salary: data.salary,
      location: data.location,
      startDate: new Date(data.startDate),
      skills: data.skills
        .map((skillId) => mockSkills.find((s) => s.id === skillId)!)
        .filter(Boolean),
      performanceRating: data.performanceRating,
      isActive: data.isActive,
    };

    mockEmployees.push(newEmployee);
    return newEmployee;
  },

  async updateEmployee(id: string, data: Partial<EmployeeFormData>): Promise<Employee> {
    await delay(500);

    const employeeIndex = mockEmployees.findIndex((emp) => emp.id === id);
    if (employeeIndex === -1) {
      throw new Error('Employee not found');
    }

    const currentEmployee = mockEmployees[employeeIndex];
    const updates: Partial<Employee> = {};

    if (data.firstName) updates.firstName = data.firstName;
    if (data.lastName) updates.lastName = data.lastName;
    if (data.email) updates.email = data.email;
    if (data.departmentId) {
      updates.department = mockDepartments.find((d) => d.id === data.departmentId);
    }
    if (data.roleId) {
      updates.role = mockRoles.find((r) => r.id === data.roleId);
    }
    if (data.experienceYears !== undefined) updates.experienceYears = data.experienceYears;
    if (data.specialization) updates.specialization = data.specialization;
    if (data.salary !== undefined) updates.salary = data.salary;
    if (data.location) updates.location = data.location;
    if (data.startDate) updates.startDate = new Date(data.startDate);
    if (data.skills) {
      updates.skills = data.skills
        .map((skillId) => mockSkills.find((s) => s.id === skillId)!)
        .filter(Boolean);
    }
    if (data.performanceRating !== undefined) updates.performanceRating = data.performanceRating;
    if (data.isActive !== undefined) updates.isActive = data.isActive;

    const updatedEmployee = { ...currentEmployee, ...updates };
    mockEmployees[employeeIndex] = updatedEmployee;
    return updatedEmployee;
  },

  async deleteEmployee(id: string): Promise<void> {
    await delay(300);
    const index = mockEmployees.findIndex((emp) => emp.id === id);
    if (index === -1) {
      throw new Error('Employee not found');
    }
    mockEmployees.splice(index, 1);
  },

  async getDepartments(): Promise<Department[]> {
    await delay(200);
    return [...mockDepartments];
  },

  async getRoles(): Promise<Role[]> {
    await delay(200);
    return [...mockRoles];
  },

  async getSkills(): Promise<Skill[]> {
    await delay(200);
    return [...mockSkills];
  },
};
