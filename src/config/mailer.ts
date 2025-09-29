import nodemailer from 'nodemailer';
import { logger } from './logger';

export interface SendMailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

// Create reusable transporter
export const transporter = nodemailer.createTransport({
  service: 'gmail', // Using Gmail service
  auth: {
    user: process.env.EMAIL_USER!,
    pass: process.env.EMAIL_PASS!
  }
});

// Verify connection configuration
transporter.verify((error: Error | null) => {
  if (error) {
    logger.error('Email service connection failed', { error });
  } else {
    logger.info('Email service is ready to send messages');
  }
});

export const sendMail = async ({ to, subject, html, from }: SendMailOptions): Promise<boolean> => {
  try {
    const info = await transporter.sendMail({
      from: from || process.env.MAIL_FROM || 'Mailer8 <no-reply@mailer8.test>',
      to,
      subject,
      html
    });

    logger.info(`Email sent successfully to ${to}`, { messageId: info.messageId });
    return true;
  } catch (error) {
    logger.error(`Failed to send email to ${to}`, { error });
    return false;
  }
};