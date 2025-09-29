import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { morganStream } from './config/logger';
import { errorHandler } from './middleware/errorHandler';
import { notFound } from './middleware/notFound';
import { setupSwagger } from './config/swagger';
import './docs'; // Load all Swagger documentation

// Import route modules
import authRoutes from './features/auth/auth.routes';
import usersRoutes from './features/users/users.routes';
import customersRoutes from './features/customers/customers.routes';
import templatesRoutes from './features/templates/templates.routes';
import settingsRoutes from './features/settings/settings.routes';
import jobsRoutes from './features/jobs/jobs.routes';

const app = express();

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:8000/api/doc',
  credentials: true
}));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev', { stream: morganStream }));
app.use(cookieParser());

// Setup Swagger documentation
setupSwagger(app);

// Base API routes
app.get('/api', (req, res) => {
  res.json({ 
    message: 'Mailer8 API running',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0'
  });
});

// Mount feature routes
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/customers', customersRoutes);
app.use('/api/templates', templatesRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/jobs', jobsRoutes);

// Error handling
app.use('*', notFound); // 404 handler 
app.use(errorHandler);

export default app;