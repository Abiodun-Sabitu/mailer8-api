import { formatDate } from './dates';

export const renderTemplate = (template: string, context: Record<string, string>): string => {
  let rendered = template;
  
  // Replace placeholders with context values
  Object.entries(context).forEach(([key, value]) => {
    const placeholder = new RegExp(`{{${key}}}`, 'g');
    rendered = rendered.replace(placeholder, value || '');
  });
  
  // Clean up any remaining unreplaced placeholders (leave them blank)
  rendered = rendered.replace(/{{\w+}}/g, '');
  
  return rendered;
};

export const createEmailContext = (customer: {
  firstName: string;
  lastName: string;
  email: string;
  dob: Date;
}): Record<string, string> => {
  return {
    firstName: customer.firstName,
    lastName: customer.lastName,
    email: customer.email,
    dob: formatDate(customer.dob, 'DD MMM')
  };
};