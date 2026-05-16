import React from 'react';

const AGENTS = [
  {
    name: "Maria Santos",
    specialty: "Metro Manila Condos",
    location: "Makati / BGC / Pasig",
    avatar: "https://i.pravatar.cc/80?img=47",
    rating: "4.9",
    deals: "120+ deals",
    color: "from-blue-500 to-indigo-600",
  },
  {
    name: "Jose dela Cruz",
    specialty: "Commercial & Investment",
    location: "Quezon City / Ortigas",
    avatar: "https://i.pravatar.cc/80?img=12",
    rating: "4.8",
    deals: "95+ deals",
    color: "from-violet-500 to-purple-700",
  },
  {
    name: "Ana Reyes",
    specialty: "Cebu & Visayas Properties",
    location: "Cebu City / Lapu-Lapu",
    avatar: "https://i.pravatar.cc/80?img=32",
    rating: "4.9",
    deals: "80+ deals",
    color: "from-emerald-500 to-teal-600",
  },
];

const ContactSection: React.FC = () => {
  return (
    <section className="mt-20 pt-16 border-t border-white/5">
      {/* Header */}
      <div className="text-center mb-12">
        <span className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-[10px] uppercase tracking-widest font-bold text-text-muted px-4 py-2 rounded-full mb-4">
          <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse"></span>
          Expert Network
        </span>
        <h2 className="text-4xl font-black text-white tracking-tight mb-3">
          Speak to a <span className="text-gradient">Local Expert</span>
        </h2>
        <p className="text-text-secondary max-w-lg mx-auto text-sm leading-relaxed">
          Connect with verified Philippine real estate professionals who can help you navigate the market and close the right deal.
        </p>
      </div>

      {/* Agent Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {AGENTS.map((agent, i) => (
          <div
            key={i}
            className="glass p-6 rounded-2xl border border-white/10 hover:border-white/25 hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(59,130,246,0.15)] transition-all duration-300 flex flex-col items-center text-center group"
          >
            {/* Avatar ring */}
            <div className={`relative mb-4 p-[2px] rounded-full bg-gradient-to-br ${agent.color}`}>
              <img
                src={agent.avatar}
                alt={agent.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-accent rounded-full border-2 border-bg-deep"></span>
            </div>

            {/* Info */}
            <h3 className="font-bold text-white text-base mb-0.5">{agent.name}</h3>
            <p className="text-xs font-semibold text-primary mb-1">{agent.specialty}</p>
            <p className="text-[11px] text-text-muted mb-3 flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              {agent.location}
            </p>

            {/* Stats */}
            <div className="flex items-center gap-3 mb-4">
              <span className="text-[11px] font-bold text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 px-2 py-0.5 rounded-full">
                ⭐ {agent.rating}
              </span>
              <span className="text-[11px] text-text-muted">{agent.deals}</span>
            </div>

            {/* CTA */}
            <button className="w-full py-2.5 rounded-xl text-xs font-bold text-white border border-white/10 hover:border-primary/50 hover:bg-primary/10 hover:shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all flex items-center justify-center gap-2">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Schedule Consultation
            </button>
          </div>
        ))}
      </div>

      {/* Bottom CTA banner */}
      <div className="relative overflow-hidden glass rounded-2xl border border-primary/20 p-8 text-center">
        <div className="absolute -top-16 -left-16 w-40 h-40 bg-primary/20 rounded-full blur-[60px] pointer-events-none"></div>
        <div className="absolute -bottom-16 -right-16 w-40 h-40 bg-secondary/20 rounded-full blur-[60px] pointer-events-none"></div>
        <div className="relative z-10">
          <h3 className="text-2xl font-black text-white mb-2 tracking-tight">
            Have a Property to List?
          </h3>
          <p className="text-text-secondary text-sm mb-6 max-w-md mx-auto">
            Join ProphetIQ's partner network and reach thousands of qualified buyers across the Philippines.
          </p>
          <button className="inline-flex items-center gap-2 bg-grad-hero px-8 py-3 rounded-xl font-bold text-white hover:shadow-[0_0_25px_rgba(59,130,246,0.5)] transition-all active:scale-95">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            List Your Property on ProphetIQ
          </button>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
