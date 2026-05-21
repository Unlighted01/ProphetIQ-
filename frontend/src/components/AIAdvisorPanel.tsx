'use client';

import React, { useState } from 'react';
import SoilStrataCanvas from './SoilStrataCanvas';

interface AIAdvisorProps {
  advice: {
    summary?: string;
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
  BUY:   { badge: 'bg-accent/15 text-accent border-accent/30',    glow: 'hover:shadow-[0_0_20px_rgba(16,185,129,0.15)]',  icon: '✓', label: 'BUY'   },
  HOLD:  { badge: 'bg-warning/15 text-warning border-warning/30', glow: 'hover:shadow-[0_0_20px_rgba(245,158,11,0.15)]',   icon: '⏸', label: 'HOLD'  },
  AVOID: { badge: 'bg-danger/15 text-danger border-danger/30',    glow: 'hover:shadow-[0_0_20px_rgba(244,63,94,0.15)]',   icon: '✕', label: 'AVOID' },
};

const AIAdvisorPanel: React.FC<AIAdvisorProps> = ({ advice, isLoading, isError, city = 'Lingayen', isCondo = false }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'geotechnical' | 'permits'>('overview');

  if (isError) {
    return (
      <div className="glass p-8 rounded-2xl border border-danger/20 bg-danger/[0.03] shadow-[0_8px_32px_rgba(244,63,94,0.08)] relative overflow-hidden animate-fade-in">
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-danger/10 rounded-full blur-[60px] pointer-events-none" />
        <div className="relative z-10 flex items-center gap-3 mb-4 font-headers">
          <div className="w-10 h-10 rounded-xl bg-danger/10 border border-danger/20 flex items-center justify-center flex-shrink-0 animate-telemetry-pulse">
            <span className="text-danger font-bold text-lg">⚠️</span>
          </div>
          <div>
            <h3 className="text-base font-bold text-on-surface uppercase tracking-wider">AI Advisor Panel</h3>
            <p className="text-[9px] text-danger uppercase tracking-widest font-extrabold mt-0.5">Telemetry Offline</p>
          </div>
        </div>
        <p className="text-xs text-on-muted leading-relaxed relative z-10 font-mono uppercase tracking-wider border-t border-border-color/30 pt-3">
          ERROR // Geotechnical and architectural AI models temporarily unresponsive. Price prediction engine and investment spreadsheets are offline for core maintenance.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="glass p-8 rounded-2xl border border-border-color relative overflow-hidden h-[460px] flex flex-col justify-between shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse" />
        <div className="relative z-10 flex items-center gap-3 font-headers">
          <div className="w-9 h-9 rounded-xl bg-white/5 border border-border-color flex items-center justify-center animate-pulse" />
          <div className="space-y-1">
            <div className="h-3 w-32 bg-white/10 rounded animate-pulse" />
            <div className="h-2 w-20 bg-white/5 rounded animate-pulse" />
          </div>
        </div>
        <div className="space-y-4 my-auto">
          <div className="h-3 bg-white/10 rounded w-full animate-pulse" />
          <div className="h-3 bg-white/10 rounded w-5/6 animate-pulse" />
          <div className="h-3 bg-white/10 rounded w-4/6 animate-pulse" />
          <div className="h-3 bg-white/10 rounded w-5/6 animate-pulse" />
        </div>
        <p className="text-[9px] font-mono uppercase tracking-widest text-on-faint animate-pulse">assess_soil_structural_timeline_matrices...</p>
      </div>
    );
  }

  if (!advice) return null;

  const rec = advice.recommendation?.toUpperCase() as keyof typeof RECOMMENDATION_STYLES;
  const style = RECOMMENDATION_STYLES[rec] ?? RECOMMENDATION_STYLES['HOLD'];

  return (
    <div className={`glass p-8 rounded-2xl border border-border-color animate-fade-in relative overflow-hidden flex flex-col min-h-[460px] h-auto justify-between gap-6 shadow-2xl transition-all duration-500 ${style.glow}`}>
      {/* Precision corner details */}
      <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-primary/20" />
      <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-primary/20" />
      
      {/* Decorative background blob */}
      <div className="absolute -top-20 -right-20 w-48 h-48 bg-primary/5 rounded-full blur-[60px] pointer-events-none" />

      {/* Header and Tab Selector */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-2 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/10 flex-shrink-0">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div className="font-headers">
            <h3 className="text-base font-bold text-on-surface uppercase tracking-wider">AI Site Advisor</h3>
            <p className="text-[9px] text-on-faint uppercase tracking-widest font-extrabold mt-0.5">Structural &amp; Civil Diagnostics</p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex p-1 rounded-xl bg-bg-deep/45 border border-border-color text-xs self-start md:self-center font-headers">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3.5 py-2 rounded-lg transition-all font-bold uppercase tracking-wider text-[9px] ${activeTab === 'overview' ? 'bg-primary text-white shadow-md' : 'text-on-muted hover:text-on-surface hover:bg-white/5'}`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('geotechnical')}
            className={`px-3.5 py-2 rounded-lg transition-all font-bold uppercase tracking-wider text-[9px] ${activeTab === 'geotechnical' ? 'bg-primary text-white shadow-md' : 'text-on-muted hover:text-on-surface hover:bg-white/5'}`}
          >
            Geotechnical
          </button>
          <button
            onClick={() => setActiveTab('permits')}
            className={`px-3.5 py-2 rounded-lg transition-all font-bold uppercase tracking-wider text-[9px] ${activeTab === 'permits' ? 'bg-primary text-white shadow-md' : 'text-on-muted hover:text-on-surface hover:bg-white/5'}`}
          >
            Regulatory
          </button>
        </div>
      </div>

      {/* Tab Contents */}
      <div className="flex-grow flex flex-col justify-center relative z-10 min-h-[300px]">
        
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-4 animate-fade-in flex flex-col justify-between h-full">
            {/* Top row: Recommendation and Reason */}
            <div className="flex justify-between items-center bg-bg-surface/50 p-4 rounded-xl border border-border-color gap-4">
              <p className="text-xs font-semibold text-on-surface leading-relaxed">{advice.recommendation_reason}</p>
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest border font-headers flex-shrink-0 ${style.badge}`}>
                <span className="font-mono">{style.icon}</span>
                <span>{style.label}</span>
              </div>
            </div>

            {/* Why this price */}
            <div className="bg-bg-surface/30 rounded-xl p-4 border border-border-color/50">
              <h4 className="text-[9px] font-bold text-on-faint uppercase tracking-wider font-headers mb-1.5">
                📊 Model Prediction Insights
              </h4>
              <p className="text-xs text-on-muted leading-relaxed line-clamp-3 font-medium">{advice.why_this_price}</p>
            </div>

            {/* Grid for Investment Take & Red Flags */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Investment Take */}
              <div className="bg-bg-surface/30 rounded-xl p-4 border border-border-color/50">
                <h4 className="text-[9px] font-bold text-accent uppercase tracking-wider font-headers mb-2 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-telemetry-pulse" />
                  Investment Take
                </h4>
                <p className="text-xs text-on-muted leading-relaxed line-clamp-3 font-medium">{advice.investment_take}</p>
              </div>

              {/* Red Flags */}
              <div className="bg-danger/[0.03] rounded-xl p-4 border border-danger/20">
                <h4 className="text-[9px] font-bold text-danger uppercase tracking-wider font-headers mb-2 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-danger animate-telemetry-pulse" />
                  Hazards &amp; Risks
                </h4>
                <div className="overflow-y-auto max-h-[72px] pr-1 scrollbar-none font-medium">
                  {advice.red_flags && advice.red_flags.length > 0 ? (
                    <ul className="space-y-1.5">
                      {advice.red_flags.map((flag, i) => (
                        <li key={i} className="text-[11px] text-on-muted flex items-start gap-1.5">
                          <span className="text-danger flex-shrink-0 font-mono">▸</span>
                          <span className="line-clamp-2">{flag}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-on-faint italic font-headers">No major red flags detected.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* GEOTECHNICAL TAB */}
        {activeTab === 'geotechnical' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in items-center h-full w-full">
            {/* Left Column: Text Assessments */}
            <div className="space-y-4 w-full">
              {/* Geotechnical Assessment Card */}
              <div className="bg-warning/[0.03] rounded-xl p-4 border border-warning/20">
                <h4 className="text-[9px] font-bold text-warning uppercase tracking-wider font-headers mb-2 flex items-center gap-2">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  Geotechnical &amp; Soil Hazards
                </h4>
                <p className="text-xs text-on-muted leading-relaxed font-medium">
                  {advice.geotechnical_assessment || "Analyzing local hazard profiles, distance to waterways, and seismic liquefaction probability..."}
                </p>
              </div>

              {/* Structural Advice Card */}
              <div className="bg-primary/[0.03] rounded-xl p-4 border border-primary/20">
                <h4 className="text-[9px] font-bold text-primary uppercase tracking-wider font-headers mb-2 flex items-center gap-2">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  Civil &amp; Structural Specs
                </h4>
                <p className="text-xs text-on-muted leading-relaxed font-medium">
                  {advice.structural_advice || "Evaluating foundation parameters, structural column reinforcements, and drainage options..."}
                </p>
              </div>
            </div>

            {/* Right Column: 2D Soil Strata Canvas Visualizer */}
            <div className="w-full flex justify-center lg:justify-end">
              <SoilStrataCanvas city={city} isCondo={isCondo} />
            </div>
          </div>
        )}

        {/* REGULATORY TAB */}
        {activeTab === 'permits' && (
          <div className="space-y-4 animate-fade-in flex flex-col justify-between h-full">
            {/* Regulatory Card */}
            <div className="bg-bg-surface/30 rounded-xl p-4 border border-border-color/50 flex-grow">
              <h4 className="text-[9px] font-bold text-on-muted uppercase tracking-wider font-headers mb-2.5 flex items-center gap-2">
                <svg className="w-3.5 h-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Zoning &amp; Regulatory Bylaws
              </h4>
              <p className="text-xs text-on-muted leading-relaxed font-medium">
                {advice.regulatory_notes || "Assessing easement setbacks, municipal zoning ordinances, and environmental clearance permit requirements."}
              </p>
            </div>

            {/* Timeline Card */}
            <div className="bg-accent/[0.03] rounded-xl p-4 border border-accent/20">
              <h4 className="text-[9px] font-bold text-accent uppercase tracking-wider font-headers mb-2 flex items-center gap-2">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Project Execution Timeline
              </h4>
              <div className="flex items-center justify-between gap-4 font-headers">
                <p className="text-xs text-on-muted leading-relaxed flex-grow font-sans font-medium">
                  Estimated civil timeline to build execution for this scale of project in Pangasinan.
                </p>
                <div className="flex-shrink-0 bg-accent/10 border border-accent/20 text-accent font-extrabold text-xs px-4 py-2.5 rounded-xl text-center shadow-lg uppercase tracking-wider font-mono">
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
