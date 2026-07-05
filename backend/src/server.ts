/**
 * Servidor Express atualizado com todas as rotas
 */

import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import 'express-async-errors';
import analyzerRoutes from './routes/analyzer';
import creatorRoutes from './routes/creator';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 5000;

// ==================== MIDDLEWARE ====================

// CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  })
);

// Body Parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// ==================== ROUTES ====================

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: '🚀 OvitoCv Backend is running',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/analyzer', analyzerRoutes);
app.use('/api/creator', creatorRoutes);

// ==================== 404 HANDLER ====================

app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: `Rota ${req.path} não encontrada`,
  });
});

// ==================== ERROR HANDLER ====================

app.use((err: any, req: Request, res: Response) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Erro interno do servidor',
  });
});

// ==================== START SERVER ====================

app.listen(PORT, () => {
  console.log(`
${'='.repeat(50)}`);
  console.log(`🚀 OvitoCv Backend`);
  console.log(`${'='.repeat(50)}`);
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🤖 AI Enabled: ${process.env.OPENAI_API_KEY ? '✅ Yes' : '❌ No'}`);
  console.log(`${'='.repeat(50)}\n`);
});

export default app;
