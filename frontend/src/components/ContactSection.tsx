'use client';

import React, { useState } from 'react';

type Specialisation = 'Structural Engineer' | 'Civil Engineer' | 'Architect' | 'Quantity Surveyor' | 'Geotechnical Engineer';

interface Engineer {
  id: string;
  name: string;
  role: Specialisation;
  prc: string;
  city: string;
  rating: number;
  projects: number;
  available: boolean;
  tagline: string;
}

const ENGINEERS: Engineer[] = [
  {
    id: 'eng-001',
    name: 'Engr. Ricardo M. Santos',
    role: 'Structural Engineer',
    prc: 'PRC-CE-2024-001234',
    city: 'Dagupan',
    rating: 4.9,
    projects: 38,
    available: true,
    tagline: 'Specialises in RC frame residential and commercial builds.',
  },
  {
    id: 'eng-002',
    name: 'Arch. Maria Luisa Cruz',
    role: 'Architect',
    prc: 'PRC-ARCH-2022-009871',
    city: 'Lingayen',
    rating: 4.8,
    projects: 54,
    available: true,
    tagline: 'Modern minimalist design, DPWH-compliant blueprints.',
  },
  {
    id: 'eng-003',
    name: 'Engr. Danilo F. Reyes',
    role: 'Geotechnical Engineer',
    prc: 'PRC-GE-2021-005512',
    city: 'Urdaneta',
    rating: 4.7,
    projects: 22,
    available: false,
    tagline: 'Soil investigation, borelog analysis, pile design for flood zones.',
  },
  {
    id: 'eng-004',
    name: 'Engr. Josephine T. Manalo',
    role: 'Quantity Surveyor',
    prc: 'PRC-CE-2020-003389',
    city: 'San Carlos',
    rating: 4.9,
    projects: 41,
    available: true,
    tagline: 'Expert BOQ preparation and value engineering for tight budgets.',
  },
  {
    id: 'eng-005',
    name: 'Engr. Bernardo G. Lacsamana',
    role: 'Civil Engineer',
    prc: 'PRC-CE-2019-007712',
    city: 'Alaminos',
    rating: 4.6,
    projects: 63,
    available: true,
    tagline: 'Site supervision, road works, drainage, and retaining walls.',
  },
  {
    id: 'eng-006',
    name: 'Arch. Kristine A. Lim',
    role: 'Architect',
    prc: 'PRC-ARCH-2023-012045',
    city: 'Lingayen',
    rating: 4.8,
    projects: 17,
    available: true,
    tagline: 'Tropical-modern designs with energy-efficient passive cooling.',
  },
];

const ROLE_BADGE: Record<Specialisation, string> = {
  'Structural Engineer':    'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
  'Civil Engineer':         'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
  'Architect':              'bg-purple-500/10 text-purple-400 border-purple-500/30',
  'Quantity Surveyor':      'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  'Geotechnical Engineer':  'bg-orange-500/10 text-orange-400 border-orange-500/30',
};

interface ContactFormState {
  name: string;
  email: string;
  phone: string;
  projectType: string;
  message: string;
}

const EMPTY_FORM: ContactFormState = {
  name: '', email: '', phone: '', projectType: '', message: '',
};

