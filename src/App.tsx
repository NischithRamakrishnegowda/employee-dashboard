// src/App.tsx
import React, { useState, useEffect } from 'react';
import { ErrorBoundary } from '@components/ErrorBoundary';
import { EmployeeProvider, useEmployeeContext } from '@context/EmployeeContext';
import { EmployeeTable } from '@components/Employee/EmployeeTable';
import { EmployeeForm } from '@components/Employee/EmployeeForm';
import { EmployeeFilters } from '@components/Employee/EmployeeFilters';
import { DashboardSummary } from '@components/Dashboard/DashboardSummary';
import { DashboardCharts } from '@components/Dashboard/DashboardCharts';
import { Modal } from '@components/ui/Modal';
import { Button } from '@components/ui/Button';
import { Spinner } from '@components/ui/Spinner';
import { employeeService } from '@services/employeeService';
import { Employee, Department } from '@models/employee';
import { EmployeeFormData } from '@models/form';

type ViewMode = 'dashboard' | 'employees';

const AppContent: React.FC = () => {
  const {
    state,
    setLoading,
    setError,
    setEmployees,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    setFilters,
    setSort,
  } = useEmployeeContext();

  const [departments, setDepartments] = useState<Department[]>([]);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [deletingEmployee, setDeletingEmployee] = useState<Employee | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard');

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [employeesData, departmentsData] = await Promise.all([
          employeeService.getAllEmployees(),
          employeeService.getDepartments(),
        ]);
        setEmployees(employeesData);
        setDepartments(departmentsData);
      } catch (error) {
        console.error('Error loading data:', error);
        setError('Failed to load employee data. Please try again.');
      }
    };

    loadData();
  }, [setLoading, setError, setEmployees]);

  // Handle sorting
  const handleSort = (field: keyof Employee) => {
    const newDirection =
      state.sort.field === field && state.sort.direction === 'asc' ? 'desc' : 'asc';

    setSort({ field, direction: newDirection });
  };

  // Handle filter clear
  const handleClearFilters = () => {
    setFilters({
      department: '',
      experienceLevel: '',
      searchTerm: '',
      isActive: null,
    });
  };

  // Handle create employee
  const handleCreateEmployee = async (formData: EmployeeFormData) => {
    setFormLoading(true);
    try {
      const newEmployee = await employeeService.createEmployee(formData);
      addEmployee(newEmployee);
      setIsFormModalOpen(false);
      setEditingEmployee(null);
    } catch (error) {
      console.error('Error creating employee:', error);
      setError('Failed to create employee. Please try again.');
    } finally {
      setFormLoading(false);
    }
  };

  // Handle update employee
  const handleUpdateEmployee = async (formData: EmployeeFormData) => {
    if (!editingEmployee) return;

    setFormLoading(true);
    try {
      const updatedEmployee = await employeeService.updateEmployee(editingEmployee.id, formData);
      updateEmployee(updatedEmployee);
      setIsFormModalOpen(false);
      setEditingEmployee(null);
    } catch (error) {
      console.error('Error updating employee:', error);
      setError('Failed to update employee. Please try again.');
    } finally {
      setFormLoading(false);
    }
  };

  // Handle delete employee
  const handleDeleteEmployee = async () => {
    if (!deletingEmployee) return;

    setFormLoading(true);
    try {
      await employeeService.deleteEmployee(deletingEmployee.id);
      deleteEmployee(deletingEmployee.id);
      setIsDeleteModalOpen(false);
      setDeletingEmployee(null);
    } catch (error) {
      console.error('Error deleting employee:', error);
      setError('Failed to delete employee. Please try again.');
    } finally {
      setFormLoading(false);
    }
  };

  // Handle edit click
  const handleEditClick = (employee: Employee) => {
    setEditingEmployee(employee);
    setIsFormModalOpen(true);
  };

  // Handle delete click
  const handleDeleteClick = (employee: Employee) => {
    setDeletingEmployee(employee);
    setIsDeleteModalOpen(true);
  };

  // Handle form modal close
  const handleFormModalClose = () => {
    setIsFormModalOpen(false);
    setEditingEmployee(null);
  };

  // Handle form submit
  const handleFormSubmit = async (formData: EmployeeFormData) => {
    if (editingEmployee) {
      await handleUpdateEmployee(formData);
    } else {
      await handleCreateEmployee(formData);
    }
  };

  if (state.error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
          <div className="flex items-center mb-4">
            <div className="flex-shrink-0">
              <svg
                className="h-6 w-6 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h3 className="ml-3 text-lg font-medium text-gray-900">Error</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">{state.error}</p>
          <Button onClick={() => window.location.reload()}>Reload Page</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Employee Dashboard</h1>
              <p className="mt-1 text-sm text-gray-500">
                Comprehensive pharmaceutical employee management system
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <nav className="flex space-x-4">
                <button
                  onClick={() => setViewMode('dashboard')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    viewMode === 'dashboard'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => setViewMode('employees')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    viewMode === 'employees'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Employees
                </button>
              </nav>
              {viewMode === 'employees' && (
                <Button onClick={() => setIsFormModalOpen(true)} variant="primary">
                  Add Employee
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {viewMode === 'dashboard' ? (
          <div className="space-y-8">
            {/* Summary Cards */}
            <DashboardSummary employees={state.employees} />

            {/* Charts */}
            {state.employees.length > 0 ? (
              <DashboardCharts employees={state.employees} />
            ) : state.loading ? (
              <div className="flex justify-center py-12">
                <Spinner size="lg" />
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">No data available for charts</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Filters */}
            <EmployeeFilters
              filters={state.filters}
              onFiltersChange={setFilters}
              departments={departments}
              onClearFilters={handleClearFilters}
            />

            {/* Results Summary */}
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{state.filteredEmployees.length}</span> of{' '}
                <span className="font-medium">{state.employees.length}</span> employees
              </p>
            </div>

            {/* Employee Table */}
            <EmployeeTable
              employees={state.filteredEmployees}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
              onSort={handleSort}
              sortState={state.sort}
              isLoading={state.loading}
            />
          </div>
        )}
      </main>

      {/* Employee Form Modal */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={handleFormModalClose}
        title={editingEmployee ? 'Edit Employee' : 'Add New Employee'}
        size="xl"
      >
        <EmployeeForm
          employee={editingEmployee || undefined}
          onSubmit={handleFormSubmit}
          onCancel={handleFormModalClose}
          isLoading={formLoading}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Employee"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Are you sure you want to delete{' '}
            <span className="font-medium">
              {deletingEmployee?.firstName} {deletingEmployee?.lastName}
            </span>
            ? This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={formLoading}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteEmployee}
              isLoading={formLoading}
              disabled={formLoading}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <EmployeeProvider>
        <AppContent />
      </EmployeeProvider>
    </ErrorBoundary>
  );
};

export default App;
