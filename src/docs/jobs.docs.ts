/**
 * @swagger
 * /api/jobs/birthday-emails:
 *   post:
 *     tags:
 *       - Jobs
 *     summary: Manually trigger birthday emails
 *     description: Send birthday emails immediately for customers with birthdays today (or specified date)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: Optional date to check for birthdays (YYYY-MM-DD). Defaults to today.
 *         example: "2024-03-15"
 *     responses:
 *       200:
 *         description: Birthday emails processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BirthdayEmailResponse'
 *             example:
 *               message: "Birthday emails sent successfully"
 *               emailsSent: 3
 *               customersFound: 3
 *       400:
 *         description: Invalid date format or missing template
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: "Bad Request"
 *               message: "No default email template configured"
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         description: Email service error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: "Internal Server Error"
 *               message: "Failed to send emails"
 * 
 * /api/jobs/email-logs:
 *   get:
 *     tags:
 *       - Jobs
 *     summary: Get email logs
 *     description: Retrieve paginated email history with optional filtering
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *         description: Number of logs per page
 *       - in: query
 *         name: customerName
 *         schema:
 *           type: string
 *         description: Filter by customer name (partial match)
 *       - in: query
 *         name: days
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 30
 *         description: Number of days to look back from today
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [SENT, FAILED]
 *         description: Filter by email status
 *     responses:
 *       200:
 *         description: Email logs retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EmailLogListResponse'
 *             example:
 *               data:
 *                 - id: "log-uuid-1"
 *                   customerId: "customer-uuid-1"
 *                   customer:
 *                     id: "customer-uuid-1"
 *                     firstName: "John"
 *                     lastName: "Doe"
 *                     email: "john@example.com"
 *                   templateId: "template-uuid-1"
 *                   template:
 *                     id: "template-uuid-1"
 *                     name: "Classic Birthday"
 *                     subject: "🎉 Happy Birthday {{firstName}}!"
 *                   status: "SENT"
 *                   errorMessage: null
 *                   sentAt: "2024-01-01T09:00:00.000Z"
 *               meta:
 *                 page: 1
 *                 limit: 20
 *                 total: 1
 *                 pages: 1
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 * 
 * /api/jobs/birthday-email-stats:
 *   get:
 *     tags:
 *       - Jobs
 *     summary: Get email statistics
 *     description: Retrieve email delivery statistics for a specified period
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: days
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 30
 *         description: Number of days to include in statistics
 *     responses:
 *       200:
 *         description: Email statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EmailStats'
 *             example:
 *               totalEmails: 50
 *               sentEmails: 47
 *               failedEmails: 3
 *               successRate: 94.0
 *               period: "Last 30 days"
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */