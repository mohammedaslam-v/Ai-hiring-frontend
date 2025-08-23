// Mock export service (no Supabase)
import { ServiceResponse } from '@/types/interface';

// Define filter types
interface ExportFilters {
  status?: string;
  position?: string;
  dateRange?: {
    from: string;
    to: string;
  };
}

// Mock data for export
const mockExportData = Array.from({ length: 25 }, (_, i) => ({
  id: `export-${i + 1}`,
  firstName: `Candidate ${i + 1}`,
  lastName: `Last ${i + 1}`,
  email: `candidate${i + 1}@example.com`,
  phone: `+91${Math.floor(Math.random() * 9000000000) + 1000000000}`,
  position: ['English Teacher', 'Math Teacher', 'Science Teacher'][Math.floor(Math.random() * 3)],
  status: ['pending', 'approved', 'rejected'][Math.floor(Math.random() * 3)],
  createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
  applicationId: `APP-${String(i + 1).padStart(4, '0')}`
}));

export const exportApplicationsToCSV = async (filters?: ExportFilters): Promise<ServiceResponse<{ csvData: string; filename: string }>> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Generate CSV data
  const headers = ['ID', 'First Name', 'Last Name', 'Email', 'Phone', 'Position', 'Status', 'Created At', 'Application ID'];
  const csvRows = [headers.join(',')];
  
  mockExportData.forEach(row => {
    const csvRow = [
      row.id,
      `"${row.firstName}"`,
      `"${row.lastName}"`,
      `"${row.email}"`,
      `"${row.phone}"`,
      `"${row.position}"`,
      `"${row.status}"`,
      `"${row.createdAt}"`,
      `"${row.applicationId}"`
    ].join(',');
    csvRows.push(csvRow);
  });
  
  const csvData = csvRows.join('\n');
  const filename = `applications-export-${new Date().toISOString().split('T')[0]}.csv`;
  
  return {
    status: true,
    message: "Applications exported successfully",
    data: { csvData, filename }
  };
};

export const exportApplicationsToExcel = async (filters?: ExportFilters): Promise<ServiceResponse<{ excelData: Blob; filename: string }>> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Mock Excel data (in real implementation, you'd use a library like xlsx)
  const mockExcelData = new Blob(['Mock Excel Data'], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const filename = `applications-export-${new Date().toISOString().split('T')[0]}.xlsx`;
  
  return {
    status: true,
    message: "Applications exported to Excel successfully",
    data: { excelData: mockExcelData, filename }
  };
};