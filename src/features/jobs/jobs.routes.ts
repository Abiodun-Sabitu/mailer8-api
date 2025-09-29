import { Router } from 'express';
import { sendBirthdayEmails, getEmailLogs, getBirthdayEmailStats } from './jobs.controller';
import { authenticate } from '../../middleware/auth';
import { requireSuperAdmin } from '../../middleware/requireRole';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Send birthday emails (authenticated)
router.post('/birthday-emails', sendBirthdayEmails);



// Get email logs
router.get('/email-logs', getEmailLogs);

// Get birthday email statistics
router.get('/birthday-email-stats', getBirthdayEmailStats);

export default router;