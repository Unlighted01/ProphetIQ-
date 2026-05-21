'use client';

import React, { useState } from 'react';

type ProjectType = 'Residential' | 'Commercial' | 'Industrial';
type GradeType = 'Economy' | 'Standard' | 'Premium';

interface Project {
  id: string;
  name: string;
  city: string;
  type: ProjectType;
  grade: GradeType;
  sqm: number;
  beds: number;
  baths: number;
  cost: number;
  days: number;
  year: number;
}

const PROJECTS: Project[] = [
  { id: 'PQ-2024-001', name: 'Reyes Family Residence',       city: 'Dagupan',    type: 'Residential', grade: 'Standard', sqm: 185, beds: 4, baths: 3, cost: 4250000,  days: 168, year: 2024 },
  { id: 'PQ-2024-002', name: 'Manalo Commercial Hub',        city: 'Lingayen',   type: 'Commercial',  grade: 'Premium',  sqm: 320, beds: 0, baths: 6, cost: 14800000, days: 210, year: 2024 },
  { id: 'PQ-2023-003', name: 'Santos Duplex Dwelling',       city: 'Urdaneta',   type: 'Residential', grade: 'Standard', sqm: 240, beds: 6, baths: 4, cost: 5620000,  days: 192, year: 2023 },
  { id: 'PQ-2023-004', name: 'Pangasinan Rice Mill Annex',   city: 'San Carlos', type: 'Industrial',  grade: 'Economy',  sqm: 450, beds: 0, baths: 2, cost: 7100000,  days: 245, year: 2023 },
  { id: 'PQ-2023-005', name: 'De Leon Bungalow',             city: 'Calasiao',   type: 'Residential', grade: 'Economy',  sqm: 120, beds: 3, baths: 2, cost: 1980000,  days: 124, year: 2023 },
  { id: 'PQ-2022-006', name: 'Soriano Apartment Building',   city: 'Alaminos',   type: 'Commercial',  grade: 'Standard', sqm: 560, beds:12, baths:12, cost: 11300000, days: 310, year: 2022 },
  { id: 'PQ-2022-007', name: 'Lacsamana Premium Estate',     city: 'San Fabian', type: 'Residential', grade: 'Premium',  sqm: 310, beds: 5, baths: 4, cost: 10200000, days: 228, year: 2022 },
  { id: 'PQ-2022-008', name: 'Agoo Road Warehouse',          city: 'Anda',       type: 'Industrial',  grade: 'Economy',  sqm: 800, beds: 0, baths: 3, cost: 9400000,  days: 180, year: 2022 },
  { id: 'PQ-2021-009', name: 'Cruz Modern Townhouse',        city: 'Mangaldan',  type: 'Residential', grade: 'Standard', sqm: 160, beds: 3, baths: 2, cost: 3750000,  days: 148, year: 2021 },
  { id: 'PQ-2021-010', name: 'Bolinao Eco Resort Cabin',     city: 'Bolinao',    type: 'Commercial',  grade: 'Premium',  sqm: 220, beds: 2, baths: 2, cost: 8900000,  days: 195, year: 2021 },
  { id: 'PQ-2021-011', name: 'Garcia Family Home',           city: 'Rosales',    type: 'Residential', grade: 'Economy',  sqm:  95, beds: 2, baths: 1, cost: 1520000,  days:  98, year: 2021 },
  { id: 'PQ-2025-012', name: 'Lim Medical Clinic',           city: 'Lingayen',   type: 'Commercial',  grade: 'Premium',  sqm: 280, beds: 0, baths: 8, cost: 13100000, days: 187, year: 2025 },
];

const TYPE_FILTERS = ['All', 'Residential', 'Commercial', 'Industrial'] as const;
type FilterType = (typeof TYPE_FILTERS)[number];

const TYPE_GRADIENT: Record<ProjectType, string> = {
  Residential: 'from-amber-500 to-yellow-500',
  Commercial:  'from-cyan-500 to-teal-500',
  Industrial:  'from-purple-500 to-violet-600',
};

const TYPE_BADGE: Record<ProjectType, string> = {
  Residential: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  Commercial:  'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
  Industrial:  'bg-purple-500/10 text-purple-400 border-purple-500/30',
};

const GRADE_BADGE: Record<GradeType, string> = {
  Economy: 'bg-white/5 text-on-muted border-border-color',
  Standard:'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
  Premium: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
};

function fmt(n: number) {
  return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', maximumFractionDigits: 0 }).format(n);
}

