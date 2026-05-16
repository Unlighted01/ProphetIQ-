'use client';

import React from 'react';

interface ShapFeature {
  feature: string;
  impact: number;
}

interface ShapChartProps {
  features: ShapFeature[];
}

const ShapChart: React.FC<ShapChartProps> = ({ features }) => {
  // Find max impact for scaling
  const maxImpact = Math.max(...features.map(f => Math.abs(f.impact)));

  return (
    <div className="glass p-8 rounded-2xl animate-fade-in" style={{ animationDelay: '0.2s' }}>
      <h3 className="text-xl font-bold mb-6 flex items-center space-x-2">
        <span className="text-gradient">AI Reasoner</span>
        <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-text-secondary uppercase">Explaining Price Variance</span>
      </h3>

      <div className="space-y-4">
        {features.map((f, idx) => {
          const isPositive = f.impact > 0;
          const width = (Math.abs(f.impact) / maxImpact) * 100;
          
          return (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium text-text-secondary">{f.feature}</span>
                <span className={`font-bold ${isPositive ? 'text-accent' : 'text-danger'}`}>
                  {isPositive ? '+' : ''}₱{Math.abs(f.impact).toLocaleString()}
                </span>
              </div>
              
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden flex items-center">
                <div className="flex-1 flex justify-center h-full relative">
                  {/* Center Line */}
                  <div className="absolute top-0 bottom-0 w-px bg-white/20 left-1/2"></div>
                  
                  {/* The Bar */}
                  <div 
                    className={`h-full absolute rounded-full ${isPositive ? 'bg-accent' : 'bg-danger'}`}
                    style={{ 
                      width: `${width / 2}%`, 
                      left: isPositive ? '50%' : 'auto',
                      right: !isPositive ? '50%' : 'auto'
                    }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-8 pt-6 border-t border-white/10 flex justify-between text-[10px] text-text-muted uppercase tracking-widest font-bold">
        <span>Negative Impact</span>
        <span>Neutral</span>
        <span>Positive Impact</span>
      </div>
    </div>
  );
};

export default ShapChart;
