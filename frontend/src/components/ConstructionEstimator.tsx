'use client';

import React, { useState, useEffect, useRef } from 'react';

interface ConstructionEstimatorProps {
  floorArea: number;
  quality?: 'Economy' | 'Standard' | 'Premium';
  onCostChange?: (costs: { total: number; low: number; high: number }) => void;
}

const ConstructionEstimator: React.FC<ConstructionEstimatorProps> = ({ 
  floorArea, 
  quality = 'Standard',
  onCostChange
}) => {
  const [activeGrade, setActiveGrade] = useState<'Economy' | 'Standard' | 'Premium'>(quality);
  const [estimationMethod, setEstimationMethod] = useState<'rough' | 'detailed'>('detailed');

  // Sliders for Indirect Costs
  const [overheadProfitPct, setOverheadProfitPct] = useState<number>(15);
  const [contingencyPct, setContingencyPct] = useState<number>(10);

  // Permits & Insurance Checklist
  const [includedPermits, setIncludedPermits] = useState({
    barangay: true,
    zoning: true,
    building: true,
    utilities: true,
    cari: true,
  });

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

  // Custom materials type
  interface CustomMaterial {
    id: string;
    name: string;
    qty: number;
    unit: string;
    price: number;
    included: boolean;
  }

  // Custom materials list state
  const [customMaterials, setCustomMaterials] = useState<CustomMaterial[]>([]);

  // Input form state for new custom materials
  const [newItem, setNewItem] = useState({
    name: '',
    qty: 10,
    unit: 'Pcs',
    price: 150
  });

  const handleAddCustomItem = () => {
    if (!newItem.name.trim()) return;
    const item: CustomMaterial = {
      id: Math.random().toString(36).substring(2, 9),
      name: newItem.name.trim(),
      qty: newItem.qty,
      unit: newItem.unit.trim() || 'Pcs',
      price: newItem.price,
      included: true
    };
    setCustomMaterials(prev => [...prev, item]);
    setNewItem({
      name: '',
      qty: 10,
      unit: 'Pcs',
      price: 150
    });
  };

  const handleCustomPriceChange = (id: string, val: string) => {
    const num = parseFloat(val) || 0;
    setCustomMaterials(prev => prev.map(item => item.id === id ? { ...item, price: num } : item));
  };

  const handleCustomQtyChange = (id: string, val: string) => {
    const num = parseInt(val) || 0;
    setCustomMaterials(prev => prev.map(item => item.id === id ? { ...item, qty: Math.max(1, num) } : item));
  };

  const toggleCustomIncluded = (id: string) => {
    setCustomMaterials(prev => prev.map(item => item.id === id ? { ...item, included: !item.included } : item));
  };

  const handleDeleteCustomItem = (id: string) => {
    setCustomMaterials(prev => prev.filter(item => item.id !== id));
  };

  // Custom materials costs
  const customMaterialsCost = customMaterials.reduce((sum, item) => {
    return sum + (item.included ? item.qty * item.price : 0);
  }, 0);

  // --- Core Costs Calculations ---

  // Method 1: Rough Area Method specs
  const REGIONAL_RATES = {
    Economy: 18500,    // ₱18,500/sqm
    Standard: 27000,   // ₱27,000/sqm
    Premium: 41000,    // ₱41,000/sqm
  };

  // Direct Cost Calculation based on active methodology
  const totalDetailedMaterials = cementCost + steelCost + sandCost + chbCost + nailsCost + finishingCost + mepCost + roofingCost + openingsCost + customMaterialsCost;
  const detailedLabor = totalDetailedMaterials * 0.667; // Labor represents ~40% of detailed cost

  const directCost = estimationMethod === 'rough' 
    ? (floorArea * REGIONAL_RATES[activeGrade])
    : (totalDetailedMaterials + detailedLabor);

  // Indirect costs calculations
  const overheadProfitCost = directCost * (overheadProfitPct / 100);
  const contingencyCost = directCost * (contingencyPct / 100);

  // Permit & Insurance specific calculations
  const barangayCost = includedPermits.barangay ? 1000 : 0;
  const zoningCost = includedPermits.zoning ? 2500 : 0;
  const buildingCost = includedPermits.building ? (floorArea * 150) : 0;
  const utilitiesCost = includedPermits.utilities ? 8000 : 0;
  const cariCost = includedPermits.cari ? (directCost * 0.005) : 0;

  const permitsCost = barangayCost + zoningCost + buildingCost + utilitiesCost + cariCost;
  const totalIndirectCost = overheadProfitCost + contingencyCost + permitsCost;

  // Final aggregate project cost
  const totalCost = directCost + totalIndirectCost;

  // Ref pattern to prevent parent React state hook infinite render loops
  const onCostChangeRef = useRef(onCostChange);
  useEffect(() => {
    onCostChangeRef.current = onCostChange;
  }, [onCostChange]);

  useEffect(() => {
    if (onCostChangeRef.current) {
      onCostChangeRef.current({
        total: totalCost,
        low: totalCost * 0.9,
        high: totalCost * 1.1
      });
    }
  }, [totalCost]);

  // Currency Formatter Helpers
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

  const togglePermit = (key: keyof typeof includedPermits) => {
    setIncludedPermits(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="glass p-8 rounded-2xl border border-border-color animate-fade-in relative overflow-hidden flex flex-col justify-between shadow-lg space-y-6">
      
      {/* Decorative Blur Blob */}
      <div className="absolute -top-20 -right-20 w-48 h-48 bg-yellow-500/10 rounded-full blur-[60px] pointer-events-none" />

      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 relative z-10 font-headers">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center justify-center shadow-[0_0_12px_rgba(245,158,11,0.3)] border border-yellow-500/20 flex-shrink-0">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-on-surface leading-tight uppercase">Build Cost Ledger</h3>
            <p className="text-[9px] text-on-faint uppercase tracking-widest font-bold mt-0.5">Professional Site Estimates</p>
          </div>
        </div>

        {/* Methodology Toggle Tabs */}
        <div className="flex bg-bg-deep border border-border-color p-0.5 rounded-lg text-[9px] uppercase tracking-widest font-bold self-start sm:self-center">
          <button
            onClick={() => setEstimationMethod('rough')}
            className={`px-3 py-1.5 rounded-md transition-all font-bold ${estimationMethod === 'rough' ? 'bg-yellow-500 text-white shadow-md' : 'text-on-muted hover:text-on-surface'}`}
          >
            Rough Area Method
          </button>
          <button
            onClick={() => setEstimationMethod('detailed')}
            className={`px-3 py-1.5 rounded-md transition-all font-bold ${estimationMethod === 'detailed' ? 'bg-yellow-500 text-white shadow-md' : 'text-on-muted hover:text-on-surface'}`}
          >
            Detailed BOQ Takeoff
          </button>
        </div>
      </div>

      {/* Main Budget Aggregate Panel */}
      <div className="relative z-10 font-headers border-b border-border-color pb-4 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <p className="text-[9px] text-on-faint uppercase tracking-wider font-extrabold mb-1">TOTAL PROJECTED BUILD BUDGET</p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-on-surface tracking-tighter tabular-nums font-mono">
              {formatCurrency(totalCost)}
            </span>
            <span className="text-[9px] font-bold text-yellow-500 uppercase tracking-widest bg-yellow-500/10 border border-yellow-500/20 px-2 py-0.5 rounded">
              {activeGrade} SPEC
            </span>
          </div>
        </div>

        {/* Quality Grade Card Switcher */}
        <div className="flex flex-col gap-1 items-start md:items-end">
          <span className="text-[8px] text-on-faint uppercase tracking-widest font-bold">Construction Grade Spec</span>
          <div className="flex bg-bg-deep border border-border-color p-0.5 rounded-lg text-[9px] uppercase tracking-widest font-bold">
            {(['Economy', 'Standard', 'Premium'] as const).map(grade => (
              <button
                key={grade}
                onClick={() => setActiveGrade(grade)}
                className={`px-3 py-1 rounded transition-all font-bold ${activeGrade === grade ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30' : 'text-on-muted hover:text-on-surface border border-transparent'}`}
              >
                {grade}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Estimator Content Area */}
      <div className="relative z-10 flex-grow">
        {estimationMethod === 'rough' ? (
          /* Rough Area Method Screen */
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-headers text-[9px] uppercase tracking-wider font-bold mb-4 animate-fade-in">
            <div className="p-4 bg-bg-deep border border-border-color rounded-xl flex flex-col justify-between">
              <span className="block text-on-faint mb-2">Total Floor Area</span>
              <div>
                <span className="text-2xl font-black text-on-surface tabular-nums font-mono">{floorArea}</span>
                <span className="text-[10px] text-on-muted ml-1 lowercase font-sans">sqm</span>
              </div>
            </div>
            <div className="p-4 bg-bg-deep border border-border-color rounded-xl flex flex-col justify-between">
              <span className="block text-on-faint mb-2">Regional Market Rate</span>
              <div>
                <span className="text-xl font-black text-yellow-500 tabular-nums font-mono">{formatCurrency(REGIONAL_RATES[activeGrade])}</span>
                <span className="text-[10px] text-on-muted ml-1 lowercase font-sans">/ sqm</span>
              </div>
            </div>
            <div className="p-4 bg-bg-deep border border-border-color rounded-xl flex flex-col justify-between">
              <span className="block text-on-faint mb-2">Direct Construction Cost</span>
              <div>
                <span className="text-xl font-black text-on-surface tabular-nums font-mono">{formatCurrency(directCost)}</span>
                <span className="text-[10px] text-on-faint ml-1 font-normal font-sans">Estimated Base</span>
              </div>
            </div>
          </div>
        ) : (
          /* Detailed BOQ Takeoff Screen */
          <div className="space-y-4 animate-fade-in">
            {/* Interactive Bill of Materials Table */}
            <div className="overflow-x-auto scrollbar-thin max-h-[280px] border border-border-color rounded-xl bg-bg-deep/30 p-3 font-mono">
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
                        className="w-16 text-center bg-bg-deep/50 border border-border-color rounded py-0.5 font-bold text-on-surface font-mono"
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
                        className="w-16 text-center bg-bg-deep/50 border border-border-color rounded py-0.5 font-bold text-on-surface font-mono"
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
                        className="w-16 text-center bg-bg-deep/50 border border-border-color rounded py-0.5 font-bold text-on-surface font-mono"
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
                        className="w-16 text-center bg-bg-deep/50 border border-border-color rounded py-0.5 font-bold text-on-surface font-mono"
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
                        className="w-16 text-center bg-bg-deep/50 border border-border-color rounded py-0.5 font-bold text-on-surface font-mono"
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
                        className="w-16 text-center bg-bg-deep/50 border border-border-color rounded py-0.5 font-bold text-on-surface font-mono"
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
                        className="w-16 text-center bg-bg-deep/50 border border-border-color rounded py-0.5 font-bold text-on-surface font-mono"
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
                        className="w-16 text-center bg-bg-deep/50 border border-border-color rounded py-0.5 font-bold text-on-surface font-mono"
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
                        className="w-16 text-center bg-bg-deep/50 border border-border-color rounded py-0.5 font-bold text-on-surface font-mono"
                      />
                    </td>
                    <td className="py-2.5 text-right font-extrabold text-on-surface tabular-nums">{formatCurrency(openingsCost)}</td>
                  </tr>

                  {/* Custom Materials Added by User */}
                  {customMaterials.map(item => (
                    <tr key={item.id} className={`hover:bg-white/5 transition-colors ${!item.included ? 'opacity-35' : ''}`}>
                      <td className="py-2.5">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={item.included} 
                            onChange={() => toggleCustomIncluded(item.id)}
                            className="sr-only peer"
                          />
                          <div className="w-7 h-4 bg-bg-deep border border-border-color peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-3 peer-checked:after:bg-white after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-text-muted after:rounded-full after:h-2.5 after:w-2.5 after:transition-all peer-checked:bg-yellow-500 transition-all"></div>
                        </label>
                      </td>
                      <td className="py-2.5 font-bold text-on-surface font-sans">
                        <div className="flex items-center gap-1.5">
                          <button 
                            onClick={() => handleDeleteCustomItem(item.id)}
                            className="text-red-500 hover:text-red-400 p-0.5 rounded hover:bg-red-500/10 transition-colors flex-shrink-0"
                            title="Delete custom item"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                          <span>{item.name}</span>
                        </div>
                      </td>
                      <td className="py-2.5 text-center font-bold tabular-nums text-primary">
                        <div className="flex items-center justify-center gap-1">
                          <input 
                            type="number" 
                            value={item.qty} 
                            onChange={(e) => handleCustomQtyChange(item.id, e.target.value)}
                            className="w-10 text-center bg-bg-deep/50 border border-border-color rounded py-0.5 font-bold text-on-surface font-mono"
                          />
                          <span className="text-[10px] text-on-muted lowercase font-sans">{item.unit}</span>
                        </div>
                      </td>
                      <td className="py-2.5 text-center">
                        <input 
                          type="number" 
                          value={item.price} 
                          onChange={(e) => handleCustomPriceChange(item.id, e.target.value)}
                          className="w-16 text-center bg-bg-deep/50 border border-border-color rounded py-0.5 font-bold text-on-surface font-mono"
                        />
                      </td>
                      <td className="py-2.5 text-right font-extrabold text-on-surface tabular-nums">
                        {formatCurrency(item.included ? item.qty * item.price : 0)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Add Custom Material Inline Form */}
            <div className="p-3.5 bg-bg-deep/20 border border-border-color/60 rounded-xl relative z-10 font-sans">
              <p className="text-[9px] text-on-faint uppercase tracking-wider font-extrabold mb-2 font-headers">ADD CUSTOM MATERIAL / WORK ITEM</p>
              <div className="flex flex-col sm:flex-row gap-2">
                <input 
                  type="text"
                  placeholder="Item Name (e.g., PVC Pipe, Plywood, Tile Adhesive)"
                  value={newItem.name}
                  onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
                  className="flex-grow text-xs bg-bg-deep/50 border border-border-color rounded px-3 py-2 font-sans text-on-surface placeholder:text-on-faint font-medium focus:outline-none focus:border-yellow-500/50"
                />
                <div className="flex gap-2 flex-shrink-0">
                  <input 
                    type="number"
                    placeholder="Qty"
                    value={newItem.qty || ''}
                    onChange={(e) => setNewItem(prev => ({ ...prev, qty: Math.max(1, parseInt(e.target.value) || 0) }))}
                    className="w-16 text-xs bg-bg-deep/50 border border-border-color rounded px-2 text-center py-2 font-mono text-on-surface focus:outline-none focus:border-yellow-500/50"
                  />
                  <input 
                    type="text"
                    placeholder="Unit (e.g. Pcs)"
                    value={newItem.unit}
                    onChange={(e) => setNewItem(prev => ({ ...prev, unit: e.target.value }))}
                    className="w-20 text-xs bg-bg-deep/50 border border-border-color rounded px-2 text-center py-2 font-sans text-on-surface placeholder:text-on-faint focus:outline-none focus:border-yellow-500/50"
                  />
                  <input 
                    type="number"
                    placeholder="Price"
                    value={newItem.price || ''}
                    onChange={(e) => setNewItem(prev => ({ ...prev, price: Math.max(0, parseFloat(e.target.value) || 0) }))}
                    className="w-20 text-xs bg-bg-deep/50 border border-border-color rounded px-2 text-center py-2 font-mono text-on-surface focus:outline-none focus:border-yellow-500/50"
                  />
                  <button 
                    onClick={handleAddCustomItem}
                    className="px-3 bg-gradient-to-br from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-white font-bold rounded flex items-center justify-center transition-all shadow-[0_0_10px_rgba(245,158,11,0.2)] border border-yellow-500/20 active:scale-95"
                    title="Add Custom Item"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Direct Cost Components Grid */}
            <div className="grid grid-cols-2 gap-4 font-headers text-[9px] uppercase tracking-wider font-bold">
              <div className="p-3 bg-bg-deep border border-border-color rounded-xl">
                <span className="block text-on-faint mb-1">Direct Materials (60%)</span>
                <span className="text-sm font-bold text-on-surface tabular-nums font-mono">{formatCurrency(totalDetailedMaterials)}</span>
              </div>
              <div className="p-3 bg-bg-deep border border-border-color rounded-xl">
                <span className="block text-on-faint mb-1">Estimated Labor (40%)</span>
                <span className="text-sm font-bold text-on-surface tabular-nums font-mono">{formatCurrency(detailedLabor)}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Indirect Costs & Adjustments Panel */}
      <div className="relative z-10 border-t border-border-color pt-5 space-y-5">
        <div className="flex items-center gap-2 font-headers">
          <div className="w-6 h-6 rounded-lg bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-xs">🛠️</div>
          <h4 className="text-xs font-bold text-on-surface uppercase tracking-wider">Indirect Costs &amp; Adjustments</h4>
        </div>

        {/* Adjustments Sliders */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Slider 1: Overhead & Profit */}
          <div className="space-y-2 p-4 rounded-xl bg-bg-deep/30 border border-border-color">
            <div className="flex justify-between items-center text-[9px] font-extrabold uppercase font-headers">
              <span className="text-on-muted">Contractor Overhead &amp; Profit</span>
              <span className="text-yellow-500 font-mono text-[10px]">{overheadProfitPct}% ({formatCurrency(overheadProfitCost)})</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[8px] text-on-faint font-mono font-bold">10%</span>
              <input 
                type="range" 
                min={10} 
                max={20} 
                step={1}
                value={overheadProfitPct}
                onChange={(e) => setOverheadProfitPct(Number(e.target.value))}
                className="flex-grow h-1 bg-bg-deep border border-border-color rounded-lg appearance-none cursor-pointer accent-yellow-500"
              />
              <span className="text-[8px] text-on-faint font-mono font-bold">20%</span>
            </div>
          </div>

          {/* Slider 2: Contingency Buffer */}
          <div className="space-y-2 p-4 rounded-xl bg-bg-deep/30 border border-border-color">
            <div className="flex justify-between items-center text-[9px] font-extrabold uppercase font-headers">
              <span className="text-on-muted">Project Contingency Buffer</span>
              <span className="text-yellow-500 font-mono text-[10px]">{contingencyPct}% ({formatCurrency(contingencyCost)})</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[8px] text-on-faint font-mono font-bold">5%</span>
              <input 
                type="range" 
                min={5} 
                max={15} 
                step={1}
                value={contingencyPct}
                onChange={(e) => setContingencyPct(Number(e.target.value))}
                className="flex-grow h-1 bg-bg-deep border border-border-color rounded-lg appearance-none cursor-pointer accent-yellow-500"
              />
              <span className="text-[8px] text-on-faint font-mono font-bold">15%</span>
            </div>
          </div>
        </div>

        {/* Regulatory Permits & Insurance Checklist */}
        <div className="p-4 rounded-xl bg-bg-deep/30 border border-border-color space-y-3">
          <div className="flex justify-between items-center text-[9px] font-extrabold uppercase font-headers">
            <span className="text-on-muted">Permits, Clearances &amp; Insurance</span>
            <span className="text-yellow-500 font-mono text-[10px]">Total: {formatCurrency(permitsCost)}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {/* Barangay */}
            <label className={`flex items-center justify-between p-2 rounded-lg border cursor-pointer hover:bg-white/5 transition-all text-[10px] ${includedPermits.barangay ? 'bg-yellow-500/5 border-yellow-500/30' : 'bg-transparent border-border-color/60'}`}>
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  checked={includedPermits.barangay} 
                  onChange={() => togglePermit('barangay')}
                  className="rounded border-border-color text-yellow-500 focus:ring-yellow-500 h-3 w-3 bg-bg-deep"
                />
                <span className="font-semibold text-on-surface font-sans">Barangay Clearance</span>
              </div>
              <span className="font-bold text-on-muted font-mono">{formatCurrency(1000)}</span>
            </label>

            {/* Zoning */}
            <label className={`flex items-center justify-between p-2 rounded-lg border cursor-pointer hover:bg-white/5 transition-all text-[10px] ${includedPermits.zoning ? 'bg-yellow-500/5 border-yellow-500/30' : 'bg-transparent border-border-color/60'}`}>
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  checked={includedPermits.zoning} 
                  onChange={() => togglePermit('zoning')}
                  className="rounded border-border-color text-yellow-500 focus:ring-yellow-500 h-3 w-3 bg-bg-deep"
                />
                <span className="font-semibold text-on-surface font-sans">Zoning Certificate</span>
              </div>
              <span className="font-bold text-on-muted font-mono">{formatCurrency(2500)}</span>
            </label>

            {/* Building Permit */}
            <label className={`flex items-center justify-between p-2 rounded-lg border cursor-pointer hover:bg-white/5 transition-all text-[10px] ${includedPermits.building ? 'bg-yellow-500/5 border-yellow-500/30' : 'bg-transparent border-border-color/60'}`}>
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  checked={includedPermits.building} 
                  onChange={() => togglePermit('building')}
                  className="rounded border-border-color text-yellow-500 focus:ring-yellow-500 h-3 w-3 bg-bg-deep"
                />
                <span className="font-semibold text-on-surface font-sans">Municipal Building Permit</span>
              </div>
              <span className="font-bold text-on-muted font-mono">{formatCurrency(floorArea * 150)}</span>
            </label>

            {/* Utilities */}
            <label className={`flex items-center justify-between p-2 rounded-lg border cursor-pointer hover:bg-white/5 transition-all text-[10px] ${includedPermits.utilities ? 'bg-yellow-500/5 border-yellow-500/30' : 'bg-transparent border-border-color/60'}`}>
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  checked={includedPermits.utilities} 
                  onChange={() => togglePermit('utilities')}
                  className="rounded border-border-color text-yellow-500 focus:ring-yellow-500 h-3 w-3 bg-bg-deep"
                />
                <span className="font-semibold text-on-surface font-sans">Utilities Connections</span>
              </div>
              <span className="font-bold text-on-muted font-mono">{formatCurrency(8000)}</span>
            </label>

            {/* CARI Insurance */}
            <label className={`flex items-center justify-between p-2 rounded-lg border cursor-pointer hover:bg-white/5 transition-all text-[10px] ${includedPermits.cari ? 'bg-yellow-500/5 border-yellow-500/30' : 'bg-transparent border-border-color/60'}`}>
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  checked={includedPermits.cari} 
                  onChange={() => togglePermit('cari')}
                  className="rounded border-border-color text-yellow-500 focus:ring-yellow-500 h-3 w-3 bg-bg-deep"
                />
                <span className="font-semibold text-on-surface font-sans">All Risk Insurance (CARI)</span>
              </div>
              <span className="font-bold text-on-muted font-mono">{formatCurrency(directCost * 0.005)}</span>
            </label>
          </div>
        </div>
      </div>

      {/* Split Bar & Guidance Tips */}
      <div className="space-y-4 relative z-10">
        {/* Real-time dual split bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-[8px] font-extrabold text-on-faint uppercase tracking-widest font-headers">
            <span>Direct Costs ({totalCost > 0 ? Math.round((directCost / totalCost) * 100) : 75}%)</span>
            <span>Indirect &amp; Adjustments ({totalCost > 0 ? Math.round((totalIndirectCost / totalCost) * 100) : 25}%)</span>
          </div>
          <div className="w-full h-2 bg-bg-deep rounded-full overflow-hidden flex border border-border-color p-[1px]">
            <div 
              style={{ width: `${totalCost > 0 ? (directCost / totalCost) * 100 : 75}%` }} 
              className="h-full bg-gradient-to-r from-yellow-500 to-amber-500 rounded-full transition-all duration-500 ease-out" 
            />
            <div 
              style={{ width: `${totalCost > 0 ? (totalIndirectCost / totalCost) * 100 : 25}%` }} 
              className="h-full bg-white/5 dark:bg-white/5 rounded-full transition-all duration-500 ease-out" 
            />
          </div>
        </div>

        <div className="p-3 bg-yellow-500/5 border border-yellow-500/10 rounded-xl leading-relaxed text-[10px] text-on-muted">
          <p className="flex items-start gap-1.5 leading-relaxed">
            <span className="text-yellow-500 flex-shrink-0 font-bold">💡</span>
            <span>{estimationMethod === 'rough' 
              ? "Area-based method integrates regional Philippine spec rates. Switch to Detailed BOQ to refine raw physical material counts and manually add custom work items."
              : "Detailed BOQ integrates manual ledger adjustments. Ensure to calibrate custom prices or toggle specific material elements to match local hardware supplier quotes."
            }</span>
          </p>
        </div>
      </div>

    </div>
  );
};

export default ConstructionEstimator;
