import dotenv from 'dotenv';

// IMPORTANT: Load environment variables BEFORE importing other modules
dotenv.config();

import express from 'express';
import cors from 'cors';
import * as OpenApiValidator from 'express-openapi-validator';
import { toNodeHandler } from 'better-auth/node';
import { auth } from './config/auth';
import { generateOpenAPIDocument } from './openapi';
import ldrawRoutes from './routes/ldraw';

const app = express();
const PORT = process.env.PORT || 3001;

// Generate OpenAPI spec at startup
const openApiSpec = generateOpenAPIDocument();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));

// Mount better-auth handler BEFORE express.json() — it needs raw request body
app.all('/api/auth/*', toNodeHandler(auth));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// OpenAPI spec & docs (before validator so these routes aren't validated)
app.get('/api/openapi.json', (_req, res) => {
  res.json(openApiSpec);
});

app.get('/api/docs', (_req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.send(`<!doctype html>
<html>
<head>
  <title>LCONN API Docs</title>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
</head>
<body>
  <script id="api-reference" data-url="/api/openapi.json"></script>
  <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script>
</body>
</html>`);
});

// Health check
app.get('/health', (_req, res) => {
  res.json({ success: true, message: 'Server is running' });
});

// OpenAPI request validation (only for /api routes, after docs/health)
app.use(
  OpenApiValidator.middleware({
    apiSpec: openApiSpec as any,
    validateRequests: true,
    validateResponses: false,
    ignorePaths: /^\/api\/(auth|openapi\.json|docs)/,
  }),
);

// LDraw routes
app.use('/api/ldraw', ldrawRoutes);

// Error handling middleware
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  const status = err.status || 500;

  // express-openapi-validator errors include an errors array
  if (err.errors) {
    res.status(status).json({
      success: false,
      error: err.message,
      details: err.errors,
    });
    return;
  }

  if (status >= 500) {
    console.error('Error:', err);
  }

  res.status(status).json({
    success: false,
    error: err.message || 'Internal server error',
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`API docs: http://localhost:${PORT}/api/docs`);
});
