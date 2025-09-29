import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Mailer8 API',
      version: '1.0.0',
      description: `
**Automated Birthday Email System API** - REST API for managing customer birthday emails and templates.

🔐 **Quick Test Credentials:**  

• Super Admin: \`super_admin@mail.local\` / \`Admin@123\` (Full Access)

• Admin: \`admin@mail.local\` / \`Admin@123\` (Limited Access)  


      `,
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
        url: process.env.NODE_ENV === 'production' ? process.env.PRODUCTION_API_URL : `http://localhost:${process.env.PORT || 8000}`,
        description:  process.env.NODE_ENV === 'production' ? 'Mailer8 live server' : 'Mailer8 dev server'
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
      docExpansion: 'list',  // Changed from 'none' to 'list' to show all operations
      defaultModelsExpandDepth: 2,  // Expand model schemas by default
      defaultModelExpandDepth: 2,   // Show model details
      filter: true,
      showRequestHeaders: true,
      showCommonExtensions: true,
      tryItOutEnabled: true,
      persistAuthorization: true,   // Remember authorization between page refreshes
      displayRequestDuration: true  // Show how long requests take
    },
    customCss: `
      .swagger-ui .topbar { display: none }
      .swagger-ui .info { margin: 20px 0; }
      .swagger-ui .info .title { color: #3b4151; }
      .detailed-guide { 
        background: #f7f7f7; 
        padding: 20px; 
        margin: 20px 0; 
        border-radius: 8px;
        border-left: 4px solid #4a90e2;
      }
      .back-to-top { 
        position: fixed; 
        bottom: 20px; 
        right: 20px; 
        background: #4a90e2; 
        color: white; 
        padding: 10px 15px; 
        border-radius: 5px; 
        text-decoration: none;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        z-index: 1000;
      }
    `,
    customSiteTitle: 'Mailer8 API Documentation',
    customJs: `
      // Add detailed guide at the bottom
      window.onload = function() {
        const detailedGuide = document.createElement('div');
        detailedGuide.id = 'detailed-guide';
        detailedGuide.className = 'detailed-guide';
        detailedGuide.innerHTML = \`
          <h2 id="detailed-guide">🔐 Test Credentials & Quick Start Guide</h2>
          
          <h3>Super Admin (Full Access)</h3>
          <p><strong>Email:</strong> <code>super_admin@mail.local</code><br>
          <strong>Password:</strong> <code>Admin@123</code><br>
          <strong>Permissions:</strong> All endpoints including user management, settings, and templates</p>
          
          <h3>Admin (Limited Access)</h3>  
          <p><strong>Email:</strong> <code>admin@mail.local</code><br>
          <strong>Password:</strong> <code>Admin@123</code><br>
          <strong>Permissions:</strong> Customer management and email logs only</p>
          
          <h3>🚀 Quick Start</h3>
          <ol>
            <li>Use the <strong>POST /api/auth/login</strong> endpoint with credentials above</li>
            <li>Copy the <code>accessToken</code> from the response</li>
            <li>Click <strong>Authorize</strong> button (🔒 icon) and paste: <code>Bearer &lt;your-token&gt;</code></li>
            <li>Now you can test all authorized endpoints!</li>
          </ol>
          
          <h3>📧 Email Template Placeholders</h3>
          <ul>
            <li><code>{{firstName}}</code> - Customer's first name</li>
            <li><code>{{lastName}}</code> - Customer's last name</li>
            <li><code>{{email}}</code> - Customer's email</li>
            <li><code>{{dob}}</code> - Birthday in "DD MMM" format</li>
          </ul>
        \`;
        
        // Add it after the main content
        const wrapper = document.querySelector('.swagger-ui .wrapper');
        if (wrapper) {
          wrapper.appendChild(detailedGuide);
        }
        
        // Add back to top button
        const backToTop = document.createElement('a');
        backToTop.href = '#top';
        backToTop.className = 'back-to-top';
        backToTop.innerHTML = '🔝 Back to Top';
        backToTop.onclick = function() {
          window.scrollTo({top: 0, behavior: 'smooth'});
          return false;
        };
        document.body.appendChild(backToTop);
      };
    `
  }));
  
  console.log('📚 Swagger documentation available at /api/docs');
};