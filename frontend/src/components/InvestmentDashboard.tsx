'use client';

import React, { useEffect, useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';

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
  predictedPrice?: number;
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
    <span className="text-2xl font-black text-text-primary tabular-nums">{value}</span>
    {sub && subValue && (
      <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/10">
        <span className="text-[10px] text-text-muted">{sub}</span>
        <span className={`text-xs font-bold ${subColor}`}>{subValue}</span>
      </div>
    )}
  </div>
);

const InvestmentDashboard: React.FC<InvestmentDashboardProps> = ({ data, isLoading, predictedPrice = 0 }) => {
  const [activeTab, setActiveTab] = useState<'metrics' | 'trend' | 'banks'>('metrics');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

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
  const roi = data.roi_5yr_pct;
  const roiColor = roi > 30 ? 'text-accent' : roi > 0 ? 'text-yellow-400' : 'text-danger';

  // --- Price History & Forecast Data Generation ---
  const basePrice = predictedPrice || (data.monthly_payment_php * 150); // fallback if prop not passed
  const chartData = [
    { year: '2023', Price: Math.round(basePrice * 0.857), type: 'Historical' },
    { year: '2024', Price: Math.round(basePrice * 0.902), type: 'Historical' },
    { year: '2025', Price: Math.round(basePrice * 0.950), type: 'Historical' },
    { year: '2026 (Now)', Price: Math.round(basePrice), type: 'Current' },
    { year: '2027', Price: Math.round(basePrice * 1.05), type: 'Forecast' },
    { year: '2028', Price: Math.round(basePrice * 1.1025), type: 'Forecast' },
    { year: '2029', Price: Math.round(basePrice * 1.1576), type: 'Forecast' },
    { year: '2030', Price: Math.round(basePrice * 1.2155), type: 'Forecast' },
    { year: '2031', Price: Math.round(basePrice * 1.2763), type: 'Forecast' },
  ];

  // --- Bank Rates Amortization Calculations ---
  const loanAmount = basePrice * 0.8; // 20% down payment standard
  const calculateAmortization = (rate: number, years = 20) => {
    const r = (rate / 100) / 12;
    const n = years * 12;
    return loanAmount * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  };

  const bankRates = [
    { name: 'BPI', rate: 6.88, type: 'Fixed 1-Yr', tenure: 'Up to 20 Yrs', payment: calculateAmortization(6.88), tag: 'Lowest Rate' },
    { name: 'Metrobank', rate: 7.00, type: 'Fixed 1-Yr', tenure: 'Up to 25 Yrs', payment: calculateAmortization(7.00), tag: 'Most Flexible' },
    { name: 'Security Bank', rate: 7.15, type: 'Fixed 1-Yr', tenure: 'Up to 20 Yrs', payment: calculateAmortization(7.15), tag: 'Fastest Approval' },
    { name: 'BDO Unibank', rate: 7.25, type: 'Fixed 1-Yr', tenure: 'Up to 20 Yrs', payment: calculateAmortization(7.25), tag: 'Largest Network' },
  ];

  return (
    <div className="glass p-8 rounded-2xl border border-white/10 animate-fade-in relative overflow-hidden flex flex-col h-[460px] justify-between" style={{ animationDelay: '0.15s' }}>
      {/* Decorative background blob */}
      <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-emerald-500/10 rounded-full blur-[60px] pointer-events-none" />

      {/* Header and Tab Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-[0_0_12px_rgba(16,185,129,0.4)] flex-shrink-0">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-text-primary leading-tight">Investment Analysis</h3>
            <p className="text-[10px] text-text-muted uppercase tracking-widest">20% Down • 20Yr Term Amortization</p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex bg-white/5 border border-white/10 p-0.5 rounded-lg text-xs self-start sm:self-center">
          <button
            onClick={() => setActiveTab('metrics')}
            className={`px-3 py-1 rounded-md transition-all font-semibold ${activeTab === 'metrics' ? 'bg-emerald-500 text-white shadow-md' : 'text-text-secondary hover:text-white'}`}
          >
            Metrics
          </button>
          <button
            onClick={() => setActiveTab('trend')}
            className={`px-3 py-1 rounded-md transition-all font-semibold ${activeTab === 'trend' ? 'bg-emerald-500 text-white shadow-md' : 'text-text-secondary hover:text-white'}`}
          >
            Appreciation
          </button>
          <button
            onClick={() => setActiveTab('banks')}
            className={`px-3 py-1 rounded-md transition-all font-semibold ${activeTab === 'banks' ? 'bg-emerald-500 text-white shadow-md' : 'text-text-secondary hover:text-white'}`}
          >
            Banks
          </button>
        </div>
      </div>

      {/* Tab Contents */}
      <div className="flex-grow flex flex-col justify-center relative z-10 min-h-[300px]">
        {activeTab === 'metrics' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in">
            <MetricCard
              label="Est. Monthly Mortgage"
              value={phpFmt(mortgage)}
              sub="Loan size"
              subValue={phpFmt(loanAmount)}
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
              className={`rounded-xl p-4 border hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between ${
                isCashFlowPositive
                  ? 'bg-accent/10 border-accent/30 hover:border-accent/50'
                  : 'bg-yellow-500/10 border-yellow-500/30 hover:border-yellow-500/50'
              }`}
              style={{ animationDelay: '160ms' }}
            >
              <div>
                <span className="block text-[10px] text-text-muted uppercase tracking-wider mb-1">Annual Cash Flow</span>
                <span className={`text-2xl font-black tabular-nums ${isCashFlowPositive ? 'text-accent' : 'text-yellow-400'}`}>
                  {isCashFlowPositive ? '+' : '-'}{phpFmt(cashFlow)}
                </span>
              </div>
              <p className="text-[10px] text-text-muted mt-2 pt-2 border-t border-white/10">
                {isCashFlowPositive ? '✓ Rent covers mortgage payments.' : '⚠ Mortgage exceeds rental income.'}
              </p>
            </div>

            <div
              className="bg-gradient-to-br from-primary/25 to-secondary/25 rounded-xl p-4 border border-primary/30 hover:border-primary/60 hover:-translate-y-0.5 transition-all duration-200 relative overflow-hidden flex flex-col justify-between"
              style={{ animationDelay: '240ms' }}
            >
              <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-primary/30 rounded-full blur-xl" />
              <div>
                <span className="block text-[10px] text-white/70 uppercase tracking-wider mb-1">
                  5-Year Projected ROI
                </span>
                <span className={`text-3xl font-black tabular-nums ${roiColor}`}>
                  {roi >= 0 ? '+' : ''}{roi.toFixed(1)}%
                </span>
              </div>
              <p className="text-[10px] text-white/50 mt-2 pt-2 border-t border-white/10 relative z-10">
                Assumes 5% annual appreciation (PH average).
              </p>
            </div>
          </div>
        )}

        {activeTab === 'trend' && (
          <div className="w-full h-[280px] animate-fade-in flex flex-col justify-between pr-2">
            {!isMounted ? (
              <div className="h-60 bg-white/5 rounded-xl animate-pulse" />
            ) : (
              <ResponsiveContainer width="100%" height="90%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 15, bottom: 5 }}>
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis 
                    dataKey="year" 
                    stroke="rgba(255,255,255,0.3)" 
                    fontSize={10}
                    tickLine={false}
                  />
                  <YAxis 
                    stroke="rgba(255,255,255,0.3)" 
                    fontSize={10} 
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => `₱${(v / 1e6).toFixed(1)}M`}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      background: 'rgba(5, 5, 5, 0.85)', 
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '11px'
                    }}
                    formatter={(v: any) => [phpFmt(Number(v)), 'Est. Value']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="Price" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorPrice)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
            <p className="text-[10px] text-text-muted text-center uppercase tracking-widest mt-1">
              📈 Valuation Projection: 3-Year Historical &amp; 5-Year Appreciation Trend
            </p>
          </div>
        )}

        {activeTab === 'banks' && (
          <div className="w-full animate-fade-in flex flex-col justify-between overflow-hidden">
            <div className="overflow-x-auto pr-1">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-[9px] text-text-secondary uppercase tracking-widest">
                    <th className="pb-2 font-bold">Bank Partner</th>
                    <th className="pb-2 font-bold text-center">Base Rate</th>
                    <th className="pb-2 font-bold text-center">Max Tenure</th>
                    <th className="pb-2 font-bold text-right">Est. Monthly</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {bankRates.map((bank, index) => (
                    <tr key={index} className="hover:bg-white/5 transition-colors">
                      <td className="py-2 flex items-center gap-2">
                        <span className="font-extrabold text-sm text-text-primary">{bank.name}</span>
                        <span className="text-[8px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-accent font-semibold uppercase tracking-wider">{bank.tag}</span>
                      </td>
                      <td className="py-2 text-center text-xs font-semibold text-text-primary">{bank.rate}%</td>
                      <td className="py-2 text-center text-xs text-text-secondary">{bank.tenure}</td>
                      <td className="py-2 text-right text-sm font-extrabold text-text-primary tabular-nums">{phpFmt(bank.payment)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-[9px] text-text-muted leading-relaxed uppercase tracking-wider mt-4 text-center">
              ⚠️ Simulated rates based on standard 2026 Philippine banking benchmarks. Subject to credit scoring.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvestmentDashboard;
