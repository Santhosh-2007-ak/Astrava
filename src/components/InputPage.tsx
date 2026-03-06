import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Upload, FileText, Activity, Check, X, Image as ImageIcon, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { Document, Page, pdfjs } from 'react-pdf';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

interface InputPageProps {
  onAnalyze: (data: any) => void;
}

const COMMON_SYMPTOMS = [
  "Fever", "Cough", "Chest Pain", "Shortness of Breath", 
  "Fatigue", "Headache", "Nausea", "Sore Throat"
];

export default function InputPage({ onAnalyze }: InputPageProps) {
  const [image, setImage] = useState<File | null>(null);
  const [report, setReport] = useState<File | null>(null);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [additionalSymptoms, setAdditionalSymptoms] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleReportChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setReport(e.target.files[0]);
    }
  };

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptom) ? prev.filter(s => s !== symptom) : [...prev, symptom]
    );
  };

  const handleSubmit = () => {
    onAnalyze({
      image,
      report,
      symptoms: selectedSymptoms,
      additionalSymptoms
    });
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-slate-900">Patient Data Input</h1>
          <p className="text-slate-500">Provide medical records and symptoms for AI analysis</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Card 1: Medical Image Upload */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-50 p-2 rounded-lg">
                <ImageIcon className="w-5 h-5 text-[#1E88E5]" />
              </div>
              <h2 className="font-bold text-lg">Medical Image</h2>
            </div>
            
            <div className="relative group">
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${imagePreview ? 'border-[#1E88E5] bg-blue-50' : 'border-slate-200 hover:border-[#1E88E5] hover:bg-slate-50'}`}>
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="max-h-48 mx-auto rounded-lg shadow-md" />
                ) : (
                  <>
                    <Upload className="w-10 h-10 text-slate-300 mx-auto mb-4" />
                    <p className="text-sm font-medium text-slate-600">Upload X-ray, CT, or MRI</p>
                    <p className="text-xs text-slate-400 mt-1">Drag and drop or click to browse</p>
                  </>
                )}
              </div>
            </div>
            {image && (
              <div className="mt-4 flex items-center justify-between bg-slate-50 p-3 rounded-xl">
                <span className="text-xs font-medium text-slate-600 truncate max-w-[150px]">{image.name}</span>
                <button onClick={() => {setImage(null); setImagePreview(null);}} className="text-slate-400 hover:text-red-500">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </motion.div>

          {/* Card 2: Symptoms Input */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-50 p-2 rounded-lg">
                <Activity className="w-5 h-5 text-[#1E88E5]" />
              </div>
              <h2 className="font-bold text-lg">Symptoms</h2>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-6">
              {COMMON_SYMPTOMS.map(symptom => (
                <button
                  key={symptom}
                  onClick={() => toggleSymptom(symptom)}
                  className={`flex items-center gap-2 p-2 rounded-xl text-sm transition-all border ${
                    selectedSymptoms.includes(symptom) 
                    ? 'bg-blue-50 border-[#1E88E5] text-[#1E88E5] font-medium' 
                    : 'bg-white border-slate-100 text-slate-600 hover:border-slate-200'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                    selectedSymptoms.includes(symptom) ? 'bg-[#1E88E5] border-[#1E88E5]' : 'border-slate-300'
                  }`}>
                    {selectedSymptoms.includes(symptom) && <Check className="w-3 h-3 text-white" />}
                  </div>
                  {symptom}
                </button>
              ))}
            </div>

            <label className="block text-sm font-medium text-slate-700 mb-2">Additional Details</label>
            <textarea
              value={additionalSymptoms}
              onChange={(e) => setAdditionalSymptoms(e.target.value)}
              placeholder="Describe other symptoms or medical history..."
              className="w-full h-24 p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-100 focus:border-[#1E88E5] outline-none text-sm resize-none"
            />
          </motion.div>

          {/* Card 3: Lab Report Upload */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-50 p-2 rounded-lg">
                <FileText className="w-5 h-5 text-[#1E88E5]" />
              </div>
              <h2 className="font-bold text-lg">Lab Report</h2>
            </div>

            <div className="relative group">
              <input 
                type="file" 
                accept="image/*,application/pdf" 
                onChange={handleReportChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${report ? 'border-[#1E88E5] bg-blue-50' : 'border-slate-200 hover:border-[#1E88E5] hover:bg-slate-50'}`}>
                {report ? (
                  <div className="flex flex-col items-center">
                    <FileText className="w-12 h-12 text-[#1E88E5] mb-2" />
                    <p className="text-sm font-bold text-slate-700 truncate max-w-[200px]">{report.name}</p>
                    <p className="text-xs text-slate-500 mt-1">Ready for OCR analysis</p>
                    {report.type === 'application/pdf' && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); setShowPdfPreview(true); }}
                        className="mt-4 flex items-center gap-2 text-xs font-bold text-[#1E88E5] bg-white px-3 py-1.5 rounded-lg shadow-sm border border-blue-100 hover:bg-blue-50 transition-all"
                      >
                        <Eye className="w-3 h-3" />
                        View PDF
                      </button>
                    )}
                  </div>
                ) : (
                  <>
                    <Upload className="w-10 h-10 text-slate-300 mx-auto mb-4" />
                    <p className="text-sm font-medium text-slate-600">Upload PDF or Image</p>
                    <p className="text-xs text-slate-400 mt-1">Blood work, pathology, etc.</p>
                  </>
                )}
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">WBC Count</span>
                <span className="font-mono text-slate-400 italic">Auto-extracting...</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Hemoglobin</span>
                <span className="font-mono text-slate-400 italic">Auto-extracting...</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Platelets</span>
                <span className="font-mono text-slate-400 italic">Auto-extracting...</span>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="mt-12 flex justify-center">
          <button 
            onClick={handleSubmit}
            className="bg-[#1E88E5] text-white px-12 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all flex items-center gap-3"
          >
            <Activity className="w-6 h-6" />
            Run AI Fusion Analysis
          </button>
        </div>
      </div>

      {/* PDF Preview Modal */}
      <AnimatePresence>
        {showPdfPreview && report && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-4xl h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-50 p-2 rounded-lg">
                    <FileText className="w-5 h-5 text-[#1E88E5]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{report.name}</h3>
                    <p className="text-xs text-slate-500">Page {pageNumber} of {numPages || '...'}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowPdfPreview(false)}
                  className="p-2 hover:bg-slate-100 rounded-xl transition-all"
                >
                  <X className="w-6 h-6 text-slate-400" />
                </button>
              </div>

              <div className="flex-1 overflow-auto bg-slate-100 p-8 flex justify-center">
                <div className="shadow-2xl bg-white rounded-lg overflow-hidden">
                  <Document
                    file={report}
                    onLoadSuccess={onDocumentLoadSuccess}
                    loading={
                      <div className="flex flex-col items-center p-20">
                        <Activity className="w-10 h-10 text-[#1E88E5] animate-spin mb-4" />
                        <p className="text-slate-500 font-medium">Loading PDF document...</p>
                      </div>
                    }
                  >
                    <Page 
                      pageNumber={pageNumber} 
                      width={Math.min(window.innerWidth * 0.8, 800)}
                      renderTextLayer={true}
                      renderAnnotationLayer={true}
                    />
                  </Document>
                </div>
              </div>

              <div className="p-6 border-t border-slate-100 bg-white flex items-center justify-center gap-6">
                <button 
                  disabled={pageNumber <= 1}
                  onClick={() => setPageNumber(prev => prev - 1)}
                  className="p-2 rounded-xl border border-slate-200 disabled:opacity-30 hover:bg-slate-50 transition-all"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <span className="text-sm font-bold text-slate-700">
                  Page {pageNumber} / {numPages}
                </span>
                <button 
                  disabled={pageNumber >= (numPages || 1)}
                  onClick={() => setPageNumber(prev => prev + 1)}
                  className="p-2 rounded-xl border border-slate-200 disabled:opacity-30 hover:bg-slate-50 transition-all"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
