export const isBirthdayToday = (dob: Date, tz: string = process.env.TZ || 'Africa/Lagos'): boolean => {
  const today = new Date();
  const birthday = new Date(dob);
  
  // Convert to specified timezone (simplified - in production use proper timezone library)
  const todayInTz = new Date(today.toLocaleString('en-US', { timeZone: tz }));
  
  return (
    todayInTz.getMonth() === birthday.getMonth() &&
    todayInTz.getDate() === birthday.getDate()
  );
};

export const formatDate = (date: Date, format: 'DD MMM' | 'YYYY-MM-DD' = 'DD MMM'): string => {
  if (format === 'DD MMM') {
    const day = date.getDate().toString().padStart(2, '0');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[date.getMonth()];
    return `${day} ${month}`;
  }
  
  if (format === 'YYYY-MM-DD') {
    return date.toISOString().split('T')[0];
  }
  
  return date.toString();
};

export const parseDate = (dateString: string): Date => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    throw new Error('Invalid date format');
  }
  return date;
};