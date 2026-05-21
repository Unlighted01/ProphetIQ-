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
    
    // Let's rate by combination of ROI and rental yield
    let bestScore = -Infinity;
    let winnerId = null;
    
    comparedProjects.forEach(p => {
      const pricePerSqm = p.predictedPrice / (p.features['Floor_area (sqm)'] || 1);
      // Score = ROI% + Yield% * 2 - (PricePerSqm / 100000)
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
      <div className="glass p-12 rounded-3xl border-dashed border-white/10 flex flex-col items-center justify-center text-center space-y-4 opacity-50 my-12">
        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-2xl">⭐</div>
        <div>
          <h3 className="text-lg font-bold text-text-primary mb-1">Your Engineering Workspace is Empty</h3>
          <p className="text-xs text-text-muted max-w-sm">
            Predict a property price above, then click "Save Site to Cockpit" to bookmark, cross-compare, and evaluate multiple projects side-by-side.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass p-8 rounded-3xl border border-white/10 animate-fade-in my-12 relative overflow-hidden">
      
      {/* Decorative Blob */}
      <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-primary/10 rounded-full blur-[60px] pointer-events-none" />

      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-black text-text-primary tracking-tight">
            Comparison <span className="text-gradient">Cockpit</span>
          </h2>
          <p className="text-xs text-text-muted mt-0.5">
            Evaluate, compare, and rank your bookmarked site predictions ({projects.length} saved)
          </p>
        </div>
        <button
          onClick={onClearAll}
          className="text-[10px] font-bold text-danger border border-danger/30 hover:bg-danger/10 px-3.5 py-1.5 rounded-full uppercase tracking-wider transition-all self-start sm:self-center"
        >
          Clear Workspace
        </button>
      </div>

      {/* Grid of bookmarked cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {projects.map((project) => {
          const isSelected = selectedIds.includes(project.id);
          const pricePerSqm = project.predictedPrice / (project.features['Floor_area (sqm)'] || 1);
          return (
            <div
              key={project.id}
              onClick={() => handleToggleSelect(project.id)}
              className={`glass rounded-2xl p-4 border transition-all duration-300 relative overflow-hidden group cursor-pointer ${
                isSelected 
                  ? 'border-primary/60 bg-primary/5 shadow-[0_8px_32px_rgba(59,130,246,0.15)] translate-y-[-2px]' 
                  : 'border-white/5 bg-white/5 hover:border-white/20'
              }`}
            >
              {/* Checkbox badge */}
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <span className={`w-4 h-4 rounded-full border flex items-center justify-center text-[8px] font-bold transition-all ${
                  isSelected ? 'bg-primary border-primary text-white' : 'border-white/20 bg-black/40'
                }`}>
                  {isSelected && '✓'}
                </span>
              </div>

              {/* Title / Location */}
              <p className="text-[10px] text-text-muted uppercase font-bold tracking-wider mb-1">
                {project.timestamp}
              </p>
              <h3 className="font-extrabold text-sm text-text-primary group-hover:text-primary transition-colors mb-2">
                {project.features.IsCondo === 1 ? 'Condo' : 'House'} in {project.city}
              </h3>

              {/* Price */}
              <p className="text-xl font-black text-white tracking-tight tabular-nums mb-3">
                {phpFmt(project.predictedPrice)}
              </p>

              {/* Quick specs */}
              <div className="grid grid-cols-3 gap-2 text-[10px] text-text-muted border-t border-white/5 pt-2 mb-2">
                <div>
                  <span className="block font-bold">Floor</span>
                  <span className="text-text-secondary font-semibold tabular-nums">{project.features['Floor_area (sqm)']} sqm</span>
                </div>
                <div>
                  <span className="block font-bold">Rooms</span>
                  <span className="text-text-secondary font-semibold tabular-nums">{project.features.Bedrooms}B/{project.features.Bath}T</span>
                </div>
                <div>
                  <span className="block font-bold">ROI (5Yr)</span>
                  <span className="text-accent font-semibold tabular-nums">+{project.roi.toFixed(1)}%</span>
                </div>
              </div>

              {/* Delete button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveProject(project.id);
                  setSelectedIds(prev => prev.filter(item => item !== project.id));
                }}
                className="text-[9px] text-danger/60 hover:text-danger font-bold uppercase tracking-widest mt-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                Delete Card
              </button>
            </div>
          );
        })}
      </div>

      {/* Side-by-Side Comparison Workspace */}
      {comparedProjects.length >= 2 ? (
        <div className="space-y-8 animate-fade-in border-t border-white/10 pt-8 relative z-10">
          <div>
            <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
              Side-by-Side Analysis Matrix
            </h3>
            <p className="text-[10px] text-text-muted uppercase tracking-widest mt-0.5">Evaluating {comparedProjects.length} selected sites</p>
          </div>

          {/* Matrix table */}
          <div className="overflow-x-auto scrollbar-thin rounded-2xl border border-white/5 bg-black/20 p-4">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-[9px] text-text-muted uppercase tracking-wider">
                  <th className="pb-3 font-bold">Parameters</th>
                  {comparedProjects.map((p, idx) => (
                    <th key={p.id} className="pb-3 text-center font-bold relative">
                      {p.id === valueWinnerId && (
                        <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 text-[8px] font-extrabold px-2 py-0.5 rounded-full tracking-widest shadow-md whitespace-nowrap">
                          ⭐ Value Winner
                        </span>
                      )}
                      <span className={`block font-extrabold text-sm ${p.id === valueWinnerId ? 'text-yellow-400 font-black' : 'text-text-primary'}`}>
                        Site {idx + 1} ({p.city})
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {/* Location */}
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="py-3 text-text-muted font-bold uppercase tracking-wider text-[10px]">Location</td>
                  {comparedProjects.map(p => (
                    <td key={p.id} className="py-3 text-center font-bold text-text-primary">{p.city}</td>
                  ))}
                </tr>
                {/* Property Type */}
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="py-3 text-text-muted font-bold uppercase tracking-wider text-[10px]">Property Type</td>
                  {comparedProjects.map(p => (
                    <td key={p.id} className="py-3 text-center font-semibold text-text-primary">{p.features.IsCondo === 1 ? 'Condo / Apartment' : 'House & Lot'}</td>
                  ))}
                </tr>
                {/* Floor Area */}
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="py-3 text-text-muted font-bold uppercase tracking-wider text-[10px]">Floor Area</td>
                  {comparedProjects.map(p => (
                    <td key={p.id} className="py-3 text-center font-bold text-text-primary tabular-nums">{p.features['Floor_area (sqm)']} sqm</td>
                  ))}
                </tr>
                {/* Land Area */}
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="py-3 text-text-muted font-bold uppercase tracking-wider text-[10px]">Land Area</td>
                  {comparedProjects.map(p => (
                    <td key={p.id} className="py-3 text-center font-bold text-text-primary tabular-nums">
                      {p.features.IsCondo === 1 ? '—' : `${p.features['Land_area (sqm)']} sqm`}
                    </td>
                  ))}
                </tr>
                {/* Bedrooms & Bath */}
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="py-3 text-text-muted font-bold uppercase tracking-wider text-[10px]">Bed / Bath</td>
                  {comparedProjects.map(p => (
                    <td key={p.id} className="py-3 text-center font-semibold text-text-primary tabular-nums">
                      {p.features.Bedrooms} Bedrooms · {p.features.Bath} Bath
                    </td>
                  ))}
                </tr>
                {/* Price Estimate */}
                <tr className="hover:bg-white/5 transition-colors bg-white/5">
                  <td className="py-3 text-text-muted font-bold uppercase tracking-wider text-[10px]">Predicted Price</td>
                  {comparedProjects.map(p => (
                    <td key={p.id} className="py-3 text-center font-extrabold text-white text-base tabular-nums">{phpFmt(p.predictedPrice)}</td>
                  ))}
                </tr>
                {/* Est Monthly Rent */}
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="py-3 text-text-muted font-bold uppercase tracking-wider text-[10px]">Est. Monthly Rent</td>
                  {comparedProjects.map(p => (
                    <td key={p.id} className="py-3 text-center font-bold text-accent tabular-nums">{phpFmt(p.rent)}</td>
                  ))}
                </tr>
                {/* Rental Yield */}
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="py-3 text-text-muted font-bold uppercase tracking-wider text-[10px]">Gross Rental Yield</td>
                  {comparedProjects.map(p => (
                    <td key={p.id} className="py-3 text-center font-bold text-accent tabular-nums">{p.yield.toFixed(2)}%</td>
                  ))}
                </tr>
                {/* Projected ROI */}
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="py-3 text-text-muted font-bold uppercase tracking-wider text-[10px]">Projected ROI (5Yr)</td>
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
            <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
              <span className="block text-[10px] text-text-muted uppercase font-bold tracking-wider mb-4">Total Acquisition Price</span>
              <div className="space-y-4">
                {comparedProjects.map((p, idx) => {
                  const percent = maxPrice > 0 ? (p.predictedPrice / maxPrice) * 100 : 0;
                  return (
                    <div key={p.id} className="space-y-1.5">
                      <div className="flex justify-between text-[11px] font-semibold text-text-primary">
                        <span>Site {idx + 1} ({p.city})</span>
                        <span className="tabular-nums font-extrabold">{phpFmt(p.predictedPrice)}</span>
                      </div>
                      <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
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
            <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
              <span className="block text-[10px] text-text-muted uppercase font-bold tracking-wider mb-4">Price per Floor Sqm</span>
              <div className="space-y-4">
                {comparedProjects.map((p, idx) => {
                  const pricePerSqm = p.predictedPrice / (p.features['Floor_area (sqm)'] || 1);
                  const percent = maxPricePerSqm > 0 ? (pricePerSqm / maxPricePerSqm) * 100 : 0;
                  return (
                    <div key={p.id} className="space-y-1.5">
                      <div className="flex justify-between text-[11px] font-semibold text-text-primary">
                        <span>Site {idx + 1} ({p.city})</span>
                        <span className="tabular-nums font-extrabold">{phpFmt(pricePerSqm)}/sqm</span>
                      </div>
                      <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
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
            <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
              <span className="block text-[10px] text-text-muted uppercase font-bold tracking-wider mb-4">5-Year Projected ROI</span>
              <div className="space-y-4">
                {comparedProjects.map((p, idx) => {
                  const percent = maxRoi > 0 ? (p.roi / maxRoi) * 100 : 0;
                  return (
                    <div key={p.id} className="space-y-1.5">
                      <div className="flex justify-between text-[11px] font-semibold text-text-primary">
                        <span>Site {idx + 1} ({p.city})</span>
                        <span className="tabular-nums font-extrabold text-accent">+{p.roi.toFixed(1)}%</span>
                      </div>
                      <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
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
        <div className="p-6 bg-white/5 border border-white/5 rounded-2xl text-center">
          <p className="text-xs font-semibold text-text-muted">
            💡 Select <span className="text-primary font-bold">two or more site cards</span> above to enter Compare Mode and generate side-by-side matrices and charts.
          </p>
        </div>
      )}

    </div>
  );
};

export default SavedComparisonCockpit;
