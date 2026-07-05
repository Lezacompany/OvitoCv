/**
 * Página de Análise de Currículo
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResume } from '../context/ResumeContext';
import APIService from '../services/apiService';
import ScoreDisplay from '../components/ScoreDisplay';
import RecommendationsList from '../components/RecommendationsList';
import KeywordsDisplay from '../components/KeywordsDisplay';
import '../styles/Analyzer.css';

const Analyzer: React.FC = () => {
  const [resumeContent, setResumeContent] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { analysis, setAnalysis } = useResume();
  const navigate = useNavigate();

  const handleAnalyze = async () => {
    if (!resumeContent.trim()) {
      setError('Por favor, cole seu currículo');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await APIService.analyzeResume(resumeContent, targetRole);
      setAnalysis(result);
    } catch (err: any) {
      setError(err.message || 'Erro ao analisar currículo');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFromAnalysis = () => {
    if (analysis?.suggestCreation) {
      navigate('/creator');
    }
  };

  return (
    <div className="analyzer-container">
      <header className="analyzer-header">
        <h1>🔍 Análise de Currículo com IA</h1>
        <p>Cole seu currículo e receba uma análise detalhada com sugestões de melhoria</p>
      </header>

      <div className="analyzer-content">
        <div className="input-section">
          <h2>Cole seu Currículo</h2>

          <textarea
            value={resumeContent}
            onChange={(e) => setResumeContent(e.target.value)}
            placeholder="Cole seu currículo aqui (texto completo)..."
            rows={12}
            className="resume-textarea"
          />

          <input
            type="text"
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            placeholder="Cargo alvo (opcional, ex: Software Engineer)"
            className="role-input"
          />

          {error && <div className="error-message">❌ {error}</div>}

          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="btn-analyze"
          >
            {loading ? '⏳ Analisando...' : '🤖 Analisar com IA'}
          </button>
        </div>

        {analysis && (
          <div className="results-section">
            <h2>📊 Resultado da Análise</h2>

            {/* Score Display */}
            <ScoreDisplay
              overallScore={analysis.overallScore}
              scores={analysis.scores}
            />

            {/* Keywords */}
            <KeywordsDisplay keywords={analysis.keywords} />

            {/* Recommendations */}
            <RecommendationsList recommendations={analysis.recommendations} />

            {/* ATS Analysis */}
            <div className="ats-section">
              <h3>🤖 Compatibilidade ATS</h3>
              <div className="ats-info">
                <p>
                  <strong>Compatível:</strong>{' '}
                  {analysis.atsAnalysis?.parseable ? '✅ Sim' : '❌ Não'}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="action-buttons">
              {analysis.suggestCreation && (
                <button
                  onClick={handleCreateFromAnalysis}
                  className="btn-create"
                >
                  ✨ Criar Currículo Otimizado
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analyzer;
