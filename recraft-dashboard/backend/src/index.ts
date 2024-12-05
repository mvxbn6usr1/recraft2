import express from 'express';
import cors from 'cors';
import config from './config/recraft.config';
import apiRoutes from './routes/api.routes';

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: [config.server.cors.origin, 'http://localhost:5174'],
  credentials: config.server.cors.credentials,
}));

// Routes
app.use('/api/v1', apiRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(config.server.port, () => {
  console.log(`Server is running on port ${config.server.port}`);
}); 