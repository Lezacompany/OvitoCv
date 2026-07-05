/**
 * Rotas de Análise
 */

import { Router } from 'express';
import AnalyzerController from '../controllers/analyzerController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Todas as rotas requerem autenticação
router.use(authMiddleware);

// Analisar currículo
router.post('/analyze', (req, res) => AnalyzerController.analyze(req, res));

// Obter sugestões de melhoria
router.post('/improve', (req, res) => AnalyzerController.improve(req, res));

// Otimizar keywords
router.post('/keywords', (req, res) =>
  AnalyzerController.optimizeKeywords(req, res)
);

// Histórico de análises
router.get('/history', (req, res) => AnalyzerController.getHistory(req, res));

// Obter análise específica
router.get('/:id', (req, res) => AnalyzerController.getAnalysis(req, res));

export default router;
