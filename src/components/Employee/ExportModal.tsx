// src/components/Employee/ExportModal.tsx
import React, { useState, useEffect } from 'react';
import { Employee } from '@models/employee';
import { exportService, EXPORT_FIELDS, ExportFormat } from '@services/exportService';
import { Modal } from '@components/ui/Modal';
import { Button } from '@components/ui/Button';
import { Spinner } from '@components/ui/Spinner';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  employees: Employee[];
  totalCount: number;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  employees,
  totalCount,
}) => {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('csv');
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [isExporting, setIsExporting] = useState(false);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  // Default selected fields
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

  useEffect(() => {
    if (isOpen && selectedFields.length === 0) {
      setSelectedFields(defaultFields);
    }
  }, [isOpen]);

  useEffect(() => {
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

  const formatOptions = [
    { value: 'csv' as ExportFormat, label: 'CSV', description: 'Comma-separated values' },
    { value: 'excel' as ExportFormat, label: 'Excel', description: 'Microsoft Excel format' },
    { value: 'json' as ExportFormat, label: 'JSON', description: 'JavaScript Object Notation' },
  ];

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
    setSelectedFields(defaultFields);
  };

  const handleExport = async () => {
    if (selectedFields.length === 0) {
      alert('Please select at least one field to export');
      return;
    }

    setIsExporting(true);
    try {
      await exportService.exportData(employees, selectedFormat, selectedFields);
      onClose();
    } catch (error) {
      console.error('Export error:', error);
      alert(`Export failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsExporting(false);
    }
  };

  const fieldsByCategory = {
    basic: EXPORT_FIELDS.filter((field) =>
      ['firstName', 'lastName', 'fullName', 'email'].includes(field.key),
    ),
    role: EXPORT_FIELDS.filter((field) =>
      ['roleTitle', 'roleLevel', 'roleCategory', 'department'].includes(field.key),
    ),
    experience: EXPORT_FIELDS.filter((field) =>
      ['experienceYears', 'experienceLevel', 'performanceRating'].includes(field.key),
    ),
    employment: EXPORT_FIELDS.filter((field) =>
      ['salary', 'location', 'startDate', 'isActive'].includes(field.key),
    ),
    skills: EXPORT_FIELDS.filter((field) =>
      ['specialization', 'skills', 'skillCount'].includes(field.key),
    ),
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Export Employee Data" size="xl">
      <div className="space-y-6">
        {/* Export Summary */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <svg
              className="h-5 w-5 text-blue-600 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <div>
              <h4 className="text-sm font-medium text-blue-900">Export Summary</h4>
              <p className="text-sm text-blue-700">
                Exporting {employees.length} of {totalCount} employees
                {employees.length !== totalCount && ' (filtered results)'}
              </p>
            </div>
          </div>
        </div>

        {/* Format Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Export Format</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {formatOptions.map((format) => (
              <label
                key={format.value}
                className={`relative flex cursor-pointer rounded-lg border p-4 focus:outline-none ${
                  selectedFormat === format.value
                    ? 'border-blue-500 ring-2 ring-blue-500 bg-blue-50'
                    : 'border-gray-300 bg-white hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name="format"
                  value={format.value}
                  checked={selectedFormat === format.value}
                  onChange={(e) => setSelectedFormat(e.target.value as ExportFormat)}
                  className="sr-only"
                />
                <div className="flex-1">
                  <div className="flex items-center">
                    <div className="text-sm font-medium text-gray-900">{format.label}</div>
                  </div>
                  <div className="text-sm text-gray-500">{format.description}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Field Selection */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-gray-700">
              Select Fields to Export ({selectedFields.length} selected)
            </label>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={handleSelectDefault}>
                Default
              </Button>
              <Button variant="outline" size="sm" onClick={handleSelectAll}>
                All
              </Button>
              <Button variant="outline" size="sm" onClick={handleSelectNone}>
                None
              </Button>
            </div>
          </div>

          <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg p-4">
            {Object.entries(fieldsByCategory).map(([category, fields]) => (
              <div key={category} className="mb-4 last:mb-0">
                <h4 className="text-sm font-medium text-gray-900 mb-2 capitalize">
                  {category} Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {fields.map((field) => (
                    <label key={field.key} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedFields.includes(field.key)}
                        onChange={() => handleFieldToggle(field.key)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{field.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Preview */}
        {selectedFields.length > 0 && previewData.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">Data Preview</label>
              <Button variant="outline" size="sm" onClick={() => setShowPreview(!showPreview)}>
                {showPreview ? 'Hide' : 'Show'} Preview
              </Button>
            </div>

            {showPreview && (
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="overflow-x-auto max-h-48">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        {Object.keys(previewData[0] || {}).map((header) => (
                          <th
                            key={header}
                            className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {previewData.map((row, index) => (
                        <tr key={index}>
                          {Object.values(row).map((value, cellIndex) => (
                            <td
                              key={cellIndex}
                              className="px-3 py-2 whitespace-nowrap text-sm text-gray-900"
                            >
                              {String(value)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {employees.length > 3 && (
                  <div className="bg-gray-50 px-3 py-2 text-sm text-gray-600 text-center">
                    ... and {employees.length - 3} more records
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
          <Button variant="outline" onClick={onClose} disabled={isExporting}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleExport}
            disabled={isExporting || selectedFields.length === 0}
            isLoading={isExporting}
          >
            {isExporting ? 'Exporting...' : `Export ${selectedFormat.toUpperCase()}`}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
