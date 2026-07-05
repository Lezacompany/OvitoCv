/**
 * Serviço de IA - Integração com OpenAI GPT-4
 */

import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface AnalysisPromptParams {
  resumeContent: string;
  targetRole?: string;
}

interface AIResponse {
  overallScore: number;
  scores: {
    structure: number;
    experience: number;
    education: number;
    skills: number;
    summary: number;
    atsCompatibility: number;
  };
  strengths: Array<{ area: string; description: string }>;
  weaknesses: Array<{ area: string; description: string }>;
  recommendations: Array<{
    priority: 'high' | 'medium' | 'low';
    section: string;
    current: string;
    suggestion: string;
    rationale: string;
  }>;
  keywords: {
    found: string[];
    missing: string[];
    suggested: string[];
  };
  atsAnalysis: {
    parseable: boolean;
    issues: string[];
    suggestions: string[];
  };
}

class AIService {
  /**
   * Analisar currículo completo com IA
   */
  async analyzeResume(params: AnalysisPromptParams): Promise<AIResponse> {
    const { resumeContent, targetRole } = params;

    const prompt = `
Você é um especialista em RH, recrutamento e análise de currículos com mais de 15 anos de experiência.

Analise este currículo em português de forma MUITO detalhada e profissional.

${targetRole ? `O candidato está se candidatando para: ${targetRole}` : ''}

CURRÍCULO:
"""
${resumeContent}
"""

IMPORTANTE: Forneça a análise em JSON válido (sem markdown code blocks).

Estrutura esperada:
{
  "overallScore": <0-100>,
  "scores": {
    "structure": <0-100>,
    "experience": <0-100>,
    "education": <0-100>,
    "skills": <0-100>,
    "summary": <0-100>,
    "atsCompatibility": <0-100>
  },
  "strengths": [
    { "area": "...", "description": "..." }
  ],
  "weaknesses": [
    { "area": "...", "description": "..." }
  ],
  "recommendations": [
    {
      "priority": "high|medium|low",
      "section": "structure|experience|education|skills|summary",
      "current": "...",
      "suggestion": "...",
      "rationale": "..."
    }
  ],
  "keywords": {
    "found": ["...", "..."],
    "missing": ["...", "..."],
    "suggested": ["...", "..."]
  },
  "atsAnalysis": {
    "parseable": true/false,
    "issues": ["..."],
    "suggestions": ["..."]
  }
}
    `;

    try {
      const response = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      });

      const content = response.choices[0].message.content;
      if (!content) throw new Error('No response from OpenAI');

      const analysis: AIResponse = JSON.parse(content);
      return analysis;
    } catch (error) {
      console.error('Error analyzing resume with AI:', error);
      throw new Error('Falha ao analisar currículo com IA');
    }
  }

  /**
   * Extrair dados estruturados do currículo
   */
  async extractData(prompt: string): Promise<any> {
    try {
      const response = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.3,
        max_tokens: 2000,
      });

      const content = response.choices[0].message.content;
      if (!content) throw new Error('No response from OpenAI');

      return JSON.parse(content);
    } catch (error) {
      console.error('Error extracting data:', error);
      throw new Error('Falha ao extrair dados');
    }
  }

  /**
   * Gerar sugestões de melhoria para uma seção específica
   */
  async suggestImprovement(
    section: string,
    currentText: string,
    context?: string
  ): Promise<{ suggestions: string[] }> {
    const prompt = `
Você é um especialista em redação de currículos.

Reescreva este texto da seção "${section}" de forma mais impactante.
Adicione números, resultados mensuráveis, action verbs e impacto.

Texto atual:
"${currentText}"

${context ? `Contexto: ${context}` : ''}

Forneça 3 variações, do mais conciso ao mais detalhado.

Retorne em JSON:
{
  "suggestions": ["variação1", "variação2", "variação3"]
}
    `;

    try {
      const response = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.8,
        max_tokens: 800,
      });

      const content = response.choices[0].message.content;
      if (!content) throw new Error('No response from OpenAI');

      return JSON.parse(content);
    } catch (error) {
      console.error('Error generating suggestions:', error);
      throw new Error('Falha ao gerar sugestões');
    }
  }

  /**
   * Otimizar keywords para um cargo específico
   */
  async optimizeKeywords(
    resumeContent: string,
    targetRole: string
  ): Promise<{
    essentialKeywords: string[];
    niceToHave: string[];
    whereToAdd: string;
  }> {
    const prompt = `
Este é um currículo para um candidato em "${targetRole}".

CURRÍCULO:
"""
${resumeContent}
"""

Identifique as keywords CRÍTICAS que estão faltando para esta posição.
Separe em essenciais (must-have) e nice-to-have.

Retorne em JSON:
{
  "essentialKeywords": ["...", "..."],
  "niceToHave": ["...", "..."],
  "whereToAdd": "Sugestão de onde adicionar essas keywords"
}
    `;

    try {
      const response = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.5,
        max_tokens: 600,
      });

      const content = response.choices[0].message.content;
      if (!content) throw new Error('No response from OpenAI');

      return JSON.parse(content);
    } catch (error) {
      console.error('Error optimizing keywords:', error);
      throw new Error('Falha ao otimizar keywords');
    }
  }

  /**
   * Gerar conteúdo de experiência profissional
   */
  async generateExperience(params: {
    company: string;
    position: string;
    description: string;
  }): Promise<string> {
    const { company, position, description } = params;

    const prompt = `
Você é um especialista em redação de currículos.

Crie uma descrição profissional impactante para uma experiência.

Empresa: ${company}
Cargo: ${position}
Descrição breve: ${description}

Retorne um texto com:
- Ações e responsabilidades principais
- Números e resultados mensuráveis
- Action verbs profissionais
- 2-3 bullet points impactantes

Formato:
- Bullet 1
- Bullet 2
- Bullet 3
    `;

    try {
      const response = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 500,
      });

      return response.choices[0].message.content || '';
    } catch (error) {
      console.error('Error generating experience:', error);
      throw new Error('Falha ao gerar experiência');
    }
  }
}

export default new AIService();
