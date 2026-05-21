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
    Finishing: 10000,   // per sqm (Tiles, Paint, Drywall, Ceilings)
    MEP: 6000,          // per sqm (Electrical, Plumbing)
    Roofing: 4500,      // per sqm (Structural framing, Sheets)
    Openings: 4000,     // per sqm (Doors, Windows)
  });

  // Toggle checks for each material inclusion
  const [included, setIncluded] = useState({
    Cement: true,
    Steel: true,
    SandGravel: true,
    HollowBlocks: true,
    WireNails: true,
    Finishing: true,
    MEP: true,
    Roofing: true,
    Openings: true,
  });

  // Architectural coefficients per sqm based on construction grade
  const COEFFICIENTS = {
    Economy: { 
      Cement: 0.75, Steel: 3.5, SandGravel: 0.12, HollowBlocks: 11.0, WireNails: 0.06,
      Finishing: 0.50, MEP: 0.58, Roofing: 0.55, Openings: 0.50
    },
    Standard: { 
      Cement: 0.85, Steel: 4.5, SandGravel: 0.15, HollowBlocks: 12.5, WireNails: 0.08,
      Finishing: 1.00, MEP: 1.00, Roofing: 1.00, Openings: 1.00
    },
    Premium: { 
      Cement: 1.05, Steel: 6.0, SandGravel: 0.18, HollowBlocks: 14.5, WireNails: 0.10,
      Finishing: 1.80, MEP: 1.66, Roofing: 1.55, Openings: 1.87
    },
  };

  const activeCoeffs = COEFFICIENTS[activeGrade];

  // Calculated physical quantities
  const cementQty = Math.max(1, Math.round(floorArea * activeCoeffs.Cement));
  const steelQty = Math.max(1, Math.round((floorArea * activeCoeffs.Steel) / 6));
  const sandQty = Math.max(1, Math.round(floorArea * activeCoeffs.SandGravel * 10) / 10);
  const chbQty = Math.max(1, Math.round(floorArea * activeCoeffs.HollowBlocks));
  const nailsQty = Math.max(1, Math.round(floorArea * activeCoeffs.WireNails * 10) / 10);
  const finishingQty = Math.max(1, Math.round(floorArea * activeCoeffs.Finishing));
  const mepQty = Math.max(1, Math.round(floorArea * activeCoeffs.MEP));
  const roofingQty = Math.max(1, Math.round(floorArea * activeCoeffs.Roofing));
  const openingsQty = Math.max(1, Math.round(floorArea * activeCoeffs.Openings));

  // Line item costs
  const cementCost = included.Cement ? cementQty * prices.Cement : 0;
  const steelCost = included.Steel ? steelQty * prices.Steel : 0;
  const sandCost = included.SandGravel ? sandQty * prices.SandGravel : 0;
  const chbCost = included.HollowBlocks ? chbQty * prices.HollowBlocks : 0;
  const nailsCost = included.WireNails ? nailsQty * prices.WireNails : 0;
  const finishingCost = included.Finishing ? finishingQty * prices.Finishing : 0;
  const mepCost = included.MEP ? mepQty * prices.MEP : 0;
  const roofingCost = included.Roofing ? roofingQty * prices.Roofing : 0;
  const openingsCost = included.Openings ? openingsQty * prices.Openings : 0;

  // Aggregate math
  const totalMaterials = cementCost + steelCost + sandCost + chbCost + nailsCost + finishingCost + mepCost + roofingCost + openingsCost;
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
    <div className="glass p-8 rounded-2xl border border-border-color animate-fade-in relative overflow-hidden flex flex-col justify-between min-h-[460px] shadow-lg">
      
      {/* Decorative Blob */}
      <div className="absolute -top-20 -right-20 w-48 h-48 bg-yellow-500/10 rounded-full blur-[60px] pointer-events-none" />

      {/* Header and Grade Toggles */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 relative z-10 font-headers">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center justify-center shadow-[0_0_12px_rgba(245,158,11,0.3)] border border-yellow-500/20 flex-shrink-0">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-on-surface leading-tight uppercase">Build Cost Ledger</h3>
            <p className="text-[9px] text-on-faint uppercase tracking-widest font-bold mt-0.5">Physical Quantities & Estimations</p>
          </div>
        </div>

        {/* Grade Tabs */}
        <div className="flex bg-bg-deep border border-border-color p-0.5 rounded-lg text-[9px] uppercase tracking-widest font-bold self-start sm:self-center">
          {(['Economy', 'Standard', 'Premium'] as const).map(grade => (
            <button
              key={grade}
              onClick={() => setActiveGrade(grade)}
              className={`px-3 py-1.5 rounded-md transition-all font-bold ${activeGrade === grade ? 'bg-yellow-500 text-white shadow-md' : 'text-on-muted hover:text-on-surface'}`}
            >
              {grade}
            </button>
          ))}
        </div>
      </div>

      {/* Main Budget Display */}
      <div className="mb-4 relative z-10 font-headers border-b border-border-color pb-4">
        <p className="text-[9px] text-on-faint uppercase tracking-wider font-extrabold mb-1">AGGREGATE EXPENDITURE</p>
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-black text-on-surface tracking-tighter tabular-nums font-mono">
            {formatCurrency(totalCost)}
          </span>
          <span className="text-[9px] font-bold text-yellow-500 uppercase tracking-widest bg-yellow-500/10 border border-yellow-500/20 px-2 py-0.5 rounded">
            {activeGrade} SPEC
          </span>
        </div>
      </div>

      {/* Interactive Bill of Materials Table */}
      <div className="flex-grow relative z-10 overflow-x-auto scrollbar-thin max-h-[280px] border border-border-color rounded-xl bg-bg-deep/30 p-3 mb-4 font-mono">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-border-color text-[8px] text-on-faint uppercase tracking-widest font-headers">
              <th className="pb-2 font-extrabold">Active</th>
              <th className="pb-2 font-extrabold">Material/Work Item</th>
              <th className="pb-2 font-extrabold text-center">BOM Count / Area</th>
              <th className="pb-2 font-extrabold text-center">Unit Price (₱)</th>
              <th className="pb-2 font-extrabold text-right">Extended</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dotted divide-border-color font-mono text-[11px] text-on-muted">
            {/* Cement */}
            <tr className={`hover:bg-white/5 transition-colors ${!included.Cement ? 'opacity-35' : ''}`}>
              <td className="py-2.5">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={included.Cement} 
                    onChange={() => toggleIncluded('Cement')}
                    className="sr-only peer"
                  />
                  <div className="w-7 h-4 bg-bg-deep border border-border-color peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-3 peer-checked:after:bg-white after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-text-muted after:rounded-full after:h-2.5 after:w-2.5 after:transition-all peer-checked:bg-yellow-500 transition-all"></div>
                </label>
              </td>
              <td className="py-2.5 font-bold text-on-surface font-sans">Cement (Portland 40kg)</td>
              <td className="py-2.5 text-center font-bold tabular-nums text-primary">{cementQty} Bags</td>
              <td className="py-2.5 text-center">
                <input 
                  type="number" 
                  value={prices.Cement} 
                  onChange={(e) => handlePriceChange('Cement', e.target.value)}
                  className="w-16 text-center bg-bg-deep/50 border border-border-color rounded py-0.5 font-bold text-on-surface"
                />
              </td>
              <td className="py-2.5 text-right font-extrabold text-on-surface tabular-nums">{formatCurrency(cementCost)}</td>
            </tr>

            {/* Steel Rebar */}
            <tr className={`hover:bg-white/5 transition-colors ${!included.Steel ? 'opacity-35' : ''}`}>
              <td className="py-2.5">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={included.Steel} 
                    onChange={() => toggleIncluded('Steel')}
                    className="sr-only peer"
                  />
                  <div className="w-7 h-4 bg-bg-deep border border-border-color peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-3 peer-checked:after:bg-white after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-text-muted after:rounded-full after:h-2.5 after:w-2.5 after:transition-all peer-checked:bg-yellow-500 transition-all"></div>
                </label>
              </td>
              <td className="py-2.5 font-bold text-on-surface font-sans">Steel Rebar (12mm)</td>
              <td className="py-2.5 text-center font-bold tabular-nums text-primary">{steelQty} Pcs (6m)</td>
              <td className="py-2.5 text-center">
                <input 
                  type="number" 
                  value={prices.Steel} 
                  onChange={(e) => handlePriceChange('Steel', e.target.value)}
                  className="w-16 text-center bg-bg-deep/50 border border-border-color rounded py-0.5 font-bold text-on-surface"
                />
              </td>
              <td className="py-2.5 text-right font-extrabold text-on-surface tabular-nums">{formatCurrency(steelCost)}</td>
            </tr>

            {/* Sand & Gravel */}
            <tr className={`hover:bg-white/5 transition-colors ${!included.SandGravel ? 'opacity-35' : ''}`}>
              <td className="py-2.5">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={included.SandGravel} 
                    onChange={() => toggleIncluded('SandGravel')}
                    className="sr-only peer"
                  />
                  <div className="w-7 h-4 bg-bg-deep border border-border-color peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-3 peer-checked:after:bg-white after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-text-muted after:rounded-full after:h-2.5 after:w-2.5 after:transition-all peer-checked:bg-yellow-500 transition-all"></div>
                </label>
              </td>
              <td className="py-2.5 font-bold text-on-surface font-sans">Sand &amp; Gravel</td>
              <td className="py-2.5 text-center font-bold tabular-nums text-primary">{sandQty} cu.m</td>
              <td className="py-2.5 text-center">
                <input 
                  type="number" 
                  value={prices.SandGravel} 
                  onChange={(e) => handlePriceChange('SandGravel', e.target.value)}
                  className="w-16 text-center bg-bg-deep/50 border border-border-color rounded py-0.5 font-bold text-on-surface"
                />
              </td>
              <td className="py-2.5 text-right font-extrabold text-on-surface tabular-nums">{formatCurrency(sandCost)}</td>
            </tr>

            {/* Hollow Blocks */}
            <tr className={`hover:bg-white/5 transition-colors ${!included.HollowBlocks ? 'opacity-35' : ''}`}>
              <td className="py-2.5">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={included.HollowBlocks} 
                    onChange={() => toggleIncluded('HollowBlocks')}
                    className="sr-only peer"
                  />
                  <div className="w-7 h-4 bg-bg-deep border border-border-color peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-3 peer-checked:after:bg-white after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-text-muted after:rounded-full after:h-2.5 after:w-2.5 after:transition-all peer-checked:bg-yellow-500 transition-all"></div>
                </label>
              </td>
              <td className="py-2.5 font-bold text-on-surface font-sans">Hollow Blocks (4")</td>
              <td className="py-2.5 text-center font-bold tabular-nums text-primary">{chbQty} Pcs</td>
              <td className="py-2.5 text-center">
                <input 
                  type="number" 
                  value={prices.HollowBlocks} 
                  onChange={(e) => handlePriceChange('HollowBlocks', e.target.value)}
                  className="w-16 text-center bg-bg-deep/50 border border-border-color rounded py-0.5 font-bold text-on-surface"
                />
              </td>
              <td className="py-2.5 text-right font-extrabold text-on-surface tabular-nums">{formatCurrency(chbCost)}</td>
            </tr>

            {/* Wire Nails */}
            <tr className={`hover:bg-white/5 transition-colors ${!included.WireNails ? 'opacity-35' : ''}`}>
              <td className="py-2.5">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={included.WireNails} 
                    onChange={() => toggleIncluded('WireNails')}
                    className="sr-only peer"
                  />
                  <div className="w-7 h-4 bg-bg-deep border border-border-color peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-3 peer-checked:after:bg-white after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-text-muted after:rounded-full after:h-2.5 after:w-2.5 after:transition-all peer-checked:bg-yellow-500 transition-all"></div>
                </label>
              </td>
              <td className="py-2.5 font-bold text-on-surface font-sans">Common Wire Nails</td>
              <td className="py-2.5 text-center font-bold tabular-nums text-primary">{nailsQty} kg</td>
              <td className="py-2.5 text-center">
                <input 
                  type="number" 
                  value={prices.WireNails} 
                  onChange={(e) => handlePriceChange('WireNails', e.target.value)}
                  className="w-16 text-center bg-bg-deep/50 border border-border-color rounded py-0.5 font-bold text-on-surface"
                />
              </td>
              <td className="py-2.5 text-right font-extrabold text-on-surface tabular-nums">{formatCurrency(nailsCost)}</td>
            </tr>

            {/* Finishing Works */}
            <tr className={`hover:bg-white/5 transition-colors ${!included.Finishing ? 'opacity-35' : ''}`}>
              <td className="py-2.5">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={included.Finishing} 
                    onChange={() => toggleIncluded('Finishing')}
                    className="sr-only peer"
                  />
                  <div className="w-7 h-4 bg-bg-deep border border-border-color peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-3 peer-checked:after:bg-white after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-text-muted after:rounded-full after:h-2.5 after:w-2.5 after:transition-all peer-checked:bg-yellow-500 transition-all"></div>
                </label>
              </td>
              <td className="py-2.5 font-bold text-on-surface font-sans">Finishing (Paint, Tiles, Ceilings)</td>
              <td className="py-2.5 text-center font-bold tabular-nums text-primary">{finishingQty} sqm</td>
              <td className="py-2.5 text-center">
                <input 
                  type="number" 
                  value={prices.Finishing} 
                  onChange={(e) => handlePriceChange('Finishing', e.target.value)}
                  className="w-16 text-center bg-bg-deep/50 border border-border-color rounded py-0.5 font-bold text-on-surface"
                />
              </td>
              <td className="py-2.5 text-right font-extrabold text-on-surface tabular-nums">{formatCurrency(finishingCost)}</td>
            </tr>

            {/* MEP Works */}
            <tr className={`hover:bg-white/5 transition-colors ${!included.MEP ? 'opacity-35' : ''}`}>
              <td className="py-2.5">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={included.MEP} 
                    onChange={() => toggleIncluded('MEP')}
                    className="sr-only peer"
                  />
                  <div className="w-7 h-4 bg-bg-deep border border-border-color peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-3 peer-checked:after:bg-white after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-text-muted after:rounded-full after:h-2.5 after:w-2.5 after:transition-all peer-checked:bg-yellow-500 transition-all"></div>
                </label>
              </td>
              <td className="py-2.5 font-bold text-on-surface font-sans">MEP (Electrical &amp; Plumbing)</td>
              <td className="py-2.5 text-center font-bold tabular-nums text-primary">{mepQty} sqm</td>
              <td className="py-2.5 text-center">
                <input 
                  type="number" 
                  value={prices.MEP} 
                  onChange={(e) => handlePriceChange('MEP', e.target.value)}
                  className="w-16 text-center bg-bg-deep/50 border border-border-color rounded py-0.5 font-bold text-on-surface"
                />
              </td>
              <td className="py-2.5 text-right font-extrabold text-on-surface tabular-nums">{formatCurrency(mepCost)}</td>
            </tr>

            {/* Roofing Works */}
            <tr className={`hover:bg-white/5 transition-colors ${!included.Roofing ? 'opacity-35' : ''}`}>
              <td className="py-2.5">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={included.Roofing} 
                    onChange={() => toggleIncluded('Roofing')}
                    className="sr-only peer"
                  />
                  <div className="w-7 h-4 bg-bg-deep border border-border-color peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-3 peer-checked:after:bg-white after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-text-muted after:rounded-full after:h-2.5 after:w-2.5 after:transition-all peer-checked:bg-yellow-500 transition-all"></div>
                </label>
              </td>
              <td className="py-2.5 font-bold text-on-surface font-sans">Roofing (Frame &amp; Sheets)</td>
              <td className="py-2.5 text-center font-bold tabular-nums text-primary">{roofingQty} sqm</td>
              <td className="py-2.5 text-center">
                <input 
                  type="number" 
                  value={prices.Roofing} 
                  onChange={(e) => handlePriceChange('Roofing', e.target.value)}
                  className="w-16 text-center bg-bg-deep/50 border border-border-color rounded py-0.5 font-bold text-on-surface"
                />
              </td>
              <td className="py-2.5 text-right font-extrabold text-on-surface tabular-nums">{formatCurrency(roofingCost)}</td>
            </tr>

            {/* Doors & Windows */}
            <tr className={`hover:bg-white/5 transition-colors ${!included.Openings ? 'opacity-35' : ''}`}>
              <td className="py-2.5">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={included.Openings} 
                    onChange={() => toggleIncluded('Openings')}
                    className="sr-only peer"
                  />
                  <div className="w-7 h-4 bg-bg-deep border border-border-color peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-3 peer-checked:after:bg-white after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-text-muted after:rounded-full after:h-2.5 after:w-2.5 after:transition-all peer-checked:bg-yellow-500 transition-all"></div>
                </label>
              </td>
              <td className="py-2.5 font-bold text-on-surface font-sans">Doors &amp; Windows (Openings)</td>
              <td className="py-2.5 text-center font-bold tabular-nums text-primary">{openingsQty} sqm</td>
              <td className="py-2.5 text-center">
                <input 
                  type="number" 
                  value={prices.Openings} 
                  onChange={(e) => handlePriceChange('Openings', e.target.value)}
                  className="w-16 text-center bg-bg-deep/50 border border-border-color rounded py-0.5 font-bold text-on-surface"
                />
              </td>
              <td className="py-2.5 text-right font-extrabold text-on-surface tabular-nums">{formatCurrency(openingsCost)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Aggregate breakdown and progress split bar */}
      <div className="space-y-4 relative z-10">
        <div className="grid grid-cols-2 gap-4 font-headers text-[9px] uppercase tracking-wider font-bold">
          <div className="p-3 bg-bg-deep border border-border-color rounded-xl">
            <span className="block text-on-faint mb-1">Total Materials (60%)</span>
            <span className="text-sm font-bold text-on-surface tabular-nums font-mono">{formatCurrency(totalMaterials)}</span>
          </div>
          <div className="p-3 bg-bg-deep border border-border-color rounded-xl">
            <span className="block text-on-faint mb-1">Estimated Labor (40%)</span>
            <span className="text-sm font-bold text-on-surface tabular-nums font-mono">{formatCurrency(labor)}</span>
          </div>
        </div>

        {/* Real-time dual split progress bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-[8px] font-extrabold text-on-faint uppercase tracking-widest font-headers">
            <span>Materials ({totalCost > 0 ? Math.round((totalMaterials / totalCost) * 100) : 60}%)</span>
            <span>Labor ({totalCost > 0 ? Math.round((labor / totalCost) * 100) : 40}%)</span>
          </div>
          <div className="w-full h-2 bg-bg-deep rounded-full overflow-hidden flex border border-border-color p-[1px]">
            <div 
              style={{ width: `${totalCost > 0 ? (totalMaterials / totalCost) * 100 : 60}%` }} 
              className="h-full bg-gradient-to-r from-yellow-500 to-amber-500 rounded-full transition-all duration-500 ease-out" 
            />
            <div 
              style={{ width: `${totalCost > 0 ? (labor / totalCost) * 100 : 40}%` }} 
              className="h-full bg-white/5 dark:bg-white/5 rounded-full transition-all duration-500 ease-out" 
            />
          </div>
        </div>

        <div className="p-3 bg-yellow-500/5 border border-yellow-500/10 rounded-xl leading-relaxed text-[10px] text-on-muted">
          <p className="flex items-start gap-1.5 leading-relaxed">
            <span className="text-yellow-500 flex-shrink-0 font-bold">💡</span>
            <span>Adjust BOM counts or customize market prices to align calculations with regional Pangasinan invoices. Toggle rows to recalculate.</span>
          </p>
        </div>
      </div>

    </div>
  );
};

export default ConstructionEstimator;
