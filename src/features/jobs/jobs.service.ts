import { Customer, EmailLog } from '@prisma/client';
import { prisma } from '../../db/prisma';
import { getBirthdayCustomers } from '../customers/customers.service';
import { getDefaultTemplate, getSetting } from '../settings/settings.service';
import { sendMail } from '../../config/mailer';
import { renderTemplate, createEmailContext } from '../../utils/templating';
import { isBirthdayToday } from '../../utils/dates';
import { logger } from '../../config/logger';
import { parsePagination, createPaginatedResponse, PaginatedResponse } from '../../utils/pagination';

export interface BirthdayEmailSummary {
  attempted: number;
  sent: number;
  failed: number;
  errors: Array<{
    customerId: string;
    email: string;
    error: string;
  }>;
}

export const sendBirthdayEmails = async (targetDate?: Date): Promise<BirthdayEmailSummary> => {
  const summary: BirthdayEmailSummary = {
    attempted: 0,
    sent: 0,
    failed: 0,
    errors: []
  };

  try {
    logger.info('🔍 Starting birthday email job diagnostics...');
    
    // Get default template
    logger.info('📧 Fetching default email template...');
    const defaultTemplate = await getDefaultTemplate();
    
    if (!defaultTemplate) {
      logger.error('❌ No default template found in database');
      throw new Error('No default template configured. Please set a default template in settings.');
    }
    
    logger.info('✅ Default template found', { 
      templateId: defaultTemplate.id, 
      templateName: defaultTemplate.name 
    });

    // Get company name for from field
    logger.info('🏢 Fetching company name for email sender...');
    const companyName = await getSetting('companyName');
    const fromEmail = companyName 
      ? `${companyName} <${process.env.EMAIL_USER || 'no-reply@mailer8.test'}>` 
      : process.env.MAIL_FROM || 'Mailer8 <no-reply@mailer8.test>';
    
    logger.info('✅ From email configured', { fromEmail });

    // Get customers with birthdays today
    logger.info('🎂 Fetching customers with birthdays...', {
      targetDate: targetDate?.toISOString() || 'today'
    });
    const birthdayCustomers = await getBirthdayCustomers(targetDate);
      
      logger.info('✅ Customer query completed', { 
        customerCount: birthdayCustomers.length,
        targetDate: targetDate?.toISOString() || 'today'
      });
      
      if (birthdayCustomers.length === 0) {
        logger.info('ℹ️  No customers with birthdays found for target date');
        return summary;
      }

      summary.attempted = birthdayCustomers.length;
      logger.info(`🚀 Starting email processing for ${birthdayCustomers.length} customers`);

      // Process each customer
      for (const customer of birthdayCustomers) {
        try {
          // Check if we already sent email today (idempotent)
          const today = new Date();
          const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
          const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000 - 1);

          const existingLog = await prisma.emailLog.findFirst({
            where: {
              customerId: customer.id,
              sentAt: {
                gte: startOfDay,
                lte: endOfDay
              },
              status: 'SENT'
            }
          });

          if (existingLog) {
            logger.info(`Email already sent today to customer: ${customer.email}`);
            continue;
          }

          // Create email context
          const emailContext = createEmailContext(customer);

          // Render template
          const renderedSubject = renderTemplate(defaultTemplate.subject, emailContext);
          const renderedBody = renderTemplate(defaultTemplate.body, emailContext);

          // Send email
          const emailSent = await sendMail({
            to: customer.email,
            subject: renderedSubject,
            html: renderedBody,
            from: fromEmail
          });

          // Create email log
          await prisma.emailLog.create({
            data: {
              customerId: customer.id,
              templateId: defaultTemplate.id,
              toEmail: customer.email,
              subject: renderedSubject,
              renderedBody,
              status: emailSent ? 'SENT' : 'FAILED',
              errorMessage: emailSent ? null : 'Failed to send email'
            }
          });

          if (emailSent) {
            summary.sent++;
            logger.info(`Birthday email sent to: ${customer.email}`, {
              customerId: customer.id,
              templateId: defaultTemplate.id
            });
          } else {
            summary.failed++;
            summary.errors.push({
              customerId: customer.id,
              email: customer.email,
              error: 'Failed to send email'
            });
          }

        } catch (error) {
          summary.failed++;
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          
          summary.errors.push({
            customerId: customer.id,
            email: customer.email,
            error: errorMessage
          });

          // Log failed email attempt
          try {
            await prisma.emailLog.create({
              data: {
                customerId: customer.id,
                templateId: defaultTemplate.id,
                toEmail: customer.email,
                subject: 'Failed to render',
                renderedBody: 'Failed to render',
                status: 'FAILED',
                errorMessage
              }
            });
          } catch (logError) {
            logger.error('Failed to create error log', { error: logError });
          }

          logger.error(`Failed to send birthday email to: ${customer.email}`, {
            customerId: customer.id,
            error: errorMessage
          });
        }
      }

      logger.info('Birthday email job completed', summary);
      return summary;

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error('Birthday email job failed', { error: errorMessage });
    throw new Error(`Birthday email job failed: ${errorMessage}`);
  }
};

