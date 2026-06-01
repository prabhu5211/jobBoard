import { formatDistanceToNow, format } from 'date-fns';

/**
 * Format a date as "X days ago" relative to now.
 */
export const timeAgo = (date) => {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};

/**
 * Format a date as "Jan 15, 2024".
 */
export const formatDate = (date) => {
  return format(new Date(date), 'MMM d, yyyy');
};

/**
 * Format a salary range for display.
 * @param {Object} salary - { min, max, currency, period }
 */
export const formatSalary = (salary) => {
  if (!salary || (!salary.min && !salary.max)) return 'Not disclosed';
  const fmt = (n) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: salary.currency || 'USD', maximumFractionDigits: 0 }).format(n);
  if (salary.min && salary.max) return `${fmt(salary.min)} – ${fmt(salary.max)} / ${salary.period || 'year'}`;
  if (salary.min) return `From ${fmt(salary.min)} / ${salary.period || 'year'}`;
  return `Up to ${fmt(salary.max)} / ${salary.period || 'year'}`;
};

/**
 * Capitalize the first letter of a string.
 */
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Map job type enum to a display label.
 */
export const jobTypeLabel = (type) => {
  const map = {
    'full-time': 'Full-time',
    'part-time': 'Part-time',
    contract: 'Contract',
    internship: 'Internship',
    freelance: 'Freelance',
  };
  return map[type] || type;
};

/**
 * Map application status to a Tailwind badge color class.
 */
export const statusColor = (status) => {
  const map = {
    pending: 'bg-yellow-100 text-yellow-800',
    reviewed: 'bg-blue-100 text-blue-800',
    shortlisted: 'bg-purple-100 text-purple-800',
    interview: 'bg-indigo-100 text-indigo-800',
    offered: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    withdrawn: 'bg-gray-100 text-gray-800',
  };
  return map[status] || 'bg-gray-100 text-gray-800';
};
