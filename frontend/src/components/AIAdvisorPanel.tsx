import React from 'react';

interface AIAdvisorProps {
  advice: {
    summary: string;
    why_this_price: string;
    red_flags: string[];
    investment_take: string;
    recommendation: string;
    recommendation_reason: string;
  } | null;
  isLoading: boolean;
}

const AIAdvisorPanel: React.FC<AIAdvisorProps> = ({ advice, isLoading }) => {
  if (isLoading) {
    return (
      <div className="glass p-8 rounded-2xl animate-fade-in mt-6 border border-white/5 relative overflow-hidden">
        {/* Shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent shimmer-animation z-0"></div>
        
        <div className="relative z-10 flex items-center mb-6">
          <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse mr-3"></div>
          <h3 className="text-xl font-bold text-white/50">Gemini AI is analyzing...</h3>
        </div>
        
        <div className="space-y-4">
          <div className="h-4 bg-white/10 rounded w-3/4 animate-pulse"></div>
          <div className="h-4 bg-white/10 rounded w-full animate-pulse"></div>
          <div className="h-4 bg-white/10 rounded w-5/6 animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (!advice) return null;

  // Recommendation Badge Styling
  let badgeColor = "bg-white/10 text-white";
  let badgeGlow = "shadow-none";
  if (advice.recommendation.toUpperCase() === "BUY") {
    badgeColor = "bg-accent/20 text-accent border border-accent/50";
    badgeGlow = "shadow-[0_0_15px_rgba(16,185,129,0.3)]";
  } else if (advice.recommendation.toUpperCase() === "HOLD") {
    badgeColor = "bg-yellow-500/20 text-yellow-400 border border-yellow-500/50";
    badgeGlow = "shadow-[0_0_15px_rgba(234,179,8,0.3)]";
  } else if (advice.recommendation.toUpperCase() === "AVOID") {
    badgeColor = "bg-danger/20 text-danger border border-danger/50";
    badgeGlow = "shadow-[0_0_15px_rgba(239,68,68,0.3)]";
  }

  return (
    <div className="glass p-8 rounded-2xl mt-6 animate-fade-in border border-white/10 relative overflow-hidden">
      {/* Decorative gradient blob */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 rounded-full blur-[60px] pointer-events-none"></div>

      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mr-3 shadow-[0_0_10px_rgba(59,130,246,0.5)]">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight">AI Advisor <span className="text-sm font-normal text-text-muted ml-2">by Gemini</span></h3>
        </div>
        
        <div className={`px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${badgeColor} ${badgeGlow}`}>
          {advice.recommendation}
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <p className="text-text-primary leading-relaxed text-sm">
            <span className="font-semibold text-white">Summary: </span> 
            {advice.summary}
          </p>
        </div>

        <div className="bg-white/5 rounded-xl p-4 border border-white/5">
          <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">Why This Price?</h4>
          <p className="text-sm text-text-primary leading-relaxed">
            {advice.why_this_price}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white/5 rounded-xl p-4 border border-white/5">
            <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2 flex items-center">
              <span className="w-2 h-2 rounded-full bg-primary mr-2"></span>
              Investment Take
            </h4>
            <p className="text-sm text-text-primary leading-relaxed">
              {advice.investment_take}
            </p>
            <p className="text-xs font-medium text-white mt-3 pt-3 border-t border-white/10">
              {advice.recommendation_reason}
            </p>
          </div>

          <div className="bg-danger/5 rounded-xl p-4 border border-danger/20">
            <h4 className="text-xs font-semibold text-danger uppercase tracking-wider mb-2 flex items-center">
              <span className="w-2 h-2 rounded-full bg-danger mr-2"></span>
              Red Flags
            </h4>
            {advice.red_flags.length > 0 ? (
              <ul className="text-sm text-text-primary space-y-2 list-disc list-inside">
                {advice.red_flags.map((flag, i) => (
                  <li key={i}>{flag}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-text-muted italic">No major red flags detected.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAdvisorPanel;
