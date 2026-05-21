import React from 'react';

const ContactSection: React.FC = () => {
  return (
    <section className="mt-24 pt-16 border-t border-border-color/30">
      {/* Premium CTA box */}
      <div className="relative overflow-hidden glass rounded-3xl border border-border-color p-8 md:p-16 text-center max-w-4xl mx-auto shadow-2xl transition-all duration-500 hover:shadow-[0_0_50px_rgba(6,182,212,0.05)] [data-theme=light]:hover:shadow-[0_0_50px_rgba(28,25,23,0.03)]">
        
        {/* Ambient neon decorative glows behind glass */}
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-secondary/5 rounded-full blur-[100px] pointer-events-none" />
        
        {/* Micro architectural corner markers */}
        <div className="absolute top-4 left-4 w-3 h-3 border-t border-l border-primary/20" />
        <div className="absolute top-4 right-4 w-3 h-3 border-t border-r border-primary/20" />
        <div className="absolute bottom-4 left-4 w-3 h-3 border-b border-l border-primary/20" />
        <div className="absolute bottom-4 right-4 w-3 h-3 border-b border-r border-primary/20" />

        <div className="relative z-10 space-y-6">
          <span className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-[9px] uppercase tracking-[0.25em] font-bold text-primary px-4.5 py-2.5 rounded-full font-headers">
            <span className="w-1.5 h-1.5 bg-accent rounded-full animate-telemetry-pulse"></span>
            Pangasinan Partner Network
          </span>
          
          <h2 className="text-3xl md:text-5xl font-bold text-on-surface tracking-tight leading-tight font-headers uppercase">
            Speak to a <span className="text-gradient">Local Property Expert</span>
          </h2>
          
          <p className="text-on-muted text-sm md:text-base max-w-2xl mx-auto leading-relaxed font-medium">
            Looking for a local property expert in Pangasinan? Connect with verified, licensed agents and civil engineers through our secure partner network to facilitate site inspections, soil tests, and land titles.
          </p>
          
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-lg mx-auto">
            <button className="w-full sm:w-auto flex-grow inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-secondary hover:shadow-[0_4px_24px_rgba(6,182,212,0.3)] [data-theme=light]:hover:shadow-[0_4px_24px_rgba(28,25,23,0.15)] text-white px-8 py-4 rounded-xl font-bold hover:scale-[1.02] active:scale-95 transition-all duration-300 text-xs uppercase tracking-wider font-headers shadow-lg">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Get in Touch with an Expert
            </button>
            <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-border-color bg-bg-deep/45 hover:bg-bg-surface text-on-surface px-8 py-4 rounded-xl font-bold hover:scale-[1.02] active:scale-95 transition-all duration-300 text-xs uppercase tracking-wider font-headers">
              Requirements
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
