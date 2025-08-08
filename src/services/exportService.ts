// src/services/exportService.ts
import { Employee } from '@models/employee';

export interface ExportField {
  key: string;
  label: string;
  getValue: (employee: Employee) => string | number | boolean;
}

export type ExportFormat = 'csv' | 'excel' | 'json' | 'xlsx';

export const EXPORT_FIELDS: ExportField[] = [
  {
    key: 'firstName',
    label: 'First Name',
    getValue: (emp) => emp.firstName,
  },
  {
    key: 'lastName',
    label: 'Last Name',
    getValue: (emp) => emp.lastName,
  },
  {
    key: 'fullName',
    label: 'Full Name',
    getValue: (emp) => `${emp.firstName} ${emp.lastName}`,
  },
  {
    key: 'email',
    label: 'Email',
    getValue: (emp) => emp.email,
  },
  {
    key: 'roleTitle',
    label: 'Role Title',
    getValue: (emp) => emp.role.title,
  },
  {
    key: 'roleLevel',
    label: 'Role Level',
    getValue: (emp) => emp.role.level,
  },
  {
    key: 'roleCategory',
    label: 'Role Category',
    getValue: (emp) => emp.role.category,
  },
  {
    key: 'department',
    label: 'Department',
    getValue: (emp) => emp.department.name,
  },
  {
    key: 'experienceYears',
    label: 'Experience (Years)',
    getValue: (emp) => emp.experienceYears,
  },
  {
    key: 'experienceLevel',
    label: 'Experience Level',
    getValue: (emp) => {
      if (emp.experienceYears <= 2) return 'Junior';
      if (emp.experienceYears <= 5) return 'Mid';
      if (emp.experienceYears <= 8) return 'Senior';
      return 'Expert';
    },
  },
  {
    key: 'salary',
    label: 'Salary',
    getValue: (emp) => emp.salary,
  },
  {
    key: 'location',
    label: 'Location',
    getValue: (emp) => emp.location,
  },
  {
    key: 'startDate',
    label: 'Start Date',
    getValue: (emp) => emp.startDate.toISOString().split('T')[0],
  },
  {
    key: 'performanceRating',
    label: 'Performance Rating',
    getValue: (emp) => emp.performanceRating,
  },
  {
    key: 'isActive',
    label: 'Status',
    getValue: (emp) => (emp.isActive ? 'Active' : 'Inactive'),
  },
  {
    key: 'specialization',
    label: 'Specializations',
    getValue: (emp) => emp.specialization.join('; '),
  },
  {
    key: 'skills',
    label: 'Skills',
    getValue: (emp) => emp.skills.map((skill) => skill.name).join('; '),
  },
  {
    key: 'skillCount',
    label: 'Skill Count',
    getValue: (emp) => emp.skills.length,
  },
];

class ExportService {
  private downloadFile(content: string | ArrayBuffer, filename: string, mimeType: string) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  private generateFileName(format: ExportFormat, prefix: string = 'employees'): string {
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-');
    return `${prefix}_${timestamp}.${format}`;
  }

  exportToCSV(employees: Employee[], selectedFields: string[]): void {
    const fields = EXPORT_FIELDS.filter((field) => selectedFields.includes(field.key));

    // Create CSV header
    const headers = fields.map((field) => `"${field.label}"`).join(',');

    // Create CSV rows
    const rows = employees.map((employee) => {
      return fields
        .map((field) => {
          const value = field.getValue(employee);
          // Escape quotes and wrap in quotes if necessary
          const stringValue = String(value).replace(/"/g, '""');
          return `"${stringValue}"`;
        })
        .join(',');
    });

    const csvContent = [headers, ...rows].join('\n');
    const filename = this.generateFileName('csv');

    this.downloadFile(csvContent, filename, 'text/csv;charset=utf-8;');
  }

  async exportToExcel(employees: Employee[], selectedFields: string[]): Promise<void> {
    // Using SheetJS for Excel export
    const XLSX = await import('xlsx');
    const fields = EXPORT_FIELDS.filter((field) => selectedFields.includes(field.key));

    // Prepare data for Excel
    const data = employees.map((employee) => {
      const row: { [key: string]: any } = {};
      fields.forEach((field) => {
        row[field.label] = field.getValue(employee);
      });
      return row;
    });

    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);

    // Auto-size columns
    const columnWidths = fields.map((field) => ({
      wch: Math.max(field.label.length, 15),
    }));
    worksheet['!cols'] = columnWidths;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Employees');

    // Generate Excel file
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const filename = this.generateFileName('xlsx');

    this.downloadFile(
      excelBuffer,
      filename,
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
  }

  exportToJSON(employees: Employee[], selectedFields: string[]): void {
    const fields = EXPORT_FIELDS.filter((field) => selectedFields.includes(field.key));

    const data = employees.map((employee) => {
      const obj: { [key: string]: any } = {};
      fields.forEach((field) => {
        obj[field.key] = field.getValue(employee);
      });
      return obj;
    });

    const jsonContent = JSON.stringify(
      {
        exportDate: new Date().toISOString(),
        totalRecords: employees.length,
        fields: fields.map((f) => ({ key: f.key, label: f.label })),
        data,
      },
      null,
      2,
    );

    const filename = this.generateFileName('json');
    this.downloadFile(jsonContent, filename, 'application/json;charset=utf-8;');
  }

  exportData(employees: Employee[], format: ExportFormat, selectedFields: string[]): void {
    if (employees.length === 0) {
      throw new Error('No data to export');
    }

    if (selectedFields.length === 0) {
      throw new Error('No fields selected for export');
    }

    switch (format) {
      case 'csv':
        this.exportToCSV(employees, selectedFields);
        break;
      case 'excel':
        this.exportToExcel(employees, selectedFields);
        break;
      case 'json':
        this.exportToJSON(employees, selectedFields);
        break;
      default:
        throw new Error(`Unsupported export format: ${format}`);
    }
  }

  getExportPreview(employees: Employee[], selectedFields: string[], maxRows: number = 5): any[] {
    const fields = EXPORT_FIELDS.filter((field) => selectedFields.includes(field.key));

    return employees.slice(0, maxRows).map((employee) => {
      const obj: { [key: string]: any } = {};
      fields.forEach((field) => {
        obj[field.label] = field.getValue(employee);
      });
      return obj;
    });
  }
}

export const exportService = new ExportService();
