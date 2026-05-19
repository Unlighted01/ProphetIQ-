import React from 'react';

interface AIAdvisorProps {
  advice: {
    summary?: string;          // optional — Gemini doesn't always return it
    why_this_price: string;
    red_flags: string[];
    investment_take: string;
    recommendation: string;
    recommendation_reason: string;
  } | null;
  isLoading: boolean;
  isError?: boolean;
}

const RECOMMENDATION_STYLES: Record<string, { badge: string; glow: string; icon: string; label: string }> = {
  BUY:   { badge: 'bg-accent/20 text-accent border-accent/50',    glow: 'shadow-[0_0_20px_rgba(16,185,129,0.25)]',  icon: '✓', label: 'BUY'   },
  HOLD:  { badge: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50', glow: 'shadow-[0_0_20px_rgba(234,179,8,0.25)]',    icon: '⏸', label: 'HOLD'  },
  AVOID: { badge: 'bg-danger/20 text-danger border-danger/50',    glow: 'shadow-[0_0_20px_rgba(239,68,68,0.25)]',   icon: '✕', label: 'AVOID' },
};

const AIAdvisorPanel: React.FC<AIAdvisorProps> = ({ advice, isLoading, isError }) => {
  if (isError) {
    return (
      <div className="glass p-8 rounded-2xl border border-danger/20 bg-danger/5 shadow-[0_8px_32px_rgba(239,68,68,0.1)] relative overflow-hidden animate-fade-in">
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-danger/10 rounded-full blur-[60px] pointer-events-none" />
        <div className="relative z-10 flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-danger/10 border border-danger/25 flex items-center justify-center flex-shrink-0">
            <span className="text-danger font-bold text-lg">⚠️</span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white leading-tight">AI Advisor</h3>
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
      <div className="glass p-8 rounded-2xl border border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse" />
        <div className="relative z-10 flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary animate-pulse" />
          <div className="space-y-1">
            <div className="h-3 w-40 bg-white/10 rounded animate-pulse" />
            <div className="h-2 w-24 bg-white/5 rounded animate-pulse" />
          </div>
        </div>
        <div className="space-y-3">
          <div className="h-3 bg-white/10 rounded w-full animate-pulse" />
          <div className="h-3 bg-white/10 rounded w-5/6 animate-pulse" />
          <div className="h-3 bg-white/10 rounded w-4/6 animate-pulse" />
        </div>
        <p className="mt-6 text-xs text-text-muted animate-pulse">ProphetIQ AI is analyzing your property...</p>
      </div>
    );
  }

  if (!advice) return null;

  const rec = advice.recommendation?.toUpperCase() as keyof typeof RECOMMENDATION_STYLES;
  const style = RECOMMENDATION_STYLES[rec] ?? RECOMMENDATION_STYLES['HOLD'];

  return (
    <div className={`glass p-8 rounded-2xl border border-white/10 animate-fade-in relative overflow-hidden ${style.glow}`}>
      {/* Decorative blob */}
      <div className="absolute -top-20 -right-20 w-48 h-48 bg-primary/15 rounded-full blur-[60px] pointer-events-none" />

      {/* Header */}
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-[0_0_12px_rgba(59,130,246,0.5)] flex-shrink-0">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white leading-tight">AI Advisor</h3>
          </div>
        </div>

        <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border ${style.badge}`}>
          <span>{style.icon}</span>
          <span>{style.label}</span>
        </div>
      </div>

      {/* Recommendation reason — prominent */}
      <div className="relative z-10 bg-white/5 rounded-xl p-4 border border-white/10 mb-5">
        <p className="text-sm text-white leading-relaxed font-medium">{advice.recommendation_reason}</p>
      </div>

      <div className="space-y-4 relative z-10">
        {/* Why this price */}
        <div className="bg-white/5 rounded-xl p-4 border border-white/5">
          <h4 className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-2">
            💡 Why This Price?
          </h4>
          <p className="text-sm text-text-primary leading-relaxed">{advice.why_this_price}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Investment take */}
          <div className="bg-white/5 rounded-xl p-4 border border-white/5">
            <h4 className="text-[10px] font-bold text-accent uppercase tracking-widest mb-2 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              Investment Take
            </h4>
            <div className="overflow-y-auto max-h-[160px] pr-1">
              <p className="text-sm text-text-primary leading-relaxed">{advice.investment_take}</p>
            </div>
          </div>

          {/* Red flags */}
          <div className="bg-danger/5 rounded-xl p-4 border border-danger/20">
            <h4 className="text-[10px] font-bold text-danger uppercase tracking-widest mb-2 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-danger" />
              Red Flags
            </h4>
            <div className="overflow-y-auto max-h-[160px] pr-1">
              {advice.red_flags && advice.red_flags.length > 0 ? (
                <ul className="space-y-1.5">
                  {advice.red_flags.map((flag, i) => (
                    <li key={i} className="text-sm text-text-primary flex items-start gap-2">
                      <span className="text-danger mt-0.5 flex-shrink-0">▸</span>
                      <span>{flag}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-text-muted italic">No major red flags detected.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAdvisorPanel;
