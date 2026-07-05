/**
 * Controller de Análise - Endpoints de análise com IA
 */

import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import AIService from '../services/aiService';
import EvaluationService from '../services/evaluationService';

const prisma = new PrismaClient();

class AnalyzerController {
  /**
   * POST /api/analyzer/analyze
   * Analisar currículo com IA
   */
  async analyze(req: Request, res: Response) {
    try {
      const { resumeContent, targetRole } = req.body;
      const userId = (req as any).userId;

      if (!resumeContent || resumeContent.trim().length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Conteúdo do currículo é obrigatório',
        });
      }

      // Analisar com IA
      const analysis = await AIService.analyzeResume({
        resumeContent,
        targetRole,
      });

      // Calcular score geral
      const overallScore = EvaluationService.calculateOverallScore(analysis.scores);

      // Gerar feedback
      const feedback = EvaluationService.generateFeedback(overallScore);

      // Priorizar recomendações
      const recommendations = EvaluationService.prioritizeRecommendations(
        analysis.recommendations
      );

      // Salvar análise no banco
      const savedAnalysis = await prisma.analysis.create({
        data: {
          userId,
          overallScore,
          structureScore: analysis.scores.structure,
          experienceScore: analysis.scores.experience,
          educationScore: analysis.scores.education,
          skillsScore: analysis.scores.skills,
          summaryScore: analysis.scores.summary,
          atsScore: analysis.scores.atsCompatibility,
          analysisData: analysis,
          recommendations: recommendations as any,
          keywordsFound: analysis.keywords.found,
          keywordsMissing: analysis.keywords.missing,
          aiSuggestions: analysis.recommendations as any,
          suggestCreation: overallScore < 60,
          extractedData: null,
        },
      });

      // Se score < 60, preparar dados para criação
      let extractedDataForCreation = null;
      if (overallScore < 60) {
        extractedDataForCreation = {
          note: 'Score baixo - Sugerir criação do zero',
          improvements: recommendations.slice(0, 3),
        };
      }

      return res.status(200).json({
        success: true,
        analysis: {
          id: savedAnalysis.id,
          overallScore,
          scores: analysis.scores,
          feedback,
          strengths: analysis.strengths,
          weaknesses: analysis.weaknesses,
          recommendations,
          keywords: analysis.keywords,
          atsAnalysis: analysis.atsAnalysis,
          suggestCreation: overallScore < 60,
          extractedDataForCreation,
        },
      });
    } catch (error: any) {
      console.error('Erro ao analisar currículo:', error);
      return res.status(500).json({
        success: false,
        error: error.message || 'Erro ao analisar currículo',
      });
    }
  }

  /**
   * POST /api/analyzer/improve
   * Gerar sugestões de melhoria para uma seção
   */
  async improve(req: Request, res: Response) {
    try {
      const { section, currentText, context } = req.body;

      if (!section || !currentText) {
        return res.status(400).json({
          success: false,
          error: 'Seção e texto atual são obrigatórios',
        });
      }

      const suggestions = await AIService.suggestImprovement(
        section,
        currentText,
        context
      );

      return res.status(200).json({
        success: true,
        suggestions: suggestions.suggestions,
      });
    } catch (error: any) {
      console.error('Erro ao gerar sugestões:', error);
      return res.status(500).json({
        success: false,
        error: error.message || 'Erro ao gerar sugestões',
      });
    }
  }

  /**
   * POST /api/analyzer/keywords
   * Otimizar keywords para um cargo
   */
  async optimizeKeywords(req: Request, res: Response) {
    try {
      const { resumeContent, targetRole } = req.body;

      if (!resumeContent || !targetRole) {
        return res.status(400).json({
          success: false,
          error: 'Conteúdo do currículo e cargo alvo são obrigatórios',
        });
      }

      const keywords = await AIService.optimizeKeywords(resumeContent, targetRole);

      return res.status(200).json({
        success: true,
        data: keywords,
      });
    } catch (error: any) {
      console.error('Erro ao otimizar keywords:', error);
      return res.status(500).json({
        success: false,
        error: error.message || 'Erro ao otimizar keywords',
      });
    }
  }

  /**
   * GET /api/analyzer/history
   * Histórico de análises do usuário
   */
  async getHistory(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;
      const limit = Math.min(parseInt(req.query.limit as string) || 10, 100);
      const offset = parseInt(req.query.offset as string) || 0;

      const analyses = await prisma.analysis.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit,
      });

      const total = await prisma.analysis.count({ where: { userId } });

      return res.status(200).json({
        success: true,
        data: {
          analyses,
          total,
          limit,
          offset,
        },
      });
    } catch (error: any) {
      console.error('Erro ao buscar histórico:', error);
      return res.status(500).json({
        success: false,
        error: error.message || 'Erro ao buscar histórico',
      });
    }
  }

  /**
   * GET /api/analyzer/:id
   * Obter análise específica
   */
  async getAnalysis(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req as any).userId;

      const analysis = await prisma.analysis.findFirst({
        where: { id, userId },
      });

      if (!analysis) {
        return res.status(404).json({
          success: false,
          error: 'Análise não encontrada',
        });
      }

      return res.status(200).json({
        success: true,
        analysis,
      });
    } catch (error: any) {
      console.error('Erro ao buscar análise:', error);
      return res.status(500).json({
        success: false,
        error: error.message || 'Erro ao buscar análise',
      });
    }
  }
}

export default new AnalyzerController();
