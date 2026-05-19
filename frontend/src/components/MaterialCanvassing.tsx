import React from 'react';

const MATERIALS = [
  { name: "Cement (Portland)", unit: "40kg Bag", price: 265, trend: "up", city: "Dagupan" },
  { name: "Steel Rebar (12mm)", unit: "6m Length", price: 345, trend: "down", city: "Urdaneta" },
  { name: "Sand & Gravel", unit: "per cu.m", price: 950, trend: "stable", city: "Lingayen" },
  { name: "Concrete Hollow Blocks", unit: "4-inch pc", price: 14, trend: "up", city: "Calasiao" },
  { name: "Common Wire Nails", unit: "per kg", price: 85, trend: "stable", city: "San Carlos" },
];

const MaterialCanvassing: React.FC = () => {
  return (
    <div className="glass p-6 rounded-2xl border border-blue-500/20 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
          Material Canvassing Index
        </h3>
        <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 border border-blue-500/30 px-2 py-1 rounded-full uppercase tracking-widest">
          Pangasinan Local
        </span>
      </div>

      <div className="space-y-4">
        {MATERIALS.map((item, i) => (
          <div key={i} className="flex items-center justify-between group hover:bg-white/5 p-2 rounded-lg transition-all border border-transparent hover:border-white/5">
            <div>
              <p className="text-xs font-bold text-text-primary group-hover:text-primary transition-colors">{item.name}</p>
              <p className="text-[10px] text-text-muted">{item.unit} · {item.city} Average</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-black text-text-primary">₱{item.price}</p>
              <div className="flex items-center justify-end gap-1">
                {item.trend === 'up' ? (
                  <span className="text-[9px] text-danger font-bold flex items-center">↑ 2%</span>
                ) : item.trend === 'down' ? (
                  <span className="text-[9px] text-accent font-bold flex items-center">↓ 1%</span>
                ) : (
                  <span className="text-[9px] text-text-muted font-bold">Stable</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-white/5">
        <button className="w-full py-2.5 rounded-xl text-[10px] font-bold text-blue-400 border border-blue-500/20 hover:bg-blue-500/10 transition-all flex items-center justify-center gap-2">
          View Detailed Price History
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default MaterialCanvassing;
