import React from 'react';

interface ConstructionEstimatorProps {
  floorArea: number;
  quality?: 'Economy' | 'Standard' | 'Premium';
}

const ConstructionEstimator: React.FC<ConstructionEstimatorProps> = ({ 
  floorArea, 
  quality = 'Standard' 
}) => {
  // Rates per sqm in PHP (Pangasinan average)
  const rates = {
    Economy: 22000,
    Standard: 32000,
    Premium: 48000
  };

  const baseRate = rates[quality];
  const totalCost = floorArea * baseRate;
  
  // Cost breakdown
  const labor = totalCost * 0.40;
  const materials = totalCost * 0.60;

  function formatCurrency(val: number) {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      maximumFractionDigits: 0
    }).format(val);
  }

  return (
    <div className="glass p-6 rounded-2xl border border-yellow-500/20 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
          <svg className="w-5 h-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          Build Cost Estimator (ROM)
        </h3>
        <span className="text-[10px] font-bold text-yellow-500 bg-yellow-500/10 border border-yellow-500/30 px-2 py-1 rounded-full uppercase tracking-widest">
          {quality} Grade
        </span>
      </div>

      <div className="mb-6">
        <p className="text-xs text-text-muted mb-1 uppercase tracking-widest font-bold">Total Estimated Budget</p>
        <p className="text-4xl font-black text-text-primary tracking-tighter">
          {formatCurrency(totalCost)}
        </p>
        <p className="text-[10px] text-text-muted mt-1 italic">
          *Approximate Rough Order of Magnitude (ROM) for {floorArea} sqm project
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-3 bg-white/5 rounded-xl border border-white/5">
          <p className="text-[10px] text-text-muted uppercase font-bold mb-1">Materials (60%)</p>
          <p className="text-sm font-bold text-text-primary">{formatCurrency(materials)}</p>
        </div>
        <div className="p-3 bg-white/5 rounded-xl border border-white/5">
          <p className="text-[10px] text-text-muted uppercase font-bold mb-1">Labor (40%)</p>
          <p className="text-sm font-bold text-text-primary">{formatCurrency(labor)}</p>
        </div>
      </div>

      {/* Progress Bars for Breakdown */}
      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-[10px] mb-1 uppercase font-bold text-text-muted">
            <span>Material Procurement</span>
            <span>60%</span>
          </div>
          <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-yellow-500" style={{ width: '60%' }}></div>
          </div>
        </div>
        <div>
          <div className="flex justify-between text-[10px] mb-1 uppercase font-bold text-text-muted">
            <span>Labor & Management</span>
            <span>40%</span>
          </div>
          <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-yellow-600" style={{ width: '40%' }}></div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-3 bg-blue-500/5 border border-blue-500/10 rounded-xl">
        <p className="text-[10px] text-blue-400 font-semibold leading-relaxed">
          💡 <span className="underline">Engineer's Note:</span> This estimate includes basic earthworks, structural framing, and plumbing/electrical rough-ins. Final quote subject to soil test and structural design.
        </p>
      </div>
    </div>
  );
};

export default ConstructionEstimator;