const ContactSection: React.FC = () => {
  const [modalOpen, setModalOpen]         = useState(false);
  const [selectedEng, setSelectedEng]     = useState<Engineer | null>(null);
  const [form, setForm]                   = useState<ContactFormState>(EMPTY_FORM);
  const [submitted, setSubmitted]         = useState(false);
  const [filterRole, setFilterRole]       = useState<Specialisation | 'All'>('All');

  const visibleEngineers = filterRole === 'All'
    ? ENGINEERS
    : ENGINEERS.filter(e => e.role === filterRole);

  const handleOpenModal = (eng: Engineer) => {
    setSelectedEng(eng);
    setForm(EMPTY_FORM);
    setSubmitted(false);
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder submit — no real backend yet
    setSubmitted(true);
  };

  return (
    <>
      {/* ── CONTACT SECTION ── */}
      <section className="mt-24 pt-16 border-t border-border-color/30 space-y-10">

        {/* ── CTA HERO BOX ── */}
        <div className="relative overflow-hidden glass rounded-3xl border border-border-color p-8 md:p-14 text-center max-w-4xl mx-auto shadow-2xl transition-all duration-500 hover:shadow-[0_0_50px_rgba(6,182,212,0.05)]">
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-yellow-500/5 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute top-4 left-4 w-3 h-3 border-t border-l border-primary/20" />
          <div className="absolute top-4 right-4 w-3 h-3 border-t border-r border-primary/20" />
          <div className="absolute bottom-4 left-4 w-3 h-3 border-b border-l border-primary/20" />
          <div className="absolute bottom-4 right-4 w-3 h-3 border-b border-r border-primary/20" />

          <div className="relative z-10 space-y-5">
            <span className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-[9px] uppercase tracking-[0.25em] font-bold text-primary px-4 py-2 rounded-full font-headers">
              <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />
              PRC-Licensed Partner Network · Pangasinan
            </span>

            <h2 className="text-3xl md:text-5xl font-bold text-on-surface tracking-tight leading-tight font-headers uppercase">
              Connect with a <span className="text-gradient">Licensed Engineer</span>
            </h2>

            <p className="text-on-muted text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
              Get your project reviewed by a certified civil engineer or architect. Site inspections, soil tests, BOQ validation, and permit assistance available.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => setModalOpen(true)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-secondary hover:shadow-[0_4px_24px_rgba(6,182,212,0.3)] text-white px-8 py-4 rounded-xl font-bold hover:scale-[1.02] active:scale-95 transition-all duration-300 text-xs uppercase tracking-wider font-headers shadow-lg"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Browse Available Engineers
              </button>
              <a
                href="/portfolio"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-border-color bg-bg-deep/45 hover:bg-bg-surface text-on-surface px-8 py-4 rounded-xl font-bold hover:scale-[1.02] active:scale-95 transition-all duration-300 text-xs uppercase tracking-wider font-headers"
              >
                View Completed Portfolio
              </a>
            </div>
          </div>
        </div>

        {/* ── ENGINEER CARDS GRID ── */}
        <div className="max-w-5xl mx-auto space-y-5">
          {/* Role filter pills */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[9px] text-on-faint uppercase tracking-widest font-bold font-headers mr-1">Specialisation:</span>
            {(['All', 'Structural Engineer', 'Civil Engineer', 'Architect', 'Quantity Surveyor', 'Geotechnical Engineer'] as const).map(role => (
              <button
                key={role}
                onClick={() => setFilterRole(role)}
                className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider border transition-all ${
                  filterRole === role
                    ? 'bg-yellow-500 text-white border-yellow-500 shadow-[0_0_10px_rgba(245,158,11,0.25)]'
                    : 'bg-bg-deep border-border-color text-on-muted hover:border-yellow-500/30 hover:text-on-surface'
                }`}
              >
                {role}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {visibleEngineers.map(eng => (
              <div
                key={eng.id}
                className="glass border border-border-color rounded-2xl p-5 flex flex-col gap-3 hover:border-yellow-500/30 hover:-translate-y-0.5 transition-all duration-300"
              >
                {/* Avatar + name row */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500/20 to-amber-600/10 border border-yellow-500/20 flex items-center justify-center text-lg flex-shrink-0">
                    {eng.role === 'Architect' ? '🏛️' : eng.role === 'Geotechnical Engineer' ? '🪨' : eng.role === 'Quantity Surveyor' ? '📋' : '⚙️'}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-on-surface truncate font-headers">{eng.name}</p>
                    <p className="text-[9px] text-on-faint truncate">{eng.prc}</p>
                  </div>
                </div>

                {/* Role badge + availability */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-[8px] font-bold uppercase tracking-wider border px-2 py-0.5 rounded ${ROLE_BADGE[eng.role]}`}>
                    {eng.role}
                  </span>
                  <span className={`ml-auto text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                    eng.available
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : 'bg-red-500/10 text-red-400 border-red-500/30'
                  }`}>
                    {eng.available ? '● Available' : '○ Booked'}
                  </span>
                </div>

                {/* Location + tagline */}
                <div className="space-y-1">
                  <p className="text-[9px] text-on-muted flex items-center gap-1">
                    <svg className="w-2.5 h-2.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {eng.city}, Pangasinan
                  </p>
                  <p className="text-[10px] text-on-muted leading-relaxed">{eng.tagline}</p>
                </div>

                {/* Stats row */}
                <div className="flex items-center gap-4 text-[9px] font-bold font-headers border-t border-border-color/60 pt-3">
                  <span className="text-yellow-400">★ {eng.rating}</span>
                  <span className="text-on-muted">{eng.projects} Projects</span>
                </div>

                {/* Contact button */}
                <button
                  onClick={() => handleOpenModal(eng)}
                  disabled={!eng.available}
                  className={`w-full py-2 text-[10px] font-bold uppercase tracking-widest rounded-xl border transition-all ${
                    eng.available
                      ? 'bg-gradient-to-r from-primary/20 to-cyan-600/10 border-primary/30 text-primary hover:bg-primary/30 hover:scale-[1.02] active:scale-95'
                      : 'border-border-color/40 text-on-faint cursor-not-allowed opacity-40'
                  }`}
                >
                  {eng.available ? 'Send Inquiry →' : 'Currently Unavailable'}
                </button>
              </div>
            ))}
          </div>
        </div>

      </section>

      {/* ── ENGINEER CONTACT MODAL ── */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) setModalOpen(false); }}
        >
          <div className="relative w-full max-w-lg glass border border-border-color rounded-2xl shadow-2xl overflow-hidden animate-fade-in">
            {/* Modal header gradient bar */}
            <div className="h-1 w-full bg-gradient-to-r from-yellow-500 to-cyan-500" />

            <div className="p-6 space-y-4">
              {/* Close button */}
              <button
                onClick={() => setModalOpen(false)}
                className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-lg border border-border-color text-on-muted hover:text-on-surface hover:border-yellow-500/30 transition-all"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Engineer info or browse all prompt */}
              {selectedEng ? (
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-yellow-500/20 to-amber-600/10 border border-yellow-500/20 flex items-center justify-center text-xl flex-shrink-0">
                    {selectedEng.role === 'Architect' ? '🏛️' : selectedEng.role === 'Geotechnical Engineer' ? '🪨' : selectedEng.role === 'Quantity Surveyor' ? '📋' : '⚙️'}
                  </div>
                  <div>
                    <p className="font-bold text-on-surface font-headers text-sm">{selectedEng.name}</p>
                    <p className="text-[9px] text-on-muted">{selectedEng.role} · {selectedEng.city}</p>
                  </div>
                </div>
              ) : (
                <div>
                  <h3 className="font-bold text-on-surface font-headers text-base uppercase tracking-wide">Contact an Engineer</h3>
                  <p className="text-[10px] text-on-muted mt-0.5">Select from the grid or fill in your inquiry below.</p>
                </div>
              )}

              {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] text-on-faint uppercase tracking-wider font-bold font-headers">Your Name *</label>
                      <input
                        required
                        type="text"
                        value={form.name}
                        onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                        placeholder="Juan Dela Cruz"
                        className="w-full text-xs bg-bg-deep/60 border border-border-color rounded-lg px-3 py-2 text-on-surface placeholder:text-on-faint focus:outline-none focus:border-yellow-500/50 transition-colors"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] text-on-faint uppercase tracking-wider font-bold font-headers">Email *</label>
                      <input
                        required
                        type="email"
                        value={form.email}
                        onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                        placeholder="juan@example.com"
                        className="w-full text-xs bg-bg-deep/60 border border-border-color rounded-lg px-3 py-2 text-on-surface placeholder:text-on-faint focus:outline-none focus:border-yellow-500/50 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] text-on-faint uppercase tracking-wider font-bold font-headers">Phone Number</label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                        placeholder="09xx xxx xxxx"
                        className="w-full text-xs bg-bg-deep/60 border border-border-color rounded-lg px-3 py-2 text-on-surface placeholder:text-on-faint focus:outline-none focus:border-yellow-500/50 transition-colors"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] text-on-faint uppercase tracking-wider font-bold font-headers">Project Type</label>
                      <select
                        value={form.projectType}
                        onChange={e => setForm(p => ({ ...p, projectType: e.target.value }))}
                        className="w-full text-xs bg-bg-deep/60 border border-border-color rounded-lg px-3 py-2 text-on-surface focus:outline-none focus:border-yellow-500/50 transition-colors"
                      >
                        <option value="">Select type…</option>
                        <option>Residential House</option>
                        <option>Commercial Building</option>
                        <option>Industrial Structure</option>
                        <option>Renovation / Extension</option>
                        <option>Site Inspection Only</option>
                        <option>BOQ / Cost Validation</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] text-on-faint uppercase tracking-wider font-bold font-headers">Project Details *</label>
                    <textarea
                      required
                      rows={3}
                      value={form.message}
                      onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                      placeholder="Briefly describe your project — location, floor area, structure type, and what engineering service you need…"
                      className="w-full text-xs bg-bg-deep/60 border border-border-color rounded-lg px-3 py-2 text-on-surface placeholder:text-on-faint focus:outline-none focus:border-yellow-500/50 transition-colors resize-none"
                    />
                  </div>

                  <p className="text-[9px] text-on-faint/60">
                    * This is a demo inquiry form. No data is transmitted. A real backend integration will be wired in a future update.
                  </p>

                  <div className="flex items-center gap-3 pt-1">
                    <button
                      type="button"
                      onClick={() => setModalOpen(false)}
                      className="flex-1 py-2.5 text-[10px] font-bold uppercase tracking-widest border border-border-color rounded-xl text-on-muted hover:text-on-surface hover:border-yellow-500/20 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-[2] py-2.5 text-[10px] font-bold uppercase tracking-widest bg-gradient-to-r from-yellow-500 to-amber-500 text-white rounded-xl hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                    >
                      Send Inquiry →
                    </button>
                  </div>
                </form>
              ) : (
                /* Success state */
                <div className="py-8 text-center space-y-3">
                  <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-2xl">✅</div>
                  <h3 className="font-bold text-on-surface font-headers uppercase text-sm">Inquiry Sent!</h3>
                  <p className="text-[11px] text-on-muted max-w-xs mx-auto leading-relaxed">
                    {selectedEng ? `${selectedEng.name} will` : 'Our partner engineer will'} review your project details and reach out within 24–48 hours.
                  </p>
                  <button
                    onClick={() => setModalOpen(false)}
                    className="mt-2 px-6 py-2 text-[10px] font-bold uppercase tracking-widest bg-bg-deep border border-border-color text-on-muted rounded-xl hover:border-yellow-500/30 hover:text-on-surface transition-all"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ContactSection;
