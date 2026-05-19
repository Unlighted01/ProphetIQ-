import React from 'react';

const ContactSection: React.FC = () => {
  return (
    <section className="mt-20 pt-16 border-t border-white/5">
      {/* Premium CTA box */}
      <div className="relative overflow-hidden glass rounded-3xl border border-primary/20 p-10 md:p-16 text-center max-w-4xl mx-auto shadow-[0_8px_32px_rgba(59,130,246,0.1)]">
        {/* Decorative elements */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary/20 rounded-full blur-[80px] pointer-events-none"></div>
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-secondary/20 rounded-full blur-[80px] pointer-events-none"></div>
        
        <div className="relative z-10 space-y-6">
          <span className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-[10px] uppercase tracking-widest font-extrabold text-primary px-4 py-2 rounded-full">
            <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse"></span>
            Pangasinan Partner Network
          </span>
          
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
            Speak to a <span className="text-gradient">Local Property Expert</span>
          </h2>
          
          <p className="text-text-secondary text-base max-w-2xl mx-auto leading-relaxed">
            Looking for a local property expert in Pangasinan? Connect with verified, licensed agents and engineers through our secure partner network to facilitate site inspections, soil tests, and land titles.
          </p>
          
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-grad-hero px-8 py-4 rounded-xl font-bold text-white hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] transition-all active:scale-95 text-sm">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Get in Touch with an Expert
            </button>
            <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 px-8 py-4 rounded-xl font-bold text-white transition-all text-sm">
              Learn Partner Requirements
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
