/**
 * Context de Currículo e Análise
 */

import React, { createContext, useContext, useState } from 'react';

interface Analysis {
  id: string;
  overallScore: number;
  scores: {
    structure: number;
    experience: number;
    education: number;
    skills: number;
    summary: number;
    atsCompatibility: number;
  };
  recommendations: any[];
  keywords: {
    found: string[];
    missing: string[];
  };
  suggestCreation: boolean;
}

interface Resume {
  id: string;
  title: string;
  template: string;
  content: any;
  createdAt: string;
}

interface ResumeContextType {
  analysis: Analysis | null;
  setAnalysis: (analysis: Analysis | null) => void;
  resumes: Resume[];
  setResumes: (resumes: Resume[]) => void;
  currentResume: Resume | null;
  setCurrentResume: (resume: Resume | null) => void;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export const ResumeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [currentResume, setCurrentResume] = useState<Resume | null>(null);

  return (
    <ResumeContext.Provider
      value={{
        analysis,
        setAnalysis,
        resumes,
        setResumes,
        currentResume,
        setCurrentResume,
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
};

export const useResume = () => {
  const context = useContext(ResumeContext);
  if (!context) {
    throw new Error('useResume deve ser usado dentro de ResumeProvider');
  }
  return context;
};
