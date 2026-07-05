/**
 * Componente de Lista de Recomendações
 */

import React from 'react';
import '../styles/Components.css';

interface Recommendation {
  priority: 'high' | 'medium' | 'low';
  section: string;
  current: string;
  suggestion: string;
  rationale: string;
}

interface Props {
  recommendations: Recommendation[];
}

const RecommendationsList: React.FC<Props> = ({ recommendations }) => {
  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return '🔴';
      case 'medium':
        return '🟠';
      case 'low':
        return '🟢';
      default:
        return '⚪';
    }
  };

  const getSectionIcon = (section: string) => {
    switch (section) {
      case 'experience':
        return '💼';
      case 'education':
        return '🎓';
      case 'skills':
        return '🔧';
      case 'summary':
        return '📝';
      case 'structure':
        return '📋';
      default:
        return '📌';
    }
  };

  return (
    <div className="recommendations-section">
      <h3>💡 Recomendações de Melhoria</h3>
      <div className="recommendations-list">
        {recommendations.map((rec, index) => (
          <div key={index} className={`recommendation priority-${rec.priority}`}>
            <div className="rec-header">
              <span className="priority-badge">{getPriorityIcon(rec.priority)}</span>
              <span className="section-badge">{getSectionIcon(rec.section)}</span>
              <span className="section-name">{rec.section}</span>
            </div>

            <div className="rec-content">
              <p className="current">
                <strong>Atual:</strong> "{rec.current}"
              </p>
              <p className="suggestion">
                <strong>Sugestão:</strong> "{rec.suggestion}"
              </p>
              <p className="rationale">
                <strong>Motivo:</strong> {rec.rationale}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendationsList;
