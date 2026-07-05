# 🎯 OvitoCv - Avaliador & Criador de Currículos com IA

![OvitoCv](https://img.shields.io/badge/status-development-yellow)
![License](https://img.shields.io/badge/license-MIT-green)
![Version](https://img.shields.io/badge/version-1.0.0-blue)

## 📋 Sobre o Projeto

**OvitoCv** é uma plataforma full-stack de IA para **avaliar**, **otimizar** e **criar** currículos profissionais.

### 🎯 Objetivos Principais

1. **🤖 Avaliação com IA**: Análise profunda do currículo com:
   - Score percentual (0-100%)
   - Feedback detalhado
   - Recomendações de melhoria
   - Análise de palavras-chave (ATS)
   - Identificação de gaps

2. **✍️ Criador Inteligente com IA**: 
   - Se score < 60: Sistema sugere CRIAR DO ZERO
   - Extrai dados do currículo atual
   - Permite edições e melhorias
   - Otimiza com sugestões de IA em tempo real
   - Gera novo currículo profissional

### ✨ Características Principais

- 🎨 **Templates Modernos**: 5+ templates profissionais curados
- 🤖 **IA Integrada**: OpenAI GPT-4 para análise e sugestões
- 📊 **Análise Completa**: Score, feedback, recomendações
- 🔄 **Fluxo Inteligente**: Avaliação → Sugestão → Criação
- 🔍 **Otimização ATS**: Compatibilidade com sistemas de rastreamento
- 💡 **Sugestões em Tempo Real**: Reescrever, adicionar keywords
- 📄 **Geração de PDF**: Exportar em múltiplos estilos
- 👤 **Autenticação Segura**: JWT com refresh tokens
- 💾 **Histórico**: Salvar e acompanhar evoluções
- 📱 **Responsivo**: Desktop e mobile

---

## 🏗️ Arquitetura

```
OvitoCv/
├── frontend/                    # React + TypeScript + Tailwind CSS
│   ├── src/
│   │   ├── components/
│   │   │   ├── Analyzer/        # Avaliador
│   │   │   ├── ResumeCreator/   # Criador inteligente
│   │   │   ├── Editor/          # Editor de currículo
│   │   │   ├── Templates/       # Templates
│   │   │   └── Preview/         # Preview ao vivo
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Analyzer.tsx
│   │   │   ├── Creator.tsx       # ⭐ Nova página
│   │   │   └── History.tsx
│   │   ├── context/
│   │   │   ├── AuthContext.tsx
│   │   │   └── ResumeContext.tsx
│   │   └── App.tsx
│   └── package.json
│
├── backend/                     # Node.js + Express + TypeScript
│   ├── src/
│   │   ├── routes/
│   │   │   ├── auth.ts
│   │   │   ├── resumes.ts
│   │   │   ├── analyzer.ts      # ⭐ Análise
│   │   │   ├── creator.ts       # ⭐ Criação inteligente
│   │   │   └── ai.ts
│   │   ├── controllers/
│   │   │   ├── analyzerController.ts
│   │   │   └── creatorController.ts   # ⭐ Lógica criação
│   │   ├── services/
│   │   │   ├── aiService.ts
│   │   │   ├── evaluationService.ts
│   │   │   ├── extractionService.ts   # ⭐ Extração de dados
│   │   │   ├── creatorService.ts      # ⭐ Lógica criação
│   │   │   └── pdfGenerator.ts
│   │   └── server.ts
│   └── package.json
│
├── docker-compose.yml
├── .env.example
└── docs/
    ├── API.md
    ├── AI_EVALUATION.md
    ├── SMART_CREATION.md       # ⭐ Novo!
    └── SETUP.md
```

---

## 🚀 Quick Start

### 1️⃣ Clonar
```bash
git clone https://github.com/Lezacompany/OvitoCv.git
cd OvitoCv
cp .env.example .env.local
```

### 2️⃣ Configurar .env.local
```env
DATABASE_URL=postgresql://user:password@localhost:5432/ovitocv
JWT_SECRET=your_secret
OPENAI_API_KEY=sk-your-key
```

### 3️⃣ Iniciar
```bash
docker-compose up -d
```

### 4️⃣ Acessar
- 🌐 Frontend: http://localhost:3000
- 🔌 Backend: http://localhost:5000

---

## 🔄 Fluxo Principal: Avaliação + Criação Inteligente

```
┌─────────────────────────────────────────┐
│   USUÁRIO COLA CURRÍCULO ATUAL          │
└──────────────┬──────────────────────────┘
               ↓
┌─────────────────────────────────────────┐
│   IA ANALISA CURRÍCULO                  │
│   - Calcula scores                      │
│   - Extrai informações                  │
│   - Identifica problemas                │
└──────────────┬──────────────────────────┘
               ↓
          ┌────────────┐
          │ Score < 60?│
          └────┬───────┘
           Sim │  Não
               │   └─→ Exibir feedback e recomendações
               ↓
┌─────────────────────────────────────────┐
│   SUGERIR CRIAR NOVO CURRÍCULO          │
│   ✅ Aproveitando dados do atual        │
│   ✅ Com melhorias sugeridas pela IA    │
└──────────────┬──────────────────────────┘
               ↓
          ┌─────────────┐
          │ Usuário     │
          │ Aceita?     │
          └────┬────────┘
           Sim │  Não
               │   └─→ Voltar ao dashboard
               ↓
┌─────────────────────────────────────────┐
│   EXTRAÇÃO INTELIGENTE                  │
│   - Dados do currículo atual            │
│   - Estrutura melhorada                 │
│   - Sugestões de IA pré-preenchidas     │
└──────────────┬──────────────────────────┘
               ↓
┌─────────────────────────────────────────┐
│   EDITOR INTELIGENTE DE CRIAÇÃO         │
│   - Editar dados extraídos              │
│   - Ver sugestões de IA                 │
│   - Preview ao vivo                     │
│   - Aplicar sugestões com 1 clique      │
└──────────────┬──────────────────────────┘
               ↓
┌─────────────────────────────────────────┐
│   REVISAR & SALVAR NOVO CURRÍCULO       │
│   - Preview final                       │
│   - Gerar PDF                           │
│   - Comparar com antigo                 │
└─────────────────────────────────────────┘
```

---

## 🤖 IA Integration Points

### 1️⃣ Avaliação
- OpenAI GPT-4 analisa currículo
- Calcula scores por seção
- Gera recomendações

### 2️⃣ Extração Inteligente
- IA extrai dados estruturados
- Melhora texto automaticamente
- Organiza em seções

### 3️⃣ Sugestões em Tempo Real
- Reescrever experiências
- Adicionar achievements
- Otimizar keywords
- Melhorar redação

---

## 📚 Stack Tecnológico

### Frontend
- React 18 + TypeScript
- Tailwind CSS
- Axios, React Router
- Chart.js, html2pdf.js

### Backend
- Node.js + Express + TypeScript
- Prisma ORM
- PostgreSQL
- **OpenAI API** ⭐
- JWT

---

## 📄 Licença

MIT License - Veja `LICENSE`

---

## 👨‍💻 Desenvolvido por

**Lezacompany** 🚀

---

**Vamos construir currículos extraordinários com IA! 🎉**