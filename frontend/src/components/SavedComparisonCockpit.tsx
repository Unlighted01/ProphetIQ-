'use client';

import React, { useState, useMemo } from 'react';

export interface SavedProject {
  id: string;
  timestamp: string;
  city: string;
  features: {
    Bedrooms: number;
    Bath: number;
    'Floor_area (sqm)': number;
    'Land_area (sqm)': number;
    IsCondo: number;
  };
  predictedPrice: number;
  rent: number;
  yield: number;
  roi: number;
}

interface SavedComparisonCockpitProps {
  projects: SavedProject[];
  onRemoveProject: (id: string) => void;
  onClearAll: () => void;
}

const phpFmt = (n: number) => `₱${Math.round(n).toLocaleString('en-PH', { maximumFractionDigits: 0 })}`;

const SavedComparisonCockpit: React.FC<SavedComparisonCockpitProps> = ({
  projects,
  onRemoveProject,
  onClearAll,
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Toggle selection for comparison
  const handleToggleSelect = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Filter out only selected projects for comparison metrics
  const comparedProjects = useMemo(() => {
    return projects.filter(p => selectedIds.includes(p.id));
  }, [projects, selectedIds]);

  // Determine Value Winner (highest ROI or lowest Price/Sqm)
  const valueWinnerId = useMemo(() => {
    if (comparedProjects.length < 2) return null;
    
    // Rate by combination of ROI, yield, and price/sqm
    let bestScore = -Infinity;
    let winnerId = null;
    
    comparedProjects.forEach(p => {
      const pricePerSqm = p.predictedPrice / (p.features['Floor_area (sqm)'] || 1);
      const score = p.roi + p.yield * 2 - (pricePerSqm / 100000);
      if (score > bestScore) {
        bestScore = score;
        winnerId = p.id;
      }
    });
    
    return winnerId;
  }, [comparedProjects]);

  // Find max values for flex-bar scaling
  const maxPrice = useMemo(() => {
    if (comparedProjects.length === 0) return 0;
    return Math.max(...comparedProjects.map(p => p.predictedPrice));
  }, [comparedProjects]);

  const maxRoi = useMemo(() => {
    if (comparedProjects.length === 0) return 0;
    return Math.max(...comparedProjects.map(p => p.roi));
  }, [comparedProjects]);

  const maxPricePerSqm = useMemo(() => {
    if (comparedProjects.length === 0) return 0;
    return Math.max(...comparedProjects.map(p => p.predictedPrice / (p.features['Floor_area (sqm)'] || 1)));
  }, [comparedProjects]);

  if (projects.length === 0) {
    return (
      <div className="glass p-12 rounded-3xl border border-dashed border-border-color flex flex-col items-center justify-center text-center space-y-4 opacity-50 my-12 shadow-sm font-headers">
        <div className="w-16 h-16 rounded-full bg-bg-surface flex items-center justify-center text-2xl shadow-inner">⭐</div>
        <div>
          <h3 className="text-lg font-bold text-on-surface mb-1 uppercase tracking-tight">Engineering Workspace Empty</h3>
          <p className="text-xs text-on-muted max-w-sm font-sans normal-case leading-relaxed">
            Predict a property price above, then click "Save Site to Cockpit" to bookmark, cross-compare, and evaluate multiple projects side-by-side.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass p-8 rounded-3xl border border-border-color animate-fade-in my-12 relative overflow-hidden shadow-lg">
      
      {/* Decorative Blob */}
      <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-primary/10 rounded-full blur-[60px] pointer-events-none" />

      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 font-headers">
        <div>
          <h2 className="text-2xl font-black text-on-surface tracking-tight uppercase">
            Comparison <span className="text-gradient">Cockpit</span>
          </h2>
          <p className="text-[10px] text-on-faint font-bold uppercase tracking-widest mt-0.5">
            Evaluate, rank, and analyze bookmarked project parameters ({projects.length} sites saved)
          </p>
        </div>
        <button
          onClick={onClearAll}
          className="text-[9px] font-extrabold text-danger border border-danger/30 hover:bg-danger/10 px-4 py-2 rounded-full uppercase tracking-widest transition-all self-start sm:self-center"
        >
          Clear Workspace
        </button>
      </div>

      {/* Grid of bookmarked cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mb-8">
        {projects.map((project, idx) => {
          const isSelected = selectedIds.includes(project.id);
          const pricePerSqm = project.predictedPrice / (project.features['Floor_area (sqm)'] || 1);
          return (
            <div
              key={project.id}
              onClick={() => handleToggleSelect(project.id)}
              className={`glass rounded-2xl p-5 border transition-all duration-300 relative overflow-hidden group cursor-pointer ${
                isSelected 
                  ? 'border-primary/60 bg-primary/5 shadow-[0_8px_32px_rgba(6,182,212,0.12)] translate-y-[-2px]' 
                  : 'border-border-color bg-white/5 hover:border-primary/35'
              }`}
            >
              {/* Checkbox badge */}
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <span className={`w-4 h-4 rounded-full border flex items-center justify-center text-[8px] font-bold transition-all ${
                  isSelected ? 'bg-primary border-primary text-white shadow-[0_0_8px_var(--border-glow)]' : 'border-border-color bg-bg-deep/40'
                }`}>
                  {isSelected && '✓'}
                </span>
              </div>

              {/* Title / Coordinates index */}
              <div className="flex justify-between items-center mb-3 font-mono text-[9px] text-on-faint border-b border-border-color/30 pb-2 font-bold uppercase tracking-wider">
                <span>SITE // 0{idx + 1}</span>
                <span>{project.features.IsCondo === 1 ? 'CONDO' : 'HOUSE'}</span>
              </div>

              <p className="text-[9px] text-on-faint uppercase font-bold tracking-wider mb-1">
                {project.timestamp}
              </p>
              <h3 className="font-extrabold text-sm text-on-surface group-hover:text-primary transition-colors mb-2 font-headers uppercase leading-tight">
                {project.city} Site
              </h3>

              {/* Price */}
              <p className="text-xl font-black text-on-surface tracking-tight tabular-nums font-mono mb-3">
                {phpFmt(project.predictedPrice)}
              </p>

              {/* Quick specs */}
              <div className="grid grid-cols-3 gap-2 text-[9px] text-on-faint border-t border-border-color/30 pt-3 mb-2 font-mono uppercase font-bold">
                <div>
                  <span className="block text-on-muted">Floor</span>
                  <span className="text-on-surface font-extrabold tabular-nums font-sans normal-case text-xs mt-0.5 block">{project.features['Floor_area (sqm)']} sqm</span>
                </div>
                <div>
                  <span className="block text-on-muted">Bed/Bath</span>
                  <span className="text-on-surface font-extrabold tabular-nums font-sans normal-case text-xs mt-0.5 block">{project.features.Bedrooms}B/{project.features.Bath}T</span>
                </div>
                <div>
                  <span className="block text-on-muted">ROI (5Y)</span>
                  <span className="text-accent font-extrabold tabular-nums font-sans normal-case text-xs mt-0.5 block">+{project.roi.toFixed(1)}%</span>
                </div>
              </div>

              {/* Delete button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveProject(project.id);
                  setSelectedIds(prev => prev.filter(item => item !== project.id));
                }}
                className="text-[9px] text-danger/60 hover:text-danger font-extrabold uppercase tracking-widest mt-2 opacity-0 group-hover:opacity-100 transition-opacity font-headers"
              >
                Delete Card
              </button>
            </div>
          );
        })}
      </div>

      {/* Side-by-Side Comparison Workspace */}
      {comparedProjects.length >= 2 ? (
        <div className="space-y-8 animate-fade-in border-t border-border-color pt-8 relative z-10">
          <div className="font-headers">
            <h3 className="text-lg font-bold text-on-surface flex items-center gap-2 uppercase">
              <span className="w-2 h-2 rounded-full bg-primary animate-telemetry-pulse" />
              Side-by-Side Analysis Matrix
            </h3>
            <p className="text-[9px] text-on-faint uppercase tracking-widest font-bold mt-0.5">Evaluating {comparedProjects.length} selected sites</p>
          </div>

          {/* Matrix table */}
          <div className="overflow-x-auto scrollbar-thin rounded-2xl border border-border-color bg-bg-deep/30 p-4 shadow-inner">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border-color text-[8px] text-on-faint uppercase tracking-widest font-headers">
                  <th className="pb-3 font-extrabold">Parameters</th>
                  {comparedProjects.map((p, idx) => (
                    <th key={p.id} className="pb-3 text-center font-extrabold relative">
                      {p.id === valueWinnerId && (
                        <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-accent/20 text-accent border border-accent/30 text-[7px] font-black px-2.5 py-0.5 rounded-full tracking-widest shadow-md whitespace-nowrap animate-pulse">
                          ★ Winner
                        </span>
                      )}
                      <span className={`block font-extrabold text-sm ${p.id === valueWinnerId ? 'text-accent font-black' : 'text-on-surface'}`}>
                        Site 0{idx + 1} ({p.city})
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-dotted divide-border-color font-mono text-[11px] text-on-muted">
                {/* Location */}
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="py-3 text-on-faint font-extrabold uppercase tracking-widest text-[9px] font-headers">Location</td>
                  {comparedProjects.map(p => (
                    <td key={p.id} className="py-3 text-center font-bold text-on-surface font-sans uppercase">{p.city}</td>
                  ))}
                </tr>
                {/* Property Type */}
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="py-3 text-on-faint font-extrabold uppercase tracking-widest text-[9px] font-headers">Property Type</td>
                  {comparedProjects.map(p => (
                    <td key={p.id} className="py-3 text-center font-semibold text-on-surface font-sans">{p.features.IsCondo === 1 ? 'Condo / Apartment' : 'House & Lot'}</td>
                  ))}
                </tr>
                {/* Floor Area */}
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="py-3 text-on-faint font-extrabold uppercase tracking-widest text-[9px] font-headers">Floor Area</td>
                  {comparedProjects.map(p => (
                    <td key={p.id} className="py-3 text-center font-bold text-on-surface tabular-nums">{p.features['Floor_area (sqm)']} sqm</td>
                  ))}
                </tr>
                {/* Land Area */}
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="py-3 text-on-faint font-extrabold uppercase tracking-widest text-[9px] font-headers">Land Area</td>
                  {comparedProjects.map(p => (
                    <td key={p.id} className="py-3 text-center font-bold text-on-surface tabular-nums">
                      {p.features.IsCondo === 1 ? '—' : `${p.features['Land_area (sqm)']} sqm`}
                    </td>
                  ))}
                </tr>
                {/* Bedrooms & Bath */}
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="py-3 text-on-faint font-extrabold uppercase tracking-widest text-[9px] font-headers">Bed / Bath</td>
                  {comparedProjects.map(p => (
                    <td key={p.id} className="py-3 text-center font-semibold text-on-surface tabular-nums">
                      {p.features.Bedrooms} Bedrooms · {p.features.Bath} Bath
                    </td>
                  ))}
                </tr>
                {/* Price Estimate */}
                <tr className="hover:bg-white/5 transition-colors bg-bg-deep/50">
                  <td className="py-3 text-on-faint font-extrabold uppercase tracking-widest text-[9px] font-headers">Predicted Price</td>
                  {comparedProjects.map(p => (
                    <td key={p.id} className="py-3 text-center font-extrabold text-on-surface text-base tabular-nums">{phpFmt(p.predictedPrice)}</td>
                  ))}
                </tr>
                {/* Est Monthly Rent */}
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="py-3 text-on-faint font-extrabold uppercase tracking-widest text-[9px] font-headers">Est. Monthly Rent</td>
                  {comparedProjects.map(p => (
                    <td key={p.id} className="py-3 text-center font-bold text-accent tabular-nums">{phpFmt(p.rent)}</td>
                  ))}
                </tr>
                {/* Rental Yield */}
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="py-3 text-on-faint font-extrabold uppercase tracking-widest text-[9px] font-headers">Gross Rental Yield</td>
                  {comparedProjects.map(p => (
                    <td key={p.id} className="py-3 text-center font-bold text-accent tabular-nums">{p.yield.toFixed(2)}%</td>
                  ))}
                </tr>
                {/* Projected ROI */}
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="py-3 text-on-faint font-extrabold uppercase tracking-widest text-[9px] font-headers">Projected ROI (5Yr)</td>
                  {comparedProjects.map(p => (
                    <td key={p.id} className="py-3 text-center font-extrabold text-accent tabular-nums">+{p.roi.toFixed(1)}%</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          {/* High-Fidelity Comparison Charts (CSS Flex Bars) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Chart 1: Total Price Comparison */}
            <div className="bg-bg-deep/20 rounded-2xl p-5 border border-border-color">
              <span className="block text-[9px] text-on-faint uppercase font-bold tracking-widest mb-4 font-headers">Total Acquisition Price</span>
              <div className="space-y-4">
                {comparedProjects.map((p, idx) => {
                  const percent = maxPrice > 0 ? (p.predictedPrice / maxPrice) * 100 : 0;
                  return (
                    <div key={p.id} className="space-y-1.5">
                      <div className="flex justify-between text-[11px] font-semibold text-on-surface">
                        <span className="font-headers">Site 0{idx + 1} ({p.city})</span>
                        <span className="tabular-nums font-bold font-mono">{phpFmt(p.predictedPrice)}</span>
                      </div>
                      <div className="w-full h-1.5 bg-bg-deep rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-primary to-blue-500 rounded-full transition-all duration-500" 
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Chart 2: Price per Floor Sqm Comparison */}
            <div className="bg-bg-deep/20 rounded-2xl p-5 border border-border-color">
              <span className="block text-[9px] text-on-faint uppercase font-bold tracking-widest mb-4 font-headers">Price per Floor Sqm</span>
              <div className="space-y-4">
                {comparedProjects.map((p, idx) => {
                  const pricePerSqm = p.predictedPrice / (p.features['Floor_area (sqm)'] || 1);
                  const percent = maxPricePerSqm > 0 ? (pricePerSqm / maxPricePerSqm) * 100 : 0;
                  return (
                    <div key={p.id} className="space-y-1.5">
                      <div className="flex justify-between text-[11px] font-semibold text-on-surface">
                        <span className="font-headers">Site 0{idx + 1} ({p.city})</span>
                        <span className="tabular-nums font-bold font-mono">{phpFmt(pricePerSqm)}/sqm</span>
                      </div>
                      <div className="w-full h-1.5 bg-bg-deep rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-yellow-500 to-amber-500 rounded-full transition-all duration-500" 
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Chart 3: 5-Year Projected ROI Comparison */}
            <div className="bg-bg-deep/20 rounded-2xl p-5 border border-border-color">
              <span className="block text-[9px] text-on-faint uppercase font-bold tracking-widest mb-4 font-headers">5-Year Projected ROI</span>
              <div className="space-y-4">
                {comparedProjects.map((p, idx) => {
                  const percent = maxRoi > 0 ? (p.roi / maxRoi) * 100 : 0;
                  return (
                    <div key={p.id} className="space-y-1.5">
                      <div className="flex justify-between text-[11px] font-semibold text-on-surface">
                        <span className="font-headers">Site 0{idx + 1} ({p.city})</span>
                        <span className="tabular-nums font-bold font-mono text-accent">+{p.roi.toFixed(1)}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-bg-deep rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-accent to-emerald-500 rounded-full transition-all duration-500" 
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      ) : (
        <div className="p-4 bg-bg-deep/30 border border-border-color rounded-2xl text-center">
          <p className="text-xs font-semibold text-on-muted leading-relaxed">
            💡 Select <span className="text-primary font-bold">two or more site cards</span> above to enter Compare Mode and generate side-by-side matrices and charts.
          </p>
        </div>
      )}

    </div>
  );
};

export default SavedComparisonCockpit;
