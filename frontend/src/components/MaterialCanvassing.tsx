import React from 'react';

const MATERIALS = [
  { name: "Cement (Portland)", unit: "40kg Bag", price: 265, trend: "up", change: "+2%", city: "Dagupan" },
  { name: "Steel Rebar (12mm)", unit: "6m Length", price: 345, trend: "down", change: "-1%", city: "Urdaneta" },
  { name: "Sand & Gravel", unit: "per cu.m", price: 950, trend: "stable", change: "0%", city: "Lingayen" },
  { name: "Concrete Hollow Blocks", unit: "4-inch pc", price: 14, trend: "up", change: "+4%", city: "Calasiao" },
  { name: "Common Wire Nails", unit: "per kg", price: 85, trend: "stable", change: "0%", city: "San Carlos" },
];

const MaterialCanvassing: React.FC = () => {
  return (
    <div className="glass p-8 rounded-2xl border border-border-color animate-fade-in shadow-lg">
      <div className="flex items-center justify-between mb-6 border-b border-border-color pb-4 font-headers">
        <div>
          <h3 className="text-lg font-bold text-on-surface uppercase tracking-tight">Material Canvassing Index</h3>
          <p className="text-[9px] text-on-faint uppercase tracking-widest font-bold mt-0.5">Real-Time Regional Sourcing</p>
        </div>
        <span className="text-[9px] font-bold text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-full uppercase tracking-wider">
          Pangasinan Local
        </span>
      </div>

      <div className="space-y-3.5">
        {MATERIALS.map((item, i) => (
          <div 
            key={i} 
            className="flex items-center justify-between group hover:bg-bg-deep/50 p-3 rounded-xl transition-all duration-300 border border-border-color hover:border-primary/20 shadow-sm"
          >
            <div>
              <p className="text-xs font-bold text-on-surface group-hover:text-primary transition-colors font-headers">{item.name}</p>
              <p className="text-[9px] text-on-faint uppercase font-bold tracking-wider mt-1">{item.unit} · {item.city} Average</p>
            </div>
            <div className="text-right font-mono">
              <p className="text-sm font-black text-on-surface">₱{item.price}</p>
              <div className="flex items-center justify-end gap-1 mt-1 text-[9px] font-bold">
                {item.trend === 'up' ? (
                  <span className="text-danger flex items-center bg-danger/10 border border-danger/25 px-1.5 py-0.5 rounded text-[8px]">
                    ▲ {item.change}
                  </span>
                ) : item.trend === 'down' ? (
                  <span className="text-accent flex items-center bg-accent/10 border border-accent/25 px-1.5 py-0.5 rounded text-[8px]">
                    ▼ {item.change}
                  </span>
                ) : (
                  <span className="text-on-faint bg-bg-deep border border-border-color px-1.5 py-0.5 rounded text-[8px]">
                    STABLE
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-border-color">
        <button className="w-full py-3 rounded-xl text-[9px] font-extrabold uppercase tracking-widest text-primary border border-primary/25 hover:bg-primary/5 transition-all flex items-center justify-center gap-2 font-headers">
          <span>View Detailed Price History</span>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default MaterialCanvassing;
