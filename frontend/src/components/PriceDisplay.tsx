'use client';

import React, { useEffect, useState } from 'react';

interface PriceDisplayProps {
  price: number;
  low: number;
  high: number;
}

function useCountUp(target: number, duration = 1400) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!target || isNaN(target)) { setValue(0); return; }
    let start = 0;
    const step = target / (duration / 10);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setValue(target); clearInterval(timer); }
      else setValue(start);
    }, 10);
    return () => clearInterval(timer);
  }, [target, duration]);
  return value;
}

const fmt = (n: number) => n.toLocaleString('en-PH', { maximumFractionDigits: 0 });

const PriceDisplay: React.FC<PriceDisplayProps> = ({ price, low, high }) => {
  const displayPrice = useCountUp(price);
  const displayLow   = useCountUp(low,  1000);
  const displayHigh  = useCountUp(high, 1600);

  const range = high - low;
  const position = range > 0 ? ((price - low) / range) * 100 : 50;

  return (
    <div className="glass p-8 rounded-2xl flex flex-col items-center space-y-6 animate-fade-in border border-border-color relative overflow-hidden shadow-2xl">
      {/* Precision Corner Grid Lines for Architectural Consoles */}
      <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-primary/30" />
      <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-primary/30" />
      <div className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-primary/30" />
      <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-primary/30" />
      
      {/* Cosmic background glow */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-40 bg-gradient-to-b from-primary/15 to-transparent rounded-full blur-[70px] pointer-events-none" />

      <div className="flex flex-col items-center space-y-1 relative z-10 font-headers">
        <span className="text-[10px] font-bold text-primary uppercase tracking-[0.25em]">
          Telemetry Estimation
        </span>
        <h3 className="text-xs font-bold text-on-muted uppercase tracking-widest">
          Projected Construction Cost
        </h3>
      </div>

      {/* Main price readout */}
      <div className="text-5xl sm:text-6xl font-extrabold text-on-surface tracking-tighter relative z-10 font-headers tabular-nums drop-shadow-[0_0_15px_rgba(6,182,212,0.15)] flex items-baseline">
        <span className="text-3xl text-primary font-bold mr-1">₱</span>
        <span>{fmt(displayPrice)}</span>
      </div>

      {/* Confidence range bar */}
      <div className="w-full relative z-10 px-2 border-t border-border-color/30 pt-5">
        <div className="relative h-2 rounded-full bg-white/5 shadow-inner overflow-visible">
          {/* Gradient scale fill representing conservative to optimistic */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-danger/60 via-warning/60 to-accent/60" />
          
          {/* Needle - engineered layout marker */}
          <div
            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white shadow-[0_0_10px_var(--primary)] border-4 border-primary transition-all duration-[1800ms] cubic-bezier(0.34, 1.56, 0.64, 1) cursor-pointer"
            style={{ left: `calc(${Math.min(Math.max(position, 2), 98)}% - 8px)` }}
          />
        </div>
        
        <div className="flex justify-between mt-3 text-[10px] font-mono leading-tight">
          <span className="text-danger flex flex-col">
            <span className="font-bold">₱{fmt(displayLow)}</span>
            <span className="text-[8px] uppercase tracking-wider opacity-60">Conservative</span>
          </span>
          <span className="text-accent flex flex-col text-right">
            <span className="font-bold">₱{fmt(displayHigh)}</span>
            <span className="text-[8px] uppercase tracking-wider opacity-60">Optimistic</span>
          </span>
        </div>
      </div>

      {/* Technical Status Badge */}
      <div className="flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-1.5 rounded-full relative z-10 font-headers">
        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-telemetry-pulse" />
        <span className="text-[9px] font-bold text-primary uppercase tracking-widest">
          ±10% Cost Budget Range
        </span>
      </div>

      <p className="text-[8px] text-on-faint font-mono uppercase tracking-widest relative z-10 text-center">
        *REPORT_ID: PQ-{Math.floor(100000 + Math.random() * 900000)} // FIRM_COSTING_CYCLE_{new Date().getFullYear()}
      </p>
    </div>
  );
};

export default PriceDisplay;
