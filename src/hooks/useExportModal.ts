// src/hooks/useExportModal.ts
import { useState, useEffect, useCallback } from 'react';
import { Employee } from '@models/employee';
import { exportService, EXPORT_FIELDS, ExportFormat } from '@services/exportService';

const DEFAULT_FIELDS = [
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

export const useExportModal = (employees: Employee[], isOpen: boolean) => {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('csv');
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [isExporting, setIsExporting] = useState(false);
  const [previewData, setPreviewData] = useState<Record<string, string | number | boolean>[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  const updatePreview = useCallback(() => {
    if (selectedFields.length > 0 && employees.length > 0) {
      try {
        const preview = exportService.getExportPreview(employees, selectedFields, 3);
        setPreviewData(preview);
      } catch (error) {
        console.error('Error generating preview:', error);
        setPreviewData([]);
      }
    }
  }, [selectedFields, employees]);

  useEffect(() => {
    if (isOpen && selectedFields.length === 0) {
      setSelectedFields(DEFAULT_FIELDS);
    }
  }, [isOpen, selectedFields.length]);

  useEffect(() => {
    updatePreview();
  }, [updatePreview]);

  const handleFieldToggle = (fieldKey: string) => {
    setSelectedFields((prev) =>
      prev.includes(fieldKey) ? prev.filter((key) => key !== fieldKey) : [...prev, fieldKey],
    );
  };

  const handleSelectAll = () => {
    setSelectedFields(EXPORT_FIELDS.map((field) => field.key));
  };

  const handleSelectNone = () => {
    setSelectedFields([]);
  };

  const handleSelectDefault = () => {
    setSelectedFields(DEFAULT_FIELDS);
  };

  const handleExport = async () => {
    if (selectedFields.length === 0) {
      alert('Please select at least one field to export');
      return;
    }

    setIsExporting(true);
    try {
      await exportService.exportData(employees, selectedFormat, selectedFields);
      return true;
    } catch (error) {
      console.error('Export error:', error);
      alert(`Export failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return false;
    } finally {
      setIsExporting(false);
    }
  };

  return {
    selectedFormat,
    setSelectedFormat,
    selectedFields,
    isExporting,
    previewData,
    showPreview,
    setShowPreview,
    handleFieldToggle,
    handleSelectAll,
    handleSelectNone,
    handleSelectDefault,
    handleExport,
  };
};
