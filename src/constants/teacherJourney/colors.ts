/**
 * Teacher Journey Color Palette
 * Following the brand color pattern with Primary Blue (#1E62F2) as the main brand color
 */

// Primary Brand Colors
export const PRIMARY_BLUE = '#1E62F2'; // HSL: 216 88% 54%
export const PRIMARY_BLUE_GLOW = 'hsl(216, 88%, 64%)'; // Lighter blue variant

// Core Colors
export const BACKGROUND_WHITE = '#FFFFFF';
export const FOREGROUND_DARK = 'hsl(214, 100%, 15%)'; // Dark blue-gray
export const SECONDARY_LIGHT = '#F4F6FA'; // HSL: 244 100% 97%
export const ACCENT_YELLOW = '#FFCC00'; // HSL: 50 100% 80%
export const MUTED_LIGHT = 'hsl(244, 100%, 97%)'; // Light gray-blue

// Status Colors (CRM-specific)
export const STATUS_RENEWED = 'hsl(142, 76%, 36%)'; // Green
export const STATUS_DROPPED = 'hsl(0, 84%, 60%)'; // Red
export const STATUS_FOLLOW_UP = 'hsl(38, 92%, 50%)'; // Orange/Yellow
export const STATUS_PENDING = 'hsl(240, 5%, 64.9%)'; // Gray

// Role Colors
export const ROLE_ADMIN = 'hsl(259, 94%, 51%)'; // Purple
export const ROLE_TEACHER = 'hsl(217, 91%, 60%)'; // Blue
export const ROLE_TSM = 'hsl(142, 76%, 36%)'; // Green
export const ROLE_SSM = 'hsl(262, 83%, 58%)'; // Purple
export const ROLE_SALES = 'hsl(38, 92%, 50%)'; // Orange/Yellow

// Design Theme
export const BORDER_RADIUS = '12px';
export const FONT_FAMILY = 'Inter, sans-serif';

// Status badge color mappings - returns Tailwind classes
export const getStatusBadgeColors = (status: string): { bg: string; text: string; border: string } => {
  const statusMap: Record<string, { bg: string; text: string; border: string }> = {
    // Demo Status
    'PENDING': {
      bg: 'bg-[hsl(240,5%,64.9%,0.1)]',
      text: 'text-[hsl(240,5%,64.9%)]',
      border: 'border-[hsl(240,5%,64.9%)]',
    },
    'SCHEDULED': {
      bg: 'bg-[hsl(216,88%,64%,0.1)]',
      text: 'text-[#1E62F2]',
      border: 'border-[#1E62F2]',
    },
    'SELECTED': {
      bg: 'bg-[hsl(142,76%,36%,0.1)]',
      text: 'text-[hsl(142,76%,36%)]',
      border: 'border-[hsl(142,76%,36%)]',
    },
    'NOT_SELECTED': {
      bg: 'bg-[hsl(0,84%,60%,0.1)]',
      text: 'text-[hsl(0,84%,60%)]',
      border: 'border-[hsl(0,84%,60%)]',
    },
    'HOLD': {
      bg: 'bg-[hsl(38,92%,50%,0.1)]',
      text: 'text-[hsl(38,92%,50%)]',
      border: 'border-[hsl(38,92%,50%)]',
    },
    // Induction
    'YES': {
      bg: 'bg-[hsl(142,76%,36%,0.1)]',
      text: 'text-[hsl(142,76%,36%)]',
      border: 'border-[hsl(142,76%,36%)]',
    },
    'NO': {
      bg: 'bg-[hsl(0,84%,60%,0.1)]',
      text: 'text-[hsl(0,84%,60%)]',
      border: 'border-[hsl(0,84%,60%)]',
    },
    'NOT_INTERESTED': {
      bg: 'bg-[hsl(0,84%,60%,0.1)]',
      text: 'text-[hsl(0,84%,60%)]',
      border: 'border-[hsl(0,84%,60%)]',
    },
    // Training
    'JOINED': {
      bg: 'bg-[hsl(217,91%,60%,0.1)]',
      text: 'text-[hsl(217,91%,60%)]',
      border: 'border-[hsl(217,91%,60%)]',
    },
    'NOT_JOINED': {
      bg: 'bg-[hsl(240,5%,64.9%,0.1)]',
      text: 'text-[hsl(240,5%,64.9%)]',
      border: 'border-[hsl(240,5%,64.9%)]',
    },
    'INCOMPLETE': {
      bg: 'bg-[hsl(38,92%,50%,0.1)]',
      text: 'text-[hsl(38,92%,50%)]',
      border: 'border-[hsl(38,92%,50%)]',
    },
    'SHIFTED_TO_NEXT_WEEK': {
      bg: 'bg-[hsl(216,88%,64%,0.1)]',
      text: 'text-[#1E62F2]',
      border: 'border-[#1E62F2]',
    },
    'DROPPED': {
      bg: 'bg-[hsl(0,84%,60%,0.1)]',
      text: 'text-[hsl(0,84%,60%)]',
      border: 'border-[hsl(0,84%,60%)]',
    },
    'COMPLETED': {
      bg: 'bg-[hsl(142,76%,36%,0.1)]',
      text: 'text-[hsl(142,76%,36%)]',
      border: 'border-[hsl(142,76%,36%)]',
    },
    // Certification
    'CLEARED': {
      bg: 'bg-[hsl(142,76%,36%,0.1)]',
      text: 'text-[hsl(142,76%,36%)]',
      border: 'border-[hsl(142,76%,36%)]',
    },
    'NOT_CLEARED': {
      bg: 'bg-[hsl(0,84%,60%,0.1)]',
      text: 'text-[hsl(0,84%,60%)]',
      border: 'border-[hsl(0,84%,60%)]',
    },
    'OFFER_LETTER_SENT': {
      bg: 'bg-[hsl(38,92%,50%,0.1)]',
      text: 'text-[hsl(38,92%,50%)]',
      border: 'border-[hsl(38,92%,50%)]',
    },
    'OFFER_LETTER_SENT_PORTAL_CREATED': {
      bg: 'bg-[hsl(142,76%,36%,0.1)]',
      text: 'text-[hsl(142,76%,36%)]',
      border: 'border-[hsl(142,76%,36%)]',
    },
    'PORTAL_HW_SUBMITTED': {
      bg: 'bg-[hsl(142,76%,36%,0.1)]',
      text: 'text-[hsl(142,76%,36%)]',
      border: 'border-[hsl(142,76%,36%)]',
    },
    'JOINING_FORM_SENT': {
      bg: 'bg-[hsl(142,76%,36%,0.1)]',
      text: 'text-[hsl(142,76%,36%)]',
      border: 'border-[hsl(142,76%,36%)]',
    },
    'PORTAL_CREATED': {
      bg: 'bg-[hsl(142,76%,36%,0.1)]',
      text: 'text-[hsl(142,76%,36%)]',
      border: 'border-[hsl(142,76%,36%)]',
    },
    'NEEDS_MORE_TRAINING': {
      bg: 'bg-[hsl(38,92%,50%,0.1)]',
      text: 'text-[hsl(38,92%,50%)]',
      border: 'border-[hsl(38,92%,50%)]',
    },
  };

  return statusMap[status] || {
    bg: 'bg-[hsl(240,5%,64.9%,0.1)]',
    text: 'text-[hsl(240,5%,64.9%)]',
    border: 'border-[hsl(240,5%,64.9%)]',
  };
};

