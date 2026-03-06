import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Brain, Search, Database, Cpu } from 'lucide-react';

const STEPS = [
  { id: 1, label: "Analyzing medical image", icon: Search, color: "bg-blue-500" },
  { id: 2, label: "Extracting lab report data", icon: Database, color: "bg-indigo-500" },
  { id: 3, label: "Understanding symptoms", icon: Brain, color: "bg-purple-500" },
  { id: 4, label: "Running fusion diagnosis model", icon: Cpu, color: "bg-emerald-500" },
];

export default function AnalysisScreen() {
  const [progress, setProgress] = useState([0, 0, 0, 0]);

  useEffect(() => {
    const intervals = STEPS.map((_, index) => {
      return setInterval(() => {
        setProgress(prev => {
          const next = [...prev];
          if (next[index] < 100) {
            // Only progress if previous step is at least 50%
            if (index === 0 || next[index - 1] > 50) {
              next[index] = Math.min(100, next[index] + Math.random() * 15);
            }
          }
          return next;
        });
      }, 200);
    });

    return () => intervals.forEach(clearInterval);
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex flex-col items-center justify-center p-6">
      <div className="max-w-xl w-full">
        <div className="text-center mb-12">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="inline-block mb-6"
          >
            <Cpu className="w-16 h-16 text-[#1E88E5]" />
          </motion.div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">AI Fusion Processing</h1>
          <p className="text-slate-500">Synthesizing multi-modal data for diagnosis...</p>
        </div>

        <div className="space-y-8">
          {STEPS.map((step, idx) => (
            <div key={step.id} className="relative">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className={`${step.color} p-2 rounded-lg text-white`}>
                    <step.icon className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-bold text-slate-700">{step.label}</span>
                </div>
                <span className="text-xs font-mono font-bold text-slate-400">{Math.round(progress[idx])}%</span>
              </div>
              <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                <motion.div 
                  className={`h-full ${step.color}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress[idx]}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-xs text-slate-400 font-medium uppercase tracking-widest animate-pulse">
            Securely processing HIPAA-compliant data
          </p>
        </div>
      </div>
    </div>
  );
}
