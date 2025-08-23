// Mock CSV export utility (no Supabase)
import { ServiceResponse } from '@/types/interface';

// Mock data for CSV export
const mockCsvData = Array.from({ length: 20 }, (_, i) => ({
  id: `csv-${i + 1}`,
  firstName: `Candidate ${i + 1}`,
  lastName: `Last ${i + 1}`,
  email: `candidate${i + 1}@example.com`,
  phone: `+91${Math.floor(Math.random() * 9000000000) + 1000000000}`,
  position: ['English Teacher', 'Math Teacher', 'Science Teacher'][Math.floor(Math.random() * 3)],
  status: ['pending', 'approved', 'rejected'][Math.floor(Math.random() * 3)],
  createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
}));

export const generateCsvData = (data: typeof mockCsvData): string => {
  const headers = ['ID', 'First Name', 'Last Name', 'Email', 'Phone', 'Position', 'Status', 'Created At'];
  const csvRows = [headers.join(',')];
  
  data.forEach(row => {
    const csvRow = [
      row.id,
      `"${row.firstName}"`,
      `"${row.lastName}"`,
      `"${row.email}"`,
      `"${row.phone}"`,
      `"${row.position}"`,
      `"${row.status}"`,
      `"${row.createdAt}"`
    ].join(',');
    csvRows.push(csvRow);
  });
  
  return csvRows.join('\n');
};

export const downloadCsv = (csvData: string, filename: string): void => {
  const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const exportToCsv = async (): Promise<ServiceResponse<{ csvData: string; filename: string }>> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const csvData = generateCsvData(mockCsvData);
  const filename = `applications-${new Date().toISOString().split('T')[0]}.csv`;
  
  return {
    status: true,
    message: "CSV export generated successfully",
    data: { csvData, filename }
  };
};