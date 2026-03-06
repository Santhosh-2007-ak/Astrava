import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import InputPage from './components/InputPage';
import AnalysisScreen from './components/AnalysisScreen';
import Dashboard from './components/Dashboard';
import HistoryPage from './components/HistoryPage';
import { analyzeMedicalCase } from './services/geminiService';

type Step = 'landing' | 'input' | 'processing' | 'dashboard' | 'history';

export default function App() {
  const [step, setStep] = useState<Step>('landing');
  const [results, setResults] = useState<any>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [reportFile, setReportFile] = useState<File | null>(null);

  const handleStart = () => setStep('input');
  
  const handleAnalyze = async (data: any) => {
    setStep('processing');
    
    if (data.image) {
      setImagePreview(URL.createObjectURL(data.image));
    }
    if (data.report) {
      setReportFile(data.report);
    }

    try {
      const result = await analyzeMedicalCase({
        image: data.image,
        report: data.report,
        symptoms: data.symptoms,
        additionalSymptoms: data.additionalSymptoms
      });
      
      setResults(result);
      // Artificial delay to show processing screen
      setTimeout(() => {
        setStep('dashboard');
      }, 3000);
    } catch (error) {
      console.error("Analysis failed:", error);
      alert(`Analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setStep('input');
    }
  };

  const handleViewHistory = () => setStep('history');
  const handleBackToDashboard = () => setStep('dashboard');

  return (
    <div className="font-sans antialiased text-slate-900">
      {step === 'landing' && <LandingPage onStart={handleStart} />}
      {step === 'input' && <InputPage onAnalyze={handleAnalyze} />}
      {step === 'processing' && <AnalysisScreen />}
      {step === 'dashboard' && results && (
        <Dashboard 
          results={results} 
          imagePreview={imagePreview} 
          reportFile={reportFile}
          onViewHistory={handleViewHistory}
        />
      )}
      {step === 'history' && <HistoryPage onBack={handleBackToDashboard} />}
    </div>
  );
}
