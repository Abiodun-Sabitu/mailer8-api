# Mailer8 API

Backend API for Mailer8 - helping SMEs celebrate their customers with automated, personalized birthday emails.

## Features

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