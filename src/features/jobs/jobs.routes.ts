import { Router } from 'express';
import { sendBirthdayEmailsCron, sendBirthdayEmails, getEmailLogs, getBirthdayEmailStats } from './jobs.controller';
import { authenticate } from '../../middleware/auth';

const router = Router();

// Public endpoint for external cron jobs (production)
router.post('/cron/send-birthday-emails', sendBirthdayEmailsCron);

// All other routes require authentication
router.use(authenticate);

// Send birthday emails (authenticated)
router.post('/send-birthday-emails', sendBirthdayEmails);

// Get email logs
router.get('/email-logs', getEmailLogs);

// Get birthday email statistics
router.get('/birthday-email-stats', getBirthdayEmailStats);

export default router;