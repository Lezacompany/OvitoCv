# ⭐ Smart Resume Creation - Fluxo Inteligente

## 🎯 Objetivo

Quando um currículo recebe uma avaliação **negativa (score < 60)**, o sistema automaticamente:

1. ✅ Extrai dados estruturados do currículo atual
2. ✅ Aplica melhorias sugeridas pela IA
3. ✅ Permite que o usuário edite e melhore
4. ✅ Gera novo currículo profissional otimizado

---

## 🔄 Fluxo Completo

### Fase 1: Análise & Detecção

```typescript
// 1. Usuário cola currículo
// 2. Backend analisa com IA
// 3. Calcula scores

if (overallScore < 60) {
  // Sugerir criação do zero
  suggestCreation = true;
  extractedData = extractDataFromResume(resumeContent);
}
```

---

### Fase 2: Extração Inteligente de Dados

**O que extrair do currículo atual:**

```json
{
  "personal": {
    "fullName": "...",
    "email": "...",
    "phone": "...",
    "location": "...",
    "linkedin": "..."
  },
  "summary": "...",
  "experience": [
    {
      "company": "...",
      "position": "...",
      "startDate": "...",
      "endDate": "...",
      "description": "...",
      "aiSuggestion": "Versão melhorada pela IA"  // ⭐
    }
  ],
  "education": [
    {
      "school": "...",
      "degree": "...",
      "field": "...",
      "year": "..."
    }
  ],
  "skills": [
    {
      "name": "...",
      "level": "...",
      "suggested": true  // ⭐ Se faltava no original
    }
  ],
  "certifications": [...]
}
```

**Prompt de Extração:**

```typescript
const EXTRACTION_PROMPT = `
Extraia os dados estruturados deste currículo em JSON:

CURRÍCULO:
${resumeContent}

Retorne:
{
  "personal": { fullName, email, phone, location, linkedin },
  "summary": "...",
  "experience": [ { company, position, startDate, endDate, description } ],
  "education": [ { school, degree, field, year } ],
  "skills": [ { name, level } ],
  "certifications": [...]
}
`;
```

---

### Fase 3: IA Gera Sugestões de Melhoria

**Para cada seção, IA sugere melhorias:**

```typescript
const IMPROVEMENT_PROMPT = `
Melhore este texto de currículo de forma PROFISSIONAL e IMPACTANTE:

Texto atual: "${currentText}"

Forneca 3 versões:
1. Mais concisa
2. Equilibrada
3. Mais detalhada

Cada versão deve:
- Ter números e métricas
- Usar action verbs
- Mostrar impacto
- Ser ATS-friendly

Formate como JSON:
{
  "concise": "...",
  "balanced": "...",
  "detailed": "..."
}
`;
```

---

### Fase 4: Interface de Criação Inteligente

**Tela Principal:**

```
┌─────────────────────────────────────────────────┐
│  🔄 Criando Novo Currículo Otimizado            │
│  Baseado em: "Currículo_2024.docx"             │
│  Score Anterior: 45%                            │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ 📋 SEÇÕES A EDITAR                              │
├─────────────────────────────────────────────────┤
│                                                 │
│ 👤 DADOS PESSOAIS                               │
│   ✓ Nome: [João Silva]                          │
│   ✓ Email: [joao@email.com]                     │
│   ✓ Telefone: [+55 11 99999-9999]               │
│   ✓ Localização: [São Paulo, SP]                │
│                                                 │
│ 💼 EXPERIÊNCIA PROFISSIONAL                     │
│   ▼ Tech Corp (2020 - Atual)                    │
│     Cargo: Senior Developer                     │
│     [Descrição]                                 │
│     💡 Sugestão IA:                             │
│     "Liderou equipe de 3 devs em 8 projetos..." │
│     [✓ Aplicar] [⊗ Recusar]                     │
│                                                 │
│   ▼ StartupXYZ (2018 - 2020)                    │
│     ...
│                                                 │
│ 🎓 EDUCAÇÃO                                     │
│   ...
│                                                 │
│ 🔧 HABILIDADES                                  │
│   ✓ Python                                      │
│   ✓ JavaScript                                  │
│   ⚠️ + Sugestão IA: AWS, Docker, CI/CD          │
│   [+ Adicionar keywords]                        │
│                                                 │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ 📄 PREVIEW AO VIVO (Template: Modern)           │
│ [Mostra currículo em tempo real]                │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ [Cancelar] [Salvar Rascunho] [Concluir]         │
└─────────────────────────────────────────────────┘
```

---

### Fase 5: Edição com Sugestões

**Componente de Experiência Profissional:**

