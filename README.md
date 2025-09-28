# Mailer8 API

A complete REST API for sending automated, personalized birthday emails built with Node.js, Express, TypeScript, Prisma, and PostgreSQL.

## Features

- 🔐 **JWT Authentication** - Secure login/logout with role-based access (SUPER_ADMIN/ADMIN)
- 👥 **User Management** - Admin user creation and status management
- 📧 **Customer Management** - CRUD operations with search, pagination, and birthday tracking
- 📝 **Email Templates** - Customizable HTML templates with placeholder support
- ⚙️ **Settings Management** - Configure default templates and email scheduling
- 🎂 **Birthday Email Jobs** - Automated birthday email sending with idempotent daily runs
- 📊 **Email Analytics** - Track sent emails, success rates, and comprehensive logging
- 🕐 **Flexible Scheduling** - Development auto-scheduler + production external scheduler support

## Quick Start

### Prerequisites
- Node.js 14+ (Node.js 22 recommended)
- PostgreSQL database
- SMTP email service

### Installation & Setup

```bash
# Clone and install
git clone <repository-url>
cd mailer8-api
npm install

# Setup environment
cp .env.example .env
# Edit .env with your database and SMTP settings

# Database setup
npx prisma generate
npm run prisma:migrate
npx ts-node src/db/seed.ts

# Start development server
npm run dev
```

**Default Admin Credentials:** admin@mail.local / Admin@123

## API Overview

All endpoints return JSON with consistent structure:
```json
{
  "success": true,
  "message": "Operation completed",
  "data": { ... }
}
```

### Core Endpoints

**Authentication**
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - Create admin (SUPER_ADMIN only)  
- `GET /api/auth/me` - Get current user profile

**Birthday Email Job**
- `POST /api/jobs/send-birthday-emails` - Send birthday emails now
- `GET /api/jobs/email-logs` - View email history
- `GET /api/jobs/birthday-email-stats` - Analytics

**Management** (Authentication required)
- `/api/customers` - Customer CRUD with search/pagination
- `/api/templates` - Email template management
- `/api/settings` - System configuration (SUPER_ADMIN only)

## Template System

Templates support dynamic placeholders:
- `{{firstName}}` - Customer first name
- `{{lastName}}` - Customer last name  
- `{{email}}` - Customer email
- `{{dob}}` - Formatted birthday date (e.g., "15 May")

Example template:
```html
<h1>🎉 Happy Birthday {{firstName}}!</h1>
<p>Dear {{firstName}} {{lastName}},</p>
<p>Hope your special day on {{dob}} is amazing!</p>
```

## Production Deployment

1. Set `NODE_ENV=production` (disables internal scheduler)
2. Use external scheduler to call `POST /api/jobs/send-birthday-emails`
3. Configure proper SMTP and database credentials
4. Run migrations: `npm run prisma:migrate`

## Environment Variables

**Required:**
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - JWT signing secret  
- `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS` - Email service credentials

**Optional:**
- `DEFAULT_CRON_TIME=07:00` - Daily email send time
- `TZ=Africa/Lagos` - Timezone for birthday calculation
- `PORT=3000` - Server port

## Scripts

- `npm run dev` - Development server with auto-restart
- `npm run build` - Build TypeScript for production
- `npm start` - Start production server  
- `npm run prisma:migrate` - Run database migrations

## Architecture

Built with feature-based modular architecture:
- `src/features/` - Auth, Users, Customers, Templates, Settings, Jobs
- `src/middleware/` - Authentication, validation, error handling
- `src/utils/` - Crypto, dates, templating, pagination helpers
- `src/config/` - Environment, logging, email configuration

Perfect for SMEs wanting to automate customer birthday celebrations! 🎂

- **Node.js + Express + TypeScript**: Modern backend stack
- **ES Modules**: Using the latest module system
- **Authentication**: JWT-based auth with refresh tokens
- **Email Service**: Automated email sending with nodemailer
- **Database**: Prisma ORM ready for PostgreSQL
- **Validation**: Zod for request validation
- **Scheduled Tasks**: Node-cron for automated tasks
- **Security**: CORS, rate limiting, and secure headers

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

Copy the example environment file and configure your settings:

```bash
cp .env.example .env
```

Edit `.env` with your actual configuration values:
- Database connection string
- JWT secrets
- Email credentials
- Other settings

### 3. Database Setup

Initialize and migrate your database:

```bash
npm run prisma:migrate
```

### 4. Development

Start the development server:

```bash
npm run dev
```

The API will be available at `http://localhost:3000`

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio

## API Endpoints

### Health Check
- `GET /` - API status message
- `GET /health` - Detailed health check

## Environment Variables

See `.env.example` for all required environment variables.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database ORM**: Prisma
- **Authentication**: JWT
- **Email**: Nodemailer
- **Validation**: Zod
- **Scheduling**: Node-cron
- **Security**: CORS, Cookie Parser

## Project Structure

```
src/
├── app.ts          # Express app configuration
├── server.ts       # Server entry point
├── routes/         # API routes (to be added)
├── controllers/    # Route controllers (to be added)
├── middleware/     # Custom middleware (to be added)
├── models/         # Data models (to be added)
├── services/       # Business logic (to be added)
└── utils/          # Utility functions (to be added)
```

## Next Steps

1. Set up your database and run migrations
2. Create your database schema in `prisma/schema.prisma`
3. Add authentication routes and middleware
4. Implement email service functionality
5. Add API routes for your business logic
6. Set up automated birthday email cron jobs

## License

ISC