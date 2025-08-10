// src/components/employee/ExportModal.tsx
import React from 'react';
import { Employee } from '@models/employee';
import { Modal } from '@components/ui/Modal';
import { Button } from '@components/ui/Button';
import { useExportModal } from '@hooks/useExportModal';
import { formatOptions, getFieldsByCategory } from '@utils/constants';
import { ExportFormat } from '@services/exportService';

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
  const {
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
  } = useExportModal(employees, isOpen);

  const fieldsByCategory = getFieldsByCategory();

  const handleExportClick = async () => {
    const success = await handleExport();
    if (success) {
      onClose();
    }
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
        <fieldset>
          <legend className="block text-sm font-medium text-gray-700 mb-3">Export Format</legend>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {formatOptions.map((format) => (
              <label
                key={format.value}
                htmlFor={`format-${format.value}`}
                aria-label={`Select ${format.label} format - ${format.description}`}
                className={`relative flex cursor-pointer rounded-lg border p-4 focus:outline-none ${
                  selectedFormat === format.value
                    ? 'border-blue-500 ring-2 ring-blue-500 bg-blue-50'
                    : 'border-gray-300 bg-white hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  id={`format-${format.value}`}
                  name="format"
                  value={format.value}
                  checked={selectedFormat === format.value}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Runtime check to ensure the value is valid
                    if (formatOptions.some((option) => option.value === value)) {
                      setSelectedFormat(value as ExportFormat);
                    }
                  }}
                  className="sr-only"
                  aria-describedby={`format-${format.value}-desc`}
                />
                <div className="flex-1">
                  <div className="flex items-center">
                    <div className="text-sm font-medium text-gray-900">{format.label}</div>
                  </div>
                  <div id={`format-${format.value}-desc`} className="text-sm text-gray-500">
                    {format.description}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </fieldset>

        {/* Field Selection */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="block text-sm font-medium text-gray-700">
              Select Fields to Export ({selectedFields.length} selected)
            </span>
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
              <fieldset key={category} className="mb-4 last:mb-0">
                <legend className="text-sm font-medium text-gray-900 mb-2 capitalize">
                  {category} Information
                </legend>
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
              </fieldset>
            ))}
          </div>
        </div>

        {/* Preview */}
        {selectedFields.length > 0 && previewData.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="block text-sm font-medium text-gray-700">Data Preview</span>
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
            onClick={handleExportClick}
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
