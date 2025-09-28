import { Router } from 'express';
import { sendBirthdayEmailsCron, sendBirthdayEmails, getEmailLogs, getBirthdayEmailStats } from './jobs.controller';
import { authenticate } from '../../middleware/auth';
import { requireSuperAdmin } from '../../middleware/requireRole';

const router = Router();

// Public endpoint for external cron jobs (production)
// POST /api/jobs/cron/birthday-emails?date=YYYY-MM-DD&force=true
router.post('/cron/birthday-emails', sendBirthdayEmailsCron);

// All other routes require authentication
router.use(authenticate, requireSuperAdmin);

// Send birthday emails (authenticated)
router.post('/birthday-emails', sendBirthdayEmails);

// Get email logs
router.get('/email-logs', getEmailLogs);

// Get birthday email statistics
router.get('/birthday-email-stats', getBirthdayEmailStats);

export default router;