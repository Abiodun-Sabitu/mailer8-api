import { Request, Response } from 'express';
import { sendBirthdayEmails as sendBirthdayEmailsService, getEmailLogs as getEmailLogsService, getBirthdayEmailStats as getBirthdayEmailStatsService } from './jobs.service';
import { asyncHandler } from '../../utils/asyncHandler';
import { ok } from '../../utils/responses';
import { logger } from '../../config/logger';

// Public endpoint for external cron jobs (production)
export const sendBirthdayEmailsCron = asyncHandler(async (req: Request, res: Response) => {
  const { apiKey } = req.headers;
  
  // Check API key for external cron jobs
  if (!apiKey || apiKey !== process.env.CRON_API_KEY) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized: Invalid API key'
    });
  }

  const { date } = req.query;
  const targetDate = date ? new Date(date as string) : undefined;

  if (date && isNaN(targetDate!.getTime())) {
    return res.status(400).json({
      success: false,
      message: 'Invalid date format. Use YYYY-MM-DD'
    });
  }

  logger.info('Birthday email cron job started', {
    triggeredBy: 'external-cron',
    targetDate: targetDate?.toISOString() || 'today'
  });

  const summary = await sendBirthdayEmailsService(targetDate);

  const message = `Birthday emails processed: ${summary.attempted} attempted, ${summary.sent} sent, ${summary.failed} failed`;

  if (summary.failed > 0) {
    logger.warn(message, { errors: summary.errors });
  } else {
    logger.info(message);
  }

  // Return 200 even if some emails failed, as the job itself succeeded
  ok(res, summary, message);
});

export const sendBirthdayEmails = asyncHandler(async (req: Request, res: Response) => {
  const { date } = req.query;
  const targetDate = date ? new Date(date as string) : undefined;

  if (date && isNaN(targetDate!.getTime())) {
    return res.status(400).json({
      success: false,
      message: 'Invalid date format. Use YYYY-MM-DD'
    });
  }

  logger.info('Birthday email job started', {
    triggeredBy: req.user?.id,
    targetDate: targetDate?.toISOString() || 'today'
  });

  const summary = await sendBirthdayEmailsService(targetDate);

  const message = `Birthday emails processed: ${summary.attempted} attempted, ${summary.sent} sent, ${summary.failed} failed`;

  if (summary.failed > 0) {
    logger.warn(message, { errors: summary.errors });
  } else {
    logger.info(message);
  }

  // Return 200 even if some emails failed, as the job itself succeeded
  ok(res, summary, message);
});

export const getEmailLogs = asyncHandler(async (req: Request, res: Response) => {
  const { customerId, limit } = req.query;
  const parsedLimit = limit ? parseInt(limit as string) : 50;

  if (limit && isNaN(parsedLimit)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid limit parameter'
    });
  }

  const logs = await getEmailLogsService(customerId as string, parsedLimit);

  ok(res, logs, 'Email logs retrieved successfully');
});

export const getBirthdayEmailStats = asyncHandler(async (req: Request, res: Response) => {
  const { days } = req.query;
  const parsedDays = days ? parseInt(days as string) : 30;

  if (days && isNaN(parsedDays)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid days parameter'
    });
  }

  const stats = await getBirthdayEmailStatsService(parsedDays);

  ok(res, stats, `Email statistics for the last ${parsedDays} days`);
});