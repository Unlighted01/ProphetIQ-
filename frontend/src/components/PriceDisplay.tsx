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
    <div className="glass p-8 rounded-2xl flex flex-col items-center space-y-5 animate-fade-in relative overflow-hidden">
      {/* Glow blob */}
      <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-64 h-32 bg-primary/20 rounded-full blur-[60px] pointer-events-none" />

      <span className="text-xs font-bold text-text-secondary uppercase tracking-[0.25em] relative z-10">
        Estimated Market Value
      </span>

      {/* Main price */}
      <div className="text-5xl sm:text-6xl font-black text-text-primary tracking-tighter relative z-10 tabular-nums">
        ₱{fmt(displayPrice)}
      </div>

      {/* Confidence range bar */}
      <div className="w-full relative z-10 px-2">
        <div className="relative h-2 rounded-full bg-white/10 overflow-visible">
          {/* Gradient fill */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-danger/50 via-yellow-500/50 to-accent/50" />
          {/* Needle */}
          <div
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)] border-2 border-primary transition-all duration-[1500ms]"
            style={{ left: `calc(${Math.min(Math.max(position, 2), 98)}% - 6px)` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-[10px] text-text-muted font-medium">
          <span className="text-danger">₱{fmt(displayLow)}<br /><span className="text-[9px] uppercase opacity-60">Conservative</span></span>
          <span className="text-accent text-right">₱{fmt(displayHigh)}<br /><span className="text-[9px] uppercase opacity-60">Optimistic</span></span>
        </div>
      </div>

      {/* Confidence badge */}
      <div className="flex items-center gap-2 bg-accent/10 border border-accent/20 px-4 py-1.5 rounded-full relative z-10">
        <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
        <span className="text-[10px] font-bold text-accent uppercase tracking-widest">±10% Confidence Interval</span>
      </div>

      <p className="text-[10px] text-text-muted italic relative z-10 text-center">
        *XGBoost analysis of {new Date().getFullYear()} Philippine real estate market data.
      </p>
    </div>
  );
};

export default PriceDisplay;
