import cron from 'node-cron';
import { logger } from '../utils/logger.js';
import prisma from './db.js';

const getSendTime = async (): Promise<string> => {
  try {
    // Try to get SEND_TIME from database settings first
    const setting = await prisma.setting.findUnique({
      where: { key: 'SEND_TIME' }
    });
    
    if (setting?.value) {
      return setting.value;
    }
  } catch (error) {
    logger.warn('Could not fetch SEND_TIME from database, using environment variable');
  }
  
  // Fallback to environment variable or default
  return process.env.SEND_TIME || '09:00';
};

const dailyEmailTask = async () => {
  try {
    logger.info('Running daily birthday email task');
    
    // TODO: Implement birthday email logic here
    // 1. Get customers with birthdays today
    // 2. Get active email template
    // 3. Send birthday emails
    // 4. Log results
    
    logger.info('Daily birthday email task completed');
  } catch (error) {
    logger.error('Error in daily birthday email task', { error });
  }
};

export const registerCronJobs = async () => {
  try {
    const sendTime = await getSendTime();
    const [hour, minute] = sendTime.split(':');
    
    // Schedule daily task at specified time
    const cronExpression = `${minute} ${hour} * * *`;
    
    cron.schedule(cronExpression, dailyEmailTask, {
      scheduled: true,
      timezone: process.env.TIMEZONE || 'UTC'
    });
    
    logger.info('Cron job registered', { 
      expression: cronExpression, 
      sendTime,
      timezone: process.env.TIMEZONE || 'UTC'
    });
  } catch (error) {
    logger.error('Failed to register cron jobs', { error });
  }
};