export const getEmailLogs = async (
  customerName?: string,
  page?: number,
  limit?: number,
  startDate?: Date,
  endDate?: Date,
  days?: number
): Promise<PaginatedResponse<any>> => {
  const pagination = parsePagination({ page, limit });
  const where: any = {};
  
  // Filter by customer name if provided (partial match)
  if (customerName) {
    where.customer = {
      OR: [
        { firstName: { contains: customerName, mode: 'insensitive' } },
        { lastName: { contains: customerName, mode: 'insensitive' } },
        { email: { contains: customerName, mode: 'insensitive' } }
      ]
    };
  }
  
  // Build date filter
  if (startDate || endDate || days) {
    where.sentAt = {};
    
    if (days) {
      // Filter by last N days
      const since = new Date();
      since.setDate(since.getDate() - days);
      where.sentAt.gte = since;
    } else {
      // Filter by date range
      if (startDate) {
        where.sentAt.gte = startDate;
      }
      if (endDate) {
        // Add 1 day and subtract 1ms to include the entire end date
        const endOfDay = new Date(endDate);
        endOfDay.setDate(endOfDay.getDate() + 1);
        endOfDay.setMilliseconds(endOfDay.getMilliseconds() - 1);
        where.sentAt.lte = endOfDay;
      }
    }
  }

  // Get logs with pagination and total count
  const [logs, total] = await Promise.all([
    prisma.emailLog.findMany({
      where,
      select: {
        id: true,
        toEmail: true,
        subject: true,
        status: true,
        sentAt: true,
        errorMessage: true,
        customer: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        },
        template: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: { sentAt: 'desc' },
      skip: pagination.skip,
      take: pagination.take
    }),
    prisma.emailLog.count({ where })
  ]);

  return createPaginatedResponse(logs, total, pagination);
};

// Get birthday email statistics
export const getBirthdayEmailStats = async (days: number = 30): Promise<{
  totalEmails: number;
  sentEmails: number;
  failedEmails: number;
  successRate: number;
}> => {
  const since = new Date();
  since.setDate(since.getDate() - days);

  const logs = await prisma.emailLog.findMany({
    where: {
      sentAt: {
        gte: since
      }
    }
  });

  const totalEmails = logs.length;
  const sentEmails = logs.filter(log => log.status === 'SENT').length;
  const failedEmails = logs.filter(log => log.status === 'FAILED').length;
  const successRate = totalEmails > 0 ? (sentEmails / totalEmails) * 100 : 0;

  return {
    totalEmails,
    sentEmails,
    failedEmails,
    successRate: Math.round(successRate * 100) / 100
  };
};