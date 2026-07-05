/**
 * Rotas de Criação
 */

import { Router } from 'express';
import CreatorController from '../controllers/creatorController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Todas as rotas requerem autenticação
router.use(authMiddleware);

// Iniciar criação
router.post('/start', (req, res) => CreatorController.startCreation(req, res));

// Listar criações
router.get('/', (req, res) => CreatorController.listCreations(req, res));

// Obter criação específica
router.get('/:id', (req, res) => CreatorController.getCreation(req, res));

// Atualizar criação
router.put('/:id/update', (req, res) =>
  CreatorController.updateCreation(req, res)
);

// Aplicar sugestão
router.post('/:id/apply-suggestion', (req, res) =>
  CreatorController.applySuggestion(req, res)
);

// Concluir criação
router.post('/:id/complete', (req, res) =>
  CreatorController.completeCreation(req, res)
);

// Abandonar criação
router.delete('/:id', (req, res) =>
  CreatorController.abandonCreation(req, res)
);

export default router;
