/**
 * Componente de Exibição de Keywords
 */

import React from 'react';
import '../styles/Components.css';

interface KeywordsProps {
  keywords: {
    found: string[];
    missing: string[];
    suggested?: string[];
  };
}

const KeywordsDisplay: React.FC<KeywordsProps> = ({ keywords }) => {
  return (
    <div className="keywords-section">
      <h3>🔍 Keywords</h3>
      <div className="keywords-grid">
        <div className="keywords-group">
          <h4>✅ Encontradas ({keywords.found.length})</h4>
          <div className="keywords-list">
            {keywords.found.length > 0 ? (
              keywords.found.map((kw, idx) => (
                <span key={idx} className="keyword found">
                  {kw}
                </span>
              ))
            ) : (
              <p className="empty">Nenhuma keyword encontrada</p>
            )}
          </div>
        </div>

        <div className="keywords-group">
          <h4>❌ Faltando ({keywords.missing.length})</h4>
          <div className="keywords-list">
            {keywords.missing.length > 0 ? (
              keywords.missing.map((kw, idx) => (
                <span key={idx} className="keyword missing">
                  {kw}
                </span>
              ))
            ) : (
              <p className="empty">Excelente! Todas as keywords presentes</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KeywordsDisplay;
