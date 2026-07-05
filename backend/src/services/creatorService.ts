/**
 * Serviço de Criação - Lógica de criação inteligente de currículo
 */

import { PrismaClient } from '@prisma/client';
import ExtractionService from './extractionService';
import EvaluationService from './evaluationService';

const prisma = new PrismaClient();

class CreatorService {
  /**
   * Iniciar processo de criação baseado em análise negativa
   */
  async startCreation(
    userId: string,
    analysisId: string,
    sourceResumeId: string
  ): Promise<any> {
    try {
      // Buscar análise
      const analysis = await prisma.analysis.findUnique({
        where: { id: analysisId },
      });

      if (!analysis) throw new Error('Análise não encontrada');

      // Buscar currículo fonte
      const resume = await prisma.resume.findUnique({
        where: { id: sourceResumeId },
      });

      if (!resume) throw new Error('Currículo não encontrado');

      // Extrair dados
      const resumeContent = JSON.stringify(resume.content, null, 2);
      const extractedData = await ExtractionService.extractResumeData(resumeContent);

      // Validar
      const validation = ExtractionService.validateExtractedData(extractedData);
      if (!validation.valid) {
        throw new Error(`Erros na extração: ${validation.errors.join(', ')}`);
      }

      // Gerar sugestões
      const targetRole = analysis.analysisData?.targetRole;
      const improvedData = await ExtractionService.generateSuggestionsForExtracted(
        extractedData,
        targetRole
      );

      // Criar registro de criação
      const creation = await prisma.resumeCreation.create({
        data: {
          userId,
          sourceResumeId,
          extractedData: extractedData,
          currentData: improvedData,
          aiSuggestions: this.extractAISuggestions(improvedData),
          status: 'in_progress',
        },
      });

      return {
        id: creation.id,
        extractedData,
        improvedData,
        aiSuggestions: this.extractAISuggestions(improvedData),
        status: 'in_progress',
        validation,
      };
    } catch (error) {
      console.error('Erro ao iniciar criação:', error);
      throw error;
    }
  }

  /**
   * Atualizar dados durante criação
   */
  async updateCreation(creationId: string, updatedData: any): Promise<any> {
    try {
      const creation = await prisma.resumeCreation.update({
        where: { id: creationId },
        data: {
          currentData: updatedData,
          updatedAt: new Date(),
        },
      });

      return creation;
    } catch (error) {
      console.error('Erro ao atualizar criação:', error);
      throw error;
    }
  }

  /**
   * Aplicar sugestão de IA
   */
  async applySuggestion(
    creationId: string,
    section: string,
    index: number,
    suggestionType: 'concise' | 'balanced' | 'detailed'
  ): Promise<any> {
    try {
      const creation = await prisma.resumeCreation.findUnique({
        where: { id: creationId },
      });

      if (!creation) throw new Error('Criação não encontrada');

      const currentData = creation.currentData as any;
      const aiSuggestion = (creation.aiSuggestions as any[])[index];

      if (!aiSuggestion) throw new Error('Sugestão não encontrada');

      // Aplicar sugestão no section apropriado
      if (section === 'experience' && currentData.experience[index]) {
        currentData.experience[index].description = aiSuggestion[suggestionType];
      } else if (section === 'summary' && currentData.personal) {
        currentData.personal.summary = aiSuggestion[suggestionType];
      }

      return this.updateCreation(creationId, currentData);
    } catch (error) {
      console.error('Erro ao aplicar sugestão:', error);
      throw error;
    }
  }

  /**
   * Concluir criação e salvar novo currículo
   */
  async completeCreation(
    creationId: string,
    title: string,
    template: string = 'modern'
  ): Promise<any> {
    try {
      const creation = await prisma.resumeCreation.findUnique({
        where: { id: creationId },
      });

      if (!creation) throw new Error('Criação não encontrada');

      // Criar novo currículo
      const newResume = await prisma.resume.create({
        data: {
          userId: creation.userId,
          title,
          template,
          content: creation.currentData,
        },
      });

      // Atualizar status de criação
      await prisma.resumeCreation.update({
        where: { id: creationId },
        data: {
          status: 'completed',
          finalResumeId: newResume.id,
        },
      });

      // Calcular estatísticas
      const stats = this.calculateStats(
        creation.extractedData as any,
        creation.currentData as any
      );

      return {
        success: true,
        resume: newResume,
        stats,
        message: 'Novo currículo criado com sucesso!',
      };
    } catch (error) {
      console.error('Erro ao concluir criação:', error);
      throw error;
    }
  }

  /**
   * Extrair sugestões de IA de dados estruturados
   */
  private extractAISuggestions(data: any): any[] {
    const suggestions: any[] = [];

    // Sugestões de experiência
    if (data.experience) {
      data.experience.forEach((exp: any) => {
        if (exp.aiSuggestion) {
          suggestions.push({
            section: 'experience',
            current: exp.description,
            suggestion: exp.aiSuggestion,
          });
        }
      });
    }

    // Sugestões de skills
    if (data.skills) {
      const suggestedSkills = data.skills.filter((s: any) => s.suggested);
      if (suggestedSkills.length > 0) {
        suggestions.push({
          section: 'skills',
          type: 'add',
          items: suggestedSkills,
        });
      }
    }

    return suggestions;
  }

  /**
   * Calcular estatísticas de melhoria
   */
  private calculateStats(extracted: any, improved: any): any {
    let sectionsImproved = 0;
    let suggestionsApplied = 0;

    // Contar experiências melhoradas
    if (extracted.experience && improved.experience) {
      for (let i = 0; i < extracted.experience.length; i++) {
        if (
          extracted.experience[i]?.description !==
          improved.experience[i]?.description
        ) {
          sectionsImproved++;
          suggestionsApplied++;
        }
      }
    }

    // Contar skills adicionadas
    if (improved.skills) {
      const addedSkills = improved.skills.filter((s: any) => s.suggested);
      if (addedSkills.length > 0) {
        sectionsImproved++;
        suggestionsApplied += addedSkills.length;
      }
    }

    return {
      sectionsImproved: Math.max(1, sectionsImproved),
      suggestionsApplied: Math.max(1, suggestionsApplied),
      estimatedScoreIncrease: Math.min(30, suggestionsApplied * 3),
    };
  }

  /**
   * Obter histórico de criações do usuário
   */
  async getUserCreations(userId: string, limit = 10): Promise<any[]> {
    try {
      return await prisma.resumeCreation.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: limit,
      });
    } catch (error) {
      console.error('Erro ao obter criações:', error);
      throw error;
    }
  }
}

export default new CreatorService();
