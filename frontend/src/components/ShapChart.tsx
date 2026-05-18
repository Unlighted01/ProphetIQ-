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
    <div className="glass p-8 rounded-2xl animate-fade-in" style={{ animationDelay: '0.2s' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white tracking-tight">
            Price <span className="text-gradient">Drivers</span>
          </h3>
          <p className="text-[10px] text-text-muted uppercase tracking-widest mt-1">
            SHAP Attribution Analysis
          </p>
        </div>
        <div className="flex gap-3 text-[10px] font-bold uppercase tracking-wider">
          <span className="flex items-center gap-1.5 text-danger">
            <span className="inline-block w-2 h-2 rounded-full bg-danger" />
            Negative
          </span>
          <span className="flex items-center gap-1.5 text-accent">
            <span className="inline-block w-2 h-2 rounded-full bg-accent" />
            Positive
          </span>
        </div>
      </div>

      {/* Bars */}
      <div className="space-y-3">
        {features.slice(0, 8).map((f, idx) => {
          const isPositive = f.impact > 0;
          const barWidth = (Math.abs(f.impact) / maxImpact) * 100;
          const color = isPositive ? 'bg-accent' : 'bg-danger';
          const textColor = isPositive ? 'text-accent' : 'text-danger';
          const bgColor = isPositive ? 'bg-accent/10' : 'bg-danger/10';

          return (
            <div
              key={idx}
              className={`rounded-xl px-4 py-3 ${bgColor} border border-white/5 hover:border-white/15 transition-all duration-200`}
              style={{ animationDelay: `${idx * 80}ms` }}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-medium text-text-secondary truncate max-w-[60%]">
                  {formatFeatureName(f.feature)}
                </span>
                <span className={`text-xs font-bold ${textColor} tabular-nums`}>
                  {isPositive ? '+' : ''}₱{Math.abs(f.impact).toLocaleString('en-PH', { maximumFractionDigits: 0 })}
                </span>
              </div>

              {/* Bar track */}
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${color} transition-all duration-700 ease-out`}
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

      <p className="text-[10px] text-text-muted mt-5 pt-4 border-t border-white/5">
        Each bar shows how much that feature pushed the predicted price up or down from the model baseline.
      </p>
    </div>
  );
};

export default ShapChart;
