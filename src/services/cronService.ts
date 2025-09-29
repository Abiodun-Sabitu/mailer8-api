import cron from 'node-cron';
import { sendBirthdayEmails } from '../features/jobs/jobs.service';
import { logger } from '../config/logger';

/**
 * Starts dual cron jobs in both dev and prod:
 * 1. Fixed time from ENV (default 07:00) - reliable daily emails
 * 2. User-configurable time from DB - flexible testing/experience
 */
export const startCronJobs = async () => {
  await startDualCronJobs();
};

/**
 * Dual cron system - works in both dev and prod
 */
export const startDualCronJobs = async () => {
  try {
    const { getCronTime, getTimezone } = await import('../features/settings/settings.service');
    
    // Get initial settings from database
    const dbCronTime = await getCronTime();
    const dbTimezone = await getTimezone();
    
    // Get fixed time from ENV (default 07:00)
    const fixedTime = process.env.FIXED_CRON_TIME || '07:00';
    // Get fixed timezone from ENV (fallback to system default)
    const fixedTimezone = process.env.TZ || 'UTC';
    
    logger.info('🕐 Setting up dual cron jobs...', { 
      fixedCronTime: fixedTime,
      fixedTimezone: fixedTimezone,
      flexibleCronTime: dbCronTime, 
      flexibleTimezone: dbTimezone,
      environment: process.env.NODE_ENV || 'development'
    });

    // Cron Job 1: Fixed cron from ENV (reliable daily emails)
    const [fixedHours, fixedMinutes] = fixedTime.split(':');
    cron.schedule(`0 ${fixedMinutes} ${fixedHours} * * *`, async () => {
      await runFixedCronJob(fixedTime, fixedTimezone);
    }, {
      timezone: fixedTimezone
    });

    // Cron Job 2: Flexible cron (user-configurable from database)
    if (dbCronTime !== fixedTime) {  // Only if different from fixed time
      const [hours, minutes] = dbCronTime.split(':');
      const flexibleCronExpression = `0 ${minutes} ${hours} * * *`;

      cron.schedule(flexibleCronExpression, async () => {
        await runFlexibleCronJob(dbCronTime, dbTimezone);
      }, {
        timezone: dbTimezone
      });

      logger.info(`✅ Flexible cron scheduled for ${dbCronTime} (${dbTimezone})`);
    } else {
      logger.info(`⏭️ Flexible cron skipped - same time as fixed cron (${fixedTime})`);
    }

    logger.info(`✅ Fixed cron scheduled for ${fixedTime} (${fixedTimezone})`);
    logger.info('💡 Update settings to change flexible cron time - requires restart');
  } catch (error) {
    logger.error('❌ Failed to setup dual cron jobs', { error });
  }
};



/**
 * Runs fixed cron job (from ENV variable)
 */
const runFixedCronJob = async (scheduledTime: string, timezone: string) => {
  try {
    logger.info(`🎂 Running FIXED cron job at ${scheduledTime} (${timezone})`);
    const summary = await sendBirthdayEmails();
    
    logger.info('✅ Fixed cron job completed', {
      ...summary,
      jobType: 'fixed-cron',
      scheduledTime,
      timezone
    });
  } catch (error) {
    const errorDetails = {
      jobType: 'fixed-cron',
      scheduledTime,
      timezone,
      errorType: error instanceof Error ? error.constructor.name : typeof error,
      errorMessage: error instanceof Error ? error.message : String(error),
      errorStack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    };
    
    logger.error('❌ Fixed cron job failed', errorDetails);
  }
};

/**
 * Runs flexible cron job (user-configurable time from database)
 */
const runFlexibleCronJob = async (scheduledTime: string, timezone: string) => {
  try {
    logger.info(`🧪 Running FLEXIBLE cron job at ${scheduledTime} (${timezone})`);
    const summary = await sendBirthdayEmails();
    
    logger.info('✅ Flexible cron job completed', {
      ...summary,
      jobType: 'flexible-cron',
      scheduledTime,
      timezone
    });
  } catch (error) {
    const errorDetails = {
      jobType: 'flexible-cron',
      scheduledTime,
      timezone,
      errorType: error instanceof Error ? error.constructor.name : typeof error,
      errorMessage: error instanceof Error ? error.message : String(error),
      errorStack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    };
    
    logger.error('❌ Flexible cron job failed', errorDetails);
  }
};