```typescript
interface ExperienceEditorProps {
  experience: ExperienceItem;
  aiSuggestion: string;  // ⭐ Sugestão da IA
  onUpdate: (updated: ExperienceItem) => void;
  onApplySuggestion: () => void;  // ⭐
}

function ExperienceEditor({ experience, aiSuggestion, onUpdate, onApplySuggestion }: ExperienceEditorProps) {
  return (
    <div className="experience-editor">
      <input
        value={experience.company}
        onChange={(e) => onUpdate({ ...experience, company: e.target.value })}
        placeholder="Empresa"
      />
      
      <textarea
        value={experience.description}
        onChange={(e) => onUpdate({ ...experience, description: e.target.value })}
        placeholder="Descrição das responsabilidades"
      />
      
      {/* ⭐ Card de Sugestão IA */}
      {aiSuggestion && (
        <div className="ai-suggestion">
          <div className="header">
            <span>💡 Sugestão de IA</span>
            <button onClick={onApplySuggestion}>✓ Aplicar</button>
          </div>
          <p className="suggestion-text">{aiSuggestion}</p>
        </div>
      )}
    </div>
  );
}
```

---

### Fase 6: Comparação Antes/Depois

```
┌─────────────────────────────────────────────────┐
│ 📊 COMPARAÇÃO: ANTES vs DEPOIS                  │
├─────────────────────────────────────────────────┤
│                                                 │
│ EXPERIÊNCIA #1:                                 │
│                                                 │
│ ❌ ANTES:                                       │
│ "Responsável por desenvolvimento de features    │
│  em equipe pequena. Participei de vários       │
│  projetos."                                    │
│                                                 │
│ ✅ DEPOIS:                                      │
│ "Liderou equipe de 3 devs em 8 projetos        │
│  críticos, gerando $1.5M em receita com        │
│  35% ROI. Implementou arquitetura de           │
│  microserviços que reduziu latência em 40%."   │
│                                                 │
│ 📈 Melhoria: +80% em impacto e clareza         │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## 🔌 Endpoints da API

### POST /api/creator/start
Inicia criação baseada em análise negativa.

**Request:**
```json
{
  "analysisId": "analysis_123",
  "sourceResumeId": "resume_456"
}
```

**Response:**
```json
{
  "success": true,
  "creation": {
    "id": "creation_789",
    "extractedData": {...},
    "aiSuggestions": [...],
    "status": "in_progress"
  }
}
```

---

### PUT /api/creator/:id/update
Atualiza dados durante criação.

**Request:**
```json
{
  "currentData": {...},
  "section": "experience"
}
```

---

### POST /api/creator/:id/apply-suggestion
Aplica sugestão de IA.

**Request:**
```json
{
  "section": "experience",
  "index": 0,
  "suggestionType": "balanced"
}
```

---

### POST /api/creator/:id/complete
Concui criação e salva novo currículo.

**Request:**
```json
{
  "title": "Novo Currículo 2024",
  "template": "modern"
}
```

**Response:**
```json
{
  "success": true,
  "resume": {
    "id": "resume_new_123",
    "title": "Novo Currículo 2024"
  },
  "stats": {
    "sectionsImproved": 4,
    "suggestionsApplied": 8,
    "estimatedScoreIncrease": "+25%"
  }
}
```

---

## 🤖 Prompts Utilizados

### 1. Extração de Dados

```typescript
const EXTRACT_DATA_PROMPT = `
Extraia dados estruturados deste currículo.
Forneça JSON valido.
`;
```

### 2. Melhoria por Seção

```typescript
const IMPROVE_SECTION_PROMPT = `
Melhore este texto de currículo de forma profissional.
Forneca 3 versões: concise, balanced, detailed.
`;
```

### 3. Sugestão de Keywords

```typescript
const SUGGEST_KEYWORDS_PROMPT = `
Este currículo é para um candidato em "${role}".
Sugira keywords que faltam.
`;
```

---

## 📊 Métricas & Analytics

```typescript
interface CreationStats {
  // Quantas seções foram melhoradas
  sectionsImproved: number;
  
  // Quantas sugestões de IA foram aplicadas
  suggestionsApplied: number;
  
  // Tempo gasto no editor
  timeSpent: number;  // em minutos
  
  // Estimativa de melhoria no score
  estimatedScoreIncrease: number;  // 0-100
  
  // Template escolhido
  templateUsed: string;
  
  // Comparação antes/depois
  before: {
    score: number;
    keywords: number;
  };
  after: {
    score: number;
    keywords: number;
  };
}
```

---

## 🎨 UI/UX Considerações

✅ **Do:**
- Mostrar sugestões de IA de forma clara
- Permitir aplicar/recusar com 1 clique
- Preview ao vivo em tempo real
- Histórico de edições
- Comparação antes/depois
- Indicadores visuais de melhoria

❌ **Não fazer:**
- Forçar aplicação de sugestões
- Sobrecarregar com muitas opções
- Texto pequeno em mobile
- Sem salvamento automático
- Sem forma de voltar/desfazer

---

## 🚀 Roadmap

- [ ] Análise de vídeo currículo
- [ ] Comparação com outros candidatos
- [ ] Integração LinkedIn
- [ ] Tradução automática
- [ ] Templates adicionais
- [ ] Análise de compatibilidade com vagas

---

**Última atualização:** Julho 2024
