import { format, parseISO, isValid, differenceInDays, differenceInHours, differenceInMinutes } from 'date-fns';

export const formatDate = (date: Date | string, formatStr: string = 'yyyy-MM-dd'): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return isValid(dateObj) ? format(dateObj, formatStr) : '';
};

export const formatDateTime = (date: Date | string): string => {
  return formatDate(date, 'yyyy-MM-dd HH:mm:ss');
};

export const getDateRange = (period: 'day' | 'week' | 'month' | 'year'): { start: Date; end: Date } => {
  const end = new Date();
  const start = new Date();

  switch (period) {
    case 'day':
      start.setDate(start.getDate() - 1);
      break;
    case 'week':
      start.setDate(start.getDate() - 7);
      break;
    case 'month':
      start.setMonth(start.getMonth() - 1);
      break;
    case 'year':
      start.setFullYear(start.getFullYear() - 1);
      break;
  }

  return { start, end };
};

export const calculateHoldingTime = (entryDate: Date, exitDate?: Date): string => {
  if (!exitDate) return 'Open';
  
  const days = differenceInDays(exitDate, entryDate);
  if (days > 0) return `${days}d`;
  
  const hours = differenceInHours(exitDate, entryDate);
  if (hours > 0) return `${hours}h`;
  
  const minutes = differenceInMinutes(exitDate, entryDate);
  return `${minutes}m`;
};