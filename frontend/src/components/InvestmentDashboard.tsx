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
}> = ({ label, value, sub, subValue, subColor = 'text-on-muted', className = '', delay = 0 }) => (
  <div
    className={`rounded-xl p-4 border border-border-color bg-white/5 hover:border-primary/20 hover:-translate-y-0.5 transition-all duration-200 ${className}`}
    style={{ animationDelay: `${delay}ms` }}
  >
    <span className="block text-[9px] text-on-faint uppercase tracking-wider font-bold font-headers mb-2">{label}</span>
    <span className="text-xl font-bold text-on-surface font-mono tabular-nums">{value}</span>
    {sub && subValue && (
      <div className="flex items-center justify-between mt-2 pt-2 border-t border-border-color/30 font-mono text-[9px]">
        <span className="text-on-faint uppercase font-bold">{sub}</span>
        <span className={`font-extrabold ${subColor}`}>{subValue}</span>
      </div>
    )}
  </div>
);

const InvestmentDashboard: React.FC<InvestmentDashboardProps> = ({ data, isLoading, predictedPrice = 0 }) => {
  const [activeTab, setActiveTab] = useState<'metrics' | 'trend' | 'banks'>('metrics');
  const [isMounted, setIsMounted] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('dark');
  
  // Dynamic annual appreciation rate state defaulting to 5%
  const [appreciationRate, setAppreciationRate] = useState(5);

  useEffect(() => {
    setIsMounted(true);
    
    const checkTheme = () => {
      const activeTheme = document.documentElement.dataset.theme || 'dark';
      setCurrentTheme(activeTheme);
    };
    checkTheme();
    
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    });
    
    return () => observer.disconnect();
  }, []);

  const basePrice = predictedPrice || (data ? (data.monthly_payment_php * 150) : 0);
  const loanAmount = basePrice * 0.8;

  const calculateAmortization = (rate: number, years = 20) => {
    const r = (rate / 100) / 12;
    const n = years * 12;
    if (n <= 0 || r <= 0) return 0;
    return loanAmount * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  };

  const calculatedMortgage = data ? calculateAmortization(7.00, 20) : 0;
  const mortgage = useCountUp(calculatedMortgage);

  const calculatedRent = data ? (basePrice * (data.gross_rental_yield_pct || 6.5) / 100) / 12 : 0;
  const rent = useCountUp(calculatedRent, 1000);

  // Dynamic projected ROI calculations: appreciation + rental yield accumulation
  const rateFactor = 1 + (appreciationRate / 100);
  const calculatedRoi = data 
    ? ((Math.pow(rateFactor, 5) - 1) * 100) + (data.gross_rental_yield_pct * 5)
    : 0;
  const dynamicRoi = useCountUp(data ? calculatedRoi : null, 800);

  const calculatedCashFlow = (calculatedRent * 12) - (calculatedMortgage * 12);
  const cashFlowAbs = useCountUp(data ? Math.abs(calculatedCashFlow) : null, 1100);

  if (isLoading) {
    return (
      <div className="glass p-8 rounded-2xl border border-border-color shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-xl bg-white/10 animate-pulse" />
          <div className="h-4 w-40 bg-white/10 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[1,2,3,4].map(i => (
            <div key={i} className="h-24 bg-white/5 rounded-xl animate-pulse border border-border-color" />
          ))}
        </div>
      </div>
    );
  }

  if (!data) return null;

  const isCashFlowPositive = calculatedCashFlow >= 0;
  const roiColor = dynamicRoi > 30 ? 'text-accent' : dynamicRoi > 0 ? 'text-yellow-500' : 'text-danger';

  // --- Theme-Aware Recharts Setup ---
  const accentColor = currentTheme === 'light' ? '#047857' : '#10b981';

  // --- Dynamic Forecast Appreciation Grid ---
  const chartData = [
    { year: '2023', Price: Math.round(basePrice * 0.86), type: 'Historical' },
    { year: '2024', Price: Math.round(basePrice * 0.91), type: 'Historical' },
    { year: '2025', Price: Math.round(basePrice * 0.95), type: 'Historical' },
    { year: '2026 (Now)', Price: Math.round(basePrice), type: 'Current' },
    { year: '2027', Price: Math.round(basePrice * Math.pow(rateFactor, 1)), type: 'Forecast' },
    { year: '2028', Price: Math.round(basePrice * Math.pow(rateFactor, 2)), type: 'Forecast' },
    { year: '2029', Price: Math.round(basePrice * Math.pow(rateFactor, 3)), type: 'Forecast' },
    { year: '2030', Price: Math.round(basePrice * Math.pow(rateFactor, 4)), type: 'Forecast' },
    { year: '2031', Price: Math.round(basePrice * Math.pow(rateFactor, 5)), type: 'Forecast' },
  ];

  const bankRates = [
    { name: 'BPI', rate: 6.88, type: 'Fixed 1-Yr', tenure: 'Up to 20 Yrs', payment: calculateAmortization(6.88), tag: 'Lowest Rate' },
    { name: 'Metrobank', rate: 7.00, type: 'Fixed 1-Yr', tenure: 'Up to 25 Yrs', payment: calculateAmortization(7.00), tag: 'Most Flexible' },
    { name: 'Security Bank', rate: 7.15, type: 'Fixed 1-Yr', tenure: 'Up to 20 Yrs', payment: calculateAmortization(7.15), tag: 'Fastest Approval' },
    { name: 'BDO Unibank', rate: 7.25, type: 'Fixed 1-Yr', tenure: 'Up to 20 Yrs', payment: calculateAmortization(7.25), tag: 'Largest Network' },
  ];

  return (
    <div className="glass p-8 rounded-2xl border border-border-color animate-fade-in relative overflow-hidden flex flex-col h-[520px] justify-between shadow-lg" style={{ animationDelay: '0.15s' }}>
      
      {/* Decorative background blob */}
      <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-emerald-500/10 rounded-full blur-[60px] pointer-events-none" />

      {/* Header and Tab Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-3 relative z-10 font-headers border-b border-border-color/30 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-[0_0_12px_rgba(16,185,129,0.3)] border border-emerald-500/20 flex-shrink-0">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-on-surface leading-tight uppercase">Financing Deck</h3>
            <p className="text-[9px] text-on-faint uppercase tracking-widest font-bold mt-0.5">Amortization & ROI Ledger</p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex bg-bg-deep border border-border-color p-0.5 rounded-lg text-[9px] uppercase tracking-widest font-bold self-start sm:self-center">
          {(['metrics', 'trend', 'banks'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-md transition-all font-bold ${activeTab === tab ? 'bg-accent text-white shadow-md' : 'text-on-muted hover:text-on-surface'}`}
            >
              {tab === 'metrics' ? 'Project ROI' : tab === 'trend' ? 'Asset Value' : 'Bank Financing'}
            </button>
          ))}
        </div>
      </div>

      {/* Global Glass appreciation slider */}
      <div className="mb-4 p-3.5 rounded-xl bg-bg-deep/45 border border-border-color flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3.5 relative z-10">
        <div className="flex items-center gap-2">
          <span className="text-[8px] text-on-faint uppercase tracking-widest font-extrabold font-headers">ANNUAL APPRECIATION RATE</span>
          <span className="text-xs font-extrabold text-accent font-mono">{appreciationRate.toFixed(1)}% / YR</span>
        </div>
        <div className="flex items-center gap-3.5 flex-grow max-w-[180px] sm:max-w-xs">
          <span className="text-[8px] text-on-faint font-extrabold font-mono uppercase">1%</span>
          <input
            type="range"
            min="1"
            max="15"
            step="0.5"
            value={appreciationRate}
            onChange={(e) => setAppreciationRate(Number(e.target.value))}
            className="flex-grow h-1.5 bg-bg-deep border border-border-color rounded-lg appearance-none cursor-pointer accent-accent"
          />
          <span className="text-[8px] text-on-faint font-extrabold font-mono uppercase">15%</span>
        </div>
      </div>

      {/* Tab Contents */}
      <div className="flex-grow flex flex-col justify-center relative z-10 min-h-[260px]">
        {activeTab === 'metrics' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in">
            <MetricCard
              label="Est. Monthly Mortgage"
              value={phpFmt(mortgage)}
              sub="LOAN PRINCIPAL (80%)"
              subValue={phpFmt(loanAmount)}
              delay={0}
            />

            <MetricCard
              label="Est. Completed Rent"
              value={phpFmt(rent)}
              sub="GROSS YIELD COEFF"
              subValue={`${data.gross_rental_yield_pct.toFixed(1)}%`}
              subColor="text-accent"
              delay={80}
            />

            <div
              className={`rounded-xl p-4 border hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between ${
                isCashFlowPositive
                  ? 'bg-accent/5 border-accent/30 hover:border-accent/50'
                  : 'bg-yellow-500/5 border-yellow-500/30 hover:border-yellow-500/50'
              }`}
              style={{ animationDelay: '160ms' }}
            >
              <div>
                <span className="block text-[9px] text-on-faint uppercase tracking-wider font-extrabold font-headers mb-1">Annual Cash Flow</span>
                <span className={`text-xl font-bold font-mono tabular-nums ${isCashFlowPositive ? 'text-accent' : 'text-yellow-500'}`}>
                  {isCashFlowPositive ? '+' : '-'}{phpFmt(cashFlowAbs)}
                </span>
              </div>
              <p className="text-[9px] font-bold uppercase tracking-wider text-on-faint mt-2 pt-2 border-t border-border-color/30 font-headers">
                {isCashFlowPositive ? '✓ Surplus rent yields' : '⚠ Deficit gap margins'}
              </p>
            </div>

            <div
              className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl p-4 border border-primary/30 hover:border-primary/60 hover:-translate-y-0.5 transition-all duration-200 relative overflow-hidden flex flex-col justify-between"
              style={{ animationDelay: '240ms' }}
            >
              <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-primary/20 rounded-full blur-xl pointer-events-none" />
              <div>
                <span className="block text-[9px] text-on-surface/80 uppercase tracking-wider font-extrabold font-headers mb-1">
                  5-Year Projected ROI
                </span>
                <span className={`text-2xl font-black font-mono tabular-nums ${roiColor}`}>
                  {dynamicRoi >= 0 ? '+' : ''}{dynamicRoi.toFixed(1)}%
                </span>
              </div>
              <p className="text-[9px] font-bold uppercase tracking-wider text-on-faint mt-2 pt-2 border-t border-border-color/30 relative z-10 font-headers">
                Dynamic forecast index.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'trend' && (
          <div className="w-full h-[240px] animate-fade-in flex flex-col justify-between pr-2">
            {!isMounted ? (
              <div className="h-full bg-white/5 rounded-xl animate-pulse border border-border-color" />
            ) : (
              <ResponsiveContainer width="100%" height="90%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 15, bottom: 5 }}>
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={accentColor} stopOpacity={0.25}/>
                      <stop offset="95%" stopColor={accentColor} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(120,113,108,0.06)" />
                  <XAxis 
                    dataKey="year" 
                    stroke="var(--text-muted)" 
                    fontSize={9}
                    tickLine={false}
                    fontFamily="var(--font-headers)"
                    fontWeight="bold"
                  />
                  <YAxis 
                    stroke="var(--text-muted)" 
                    fontSize={9} 
                    tickLine={false}
                    axisLine={false}
                    fontFamily="var(--font-headers)"
                    fontWeight="bold"
                    tickFormatter={(v) => `₱${(v / 1e6).toFixed(1)}M`}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      background: currentTheme === 'light' ? 'rgba(255, 255, 255, 0.92)' : 'rgba(11, 15, 25, 0.92)', 
                      backdropFilter: 'blur(10px)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '12px',
                      color: 'var(--text-primary)',
                      fontFamily: 'var(--font-headers)',
                      fontSize: '11px',
                      boxShadow: 'var(--shadow-lg)'
                    }}
                    formatter={(v: any) => [phpFmt(Number(v)), 'Est. Asset Value']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="Price" 
                    stroke={accentColor} 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorPrice)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
             <p className="text-[8px] text-on-faint text-center uppercase tracking-widest font-extrabold font-headers mt-1">
              Asset Value Projection Matrix: 3-Year Historical &amp; 5-Year Dynamic appreciation trend
            </p>
          </div>
        )}

        {activeTab === 'banks' && (
          <div className="w-full animate-fade-in flex flex-col justify-between overflow-hidden">
            <div className="overflow-x-auto pr-1">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border-color text-[8px] text-on-faint uppercase tracking-widest font-headers">
                    <th className="pb-2 font-extrabold">Bank Partner</th>
                    <th className="pb-2 font-extrabold text-center">Base Rate</th>
                    <th className="pb-2 font-extrabold text-center">Max Tenure</th>
                    <th className="pb-2 font-extrabold text-right">Est. Monthly</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dotted divide-border-color font-mono text-[11px] text-on-muted">
                  {bankRates.map((bank, index) => (
                    <tr key={index} className="hover:bg-white/5 transition-colors">
                      <td className="py-2.5 flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-headers text-[8px] font-black text-primary uppercase">
                          {bank.name[0]}
                        </span>
                        <span className="font-extrabold text-xs text-on-surface font-headers">{bank.name}</span>
                        <span className="text-[7px] px-1.5 py-0.5 rounded bg-accent/10 border border-accent/20 text-accent font-bold uppercase tracking-widest">{bank.tag}</span>
                      </td>
                      <td className="py-2.5 text-center text-xs font-bold text-on-surface">{bank.rate}%</td>
                      <td className="py-2.5 text-center text-[10px] text-on-muted">{bank.tenure}</td>
                      <td className="py-2.5 text-right text-xs font-extrabold text-on-surface tabular-nums">{phpFmt(bank.payment)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-[8px] text-on-faint leading-relaxed uppercase tracking-widest mt-4 text-center font-extrabold font-headers">
              ⚠️ Simulated rates based on standard 2026 Philippine banking benchmarks. Subject to credit scoring.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvestmentDashboard;
