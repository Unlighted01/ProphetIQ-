import React, { useState } from 'react';
import SoilStrataCanvas from './SoilStrataCanvas';

interface AIAdvisorProps {
  advice: {
    summary?: string;          // optional — Gemini doesn't always return it
    why_this_price: string;
    red_flags: string[];
    investment_take: string;
    recommendation: string;
    recommendation_reason: string;
    geotechnical_assessment?: string;
    structural_advice?: string;
    regulatory_notes?: string;
    project_timeline?: string;
  } | null;
  isLoading: boolean;
  isError?: boolean;
  city?: string;
  isCondo?: boolean;
}

const RECOMMENDATION_STYLES: Record<string, { badge: string; glow: string; icon: string; label: string }> = {
  BUY:   { badge: 'bg-accent/20 text-accent border-accent/50',    glow: 'shadow-[0_0_20px_rgba(16,185,129,0.25)]',  icon: '✓', label: 'BUY'   },
  HOLD:  { badge: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50', glow: 'shadow-[0_0_20px_rgba(234,179,8,0.25)]',    icon: '⏸', label: 'HOLD'  },
  AVOID: { badge: 'bg-danger/20 text-danger border-danger/50',    glow: 'shadow-[0_0_20px_rgba(239,68,68,0.25)]',   icon: '✕', label: 'AVOID' },
};

const AIAdvisorPanel: React.FC<AIAdvisorProps> = ({ advice, isLoading, isError, city = 'Lingayen', isCondo = false }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'geotechnical' | 'permits'>('overview');

  if (isError) {
    return (
      <div className="glass p-8 rounded-2xl border border-danger/20 bg-danger/5 shadow-[0_8px_32px_rgba(239,68,68,0.1)] relative overflow-hidden animate-fade-in">
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-danger/10 rounded-full blur-[60px] pointer-events-none" />
        <div className="relative z-10 flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-danger/10 border border-danger/25 flex items-center justify-center flex-shrink-0">
            <span className="text-danger font-bold text-lg">⚠️</span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-text-primary leading-tight">AI Advisor</h3>
            <p className="text-[10px] text-danger uppercase tracking-widest font-semibold mt-0.5">Temporarily Offline</p>
          </div>
        </div>
        <p className="text-sm text-text-secondary leading-relaxed relative z-10">
          AI analysis temporarily unavailable. The price prediction and investment metrics above are still accurate.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="glass p-8 rounded-2xl border border-white/5 relative overflow-hidden h-[460px] flex flex-col justify-between">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse" />
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary animate-pulse" />
          <div className="space-y-1">
            <div className="h-3 w-40 bg-white/10 rounded animate-pulse" />
            <div className="h-2 w-24 bg-white/5 rounded animate-pulse" />
          </div>
        </div>
        <div className="space-y-4 my-auto">
          <div className="h-3 bg-white/10 rounded w-full animate-pulse" />
          <div className="h-3 bg-white/10 rounded w-5/6 animate-pulse" />
          <div className="h-3 bg-white/10 rounded w-4/6 animate-pulse" />
          <div className="h-3 bg-white/10 rounded w-5/6 animate-pulse" />
        </div>
        <p className="text-xs text-text-muted animate-pulse">ProphetIQ AI is assessing soil, structural, and financial parameters...</p>
      </div>
    );
  }

  if (!advice) return null;

  const rec = advice.recommendation?.toUpperCase() as keyof typeof RECOMMENDATION_STYLES;
  const style = RECOMMENDATION_STYLES[rec] ?? RECOMMENDATION_STYLES['HOLD'];

  return (
    <div className={`glass p-8 rounded-2xl border border-white/10 animate-fade-in relative overflow-hidden flex flex-col min-h-[460px] h-auto justify-between gap-6 ${style.glow}`}>
      {/* Decorative background blob */}
      <div className="absolute -top-20 -right-20 w-48 h-48 bg-primary/10 rounded-full blur-[60px] pointer-events-none" />

      {/* Header and Tab Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-[0_0_12px_rgba(59,130,246,0.5)] flex-shrink-0">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-text-primary leading-tight">AI Advisor</h3>
            <p className="text-[10px] text-text-muted uppercase tracking-widest font-bold">Engineering &amp; Site Intelligence</p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex bg-white/5 border border-white/10 p-0.5 rounded-lg text-xs self-start sm:self-center">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-md transition-all font-semibold ${activeTab === 'overview' ? 'bg-primary text-white shadow-md' : 'text-text-secondary hover:text-white'}`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('geotechnical')}
            className={`px-3 py-1.5 rounded-md transition-all font-semibold ${activeTab === 'geotechnical' ? 'bg-primary text-white shadow-md' : 'text-text-secondary hover:text-white'}`}
          >
            Geotechnical
          </button>
          <button
            onClick={() => setActiveTab('permits')}
            className={`px-3 py-1.5 rounded-md transition-all font-semibold ${activeTab === 'permits' ? 'bg-primary text-white shadow-md' : 'text-text-secondary hover:text-white'}`}
          >
            Permits &amp; Schedule
          </button>
        </div>
      </div>

      {/* Tab Contents */}
      <div className="flex-grow flex flex-col justify-center relative z-10 min-h-[300px] mt-2">
        
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-4 animate-fade-in flex flex-col justify-between h-full">
            {/* Top row: Recommendation and Reason */}
            <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5 gap-3">
              <p className="text-xs font-semibold text-text-primary leading-relaxed">{advice.recommendation_reason}</p>
              <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest border flex-shrink-0 ${style.badge}`}>
                <span>{style.icon}</span>
                <span>{style.label}</span>
              </div>
            </div>

            {/* Why this price */}
            <div className="bg-white/5 rounded-xl p-3.5 border border-white/5">
              <h4 className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-1">
                💡 Why This Price?
              </h4>
              <p className="text-xs text-text-primary leading-relaxed line-clamp-3">{advice.why_this_price}</p>
            </div>

            {/* Grid for Investment Take & Red Flags */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Investment Take */}
              <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                <h4 className="text-[10px] font-bold text-accent uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                  Investment Take
                </h4>
                <p className="text-xs text-text-primary leading-relaxed line-clamp-3">{advice.investment_take}</p>
              </div>

              {/* Red Flags */}
              <div className="bg-danger/5 rounded-xl p-3 border border-danger/25">
                <h4 className="text-[10px] font-bold text-danger uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-danger animate-pulse" />
                  Red Flags
                </h4>
                <div className="overflow-y-auto max-h-[72px] pr-1 scrollbar-thin">
                  {advice.red_flags && advice.red_flags.length > 0 ? (
                    <ul className="space-y-1">
                      {advice.red_flags.map((flag, i) => (
                        <li key={i} className="text-[11px] text-text-primary flex items-start gap-1.5">
                          <span className="text-danger flex-shrink-0">▸</span>
                          <span className="line-clamp-2">{flag}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-text-muted italic">No major red flags detected.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* GEOTECHNICAL TAB */}
        {activeTab === 'geotechnical' && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 animate-fade-in items-start h-full w-full">
            {/* Left Column: Text Assessments */}
            <div className="space-y-4 w-full">
              {/* Geotechnical Assessment Card */}
              <div className="bg-yellow-500/5 rounded-xl p-4 border border-yellow-500/20">
                <h4 className="text-[10px] font-bold text-yellow-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  Geotechnical &amp; Soil Hazards
                </h4>
                <p className="text-xs text-text-primary leading-relaxed">
                  {advice.geotechnical_assessment || "Analyzing local hazard profiles, distance to waterways, and seismic liquefaction probability..."}
                </p>
              </div>

              {/* Structural Advice Card */}
              <div className="bg-blue-500/5 rounded-xl p-4 border border-blue-500/20">
                <h4 className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  Civil &amp; Structural Specs
                </h4>
                <p className="text-xs text-text-primary leading-relaxed">
                  {advice.structural_advice || "Evaluating foundation parameters, structural column reinforcements, and drainage options..."}
                </p>
              </div>
            </div>

            {/* Right Column: 2D Soil Strata Canvas Visualizer */}
            <div className="w-full flex justify-center xl:justify-end">
              <SoilStrataCanvas city={city} isCondo={isCondo} />
            </div>
          </div>
        )}

        {/* PERMITS & TIMELINE TAB */}
        {activeTab === 'permits' && (
          <div className="space-y-4 animate-fade-in flex flex-col justify-between h-full">
            {/* Regulatory Card */}
            <div className="bg-white/5 rounded-xl p-4 border border-white/5 flex-grow">
              <h4 className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-2 flex items-center gap-2">
                <svg className="w-3.5 h-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Zoning &amp; Regulatory Bylaws
              </h4>
              <p className="text-xs text-text-primary leading-relaxed">
                {advice.regulatory_notes || "Assessing easement setbacks, municipal zoning ordinances, and environmental clearance permit requirements."}
              </p>
            </div>

            {/* Timeline Card */}
            <div className="bg-emerald-500/5 rounded-xl p-4 border border-emerald-500/20">
              <h4 className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-1.5 flex items-center gap-2">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Project Execution Timeline
              </h4>
              <div className="flex items-center justify-between gap-4">
                <p className="text-xs text-text-primary leading-relaxed flex-grow">
                  Estimated engineering time to completion for this scale of project in Pangasinan.
                </p>
                <div className="flex-shrink-0 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-extrabold text-sm px-4 py-2 rounded-xl text-center shadow-lg">
                  {advice.project_timeline || "6-8 Months"}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AIAdvisorPanel;
