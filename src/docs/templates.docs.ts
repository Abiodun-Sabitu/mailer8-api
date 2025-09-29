/**
 * @swagger
 * /api/templates:
 *   get:
 *     tags:
 *       - Templates
 *     summary: List email templates
 *     description: Retrieve paginated list of email templates (Super Admin only)
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
 *           default: 10
 *         description: Number of templates per page
 *     responses:
 *       200:
 *         description: Templates retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TemplateListResponse'
 *             example:
 *               data:
 *                 - id: "template-uuid-1"
 *                   name: "Classic Birthday"
 *                   subject: "🎉 Happy Birthday {{firstName}}!"
 *                   body: "<h1>Happy Birthday {{firstName}}!</h1><p>Hope your day is amazing!</p>"
 *                   createdBy: "user-uuid"
 *                   createdAt: "2024-01-01T00:00:00.000Z"
 *                   updatedAt: "2024-01-01T00:00:00.000Z"
 *               meta:
 *                 page: 1
 *                 limit: 10
 *                 total: 1
 *                 pages: 1
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *   post:
 *     tags:
 *       - Templates
 *     summary: Create email template
 *     description: Create a new email template (Super Admin only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTemplateRequest'
 *           example:
 *             name: "Birthday Wishes"
 *             subject: "Happy Birthday {{firstName}}! 🎂"
 *             body: "<h1>Happy Birthday {{firstName}}!</h1><p>Hope your day on {{dob}} is amazing!</p><p>Best wishes,<br>{{companyName}}</p>"
 *     responses:
 *       201:
 *         description: Template created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 template:
 *                   $ref: '#/components/schemas/Template'
 *             example:
 *               message: "Template created successfully"
 *               template:
 *                 id: "new-template-uuid"
 *                 name: "Birthday Wishes"
 *                 subject: "Happy Birthday {{firstName}}! 🎂"
 *                 body: "<h1>Happy Birthday {{firstName}}!</h1><p>Hope your day on {{dob}} is amazing!</p>"
 *                 createdBy: "user-uuid"
 *                 createdAt: "2024-01-01T00:00:00.000Z"
 *                 updatedAt: "2024-01-01T00:00:00.000Z"
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 * 
 * /api/templates/{id}:
 *   get:
 *     tags:
 *       - Templates
 *     summary: Get template by ID
 *     description: Retrieve a specific email template by ID (Super Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Template unique identifier
 *     responses:
 *       200:
 *         description: Template retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Template'
 *             example:
 *               id: "template-uuid-here"
 *               name: "Classic Birthday"
 *               subject: "🎉 Happy Birthday {{firstName}}!"
 *               body: "<div style='font-family: Arial;'><h1>🎉 Happy Birthday!</h1><p>Dear {{firstName}},</p><p>Wishing you a very happy birthday!</p></div>"
 *               createdBy: "user-uuid"
 *               createdAt: "2024-01-01T00:00:00.000Z"
 *               updatedAt: "2024-01-01T00:00:00.000Z"
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *   patch:
 *     tags:
 *       - Templates
 *     summary: Update email template
 *     description: Update an existing email template (Super Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Template unique identifier
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateTemplateRequest'
 *           example:
 *             name: "Updated Birthday Template"
 *             subject: "🎂 Special Birthday Wishes {{firstName}}!"
 *     responses:
 *       200:
 *         description: Template updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 template:
 *                   $ref: '#/components/schemas/Template'
 *             example:
 *               message: "Template updated successfully"
 *               template:
 *                 id: "template-uuid-here"
 *                 name: "Updated Birthday Template"
 *                 subject: "🎂 Special Birthday Wishes {{firstName}}!"
 *                 body: "<h1>Happy Birthday {{firstName}}!</h1>"
 *                 createdBy: "user-uuid"
 *                 createdAt: "2024-01-01T00:00:00.000Z"
 *                 updatedAt: "2024-01-01T12:00:00.000Z"
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *   delete:
 *     tags:
 *       - Templates
 *     summary: Delete email template
 *     description: Remove an email template from the system (Super Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Template unique identifier
 *     responses:
 *       200:
 *         description: Template deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             example:
 *               message: "Template deleted successfully"
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */