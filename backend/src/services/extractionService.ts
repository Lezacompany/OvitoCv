/**
 * Serviço de Extração - Extrai dados estruturados do currículo
 */

import AIService from './aiService';

interface ExtractedResumeData {
  personal: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    linkedin?: string;
    summary?: string;
  };
  experience: Array<{
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
    aiSuggestion?: string;
  }>;
  education: Array<{
    school: string;
    degree: string;
    field: string;
    year: string;
  }>;
  skills: Array<{
    name: string;
    level?: string;
    suggested?: boolean;
  }>;
  certifications?: Array<{
    name: string;
    issuer: string;
    year: string;
  }>;
}

class ExtractionService {
  /**
   * Extrair dados estruturados do currículo com IA
   */
  async extractResumeData(resumeContent: string): Promise<ExtractedResumeData> {
    const prompt = `
Extraia os dados estruturados deste currículo em PORTUGUÊS.
Forneca resposta em JSON válido (sem markdown code blocks).

CURRÍCULO:
"""
${resumeContent}
"""

Retorne EXATAMENTE este JSON:
{
  "personal": {
    "fullName": "nome completo ou vazio",
    "email": "email ou vazio",
    "phone": "telefone ou vazio",
    "location": "cidade/estado ou vazio",
    "linkedin": "URL LinkedIn ou vazio",
    "summary": "resumo profissional ou vazio"
  },
  "experience": [
    {
      "company": "nome da empresa",
      "position": "cargo",
      "startDate": "YYYY-MM ou vazio",
      "endDate": "YYYY-MM ou 'presente'",
      "description": "descrição das responsabilidades"
    }
  ],
  "education": [
    {
      "school": "instituição",
      "degree": "graduação/mestrado/etc",
      "field": "área de estudo",
      "year": "YYYY ou vazio"
    }
  ],
  "skills": [
    {
      "name": "habilidade",
      "level": "iniciante/intermediário/avançado ou vazio"
    }
  ],
  "certifications": [
    {
      "name": "nome do certificado",
      "issuer": "órgão emissor",
      "year": "YYYY ou vazio"
    }
  ]
}
    `;

    try {
      const response = await AIService.extractData(prompt);
      return response;
    } catch (error) {
      console.error('Erro ao extrair dados:', error);
      throw new Error('Falha ao extrair dados do currículo');
    }
  }

  /**
   * Gerar sugestões de melhoria para cada item extraído
   */
  async generateSuggestionsForExtracted(
    extracted: ExtractedResumeData,
    targetRole?: string
  ): Promise<ExtractedResumeData> {
    const improved = JSON.parse(JSON.stringify(extracted));

    // Melhorar experiências profissionais
    if (improved.experience && improved.experience.length > 0) {
      for (let i = 0; i < improved.experience.length; i++) {
        const exp = improved.experience[i];
        const suggestion = await AIService.suggestImprovement(
          'experience',
          exp.description,
          `Cargo: ${exp.position} na ${exp.company}${targetRole ? ` para posição: ${targetRole}` : ''}`
        );
        improved.experience[i].aiSuggestion = suggestion.suggestions[1]; // Versão balanceada
      }
    }

    // Sugerir skills faltando
    if (targetRole) {
      const resumeText = JSON.stringify(extracted);
      const keywordSuggestions = await AIService.optimizeKeywords(resumeText, targetRole);

      // Adicionar keywords sugeridas
      improved.skills = improved.skills || [];
      keywordSuggestions.essentialKeywords.forEach((kw) => {
        if (!improved.skills.some((s: any) => s.name.toLowerCase() === kw.toLowerCase())) {
          improved.skills.push({
            name: kw,
            level: 'intermediário',
            suggested: true,
          });
        }
      });
    }

    return improved;
  }

  /**
   * Validar dados extraídos
   */
  validateExtractedData(data: ExtractedResumeData): {
    valid: boolean;
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validações críticas
    if (!data.personal?.fullName) errors.push('Nome completo é obrigatório');
    if (!data.personal?.email) errors.push('Email é obrigatório');
    if (!data.experience || data.experience.length === 0)
      warnings.push('Nenhuma experiência profissional encontrada');
    if (!data.education || data.education.length === 0)
      warnings.push('Nenhuma educação encontrada');
    if (!data.skills || data.skills.length === 0)
      warnings.push('Nenhuma habilidade encontrada');

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }
}

export default new ExtractionService();
