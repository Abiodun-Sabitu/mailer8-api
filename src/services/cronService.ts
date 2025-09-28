import cron from 'node-cron';
import { sendBirthdayEmails } from '../features/jobs/jobs.service';
import { logger } from '../config/logger';

/**
 * Starts internal cron jobs for development environment
 * Uses SEND_TIME environment variable (e.g., "07:00")
 * In production, external cron services should call {{base-url}}/api/jobs/cron/birthday-emails
 */
export const startDevelopmentCronJobs = async () => {
  try {
    const envCronTime = process.env.SEND_TIME || '07:00';
    logger.info('🕐 Setting up development cron job...', { scheduledTime: envCronTime });

    const [hours, minutes] = envCronTime.split(':');
    const cronExpression = `0 ${minutes} ${hours} * * *`;

    cron.schedule(cronExpression, async () => {
      await runDevelopmentBirthdayJob(envCronTime);
    }, {
      timezone: process.env.TZ || 'Africa/Lagos'
    });

    logger.info(`✅ Development cron job scheduled for ${envCronTime} (${process.env.TZ || 'Africa/Lagos'})`);
    logger.info('💡 To test: Update SEND_TIME in your .env file and restart server');
  } catch (error) {
    logger.error('❌ Failed to setup development cron job', { error });
  }
};

/**
 * Runs birthday email job for development
 */
const runDevelopmentBirthdayJob = async (scheduledTime: string) => {
  try {
    logger.info(`🎂 Running development birthday email job at ${scheduledTime}`);
    const summary = await sendBirthdayEmails();
    
    logger.info('✅ Development birthday email job completed', {
      ...summary,
      scheduledTime
    });
  } catch (error) {
    const errorDetails = {
      scheduledTime,
      errorType: error instanceof Error ? error.constructor.name : typeof error,
      errorMessage: error instanceof Error ? error.message : String(error),
      errorStack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    };

    logger.error('❌ Development birthday email job failed', errorDetails);
    
    // Also log to console for immediate visibility during development
    console.error('🚨 CRON JOB ERROR DETAILS:');
    console.error('Message:', errorDetails.errorMessage);
    console.error('Type:', errorDetails.errorType);
    if (errorDetails.errorStack) {
      console.error('Stack:', errorDetails.errorStack);
    }
  }
};

/**
 * Test function to manually trigger birthday emails (for development testing)
 */
export const testBirthdayEmails = async (): Promise<void> => {
  try {
    logger.info('🧪 Running test birthday email job');
    const summary = await sendBirthdayEmails();
    logger.info('✅ Test birthday email job completed', summary);
  } catch (error) {
    logger.error('❌ Test birthday email job failed', { error });
    throw error;
  }
};