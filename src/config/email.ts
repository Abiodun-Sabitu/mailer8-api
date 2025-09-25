import nodemailer from 'nodemailer';
import { logger } from '../utils/logger.js';

const createTransporter = () => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Verify connection on startup
  transporter.verify((error: any, success: any) => {
    if (error) {
      logger.error('Email transporter verification failed', { error: error.message });
    } else {
      logger.info('Email transporter is ready to send messages');
    }
  });

  return transporter;
};

export const emailTransporter = createTransporter();