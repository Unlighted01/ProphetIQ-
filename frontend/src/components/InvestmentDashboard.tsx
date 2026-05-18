'use client';

import React, { useEffect, useState } from 'react';

interface InvestmentData {
  monthly_payment_php: number;
  estimated_monthly_rent_php: number;
  gross_rental_yield_pct: number;
  annual_cash_flow_php: number;
  roi_5yr_pct: number;
}

interface InvestmentDashboardProps {
  data: InvestmentData | null;
  isLoading: boolean;
}

function useCountUp(target: number | null, duration = 1200) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (target === null || isNaN(target)) { setValue(0); return; }
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

const phpFmt = (n: number) => `₱${Math.abs(n).toLocaleString('en-PH', { maximumFractionDigits: 0 })}`;

const MetricCard: React.FC<{
  label: string;
  value: string;
  sub?: string;
  subValue?: string;
  subColor?: string;
  className?: string;
  delay?: number;
}> = ({ label, value, sub, subValue, subColor = 'text-text-muted', className = '', delay = 0 }) => (
  <div
    className={`rounded-xl p-4 border border-white/5 bg-white/5 hover:border-white/20 hover:-translate-y-0.5 transition-all duration-200 ${className}`}
    style={{ animationDelay: `${delay}ms` }}
  >
    <span className="block text-[10px] text-text-muted uppercase tracking-wider mb-2">{label}</span>
    <span className="text-2xl font-black text-white tabular-nums">{value}</span>
    {sub && subValue && (
      <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/10">
        <span className="text-[10px] text-text-muted">{sub}</span>
        <span className={`text-xs font-bold ${subColor}`}>{subValue}</span>
      </div>
    )}
  </div>
);

const InvestmentDashboard: React.FC<InvestmentDashboardProps> = ({ data, isLoading }) => {
  const mortgage    = useCountUp(data?.monthly_payment_php ?? null);
  const rent        = useCountUp(data?.estimated_monthly_rent_php ?? null, 1000);
  const cashFlow    = useCountUp(data ? Math.abs(data.annual_cash_flow_php) : null, 1400);

  if (isLoading) {
    return (
      <div className="glass p-8 rounded-2xl border border-white/5">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-xl bg-white/10 animate-pulse" />
          <div className="h-4 w-40 bg-white/10 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[1,2,3,4].map(i => (
            <div key={i} className="h-24 bg-white/5 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!data) return null;

  const isCashFlowPositive = data.annual_cash_flow_php >= 0;

  // ROI sentiment
  const roi = data.roi_5yr_pct;
  const roiColor = roi > 30 ? 'text-accent' : roi > 0 ? 'text-yellow-400' : 'text-danger';

  return (
    <div className="glass p-8 rounded-2xl border border-white/10 animate-fade-in relative overflow-hidden" style={{ animationDelay: '0.15s' }}>
      {/* Decorative blob */}
      <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-emerald-500/10 rounded-full blur-[60px] pointer-events-none" />

      {/* Header */}
      <div className="flex items-center gap-3 mb-6 relative z-10">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-[0_0_12px_rgba(16,185,129,0.4)] flex-shrink-0">
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-bold text-white leading-tight">Investment Analysis</h3>
          <p className="text-[10px] text-text-muted uppercase tracking-widest">20yr • 20% down • 8% rate</p>
        </div>
      </div>

      {/* Metrics grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
        <MetricCard
          label="Est. Monthly Mortgage"
          value={phpFmt(mortgage)}
          sub="Loan term"
          subValue="20 years"
          delay={0}
        />

        <MetricCard
          label="Est. Monthly Rent Income"
          value={phpFmt(rent)}
          sub="Gross Yield"
          subValue={`${data.gross_rental_yield_pct.toFixed(1)}%`}
          subColor="text-accent"
          delay={80}
        />

        <div
          className={`rounded-xl p-4 border hover:-translate-y-0.5 transition-all duration-200 ${
            isCashFlowPositive
              ? 'bg-accent/10 border-accent/30 hover:border-accent/50'
              : 'bg-yellow-500/10 border-yellow-500/30 hover:border-yellow-500/50'
          }`}
          style={{ animationDelay: '160ms' }}
        >
          <span className="block text-[10px] text-text-muted uppercase tracking-wider mb-2">Annual Cash Flow</span>
          <span className={`text-2xl font-black tabular-nums ${isCashFlowPositive ? 'text-accent' : 'text-yellow-400'}`}>
            {isCashFlowPositive ? '+' : '-'}{phpFmt(cashFlow)}
          </span>
          <p className="text-[10px] text-text-muted mt-2 pt-2 border-t border-white/10">
            {isCashFlowPositive ? '✓ Rent covers mortgage payments.' : '⚠ Mortgage exceeds rental income.'}
          </p>
        </div>

        {/* ROI — hero card */}
        <div
          className="bg-gradient-to-br from-primary/25 to-secondary/25 rounded-xl p-4 border border-primary/30 hover:border-primary/60 hover:-translate-y-0.5 transition-all duration-200 relative overflow-hidden"
          style={{ animationDelay: '240ms' }}
        >
          <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-primary/30 rounded-full blur-xl" />
          <span className="block text-[10px] text-white/70 uppercase tracking-wider mb-2 relative z-10">
            5-Year Projected ROI
          </span>
          <span className={`text-3xl font-black relative z-10 tabular-nums ${roiColor}`}>
            {roi >= 0 ? '+' : ''}{roi.toFixed(1)}%
          </span>
          <p className="text-[10px] text-white/50 mt-2 pt-2 border-t border-white/10 relative z-10">
            Assumes 5% annual appreciation (PH average).
          </p>
        </div>
      </div>
    </div>
  );
};

export default InvestmentDashboard;
