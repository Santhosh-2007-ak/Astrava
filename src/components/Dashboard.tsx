import React from 'react';
import { motion } from 'motion/react';
import { 
  AlertTriangle, CheckCircle, Info, 
  TrendingUp, Activity, FileText, 
  Stethoscope, Thermometer, Clock, MessageSquare, Send, X,
  Eye, ChevronLeft, ChevronRight
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer,
  Cell
} from 'recharts';
import { Document, Page, pdfjs } from 'react-pdf';
import { AnimatePresence } from 'motion/react';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

interface Diagnosis {
  name: string;
  confidence: number;
  risk: string;
}

interface DashboardProps {
  results: {
    diagnoses: Diagnosis[];
    explanation: string;
    recommendations: string[];
    labFindings: { WBC: string; Hemoglobin: string; Platelets: string };
    heatmapDescription: string;
  };
  imagePreview: string | null;
  reportFile: File | null;
  onViewHistory: () => void;
}

export default function Dashboard({ results, imagePreview, reportFile, onViewHistory }: DashboardProps) {
  const [isChatOpen, setIsChatOpen] = React.useState(false);
  const [chatInput, setChatInput] = React.useState("");
  const [chatMessages, setChatMessages] = React.useState([
    { role: 'ai', text: "Hello! I'm your MedFusion AI assistant. How can I help you understand these results?" }
  ]);
  const [showPdfPreview, setShowPdfPreview] = React.useState(false);
  const [numPages, setNumPages] = React.useState<number | null>(null);
  const [pageNumber, setPageNumber] = React.useState(1);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    setChatMessages(prev => [...prev, { role: 'user', text: chatInput }]);
    setChatInput("");
    // Simulated AI response
    setTimeout(() => {
      setChatMessages(prev => [...prev, { role: 'ai', text: "Based on the findings, the primary concern is the lung opacity. Would you like me to explain what that means in simpler terms?" }]);
    }, 1000);
  };

  const mainDiagnosis = results?.diagnoses?.[0];
  const isHighRisk = mainDiagnosis?.risk === 'HIGH';

  if (!results || !results.diagnoses) {
    return (
      <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center p-8">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900 mb-2">Analysis Data Unavailable</h2>
          <p className="text-slate-500 mb-6">We couldn't retrieve the diagnosis data. Please try again.</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-[#1E88E5] text-white px-6 py-2 rounded-xl font-bold"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA] p-8 relative">
      <div className="max-w-7xl mx-auto">
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Diagnosis Dashboard</h1>
            <p className="text-slate-500">AI-generated preliminary medical assessment</p>
          </div>
          <button 
            onClick={onViewHistory}
            className="bg-white text-slate-700 px-6 py-3 rounded-xl font-semibold border border-slate-200 hover:bg-slate-50 transition-all flex items-center gap-2"
          >
            <Clock className="w-4 h-4" />
            Patient History
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
          {/* LEFT PANEL: Medical Image & Heatmap */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-4 bg-white p-6 rounded-3xl shadow-sm border border-slate-100"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-lg flex items-center gap-2">
                <Activity className="w-5 h-5 text-[#1E88E5]" />
                Image Analysis
              </h2>
              <span className="text-xs font-bold text-slate-400 uppercase">Grad-CAM Heatmap</span>
            </div>
            
            <div className="relative rounded-2xl overflow-hidden bg-slate-900 aspect-square mb-4">
              {imagePreview ? (
                <>
                  <img src={imagePreview} alt="Medical Scan" className="w-full h-full object-cover opacity-80" />
                  {/* Simulated Heatmap Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500/40 via-yellow-400/20 to-transparent mix-blend-overlay animate-pulse" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-red-600/30 rounded-full blur-3xl" />
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-500">
                  No image provided
                </div>
              )}
            </div>
            
            <div className="bg-blue-50 p-4 rounded-2xl">
              <p className="text-xs text-[#1E88E5] font-medium leading-relaxed">
                <Info className="w-4 h-4 inline mr-2 mb-1" />
                {results.heatmapDescription || "AI detected significant patterns in the highlighted regions consistent with the primary diagnosis."}
              </p>
            </div>
          </motion.div>

          {/* CENTER PANEL: Diagnosis Results */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-5 bg-white p-6 rounded-3xl shadow-sm border border-slate-100"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-bold text-lg flex items-center gap-2">
                <BrainIcon className="w-5 h-5 text-[#1E88E5]" />
                AI Diagnosis
              </h2>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-bold text-green-600 uppercase">Confidence High</span>
              </div>
            </div>

            <div className="space-y-6 mb-8">
              {results.diagnoses?.map((diag, idx) => (
                <div key={diag.name} className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`font-bold ${idx === 0 ? 'text-xl text-slate-900' : 'text-slate-500'}`}>
                      {diag.name}
                    </span>
                    <span className={`font-mono font-bold ${idx === 0 ? 'text-[#1E88E5]' : 'text-slate-400'}`}>
                      {diag.confidence}%
                    </span>
                  </div>
                  <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${diag.confidence}%` }}
                      className={`h-full ${idx === 0 ? 'bg-[#1E88E5]' : 'bg-slate-300'}`}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="h-64 mt-8">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={results.diagnoses || []}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                  <YAxis hide />
                  <Tooltip 
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="confidence" radius={[8, 8, 0, 0]}>
                    {(results.diagnoses || []).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? '#1E88E5' : '#cbd5e1'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* RIGHT PANEL: Risk & Lab Findings */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-3 space-y-8"
          >
            <div className={`p-6 rounded-3xl border ${isHighRisk ? 'bg-red-50 border-red-100' : 'bg-emerald-50 border-emerald-100'}`}>
              <div className="flex items-center justify-between mb-4">
                <h2 className={`font-bold ${isHighRisk ? 'text-red-700' : 'text-emerald-700'}`}>Risk Status</h2>
                {isHighRisk ? <AlertTriangle className="text-red-600" /> : <CheckCircle className="text-emerald-600" />}
              </div>
              <div className={`text-4xl font-black mb-2 ${isHighRisk ? 'text-red-600' : 'text-emerald-600'}`}>
                {mainDiagnosis?.risk || 'LOW'}
              </div>
              {isHighRisk && (
                <div className="mt-4 bg-white/50 p-3 rounded-xl border border-red-200">
                  <p className="text-xs text-red-800 font-bold flex items-center gap-2">
                    ⚠ URGENT CASE DETECTED
                  </p>
                  <p className="text-[10px] text-red-700 mt-1">Immediate medical attention recommended.</p>
                </div>
              )}
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
              <h2 className="font-bold text-lg mb-6 flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#1E88E5]" />
                Lab Findings
              </h2>
              <div className="space-y-4">
                <LabItem label="WBC Count" value={results.labFindings?.WBC || 'N/A'} />
                <LabItem label="Hemoglobin" value={results.labFindings?.Hemoglobin || 'N/A'} />
                <LabItem label="Platelets" value={results.labFindings?.Platelets || 'N/A'} />
              </div>
              {reportFile && reportFile.type === 'application/pdf' && (
                <button 
                  onClick={() => setShowPdfPreview(true)}
                  className="mt-6 w-full flex items-center justify-center gap-2 text-xs font-bold text-[#1E88E5] bg-blue-50 py-3 rounded-xl border border-blue-100 hover:bg-blue-100 transition-all"
                >
                  <Eye className="w-4 h-4" />
                  View Original Report
                </button>
              )}
            </div>
          </motion.div>
        </div>

        {/* BOTTOM SECTION: Explanation & Recommendations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100"
          >
            <h2 className="font-bold text-xl mb-6 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-[#1E88E5]" />
              AI Reasoning & Explanation
            </h2>
            <div className="prose prose-slate max-w-none">
              <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                {results.explanation}
              </p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100"
          >
            <h2 className="font-bold text-xl mb-6 flex items-center gap-2">
              <Stethoscope className="w-6 h-6 text-[#1E88E5]" />
              Doctor Recommendations
            </h2>
            <div className="space-y-4">
              {(results.recommendations || []).map((rec, i) => (
                <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="bg-white p-2 rounded-lg shadow-sm">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                  </div>
                  <p className="text-slate-700 font-medium">{rec}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Floating Chatbot */}
      <div className="fixed bottom-8 right-8 z-50">
        {!isChatOpen ? (
          <button 
            onClick={() => setIsChatOpen(true)}
            className="bg-[#1E88E5] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform"
          >
            <MessageSquare className="w-6 h-6" />
          </button>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="bg-white w-80 h-96 rounded-3xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden"
          >
            <div className="bg-[#1E88E5] p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BrainIcon className="w-4 h-4" />
                <span className="font-bold text-sm">MedFusion AI Assistant</span>
              </div>
              <button onClick={() => setIsChatOpen(false)}><X className="w-4 h-4" /></button>
            </div>
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50">
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl text-xs ${
                    msg.role === 'user' ? 'bg-[#1E88E5] text-white rounded-tr-none' : 'bg-white text-slate-700 shadow-sm rounded-tl-none'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-3 bg-white border-t border-slate-100 flex gap-2">
              <input 
                type="text" 
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask about your diagnosis..."
                className="flex-1 bg-slate-100 rounded-xl px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-blue-400"
              />
              <button 
                onClick={handleSendMessage}
                className="bg-[#1E88E5] text-white p-2 rounded-xl"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* PDF Preview Modal */}
      <AnimatePresence>
        {showPdfPreview && reportFile && (
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
                    <h3 className="font-bold text-slate-900">{reportFile.name}</h3>
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
                    file={reportFile}
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

function LabItem({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
      <span className="text-sm text-slate-500 font-medium">{label}</span>
      <span className="text-sm text-slate-900 font-bold font-mono">{value}</span>
    </div>
  );
}

function BrainIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-1.04Z" />
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-1.04Z" />
    </svg>
  );
}
