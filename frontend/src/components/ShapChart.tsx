'use client';

import React from 'react';

interface ShapFeature {
  feature: string;
  impact: number;
}

interface ShapChartProps {
  features: ShapFeature[];
}

// Clean up raw feature names from the model
function formatFeatureName(name: string): string {
  return name
    .replace(/_/g, ' ')
    .replace(/\(sqm\)/g, '(sqm)')
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .replace('Iscondo', 'Is Condo')
    .replace('Sqm', 'sqm');
}

const ShapChart: React.FC<ShapChartProps> = ({ features }) => {
  if (!features || features.length === 0) return null;

  const maxImpact = Math.max(...features.map((f) => Math.abs(f.impact)));

  return (
    <div className="glass p-8 rounded-2xl animate-fade-in border border-border-color shadow-2xl relative overflow-hidden" style={{ animationDelay: '0.2s' }}>
      <div className="absolute top-0 left-0 w-20 h-1 bg-gradient-to-r from-primary to-transparent" />
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-border-color/30 font-headers">
        <div>
          <h3 className="text-lg font-bold text-on-surface tracking-tight uppercase">
            Model <span className="text-gradient">Drivers</span>
          </h3>
          <p className="text-[9px] text-on-faint uppercase tracking-widest mt-0.5">
            XGBoost Feature Attribution
          </p>
        </div>
        <div className="flex gap-4 text-[9px] font-bold uppercase tracking-wider font-mono">
          <span className="flex items-center gap-1.5 text-danger">
            <span className="inline-block w-2.5 h-1 rounded-sm bg-danger" />
            Negative
          </span>
          <span className="flex items-center gap-1.5 text-accent">
            <span className="inline-block w-2.5 h-1 rounded-sm bg-accent" />
            Positive
          </span>
        </div>
      </div>

      {/* Bars */}
      <div className="space-y-3">
        {features.slice(0, 8).map((f, idx) => {
          const isPositive = f.impact > 0;
          const barWidth = (Math.abs(f.impact) / maxImpact) * 100;
          
          // Next-generation gradient styles
          const colorClass = isPositive 
            ? 'bg-gradient-to-r from-accent to-emerald-400/30' 
            : 'bg-gradient-to-r from-danger to-rose-400/30';
          const textColor = isPositive ? 'text-accent' : 'text-danger';
          const borderGlow = isPositive ? 'hover:border-accent/30' : 'hover:border-danger/30';
          const indicatorBg = isPositive 
            ? 'bg-accent/[0.04] hover:bg-accent/[0.08]' 
            : 'bg-danger/[0.04] hover:bg-danger/[0.08]';

          return (
            <div
              key={idx}
              className={`rounded-xl px-4 py-3.5 ${indicatorBg} border border-border-color/50 transition-all duration-300 ${borderGlow}`}
              style={{ animationDelay: `${idx * 80}ms` }}
            >
              <div className="flex justify-between items-center mb-2 font-headers text-xs font-bold uppercase tracking-wider">
                <span className="text-on-muted truncate max-w-[60%]">
                  {formatFeatureName(f.feature)}
                </span>
                <span className={`${textColor} tabular-nums font-mono font-bold text-[11px]`}>
                  {isPositive ? '+' : '-'}₱{Math.abs(f.impact).toLocaleString('en-PH', { maximumFractionDigits: 0 })}
                </span>
              </div>

              {/* High-fidelity glowing bar track */}
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                <div
                  className={`h-full rounded-full ${colorClass} transition-all duration-700 ease-out`}
                  style={{
                    width: `${barWidth}%`,
                    transitionDelay: `${idx * 60 + 200}ms`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-[9px] text-on-faint uppercase font-bold tracking-wider font-headers mt-5 pt-4 border-t border-border-color/30">
        *Attribution indices are computed dynamically via SHAP values, tracing how parameters shift prediction deviation from global base values.
      </p>
    </div>
  );
};

export default ShapChart;
