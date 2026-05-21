'use client';

import React, { useState, useEffect } from 'react';

interface ConstructionEstimatorProps {
  floorArea: number;
  quality?: 'Economy' | 'Standard' | 'Premium';
}

const ConstructionEstimator: React.FC<ConstructionEstimatorProps> = ({ 
  floorArea, 
  quality = 'Standard' 
}) => {
  const [activeGrade, setActiveGrade] = useState<'Economy' | 'Standard' | 'Premium'>(quality);

  useEffect(() => {
    setActiveGrade(quality);
  }, [quality]);

  // Materials base unit prices in PHP (Pangasinan average benchmarks)
  const [prices, setPrices] = useState({
    Cement: 265,        // per 40kg Bag
    Steel: 345,         // per 6m Length
    SandGravel: 950,    // per cu.m
    HollowBlocks: 14,   // per pc
    WireNails: 85,      // per kg
  });

  // Toggle checks for each material inclusion
  const [included, setIncluded] = useState({
    Cement: true,
    Steel: true,
    SandGravel: true,
    HollowBlocks: true,
    WireNails: true,
  });

  // Architectural coefficients per sqm based on construction grade
  const COEFFICIENTS = {
    Economy: { Cement: 0.75, Steel: 3.5, SandGravel: 0.12, HollowBlocks: 11.0, WireNails: 0.06 },
    Standard: { Cement: 0.85, Steel: 4.5, SandGravel: 0.15, HollowBlocks: 12.5, WireNails: 0.08 },
    Premium: { Cement: 1.05, Steel: 6.0, SandGravel: 0.18, HollowBlocks: 14.5, WireNails: 0.10 },
  };

  const activeCoeffs = COEFFICIENTS[activeGrade];

  // Calculated physical quantities
  const cementQty = Math.max(1, Math.round(floorArea * activeCoeffs.Cement));
  // 6m Lengths for Steel (standard rebar length in PH is 6 meters)
  const steelQty = Math.max(1, Math.round((floorArea * activeCoeffs.Steel) / 6));
  const sandQty = Math.max(1, Math.round(floorArea * activeCoeffs.SandGravel * 10) / 10);
  const chbQty = Math.max(1, Math.round(floorArea * activeCoeffs.HollowBlocks));
  const nailsQty = Math.max(1, Math.round(floorArea * activeCoeffs.WireNails * 10) / 10);

  // Line item costs
  const cementCost = included.Cement ? cementQty * prices.Cement : 0;
  const steelCost = included.Steel ? steelQty * prices.Steel : 0;
  const sandCost = included.SandGravel ? sandQty * prices.SandGravel : 0;
  const chbCost = included.HollowBlocks ? chbQty * prices.HollowBlocks : 0;
  const nailsCost = included.WireNails ? nailsQty * prices.WireNails : 0;

  // Aggregate math
  const totalMaterials = cementCost + steelCost + sandCost + chbCost + nailsCost;
  // Labor is typically 40% of standard build budgets, materials are 60%
  // Labor = Total Materials * (40/60)
  const labor = totalMaterials * 0.667;
  const totalCost = totalMaterials + labor;

  // Helpers
  function formatCurrency(val: number) {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      maximumFractionDigits: 0
    }).format(val);
  }

  const handlePriceChange = (key: keyof typeof prices, val: string) => {
    const num = parseFloat(val) || 0;
    setPrices(prev => ({ ...prev, [key]: num }));
  };

  const toggleIncluded = (key: keyof typeof included) => {
    setIncluded(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="glass p-8 rounded-2xl border border-yellow-500/20 animate-fade-in relative overflow-hidden flex flex-col justify-between min-h-[460px]">
      
      {/* Decorative Blob */}
      <div className="absolute -top-20 -right-20 w-48 h-48 bg-yellow-500/10 rounded-full blur-[60px] pointer-events-none" />

      {/* Header and Grade Toggles */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-yellow-500 to-amber-700 flex items-center justify-center shadow-[0_0_12px_rgba(245,158,11,0.4)] flex-shrink-0">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-text-primary leading-tight">Build Cost Estimator</h3>
            <p className="text-[10px] text-text-muted uppercase tracking-widest font-bold">Interactive BOM &amp; Quantities</p>
          </div>
        </div>

        {/* Grade Tabs */}
        <div className="flex bg-white/5 border border-white/10 p-0.5 rounded-lg text-xs self-start sm:self-center">
          {(['Economy', 'Standard', 'Premium'] as const).map(grade => (
            <button
              key={grade}
              onClick={() => setActiveGrade(grade)}
              className={`px-3 py-1 rounded-md transition-all font-semibold ${activeGrade === grade ? 'bg-yellow-500 text-white shadow-md' : 'text-text-secondary hover:text-white'}`}
            >
              {grade}
            </button>
          ))}
        </div>
      </div>

      {/* Main Budget Display */}
      <div className="mb-4 relative z-10">
        <p className="text-[10px] text-text-muted uppercase tracking-wider font-bold mb-1">Estimated Project Budget</p>
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-black text-text-primary tracking-tighter tabular-nums">
            {formatCurrency(totalCost)}
          </span>
          <span className="text-xs font-semibold text-yellow-500 uppercase tracking-widest bg-yellow-500/10 border border-yellow-500/30 px-2 py-0.5 rounded">
            {activeGrade} Grade
          </span>
        </div>
      </div>

      {/* Interactive Bill of Materials Table */}
      <div className="flex-grow relative z-10 overflow-x-auto scrollbar-thin max-h-[170px] border border-white/5 rounded-xl bg-black/20 p-2 mb-4">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-white/10 text-[9px] text-text-muted uppercase tracking-wider">
              <th className="pb-1.5 font-bold">Include</th>
              <th className="pb-1.5 font-bold">Material Item</th>
              <th className="pb-1.5 font-bold text-center">Quantity</th>
              <th className="pb-1.5 font-bold text-center">Unit Price (₱)</th>
              <th className="pb-1.5 font-bold text-right">Cost</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {/* Cement */}
            <tr className={`hover:bg-white/5 transition-colors ${!included.Cement ? 'opacity-40' : ''}`}>
              <td className="py-2">
                <input 
                  type="checkbox" 
                  checked={included.Cement} 
                  onChange={() => toggleIncluded('Cement')}
                  className="rounded border-white/10 text-yellow-500 focus:ring-yellow-500 w-3.5 h-3.5 bg-black"
                />
              </td>
              <td className="py-2 font-medium text-text-primary">Cement (Portland 40kg)</td>
              <td className="py-2 text-center text-text-secondary font-semibold tabular-nums">{cementQty} Bags</td>
              <td className="py-2 text-center">
                <input 
                  type="number" 
                  value={prices.Cement} 
                  onChange={(e) => handlePriceChange('Cement', e.target.value)}
                  className="w-16 text-center bg-white/5 border border-white/10 rounded py-0.5 font-bold text-text-primary"
                />
              </td>
              <td className="py-2 text-right font-bold text-text-primary tabular-nums">{formatCurrency(cementCost)}</td>
            </tr>

            {/* Steel Rebar */}
            <tr className={`hover:bg-white/5 transition-colors ${!included.Steel ? 'opacity-40' : ''}`}>
              <td className="py-2">
                <input 
                  type="checkbox" 
                  checked={included.Steel} 
                  onChange={() => toggleIncluded('Steel')}
                  className="rounded border-white/10 text-yellow-500 focus:ring-yellow-500 w-3.5 h-3.5 bg-black"
                />
              </td>
              <td className="py-2 font-medium text-text-primary">Steel Rebar (12mm)</td>
              <td className="py-2 text-center text-text-secondary font-semibold tabular-nums">{steelQty} Pcs (6m)</td>
              <td className="py-2 text-center">
                <input 
                  type="number" 
                  value={prices.Steel} 
                  onChange={(e) => handlePriceChange('Steel', e.target.value)}
                  className="w-16 text-center bg-white/5 border border-white/10 rounded py-0.5 font-bold text-text-primary"
                />
              </td>
              <td className="py-2 text-right font-bold text-text-primary tabular-nums">{formatCurrency(steelCost)}</td>
            </tr>

            {/* Sand & Gravel */}
            <tr className={`hover:bg-white/5 transition-colors ${!included.SandGravel ? 'opacity-40' : ''}`}>
              <td className="py-2">
                <input 
                  type="checkbox" 
                  checked={included.SandGravel} 
                  onChange={() => toggleIncluded('SandGravel')}
                  className="rounded border-white/10 text-yellow-500 focus:ring-yellow-500 w-3.5 h-3.5 bg-black"
                />
              </td>
              <td className="py-2 font-medium text-text-primary">Sand &amp; Gravel</td>
              <td className="py-2 text-center text-text-secondary font-semibold tabular-nums">{sandQty} cu.m</td>
              <td className="py-2 text-center">
                <input 
                  type="number" 
                  value={prices.SandGravel} 
                  onChange={(e) => handlePriceChange('SandGravel', e.target.value)}
                  className="w-16 text-center bg-white/5 border border-white/10 rounded py-0.5 font-bold text-text-primary"
                />
              </td>
              <td className="py-2 text-right font-bold text-text-primary tabular-nums">{formatCurrency(sandCost)}</td>
            </tr>

            {/* Hollow Blocks */}
            <tr className={`hover:bg-white/5 transition-colors ${!included.HollowBlocks ? 'opacity-40' : ''}`}>
              <td className="py-2">
                <input 
                  type="checkbox" 
                  checked={included.HollowBlocks} 
                  onChange={() => toggleIncluded('HollowBlocks')}
                  className="rounded border-white/10 text-yellow-500 focus:ring-yellow-500 w-3.5 h-3.5 bg-black"
                />
              </td>
              <td className="py-2 font-medium text-text-primary">Hollow Blocks (4")</td>
              <td className="py-2 text-center text-text-secondary font-semibold tabular-nums">{chbQty} Pcs</td>
              <td className="py-2 text-center">
                <input 
                  type="number" 
                  value={prices.HollowBlocks} 
                  onChange={(e) => handlePriceChange('HollowBlocks', e.target.value)}
                  className="w-16 text-center bg-white/5 border border-white/10 rounded py-0.5 font-bold text-text-primary"
                />
              </td>
              <td className="py-2 text-right font-bold text-text-primary tabular-nums">{formatCurrency(chbCost)}</td>
            </tr>

            {/* Wire Nails */}
            <tr className={`hover:bg-white/5 transition-colors ${!included.WireNails ? 'opacity-40' : ''}`}>
              <td className="py-2">
                <input 
                  type="checkbox" 
                  checked={included.WireNails} 
                  onChange={() => toggleIncluded('WireNails')}
                  className="rounded border-white/10 text-yellow-500 focus:ring-yellow-500 w-3.5 h-3.5 bg-black"
                />
              </td>
              <td className="py-2 font-medium text-text-primary">Common Wire Nails</td>
              <td className="py-2 text-center text-text-secondary font-semibold tabular-nums">{nailsQty} kg</td>
              <td className="py-2 text-center">
                <input 
                  type="number" 
                  value={prices.WireNails} 
                  onChange={(e) => handlePriceChange('WireNails', e.target.value)}
                  className="w-16 text-center bg-white/5 border border-white/10 rounded py-0.5 font-bold text-text-primary"
                />
              </td>
              <td className="py-2 text-right font-bold text-text-primary tabular-nums">{formatCurrency(nailsCost)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Aggregate breakdown and quick note */}
      <div className="space-y-4 relative z-10">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-white/5 rounded-xl border border-white/5">
            <span className="block text-[10px] text-text-muted uppercase font-bold mb-1">Total Materials (60%)</span>
            <span className="text-sm font-bold text-text-primary tabular-nums">{formatCurrency(totalMaterials)}</span>
          </div>
          <div className="p-3 bg-white/5 rounded-xl border border-white/5">
            <span className="block text-[10px] text-text-muted uppercase font-bold mb-1">Estimated Labor (40%)</span>
            <span className="text-sm font-bold text-text-primary tabular-nums">{formatCurrency(labor)}</span>
          </div>
        </div>

        <div className="p-3 bg-blue-500/5 border border-blue-500/10 rounded-xl">
          <p className="text-[10px] text-blue-400 font-semibold leading-relaxed">
            💡 <span className="underline">Engineer's Guidance:</span> Adjust the quantities or pricing based on your supplier invoice. Toggling checkboxes lets you isolate specific material expenditures.
          </p>
        </div>
      </div>

    </div>
  );
};

export default ConstructionEstimator;
