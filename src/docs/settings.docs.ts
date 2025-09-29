/**
 * @swagger
 * /api/settings:
 *   get:
 *     tags:
 *       - Settings
 *     summary: Get system settings
 *     description: Retrieve current system settings and available templates (Super Admin only)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Settings retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Settings'
 *             example:
 *               defaultTemplateId: "template-uuid-here"
 *               sendTime: "09:00"
 *               timezone: "America/New_York"
 *               companyName: "Mailer8 Company"
 *               availableTemplates:
 *                 - id: "template-uuid-1"
 *                   name: "Classic Birthday"
 *                   subject: "🎉 Happy Birthday {{firstName}}!"
 *                   body: "<h1>Happy Birthday!</h1>"
 *                   createdBy: "user-uuid"
 *                   createdAt: "2024-01-01T00:00:00.000Z"
 *                   updatedAt: "2024-01-01T00:00:00.000Z"
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *   patch:
 *     tags:
 *       - Settings
 *     summary: Update system settings
 *     description: Update system configuration settings (Super Admin only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateSettingsRequest'
 *           example:
 *             defaultTemplateId: "template-uuid-here"
 *             sendTime: "10:30"
 *             timezone: "Europe/London"
 *             companyName: "My Business Name"
 *     responses:
 *       200:
 *         description: Settings updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 settings:
 *                   type: object
 *                   properties:
 *                     defaultTemplateId:
 *                       type: string
 *                       format: uuid
 *                     sendTime:
 *                       type: string
 *                     timezone:
 *                       type: string
 *                     companyName:
 *                       type: string
 *             example:
 *               message: "Settings updated successfully"
 *               settings:
 *                 defaultTemplateId: "template-uuid-here"
 *                 sendTime: "10:30"
 *                 timezone: "Europe/London"
 *                 companyName: "My Business Name"
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */