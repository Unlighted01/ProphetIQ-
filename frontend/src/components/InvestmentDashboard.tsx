import React from 'react';

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

const InvestmentDashboard: React.FC<InvestmentDashboardProps> = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <div className="glass p-8 rounded-2xl mt-6 border border-white/5 animate-pulse">
        <h3 className="text-xl font-bold text-white/50 mb-6">Calculating Financials...</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="h-20 bg-white/10 rounded-xl"></div>
          <div className="h-20 bg-white/10 rounded-xl"></div>
          <div className="h-20 bg-white/10 rounded-xl"></div>
          <div className="h-20 bg-white/10 rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const isCashFlowPositive = data.annual_cash_flow_php >= 0;

  return (
    <div className="glass p-8 rounded-2xl mt-6 border border-white/10 animate-fade-in">
      <div className="flex items-center mb-6">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-700 flex items-center justify-center mr-3 shadow-[0_0_10px_rgba(16,185,129,0.3)]">
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-white tracking-tight">Investment Dashboard</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white/5 rounded-xl p-4 border border-white/5 hover:border-white/20 transition-colors">
          <span className="block text-[10px] text-text-muted uppercase tracking-wider mb-1">Est. Monthly Mortgage</span>
          <span className="text-2xl font-bold text-white">₱{data.monthly_payment_php.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
          <p className="text-[10px] text-text-muted mt-2 border-t border-white/10 pt-2">Based on 20% down, 8% interest, 20 yr term.</p>
        </div>

        <div className="bg-white/5 rounded-xl p-4 border border-white/5 hover:border-white/20 transition-colors">
          <span className="block text-[10px] text-text-muted uppercase tracking-wider mb-1">Est. Monthly Rent</span>
          <span className="text-2xl font-bold text-white">₱{data.estimated_monthly_rent_php.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
          <div className="flex items-center justify-between mt-2 border-t border-white/10 pt-2">
            <span className="text-[10px] text-text-muted">Gross Yield</span>
            <span className="text-xs font-bold text-accent">{data.gross_rental_yield_pct.toFixed(1)}%</span>
          </div>
        </div>

        <div className={`rounded-xl p-4 border ${isCashFlowPositive ? 'bg-accent/10 border-accent/30' : 'bg-yellow-500/10 border-yellow-500/30'} hover:border-white/20 transition-colors`}>
          <span className="block text-[10px] text-text-muted uppercase tracking-wider mb-1">Annual Cash Flow</span>
          <span className={`text-2xl font-bold ${isCashFlowPositive ? 'text-accent' : 'text-yellow-400'}`}>
            {isCashFlowPositive ? '+' : '-'}₱{Math.abs(data.annual_cash_flow_php).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </span>
          <p className="text-[10px] text-text-muted mt-2 border-t border-white/10 pt-2">
            {isCashFlowPositive ? 'Rent covers mortgage.' : 'Mortgage exceeds rent.'}
          </p>
        </div>

        <div className="bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl p-4 border border-primary/30 hover:border-primary/50 transition-colors relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-primary/30 rounded-full blur-xl"></div>
          <span className="block text-[10px] text-white/70 uppercase tracking-wider mb-1 relative z-10">5-Year Projected ROI</span>
          <span className="text-2xl font-bold text-white relative z-10">+{data.roi_5yr_pct.toFixed(1)}%</span>
          <p className="text-[10px] text-white/50 mt-2 border-t border-white/10 pt-2 relative z-10">Assuming 5% annual appreciation.</p>
        </div>
      </div>
    </div>
  );
};

export default InvestmentDashboard;
