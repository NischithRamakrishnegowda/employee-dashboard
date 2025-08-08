// src/context/EmployeeContext.tsx
import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { Employee } from '@models/employee';
import { FilterState, SortState } from '@models/form';

interface EmployeeState {
  employees: Employee[];
  filteredEmployees: Employee[];
  loading: boolean;
  error: string | null;
  filters: FilterState;
  sort: SortState;
}

type EmployeeAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_EMPLOYEES'; payload: Employee[] }
  | { type: 'ADD_EMPLOYEE'; payload: Employee }
  | { type: 'UPDATE_EMPLOYEE'; payload: Employee }
  | { type: 'DELETE_EMPLOYEE'; payload: string }
  | { type: 'SET_FILTERS'; payload: Partial<FilterState> }
  | { type: 'SET_SORT'; payload: SortState }
  | { type: 'APPLY_FILTERS_AND_SORT' };

const initialState: EmployeeState = {
  employees: [],
  filteredEmployees: [],
  loading: false,
  error: null,
  filters: {
    department: '',
    experienceLevel: '',
    searchTerm: '',
    isActive: null,
  },
  sort: {
    field: null,
    direction: 'asc',
  },
};

const getExperienceLevel = (years: number): string => {
  if (years <= 2) return 'Junior';
  if (years <= 5) return 'Mid';
  if (years <= 8) return 'Senior';
  return 'Expert';
};

const applyFiltersAndSort = (
  employees: Employee[],
  filters: FilterState,
  sort: SortState,
): Employee[] => {
  let filtered = [...employees];

  // Apply filters
  if (filters.department) {
    filtered = filtered.filter((emp) => emp.department.name === filters.department);
  }

  if (filters.experienceLevel) {
    filtered = filtered.filter(
      (emp) => getExperienceLevel(emp.experienceYears) === filters.experienceLevel,
    );
  }

  if (filters.searchTerm) {
    const term = filters.searchTerm.toLowerCase();
    filtered = filtered.filter(
      (emp) =>
        emp.firstName.toLowerCase().includes(term) ||
        emp.lastName.toLowerCase().includes(term) ||
        emp.email.toLowerCase().includes(term) ||
        emp.role.title.toLowerCase().includes(term),
    );
  }

  if (filters.isActive !== null) {
    filtered = filtered.filter((emp) => emp.isActive === filters.isActive);
  }

  // Apply sorting
  if (sort.field) {
    filtered.sort((a, b) => {
      let aValue: any = a[sort.field!];
      let bValue: any = b[sort.field!];

      // Handle nested properties
      if (sort.field === 'department') {
        aValue = a.department.name;
        bValue = b.department.name;
      } else if (sort.field === 'role') {
        aValue = a.role.title;
        bValue = b.role.title;
      }

      // Handle different data types
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return sort.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sort.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }

  return filtered;
};

function employeeReducer(state: EmployeeState, action: EmployeeAction): EmployeeState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };

    case 'SET_EMPLOYEES':
      return {
        ...state,
        employees: action.payload,
        filteredEmployees: applyFiltersAndSort(action.payload, state.filters, state.sort),
        loading: false,
        error: null,
      };

    case 'ADD_EMPLOYEE':
      const newEmployees = [...state.employees, action.payload];
      return {
        ...state,
        employees: newEmployees,
        filteredEmployees: applyFiltersAndSort(newEmployees, state.filters, state.sort),
      };

    case 'UPDATE_EMPLOYEE':
      const updatedEmployees = state.employees.map((emp) =>
        emp.id === action.payload.id ? action.payload : emp,
      );
      return {
        ...state,
        employees: updatedEmployees,
        filteredEmployees: applyFiltersAndSort(updatedEmployees, state.filters, state.sort),
      };

    case 'DELETE_EMPLOYEE':
      const remainingEmployees = state.employees.filter((emp) => emp.id !== action.payload);
      return {
        ...state,
        employees: remainingEmployees,
        filteredEmployees: applyFiltersAndSort(remainingEmployees, state.filters, state.sort),
      };

    case 'SET_FILTERS':
      const newFilters = { ...state.filters, ...action.payload };
      return {
        ...state,
        filters: newFilters,
        filteredEmployees: applyFiltersAndSort(state.employees, newFilters, state.sort),
      };

    case 'SET_SORT':
      return {
        ...state,
        sort: action.payload,
        filteredEmployees: applyFiltersAndSort(state.employees, state.filters, action.payload),
      };

    case 'APPLY_FILTERS_AND_SORT':
      return {
        ...state,
        filteredEmployees: applyFiltersAndSort(state.employees, state.filters, state.sort),
      };

    default:
      return state;
  }
}

interface EmployeeContextType {
  state: EmployeeState;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setEmployees: (employees: Employee[]) => void;
  addEmployee: (employee: Employee) => void;
  updateEmployee: (employee: Employee) => void;
  deleteEmployee: (id: string) => void;
  setFilters: (filters: Partial<FilterState>) => void;
  setSort: (sort: SortState) => void;
}

const EmployeeContext = createContext<EmployeeContextType | undefined>(undefined);

export const useEmployeeContext = () => {
  const context = useContext(EmployeeContext);
  if (!context) {
    throw new Error('useEmployeeContext must be used within EmployeeProvider');
  }
  return context;
};

interface EmployeeProviderProps {
  children: React.ReactNode;
}

export const EmployeeProvider: React.FC<EmployeeProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(employeeReducer, initialState);

  const setLoading = useCallback((loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  }, []);

  const setError = useCallback((error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  }, []);

  const setEmployees = useCallback((employees: Employee[]) => {
    dispatch({ type: 'SET_EMPLOYEES', payload: employees });
  }, []);

  const addEmployee = useCallback((employee: Employee) => {
    dispatch({ type: 'ADD_EMPLOYEE', payload: employee });
  }, []);

  const updateEmployee = useCallback((employee: Employee) => {
    dispatch({ type: 'UPDATE_EMPLOYEE', payload: employee });
  }, []);

  const deleteEmployee = useCallback((id: string) => {
    dispatch({ type: 'DELETE_EMPLOYEE', payload: id });
  }, []);

  const setFilters = useCallback((filters: Partial<FilterState>) => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
  }, []);

  const setSort = useCallback((sort: SortState) => {
    dispatch({ type: 'SET_SORT', payload: sort });
  }, []);

  const value: EmployeeContextType = {
    state,
    setLoading,
    setError,
    setEmployees,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    setFilters,
    setSort,
  };

  return <EmployeeContext.Provider value={value}>{children}</EmployeeContext.Provider>;
};
