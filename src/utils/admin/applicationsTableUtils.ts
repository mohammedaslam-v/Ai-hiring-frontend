import { AdminApplicationDetail } from '@/types/admin';

/**
 * Format interview date and time for display
 */
export const formatInterviewDateTime = (dateString?: string) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleString('en-US', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Open WhatsApp chat with the given phone number
 */
export const handleOpenWhatsApp = (phone: string) => {
  const formattedPhone = phone.replace(/\D/g, '');
  window.open(`https://wa.me/${formattedPhone}`, '_blank');
};

/**
 * Open default email client with the given email address
 */
export const handleSendEmail = (email: string) => {
  window.location.href = `mailto:${email}`;
};

/**
 * Get items per page options for pagination
 */
export const ITEMS_PER_PAGE_OPTIONS = [
  { value: '25', label: '25' },
  { value: '50', label: '50' },
  { value: '100', label: '100' },
  { value: '200', label: '200' },
  { value: '500', label: '500' }
];

/**
 * Map application data to CSV export format
 */
export const mapApplicationToCsvFormat = (app: AdminApplicationDetail) => ({
  id: app.id,
  firstName: app.name.split(' ')[0] || app.name,
  lastName: app.name.split(' ').slice(1).join(' ') || '',
  email: app.email,
  phone: app.phone,
  position: app.subjects?.join(', ') || '',
  status: app.application_status || 'pending',
  createdAt: app.application_date || new Date().toISOString()
});

/**
 * Generate CSV filename with current date
 */
export const generateCsvFilename = () => {
  return `applications-${new Date().toISOString().split('T')[0]}.csv`;
};