export default function PortfolioPage() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('All');

  const visible = activeFilter === 'All'
    ? PROJECTS
    : PROJECTS.filter(p => p.type === activeFilter);

  const totalValue = PROJECTS.reduce((s, p) => s + p.cost, 0);
  const avgDays    = Math.round(PROJECTS.reduce((s, p) => s + p.days, 0) / PROJECTS.length);

  return (
    <main className="min-h-screen bg-bg-deep text-on-surface font-sans" style={{ fontFamily: 'var(--font-sans, sans-serif)' }}>

      {/* ── HERO HEADER ── */}
      <section className="relative overflow-hidden border-b border-border-color bg-bg-surface/40 backdrop-blur-xl px-6 py-12 md:py-16">
        {/* Ambient glows */}
        <div className="absolute -top-32 -left-32 w-80 h-80 bg-yellow-500/8 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-cyan-500/6 rounded-full blur-[100px] pointer-events-none" />

        {/* Corner brackets */}
        <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-yellow-500/30" />
        <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-yellow-500/30" />
        <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-yellow-500/30" />
        <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-yellow-500/30" />

        <div className="relative z-10 max-w-6xl mx-auto">
          {/* Back link */}
          <a
            href="/"
            className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-bold text-on-muted hover:text-on-surface border border-border-color bg-bg-deep/60 px-3 py-1.5 rounded-lg transition-all mb-8 hover:border-yellow-500/30"
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </a>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              {/* Eyebrow badge */}
              <span className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 text-[9px] uppercase tracking-[0.25em] font-bold text-yellow-400 px-3 py-1.5 rounded-full mb-4">
                <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse" />
                Pangasinan Partner Firms
              </span>

              <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-on-surface leading-tight" style={{ fontFamily: 'var(--font-headers, sans-serif)' }}>
                Completed Build
                <span className="block" style={{ background: 'linear-gradient(90deg,#f59e0b,#fbbf24)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  Portfolio
                </span>
              </h1>

              <p className="mt-3 text-on-muted text-sm max-w-xl leading-relaxed">
                Verified construction projects completed by our certified partner engineering firms across Pangasinan province.
              </p>
            </div>

            {/* Project count badge */}
            <div className="flex-shrink-0 px-5 py-3 bg-bg-deep border border-border-color rounded-2xl text-center">
              <p className="text-[8px] text-on-faint uppercase tracking-widest font-bold mb-0.5">Project Registry</p>
              <p className="text-3xl font-black text-on-surface font-mono tabular-nums">{PROJECTS.length}</p>
              <p className="text-[9px] text-on-muted">Projects · 2021–2025</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS STRIP ── */}
      <section className="border-b border-border-color bg-bg-deep/60 px-6 py-6">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Projects',        value: `${PROJECTS.length}`,       unit: 'Completed',        color: 'text-yellow-400' },
            { label: 'Total Build Value',     value: `₱${(totalValue/1e6).toFixed(1)}M`, unit: 'PHP Combined',  color: 'text-cyan-400'   },
            { label: 'Avg. Build Duration',   value: `${avgDays}`,               unit: 'Days Per Project', color: 'text-purple-400' },
            { label: 'Client Satisfaction',   value: `98%`,                      unit: 'Positive Feedback',color: 'text-emerald-400'},
          ].map(stat => (
            <div key={stat.label} className="p-4 bg-bg-surface/30 border border-border-color rounded-xl">
              <p className="text-[8px] uppercase tracking-widest font-bold text-on-faint mb-1" style={{ fontFamily: 'var(--font-headers, sans-serif)' }}>{stat.label}</p>
              <p className={`text-2xl font-black tabular-nums font-mono ${stat.color}`}>{stat.value}</p>
              <p className="text-[9px] text-on-faint mt-0.5">{stat.unit}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FILTER BAR ── */}
      <section className="px-6 py-5 max-w-6xl mx-auto">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[9px] uppercase tracking-widest font-bold text-on-faint mr-2" style={{ fontFamily: 'var(--font-headers, sans-serif)' }}>Filter by:</span>
          {TYPE_FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-4 py-1.5 rounded-full text-[10px] uppercase tracking-widest font-bold transition-all border ${
                activeFilter === f
                  ? 'bg-yellow-500 text-white border-yellow-500 shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                  : 'bg-bg-deep border-border-color text-on-muted hover:text-on-surface hover:border-yellow-500/30'
              }`}
            >
              {f}
              {f !== 'All' && (
                <span className="ml-1.5 opacity-60">
                  {PROJECTS.filter(p => p.type === f).length}
                </span>
              )}
            </button>
          ))}
          <span className="ml-auto text-[9px] text-on-faint">{visible.length} project{visible.length !== 1 ? 's' : ''} shown</span>
        </div>
      </section>

      {/* ── PROJECT GRID ── */}
      <section className="px-6 pb-12 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {visible.map(project => (
            <div
              key={project.id}
              className="group relative bg-bg-surface/20 border border-border-color rounded-2xl overflow-hidden hover:border-yellow-500/30 hover:-translate-y-0.5 transition-all duration-300 flex flex-col"
            >
              {/* Colour-coded type banner */}
              <div className={`h-1.5 w-full bg-gradient-to-r ${TYPE_GRADIENT[project.type]}`} />

              <div className="p-5 flex flex-col flex-grow gap-3">
                {/* Header row */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-[8px] text-on-faint font-mono tracking-wider mb-0.5">{project.id}</p>
                    <h3 className="text-sm font-bold text-on-surface leading-snug" style={{ fontFamily: 'var(--font-headers, sans-serif)' }}>
                      {project.name}
                    </h3>
                  </div>
                  <span className={`flex-shrink-0 text-[8px] font-bold uppercase tracking-wider border px-2 py-0.5 rounded ${TYPE_BADGE[project.type]}`}>
                    {project.type}
                  </span>
                </div>

                {/* Location */}
                <div className="flex items-center gap-1.5 text-[10px] text-on-muted">
                  <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {project.city}, Pangasinan
                </div>

                {/* Specs row */}
                <div className="flex items-center gap-3 text-[9px] font-bold uppercase tracking-wider text-on-faint" style={{ fontFamily: 'var(--font-headers, sans-serif)' }}>
                  <span className="flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                    </svg>
                    <span className="text-on-surface">{project.sqm}</span> sqm
                  </span>
                  {project.beds > 0 && (
                    <span className="flex items-center gap-1">
                      🛏 <span className="text-on-surface">{project.beds}</span> Beds
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    🚿 <span className="text-on-surface">{project.baths}</span> Baths
                  </span>
                </div>

                {/* Grade + duration badges */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-[8px] font-bold uppercase tracking-wider border px-2 py-0.5 rounded ${GRADE_BADGE[project.grade]}`}>
                    {project.grade} Grade
                  </span>
                  <span className="text-[8px] font-bold uppercase tracking-wider border border-border-color bg-bg-deep px-2 py-0.5 rounded text-on-muted">
                    ⏱ {project.days} days
                  </span>
                  <span className="text-[8px] font-bold uppercase tracking-wider border border-border-color bg-bg-deep px-2 py-0.5 rounded text-on-muted ml-auto">
                    {project.year}
                  </span>
                </div>

                {/* Cost — the hero number */}
                <div className="mt-auto pt-3 border-t border-border-color/60">
                  <p className="text-[8px] text-on-faint uppercase tracking-widest font-bold mb-0.5">Final Build Cost</p>
                  <p className="text-xl font-black tabular-nums font-mono text-on-surface">
                    {fmt(project.cost)}
                  </p>
                  <p className="text-[9px] text-on-faint mt-0.5">
                    ₱{Math.round(project.cost / project.sqm).toLocaleString('en-PH')} / sqm
                  </p>
                </div>

                {/* CTA button */}
                <button
                  disabled
                  className="w-full mt-2 py-2 text-[10px] font-bold uppercase tracking-widest border border-border-color/60 rounded-xl text-on-faint cursor-not-allowed opacity-50 hover:opacity-60 transition-opacity"
                >
                  View Blueprint →
                </button>
              </div>
            </div>
          ))}
        </div>

        {visible.length === 0 && (
          <div className="text-center py-20 text-on-faint">
            <p className="text-4xl mb-3">🏗️</p>
            <p className="text-sm">No projects found for this filter.</p>
          </div>
        )}
      </section>

      {/* ── CTA STRIP ── */}
      <section className="border-t border-border-color bg-bg-surface/20 px-6 py-10">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <p className="text-[9px] uppercase tracking-widest font-bold text-on-faint" style={{ fontFamily: 'var(--font-headers, sans-serif)' }}>Ready to start your project?</p>
          <h2 className="text-2xl md:text-3xl font-black uppercase text-on-surface" style={{ fontFamily: 'var(--font-headers, sans-serif)' }}>
            Generate a <span style={{ background: 'linear-gradient(90deg,#06b6d4,#0ea5e9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Cost Report</span>
          </h2>
          <p className="text-on-muted text-sm">Use our professional dual-tier estimating engine to plan your build budget with industry-standard accuracy.</p>
          <a
            href="/"
            className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-yellow-500 to-amber-500 text-white font-bold rounded-xl text-xs uppercase tracking-wider hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)]"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 19h16a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Open Cost Estimator
          </a>
        </div>
      </section>

    </main>
  );
}
