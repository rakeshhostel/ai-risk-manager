import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config';
import { generalLimiter } from './middleware/rateLimit';

import authRoutes from './routes/auth.routes';
import transactionRoutes from './routes/transaction.routes';
import riskRoutes from './routes/risk.routes';
import alertRoutes from './routes/alert.routes';
import analyticsRoutes from './routes/analytics.routes';
import ruleRoutes from './routes/rule.routes';
import aiRoutes from './routes/ai.routes';
import customerRoutes from './routes/customer.routes';
import auditRoutes from './routes/audit.routes';

import path from 'path';

const app = express();

app.use(helmet({
  contentSecurityPolicy: false, // Disable CSP temporarily to ensure R3F stars & font links load properly in production
}));
app.use(cors());
app.use(express.json());
app.use(generalLimiter);

app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/risk', riskRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/rules', ruleRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/audit-logs', auditRoutes);

// Serve static frontend files in production
if (process.env.NODE_ENV === 'production') {
  const clientBuildPath = path.join(__dirname, '../../client/dist');
  app.use(express.static(clientBuildPath));
  app.get('*', (_req: Request, res: Response) => {
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  });
}

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

mongoose.connect(config.mongoUri)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(config.port, () => {
      console.log(`Server is running on port ${config.port}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });
