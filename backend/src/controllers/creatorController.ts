/**
 * Controller de Criação - Endpoints para criação inteligente de currículo
 */

import { Request, Response } from 'express';
import CreatorService from '../services/creatorService';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class CreatorController {
  /**
   * POST /api/creator/start
   * Iniciar criação baseada em análise negativa
   */
  async startCreation(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;
      const { analysisId, sourceResumeId } = req.body;

      if (!analysisId || !sourceResumeId) {
        return res.status(400).json({
          success: false,
          error: 'analysisId e sourceResumeId são obrigatórios',
        });
      }

      const creation = await CreatorService.startCreation(
        userId,
        analysisId,
        sourceResumeId
      );

      return res.status(201).json({
        success: true,
        creation,
      });
    } catch (error: any) {
      console.error('Erro ao iniciar criação:', error);
      return res.status(500).json({
        success: false,
        error: error.message || 'Erro ao iniciar criação',
      });
    }
  }

  /**
   * PUT /api/creator/:id/update
   * Atualizar dados durante criação
   */
  async updateCreation(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { currentData } = req.body;

      if (!currentData) {
        return res.status(400).json({
          success: false,
          error: 'currentData é obrigatório',
        });
      }

      const creation = await CreatorService.updateCreation(id, currentData);

      return res.status(200).json({
        success: true,
        creation,
      });
    } catch (error: any) {
      console.error('Erro ao atualizar criação:', error);
      return res.status(500).json({
        success: false,
        error: error.message || 'Erro ao atualizar criação',
      });
    }
  }

  /**
   * POST /api/creator/:id/apply-suggestion
   * Aplicar sugestão de IA
   */
  async applySuggestion(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { section, index, suggestionType } = req.body;

      if (!section || index === undefined || !suggestionType) {
        return res.status(400).json({
          success: false,
          error: 'section, index e suggestionType são obrigatórios',
        });
      }

      const creation = await CreatorService.applySuggestion(
        id,
        section,
        index,
        suggestionType
      );

      return res.status(200).json({
        success: true,
        creation,
      });
    } catch (error: any) {
      console.error('Erro ao aplicar sugestão:', error);
      return res.status(500).json({
        success: false,
        error: error.message || 'Erro ao aplicar sugestão',
      });
    }
  }

  /**
   * POST /api/creator/:id/complete
   * Concluir criação e salvar novo currículo
   */
  async completeCreation(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { title, template = 'modern' } = req.body;

      if (!title) {
        return res.status(400).json({
          success: false,
          error: 'Título do currículo é obrigatório',
        });
      }

      const result = await CreatorService.completeCreation(id, title, template);

      return res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error: any) {
      console.error('Erro ao concluir criação:', error);
      return res.status(500).json({
        success: false,
        error: error.message || 'Erro ao concluir criação',
      });
    }
  }

  /**
   * GET /api/creator/:id
   * Obter dados de criação
   */
  async getCreation(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req as any).userId;

      const creation = await prisma.resumeCreation.findFirst({
        where: { id, userId },
      });

      if (!creation) {
        return res.status(404).json({
          success: false,
          error: 'Criação não encontrada',
        });
      }

      return res.status(200).json({
        success: true,
        creation,
      });
    } catch (error: any) {
      console.error('Erro ao buscar criação:', error);
      return res.status(500).json({
        success: false,
        error: error.message || 'Erro ao buscar criação',
      });
    }
  }

  /**
   * GET /api/creator
   * Listar criações do usuário
   */
  async listCreations(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;
      const limit = Math.min(parseInt(req.query.limit as string) || 10, 100);

      const creations = await CreatorService.getUserCreations(userId, limit);

      return res.status(200).json({
        success: true,
        creations,
      });
    } catch (error: any) {
      console.error('Erro ao listar criações:', error);
      return res.status(500).json({
        success: false,
        error: error.message || 'Erro ao listar criações',
      });
    }
  }

  /**
   * DELETE /api/creator/:id
   * Abandonar criação
   */
  async abandonCreation(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req as any).userId;

      const creation = await prisma.resumeCreation.findFirst({
        where: { id, userId },
      });

      if (!creation) {
        return res.status(404).json({
          success: false,
          error: 'Criação não encontrada',
        });
      }

      await prisma.resumeCreation.update({
        where: { id },
        data: { status: 'abandoned' },
      });

      return res.status(200).json({
        success: true,
        message: 'Criação abandonada',
      });
    } catch (error: any) {
      console.error('Erro ao abandonar criação:', error);
      return res.status(500).json({
        success: false,
        error: error.message || 'Erro ao abandonar criação',
      });
    }
  }
}

export default new CreatorController();
