import React from 'react';
import { motion } from 'motion/react';
import { Activity, Shield, Zap, ArrowRight } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
}

export default function LandingPage({ onStart }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-[#F5F7FA] flex flex-col items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl w-full text-center"
      >
        <div className="flex items-center justify-center mb-6">
          <div className="bg-[#1E88E5] p-3 rounded-2xl shadow-lg shadow-blue-200">
            <Activity className="w-12 h-12 text-white" />
          </div>
        </div>
        
        <h1 className="text-6xl font-bold text-slate-900 mb-4 tracking-tight">
          MedFusion <span className="text-[#1E88E5]">AI</span>
        </h1>
        <p className="text-xl text-slate-600 mb-8 font-medium">
          Multi-Modal Medical Diagnosis Platform
        </p>
        
        <p className="text-lg text-slate-500 mb-12 max-w-2xl mx-auto leading-relaxed">
          Analyze medical scans, symptoms, and lab reports using explainable artificial intelligence. 
          Get preliminary diagnosis suggestions with high-precision fusion models.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
            onClick={onStart}
            className="bg-[#1E88E5] text-white px-8 py-4 rounded-xl font-semibold text-lg flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 group"
          >
            Start Diagnosis
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button className="bg-white text-slate-700 px-8 py-4 rounded-xl font-semibold text-lg border border-slate-200 hover:bg-slate-50 transition-all">
            View Demo
          </button>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<Shield className="w-6 h-6 text-[#1E88E5]" />}
            title="Secure & Private"
            desc="HIPAA compliant data processing and encryption."
          />
          <FeatureCard 
            icon={<Zap className="w-6 h-6 text-[#1E88E5]" />}
            title="Real-time Analysis"
            desc="Get results in seconds with our advanced neural networks."
          />
          <FeatureCard 
            icon={<Activity className="w-6 h-6 text-[#1E88E5]" />}
            title="Explainable AI"
            desc="Visual heatmaps and reasoning for every diagnosis."
          />
        </div>
      </motion.div>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm text-left">
      <div className="bg-blue-50 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}
