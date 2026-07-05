/**
 * Serviço de API - Integração com Backend
 */

import axios, { AxiosInstance } from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

class APIService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Interceptor para adicionar token
    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  // ==================== ANALYZER ====================

  /**
   * Analisar currículo
   */
  async analyzeResume(resumeContent: string, targetRole?: string) {
    const response = await this.client.post('/api/analyzer/analyze', {
      resumeContent,
      targetRole,
    });
    return response.data.analysis;
  }

  /**
   * Obter sugestões de melhoria
   */
  async getImprovementSuggestions(
    section: string,
    currentText: string,
    context?: string
  ) {
    const response = await this.client.post('/api/analyzer/improve', {
      section,
      currentText,
      context,
    });
    return response.data.suggestions;
  }

  /**
   * Otimizar keywords
   */
  async optimizeKeywords(resumeContent: string, targetRole: string) {
    const response = await this.client.post('/api/analyzer/keywords', {
      resumeContent,
      targetRole,
    });
    return response.data.data;
  }

  /**
   * Obter histórico de análises
   */
  async getAnalysisHistory(limit = 10, offset = 0) {
    const response = await this.client.get('/api/analyzer/history', {
      params: { limit, offset },
    });
    return response.data.data;
  }

  /**
   * Obter análise específica
   */
  async getAnalysis(id: string) {
    const response = await this.client.get(`/api/analyzer/${id}`);
    return response.data.analysis;
  }

  // ==================== CREATOR ====================

  /**
   * Iniciar criação inteligente
   */
  async startCreation(analysisId: string, sourceResumeId: string) {
    const response = await this.client.post('/api/creator/start', {
      analysisId,
      sourceResumeId,
    });
    return response.data.creation;
  }

  /**
   * Atualizar criação
   */
  async updateCreation(creationId: string, currentData: any) {
    const response = await this.client.put(
      `/api/creator/${creationId}/update`,
      { currentData }
    );
    return response.data.creation;
  }

  /**
   * Aplicar sugestão de IA
   */
  async applySuggestion(
    creationId: string,
    section: string,
    index: number,
    suggestionType: 'concise' | 'balanced' | 'detailed'
  ) {
    const response = await this.client.post(
      `/api/creator/${creationId}/apply-suggestion`,
      { section, index, suggestionType }
    );
    return response.data.creation;
  }

  /**
   * Concluir criação
   */
  async completeCreation(
    creationId: string,
    title: string,
    template: string = 'modern'
  ) {
    const response = await this.client.post(
      `/api/creator/${creationId}/complete`,
      { title, template }
    );
    return response.data;
  }

  /**
   * Obter criação
   */
  async getCreation(creationId: string) {
    const response = await this.client.get(`/api/creator/${creationId}`);
    return response.data.creation;
  }

  /**
   * Listar criações
   */
  async listCreations(limit = 10) {
    const response = await this.client.get('/api/creator', {
      params: { limit },
    });
    return response.data.creations;
  }

  /**
   * Abandonar criação
   */
  async abandonCreation(creationId: string) {
    const response = await this.client.delete(`/api/creator/${creationId}`);
    return response.data;
  }
}

export default new APIService();
