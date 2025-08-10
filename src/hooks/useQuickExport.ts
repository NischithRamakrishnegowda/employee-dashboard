// src/hooks/useQuickExport.ts
import { useState, useRef, useEffect } from 'react';
import { Employee } from '@models/employee';
import { exportService, ExportFormat } from '@services/exportService';

export const useQuickExport = (employees: Employee[]) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const defaultFields = [
    'fullName',
    'email',
    'roleTitle',
    'department',
    'experienceYears',
    'salary',
    'location',
    'startDate',
    'isActive',
  ];

  const handleQuickExport = async (format: ExportFormat) => {
    setIsExporting(true);
    setIsOpen(false);

    try {
      await exportService.exportData(employees, format, defaultFields);
    } catch (error) {
      console.error('Quick export error:', error);
      alert(`Export failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsExporting(false);
    }
  };

  return {
    isOpen,
    setIsOpen,
    isExporting,
    dropdownRef,
    handleQuickExport,
  };
};
