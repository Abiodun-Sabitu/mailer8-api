import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Mailer8 API',
      version: '1.0.0',
      description: 'Automated Birthday Email System API - A comprehensive REST API for managing customer birthday emails, templates, and automated scheduling.',
      contact: {
        name: 'API Support',
        email: 'Abiodun.Sabitu@outlook.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: process.env.API_BASE_URL || `http://localhost:${process.env.PORT || 8000}/api`,
        description: 'Development server'
      },
      {
        url: process.env.PRODUCTION_API_URL || 'https://your-app.render.com/api',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT token obtained from /api/auth/login'
        }
      },
      schemas: {
        // User Schemas
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid', description: 'Unique user identifier' },
            email: { type: 'string', format: 'email', description: 'User email address' },
            firstName: { type: 'string', description: 'User first name' },
            lastName: { type: 'string', description: 'User last name' },
            role: { type: 'string', enum: ['SUPER_ADMIN', 'ADMIN'], description: 'User role' },
            isActive: { type: 'boolean', description: 'Whether user account is active' },
            createdAt: { type: 'string', format: 'date-time', description: 'Account creation date' },
            updatedAt: { type: 'string', format: 'date-time', description: 'Last update date' }
          }
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email', description: 'User email address' },
            password: { type: 'string', minLength: 6, description: 'User password' }
          }
        },
        LoginResponse: {
          type: 'object',
          properties: {
            user: { $ref: '#/components/schemas/User' },
            accessToken: { type: 'string', description: 'JWT access token' }
          }
        },
        RegisterRequest: {
          type: 'object',
          required: ['email', 'password', 'firstName', 'lastName', 'role'],
          properties: {
            email: { type: 'string', format: 'email', description: 'New user email address' },
            password: { type: 'string', minLength: 6, description: 'Password for new user' },
            firstName: { type: 'string', description: 'First name' },
            lastName: { type: 'string', description: 'Last name' },
            role: { type: 'string', enum: ['ADMIN'], description: 'User role (only ADMIN can be created)' }
          }
        },
        
        // Customer Schemas
        Customer: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid', description: 'Unique customer identifier' },
            firstName: { type: 'string', description: 'Customer first name' },
            lastName: { type: 'string', description: 'Customer last name' },
            email: { type: 'string', format: 'email', description: 'Customer email address' },
            dob: { type: 'string', format: 'date', description: 'Date of birth (YYYY-MM-DD)' },
            isActive: { type: 'boolean', description: 'Whether customer is active' },
            createdAt: { type: 'string', format: 'date-time', description: 'Record creation date' },
            updatedAt: { type: 'string', format: 'date-time', description: 'Last update date' }
          }
        },
        CreateCustomerRequest: {
          type: 'object',
          required: ['firstName', 'lastName', 'email', 'dob'],
          properties: {
            firstName: { type: 'string', minLength: 1, description: 'Customer first name' },
            lastName: { type: 'string', minLength: 1, description: 'Customer last name' },
            email: { type: 'string', format: 'email', description: 'Customer email address' },
            dob: { type: 'string', format: 'date', description: 'Date of birth (YYYY-MM-DD)' }
          }
        },
        UpdateCustomerRequest: {
          type: 'object',
          properties: {
            firstName: { type: 'string', minLength: 1, description: 'Customer first name' },
            lastName: { type: 'string', minLength: 1, description: 'Customer last name' },
            email: { type: 'string', format: 'email', description: 'Customer email address' },
            dob: { type: 'string', format: 'date', description: 'Date of birth (YYYY-MM-DD)' }
          }
        },
        
        // Template Schemas
        Template: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid', description: 'Unique template identifier' },
            name: { type: 'string', description: 'Template name' },
            subject: { type: 'string', description: 'Email subject line with placeholders' },
            body: { type: 'string', description: 'Email body content with HTML and placeholders' },
            createdBy: { type: 'string', format: 'uuid', description: 'ID of user who created template' },
            createdAt: { type: 'string', format: 'date-time', description: 'Template creation date' },
            updatedAt: { type: 'string', format: 'date-time', description: 'Last update date' }
          }
        },
        CreateTemplateRequest: {
          type: 'object',
          required: ['name', 'subject', 'body'],
          properties: {
            name: { type: 'string', minLength: 1, description: 'Template name' },
            subject: { type: 'string', minLength: 1, description: 'Email subject with placeholders like {{firstName}}' },
            body: { type: 'string', minLength: 1, description: 'Email body with HTML and placeholders like {{firstName}}, {{lastName}}, {{email}}, {{dob}}' }
          }
        },
        UpdateTemplateRequest: {
          type: 'object',
          properties: {
            name: { type: 'string', minLength: 1, description: 'Template name' },
            subject: { type: 'string', minLength: 1, description: 'Email subject with placeholders like {{firstName}}' },
            body: { type: 'string', minLength: 1, description: 'Email body with HTML and placeholders like {{firstName}}, {{lastName}}, {{email}}, {{dob}}' }
          }
        },
        
        // Settings Schemas
        Settings: {
          type: 'object',
          properties: {
            defaultTemplateId: { type: 'string', format: 'uuid', nullable: true, description: 'Default template ID for birthday emails' },
            sendTime: { type: 'string', pattern: '^([01]?[0-9]|2[0-3]):[0-5][0-9]$', description: 'Time to send emails (HH:MM format)' },
            timezone: { type: 'string', description: 'Timezone for sending emails (e.g., America/New_York)' },
            companyName: { type: 'string', description: 'Company name for email sender' },
            availableTemplates: {
              type: 'array',
              items: { $ref: '#/components/schemas/Template' },
              description: 'List of available email templates'
            }
          }
        },
        UpdateSettingsRequest: {
          type: 'object',
          properties: {
            defaultTemplateId: { type: 'string', format: 'uuid', description: 'Template ID to use as default' },
            sendTime: { type: 'string', pattern: '^([01]?[0-9]|2[0-3]):[0-5][0-9]$', description: 'Time to send emails (HH:MM format)' },
            timezone: { type: 'string', description: 'Timezone for sending emails' },
            companyName: { type: 'string', description: 'Company name for email sender' }
          }
        },
        
        // Email Log Schemas
        EmailLog: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid', description: 'Unique log entry identifier' },
            customerId: { type: 'string', format: 'uuid', description: 'Customer who received the email' },
            customer: { $ref: '#/components/schemas/Customer' },
            templateId: { type: 'string', format: 'uuid', description: 'Template used for the email' },
            template: { $ref: '#/components/schemas/Template' },
            status: { type: 'string', enum: ['SENT', 'FAILED'], description: 'Email delivery status' },
            errorMessage: { type: 'string', nullable: true, description: 'Error message if email failed' },
            sentAt: { type: 'string', format: 'date-time', description: 'When email was sent/failed' }
          }
        },
        EmailStats: {
          type: 'object',
          properties: {
            totalEmails: { type: 'number', description: 'Total number of emails in the period' },
            sentEmails: { type: 'number', description: 'Number of successfully sent emails' },
            failedEmails: { type: 'number', description: 'Number of failed emails' },
            successRate: { type: 'number', format: 'float', description: 'Success rate as percentage (0-100)' },
            period: { type: 'string', description: 'Time period for the statistics' }
          }
        },
        
        // Pagination Schemas
        PaginationMeta: {
          type: 'object',
          properties: {
            page: { type: 'number', description: 'Current page number' },
            limit: { type: 'number', description: 'Items per page' },
            total: { type: 'number', description: 'Total number of items' },
            pages: { type: 'number', description: 'Total number of pages' }
          }
        },
        CustomerListResponse: {
          type: 'object',
          properties: {
            data: {
              type: 'array',
              items: { $ref: '#/components/schemas/Customer' }
            },
            meta: { $ref: '#/components/schemas/PaginationMeta' }
          }
        },
        TemplateListResponse: {
          type: 'object',
          properties: {
            data: {
              type: 'array',
              items: { $ref: '#/components/schemas/Template' }
            },
            meta: { $ref: '#/components/schemas/PaginationMeta' }
          }
        },
        EmailLogListResponse: {
          type: 'object',
          properties: {
            data: {
              type: 'array',
              items: { $ref: '#/components/schemas/EmailLog' }
            },
            meta: { $ref: '#/components/schemas/PaginationMeta' }
          }
        },
        UserListResponse: {
          type: 'object',
          properties: {
            data: {
              type: 'array',
              items: { $ref: '#/components/schemas/User' }
            },
            meta: { $ref: '#/components/schemas/PaginationMeta' }
          }
        },
        
        // Error Schemas
        ValidationError: {
          type: 'object',
          properties: {
            error: { type: 'string', description: 'Error type' },
            message: { type: 'string', description: 'Error message' },
            details: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: { type: 'string', description: 'Field with validation error' },
                  message: { type: 'string', description: 'Validation error message' }
                }
              }
            }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            error: { type: 'string', description: 'Error type' },
            message: { type: 'string', description: 'Error message' }
          }
        },
        
        // Success Schemas
        SuccessResponse: {
          type: 'object',
          properties: {
            message: { type: 'string', description: 'Success message' }
          }
        },
        BirthdayEmailResponse: {
          type: 'object',
          properties: {
            message: { type: 'string', description: 'Operation result message' },
            emailsSent: { type: 'number', description: 'Number of emails sent' },
            customersFound: { type: 'number', description: 'Number of customers with birthdays today' }
          }
        }
      },
      responses: {
        UnauthorizedError: {
          description: 'Authentication required',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
              example: { error: 'Unauthorized', message: 'Authentication required' }
            }
          }
        },
        ForbiddenError: {
          description: 'Insufficient permissions',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
              example: { error: 'Forbidden', message: 'Super Admin access required' }
            }
          }
        },
        ValidationError: {
          description: 'Validation error',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ValidationError' },
              example: {
                error: 'Validation Error',
                message: 'Invalid input data',
                details: [
                  { field: 'email', message: 'Invalid email format' },
                  { field: 'dob', message: 'Date of birth is required' }
                ]
              }
            }
          }
        },
        NotFoundError: {
          description: 'Resource not found',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
              example: { error: 'Not Found', message: 'Resource not found' }
            }
          }
        },
        ConflictError: {
          description: 'Resource already exists',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
              example: { error: 'Conflict', message: 'Email already exists' }
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ],
    tags: [
      {
        name: 'Authentication',
        description: 'User authentication and account management'
      },
      {
        name: 'Customers',
        description: 'Customer management operations'
      },
      {
        name: 'Templates',
        description: 'Email template management (Super Admin only)'
      },
      {
        name: 'Settings',
        description: 'System configuration (Super Admin only)'
      },
      {
        name: 'Jobs',
        description: 'Birthday email jobs and monitoring'
      },
      {
        name: 'Users',
        description: 'User management (Super Admin only)'
      }
    ]
  },
  apis: ['./src/docs/*.ts'], // Modular Swagger documentation files
};

export const specs = swaggerJsdoc(options);

export const setupSwagger = (app: Express): void => {
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(specs, {
    explorer: true,
    swaggerOptions: {
      docExpansion: 'none',
      filter: true,
      showRequestHeaders: true,
      showCommonExtensions: true,
      tryItOutEnabled: true
    },
    customCss: `
      .swagger-ui .topbar { display: none }
      .swagger-ui .info { margin: 20px 0; }
      .swagger-ui .info .title { color: #3b4151; }
    `,
    customSiteTitle: 'Mailer8 API Documentation'
  }));
  
  console.log('📚 Swagger documentation available at /api/docs');
};