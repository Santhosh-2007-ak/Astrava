import React from 'react';
import { motion } from 'motion/react';
import { Calendar, ArrowLeft, ChevronRight, FileText, Activity } from 'lucide-react';

interface HistoryPageProps {
  onBack: () => void;
}

const HISTORY_DATA = [
  { date: "Current", diagnosis: "Possible infection detected", type: "Pneumonia", risk: "HIGH", color: "text-red-600" },
  { date: "Aug 2024", diagnosis: "Pneumonia", type: "Bacterial", risk: "MEDIUM", color: "text-orange-600" },
  { date: "Jan 2023", diagnosis: "Bronchitis", type: "Viral", risk: "LOW", color: "text-emerald-600" },
  { date: "Nov 2021", diagnosis: "Common Cold", type: "Viral", risk: "LOW", color: "text-emerald-600" },
];

export default function HistoryPage({ onBack }: HistoryPageProps) {
  return (
    <div className="min-h-screen bg-[#F5F7FA] p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex items-center gap-4 mb-12">
          <button 
            onClick={onBack}
            className="p-3 bg-white rounded-2xl border border-slate-200 hover:bg-slate-50 transition-all text-slate-600"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Patient History</h1>
            <p className="text-slate-500">Timeline of previous AI diagnoses and medical records</p>
          </div>
        </header>

        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-slate-200" />

          <div className="space-y-12">
            {HISTORY_DATA.map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="relative pl-20"
              >
                {/* Timeline Dot */}
                <div className={`absolute left-[26px] top-1.5 w-4 h-4 rounded-full border-4 border-[#F5F7FA] z-10 ${idx === 0 ? 'bg-[#1E88E5] scale-125' : 'bg-slate-300'}`} />
                
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition-shadow cursor-pointer group">
                  <div className="flex items-center gap-6">
                    <div className="bg-slate-50 p-4 rounded-2xl">
                      <Calendar className="w-6 h-6 text-slate-400" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{item.date}</div>
                      <h3 className="text-xl font-bold text-slate-900 mb-1">{item.diagnosis}</h3>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-slate-500 flex items-center gap-1">
                          <Activity className="w-3 h-3" />
                          {item.type}
                        </span>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 ${item.color}`}>
                          {item.risk} RISK
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <button className="flex items-center gap-2 text-sm font-bold text-[#1E88E5] hover:underline">
                      <FileText className="w-4 h-4" />
                      View Report
                    </button>
                    <ChevronRight className="w-5 h-5 text-slate-300 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mt-16 bg-[#1E88E5] p-8 rounded-3xl text-white flex items-center justify-between overflow-hidden relative">
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-2">Need a detailed summary?</h2>
            <p className="text-blue-100 max-w-md">Generate a comprehensive medical history report for your doctor with one click.</p>
            <button className="mt-6 bg-white text-[#1E88E5] px-6 py-3 rounded-xl font-bold hover:bg-blue-50 transition-all">
              Export PDF Report
            </button>
          </div>
          <Activity className="w-48 h-48 text-white/10 absolute -right-12 -bottom-12" />
        </div>
      </div>
    </div>
  );
}
