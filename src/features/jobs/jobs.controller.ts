import { Request, Response } from 'express';
import { sendBirthdayEmails as sendBirthdayEmailsService, getEmailLogs as getEmailLogsService, getBirthdayEmailStats as getBirthdayEmailStatsService } from './jobs.service';
import { asyncHandler } from '../../utils/asyncHandler';
import { ok } from '../../utils/responses';
import { logger } from '../../config/logger';

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
  const { customerName, page, limit, startDate, endDate, days } = req.query;
  
  // Parse and validate pagination parameters
  const parsedPage = page ? parseInt(page as string) : undefined;
  const parsedLimit = limit ? parseInt(limit as string) : undefined;
  
  if (page && isNaN(parsedPage!)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid page parameter'
    });
  }
  
  if (limit && isNaN(parsedLimit!)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid limit parameter'
    });
  }

  // Parse and validate days
  const parsedDays = days ? parseInt(days as string) : undefined;
  if (days && parsedDays !== undefined && isNaN(parsedDays)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid days parameter'
    });
  }

  // Parse and validate dates
  let parsedStartDate: Date | undefined;
  let parsedEndDate: Date | undefined;

  if (startDate) {
    parsedStartDate = new Date(startDate as string);
    if (isNaN(parsedStartDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid startDate format. Use YYYY-MM-DD'
      });
    }
  }

  if (endDate) {
    parsedEndDate = new Date(endDate as string);
    if (isNaN(parsedEndDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid endDate format. Use YYYY-MM-DD'
      });
    }
  }

  const result = await getEmailLogsService(
    customerName as string,
    parsedPage,
    parsedLimit,
    parsedStartDate,
    parsedEndDate,
    parsedDays
  );

  ok(res, result, 'Email logs retrieved successfully');
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