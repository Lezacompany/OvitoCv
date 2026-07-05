/**
 * Componente de Exibição de Score
 */

import React from 'react';
import '../styles/Components.css';

interface ScoreProps {
  overallScore: number;
  scores: {
    structure: number;
    experience: number;
    education: number;
    skills: number;
    summary: number;
    atsCompatibility: number;
  };
}

const ScoreDisplay: React.FC<ScoreProps> = ({ overallScore, scores }) => {
  const getScoreFeedback = (score: number) => {
    if (score >= 90) return '🌟 Excelente!';
    if (score >= 75) return '✅ Bom';
    if (score >= 60) return '⚠️ Aceitável';
    return '❌ Precisa melhorar';
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return '#10b981';
    if (score >= 75) return '#3b82f6';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="score-container">
      <div className="overall-score">
        <div
          className="score-circle"
          style={{
            borderColor: getScoreColor(overallScore),
            boxShadow: `0 0 20px ${getScoreColor(overallScore)}40`,
          }}
        >
          <span className="score-value">{overallScore}%</span>
        </div>
        <p className="score-label">{getScoreFeedback(overallScore)}</p>
      </div>

      <div className="scores-breakdown">
        {Object.entries(scores).map(([key, value]) => (
          <div key={key} className="score-item">
            <label>
              {key === 'structure' && '📋 Estrutura'}
              {key === 'experience' && '💼 Experiência'}
              {key === 'education' && '🎓 Educação'}
              {key === 'skills' && '🔧 Habilidades'}
              {key === 'summary' && '📝 Resumo'}
              {key === 'atsCompatibility' && '🤖 ATS'}
            </label>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${value}%`,
                  backgroundColor: getScoreColor(value),
                }}
              />
            </div>
            <span className="score-text">{value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScoreDisplay;
