import dotenv from 'dotenv';

// IMPORTANT: Load environment variables BEFORE importing other modules
dotenv.config();

import express from 'express';
import cors from 'cors';
import { toNodeHandler } from 'better-auth/node';
import { auth } from './config/auth';
import partsRoutes from './routes/parts';
import connectionsRoutes from './routes/connections';
import votesRoutes from './routes/votes';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));

// Mount better-auth handler BEFORE express.json() — it needs raw request body
app.all('/api/auth/*', toNodeHandler(auth));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/parts', partsRoutes);
app.use('/api/connections', connectionsRoutes);
app.use('/api/connections', votesRoutes); // Vote routes are under /api/connections/:id/vote

// Health check
app.get('/health', (req, res) => {
  res.json({ success: true, message: 'Server is running' });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal server error',
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
