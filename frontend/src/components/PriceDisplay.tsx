'use client';

import React, { useEffect, useState } from 'react';

interface PriceDisplayProps {
  price: number;
  low: number;
  high: number;
}

const PriceDisplay: React.FC<PriceDisplayProps> = ({ price, low, high }) => {
  const [displayPrice, setDisplayPrice] = useState(0);

  useEffect(() => {
    if (!price || isNaN(price)) {
      setDisplayPrice(0);
      return;
    }
    
    let start = 0;
    const end = price;
    const duration = 1500;
    const stepTime = 10;
    const increment = end / (duration / stepTime);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setDisplayPrice(end);
        clearInterval(timer);
      } else {
        setDisplayPrice(start);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [price]);

  return (
    <div className="glass p-8 rounded-2xl flex flex-col items-center justify-center space-y-4 animate-fade-in">
      <span className="text-sm font-bold text-text-secondary uppercase tracking-[0.2em]">Estimated Market Value</span>
      
      <div className="text-6xl font-black text-white tracking-tighter">
        ₱{displayPrice.toLocaleString(undefined, { maximumFractionDigits: 0 })}
      </div>
      
      <div className="flex items-center space-x-4 w-full pt-4 border-t border-white/10">
        <div className="flex-1 text-center">
          <span className="block text-[10px] text-text-muted uppercase mb-1">Conservative</span>
          <span className="text-sm font-medium">₱{low.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
        </div>
        
        <div className="h-8 w-px bg-white/10"></div>
        
        <div className="flex-1 text-center">
          <span className="block text-[10px] text-text-muted uppercase mb-1">Optimistic</span>
          <span className="text-sm font-medium">₱{high.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
        </div>
      </div>
      
      <p className="text-[10px] text-text-muted italic pt-2">
        *Based on real-time XGBoost analysis of {new Date().getFullYear()} market data.
      </p>
    </div>
  );
};

export default PriceDisplay;
