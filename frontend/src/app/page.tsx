'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import PredictionForm from '@/components/PredictionForm';
import PriceDisplay from '@/components/PriceDisplay';
import ShapChart from '@/components/ShapChart';
import AIAdvisorPanel from '@/components/AIAdvisorPanel';
import InvestmentDashboard from '@/components/InvestmentDashboard';
import RecommendedProperties from '@/components/RecommendedProperties';
import ContactSection from '@/components/ContactSection';
import ConstructionEstimator from '@/components/ConstructionEstimator';
import MaterialCanvassing from '@/components/MaterialCanvassing';
import SavedComparisonCockpit, { SavedProject } from '@/components/SavedComparisonCockpit';
import { predictPrice, checkHealth, getAIAdvice, getInvestmentMetrics } from '@/lib/api';
import { exportToPDF } from '@/lib/pdf_exporter';
import dynamic from 'next/dynamic';

// Dynamic import for MapView to prevent SSR issues with Leaflet
const MapView = dynamic(() => import('@/components/MapView'), {
  ssr: false,
  loading: () => <div className="h-[400px] w-full rounded-xl bg-white/5 animate-pulse mt-6 border border-white/10" />,
});

interface LoadingStepsProps {
  step: 'idle' | 'predicting' | 'advising' | 'investing' | 'done';
}

const LoadingSteps: React.FC<LoadingStepsProps> = ({ step }) => {
  if (step === 'idle' || step === 'done') return null;

  return (
    <div className="glass p-8 rounded-2xl border border-white/10 max-w-xl mx-auto shadow-[0_8px_32px_rgba(59,130,246,0.1)] space-y-6 animate-fade-in my-8">
      <div className="flex items-center gap-3">
        <div className="relative flex items-center justify-center">
          <span className="absolute w-5 h-5 bg-primary/30 rounded-full animate-ping"></span>
          <span className="relative w-3.5 h-3.5 bg-primary rounded-full"></span>
        </div>
        <h3 className="text-base font-bold text-white tracking-tight">Generating Site Intelligence Report...</h3>
      </div>

      <div className="space-y-4">
        {/* Step 1: Price Prediction */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm">
              {step === 'predicting' ? '⏳' : '✅'}
            </span>
            <span className={`text-sm font-semibold ${step === 'predicting' ? 'text-white' : 'text-text-muted'}`}>
              Running XGBoost Pricing Engine
            </span>
          </div>
          {step === 'predicting' && (
            <span className="text-xs text-primary font-bold animate-pulse">In Progress...</span>
          )}
        </div>

        {/* Step 2: AI Site Suitability Assessment */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm">
              {step === 'predicting' ? '⚪' : step === 'advising' ? '⏳' : '✅'}
            </span>
            <span className={`text-sm font-semibold ${step === 'advising' ? 'text-white' : 'text-text-muted'}`}>
              ProphetIQ AI Site Assessment
            </span>
          </div>
          {step === 'advising' && (
            <span className="text-xs text-primary font-bold animate-pulse">In Progress...</span>
          )}
        </div>

        {/* Step 3: Investment Analytics */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm">
              {step === 'predicting' || step === 'advising' ? '⚪' : '⏳'}
            </span>
            <span className={`text-sm font-semibold ${step === 'investing' ? 'text-white' : 'text-text-muted'}`}>
              Calculating Construction & Investment Metrics
            </span>
          </div>
          {step === 'investing' && (
            <span className="text-xs text-primary font-bold animate-pulse">In Progress...</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default function Home() {
  const [prediction, setPrediction] = useState<any>(null);
  const [advisorData, setAdvisorData] = useState<any>(null);
  const [investmentData, setInvestmentData] = useState<any>(null);
  const [lastFeatures, setLastFeatures] = useState<any>(null);

  // Saved Projects comparison deck state
  const [savedProjects, setSavedProjects] = useState<SavedProject[]>([]);

  // Local Storage Sync on Mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('saved_projects');
      if (stored) {
        setSavedProjects(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load saved projects:', e);
    }
  }, []);

  const updateSavedProjects = (newProjects: SavedProject[]) => {
    setSavedProjects(newProjects);
    try {
      localStorage.setItem('saved_projects', JSON.stringify(newProjects));
    } catch (e) {
      console.error('Failed to save projects to localStorage:', e);
    }
  };

  const handleSaveProject = () => {
    if (!prediction || !lastFeatures) return;

    const isAlreadyBookmarked = savedProjects.some(
      (p) => 
        p.city === lastFeatures.City &&
        p.features.Bedrooms === lastFeatures.Bedrooms &&
        p.features.Bath === lastFeatures.Bath &&
        p.features['Floor_area (sqm)'] === lastFeatures['Floor_area (sqm)'] &&
        p.features['Land_area (sqm)'] === lastFeatures['Land_area (sqm)'] &&
        p.features.IsCondo === lastFeatures.IsCondo &&
        p.predictedPrice === prediction.predicted_price
    );

    if (isAlreadyBookmarked) {
      toast.warning('Already saved!', {
        description: 'This property has already been added to your comparison deck.',
      });
      return;
    }

    const newProject: SavedProject = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      city: lastFeatures.City,
      features: {
        Bedrooms: lastFeatures.Bedrooms,
        Bath: lastFeatures.Bath,
        'Floor_area (sqm)': lastFeatures['Floor_area (sqm)'],
        'Land_area (sqm)': lastFeatures['Land_area (sqm)'],
        IsCondo: lastFeatures.IsCondo,
      },
      predictedPrice: prediction.predicted_price,
      rent: investmentData?.estimated_monthly_rent_php || 0,
      yield: investmentData?.gross_rental_yield_pct || 0,
      roi: investmentData?.roi_5yr_pct || 0,
    };

    const updated = [newProject, ...savedProjects];
    updateSavedProjects(updated);
    toast.success('Site bookmarked!', {
      description: `Added to your Comparison Cockpit under ${lastFeatures.City}.`,
    });
  };

  const handleExportPDF = async () => {
    const cityName = lastFeatures?.City || 'Pangasinan';
    const toastId = toast.loading('Generating blueprint PDF...', {
      description: 'Rendering high-resolution report elements',
    });
    try {
      await exportToPDF('results-section', cityName);
      toast.success('Blueprint downloaded!', { id: toastId });
    } catch (e: any) {
      console.error(e);
      toast.error('Failed to export PDF', { id: toastId, description: e.message || 'Unknown error' });
    }
  };

  // Location state (shared between Form and Map)
  const [currentLocation, setCurrentLocation] = useState({
    lat: 16.0204,
    lng: 120.2315,
    city: 'Lingayen',
  });
  const [isPinned, setIsPinned] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isAdvisorLoading, setIsAdvisorLoading] = useState(false);
  const [isInvestmentLoading, setIsInvestmentLoading] = useState(false);
  const [advisorError, setAdvisorError] = useState(false);
  const [loadingStep, setLoadingStep] = useState<'idle' | 'predicting' | 'advising' | 'investing' | 'done'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [serverStatus, setServerStatus] = useState<'online' | 'offline' | 'checking'>('checking');

  // Navigation & Theme States
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [showScrollUp, setShowScrollUp] = useState(false);

  useEffect(() => {
    async function getStatus() {
      const health = await checkHealth();
      setServerStatus(health.status === 'ok' ? 'online' : 'offline');
    }
    getStatus();

    // Scroll tracker
    const handleScroll = () => {
      setShowScrollUp(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Theme Sync on Mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.dataset.theme = savedTheme;
    } else {
      setTheme('dark');
      document.documentElement.dataset.theme = 'dark';
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.dataset.theme = newTheme;
    localStorage.setItem('theme', newTheme);
  };

  const handleLocationSelect = (lat: number, lng: number) => {
    setIsPinned(true);
    setCurrentLocation((prev) => ({ ...prev, lat, lng }));
  };

  const handlePredict = async (features: any) => {
    setIsLoading(true);
    setAdvisorData(null);
    setInvestmentData(null);
    setLastFeatures(features);
    setError(null);
    setAdvisorError(false);
    setLoadingStep('predicting');

    const toastId = toast.loading('Analyzing property...', {
      description: 'Running XGBoost prediction model',
    });

    try {
      const finalFeatures = {
        ...features,
        Latitude: currentLocation.lat,
        Longitude: currentLocation.lng,
      };

      const result = await predictPrice(finalFeatures);
      setPrediction(result);

      toast.success('Report generated!', {
        id: toastId,
        description: `Predicted: ₱${result.predicted_price_php?.toLocaleString('en-PH', { maximumFractionDigits: 0 })}`,
      });

      // Smooth scroll to results
      setTimeout(() => {
        document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 200);

      // Fetch AI Advice (Step 2)
      setLoadingStep('advising');
      setIsAdvisorLoading(true);
      try {
        const advice = await getAIAdvice(finalFeatures, result);
        setAdvisorData(advice);
      } catch (err) {
        console.error('Advisor failed:', err);
        setAdvisorError(true);
        toast.warning('AI Advisor unavailable', {
          description: 'The ProphetIQ AI analysis could not be completed.',
        });
      } finally {
        setIsAdvisorLoading(false);
      }

      // Fetch Investment Metrics (Step 3)
      setLoadingStep('investing');
      setIsInvestmentLoading(true);
      try {
        const metrics = await getInvestmentMetrics(result.predicted_price_php);
        setInvestmentData(metrics);
      } catch (err) {
        console.error('Investment metrics failed:', err);
      } finally {
        setIsInvestmentLoading(false);
      }

      setLoadingStep('done');
    } catch (err: any) {
      const msg = err.message || 'An unexpected error occurred';
      setError(msg);
      setLoadingStep('idle');
      toast.error('Prediction failed', { id: toastId, description: msg });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen py-20 px-4 sm:px-6 max-w-6xl mx-auto">
      <button
        onClick={toggleTheme}
        className="fixed top-4 right-4 z-50 w-10 h-10 rounded-full glass border border-white/10 flex items-center justify-center hover:border-primary/50 transition-all"
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? '☀️' : '🌙'}
      </button>

      {/* Header / Hero */}
      <header className="text-center mb-16 animate-fade-in">
        {/* Status pill */}
        <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full mb-6">
          <span
            className={`w-2 h-2 rounded-full animate-pulse ${
              serverStatus === 'online'
                ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]'
                : serverStatus === 'checking'
                ? 'bg-yellow-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]'
                : 'bg-danger'
            }`}
          />
          <span className="text-[10px] uppercase tracking-widest font-bold text-text-secondary">
            Firm Systems&nbsp;
            <span
              className={
                serverStatus === 'online'
                  ? 'text-emerald-400'
                  : serverStatus === 'checking'
                  ? 'text-yellow-400'
                  : 'text-danger'
              }
            >
              {serverStatus}
            </span>
          </span>
        </div>

        <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter">
          Prophet<span className="text-gradient">IQ</span>
        </h1>
        <p className="text-text-secondary text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
          The next generation of{' '}
          <span className="text-white font-bold underline decoration-yellow-500">
            Engineering &amp; Construction
          </span>{' '}
          intelligence. Bridge the gap between property value and buildability in Pangasinan.
        </p>

        {/* Quick stats bar */}
        <div className="flex flex-wrap justify-center gap-4 mt-10">
          {[
            { value: '44', label: 'Municipalities' },
            { value: '±8%', label: 'Avg. Accuracy' },
            { value: 'XGBoost', label: 'ML Engine' },
            { value: 'ProphetIQ AI', label: 'Site Advisor' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center bg-white/5 border border-white/10 px-5 py-3 rounded-xl hover:border-white/20 hover:-translate-y-0.5 transition-all duration-200 cursor-default"
            >
              <span className="text-base font-black text-white">{stat.value}</span>
              <span className="text-[10px] text-text-muted uppercase tracking-widest mt-0.5">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </header>

      {/* Input Section & Site Selector */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
        <div className="space-y-6">
          <PredictionForm
            onSubmit={handlePredict}
            isLoading={isLoading}
            externalLocation={currentLocation}
            onCityChange={(city, lat, lng) => {
              setIsPinned(false);
              setCurrentLocation({ city, lat, lng });
            }}
          />
          {error && (
            <div className="p-4 bg-danger/10 border border-danger/20 rounded-xl text-danger text-sm font-medium flex items-start gap-3">
              <span className="mt-0.5 flex-shrink-0">⚠</span>
              <span>{error}</span>
            </div>
          )}
        </div>

        <div className="lg:sticky lg:top-8 h-fit">
          <MapView
            latitude={currentLocation.lat}
            longitude={currentLocation.lng}
            city={currentLocation.city}
            price={prediction?.predicted_price}
            onLocationSelect={handleLocationSelect}
            isPinned={isPinned}
          />
          <div className="mt-4 p-4 glass rounded-xl border border-yellow-500/20 bg-yellow-500/5">
            <h4 className="text-xs font-bold text-yellow-500 uppercase tracking-widest mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
              Engineering Precision Mode
            </h4>
            <p className="text-[10px] text-text-muted leading-relaxed">
              Select your municipality first, then{' '}
              <span className="text-white font-bold">click on the map</span> to pin-point the exact
              project site. This adjusts for local terrain and neighborhood valuation factors.
            </p>
          </div>
        </div>
      </div>

      {/* Loading Steps Component */}
      <LoadingSteps step={loadingStep} />

      {/* Results / Intelligence Report Section */}
      <div id="results-section" className="space-y-12">
        {prediction ? (
          <div className="animate-fade-in space-y-12">
            {/* Report Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-l-4 border-yellow-500 pl-6 py-2">
              <div>
                <h2 className="text-3xl font-black text-text-primary tracking-tight">
                  Technical Intelligence Report
                </h2>
                <p className="text-text-muted text-sm uppercase tracking-widest font-bold">
                  Project Site Analysis: {lastFeatures?.City}, Pangasinan
                </p>
              </div>
              <div className="flex flex-wrap gap-3 self-start sm:self-center">
                <button
                  onClick={handleSaveProject}
                  className="flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-white font-extrabold text-xs px-5 py-2.5 rounded-full shadow-lg hover:shadow-yellow-500/20 active:scale-95 transition-all"
                >
                  <span>⭐</span>
                  <span>Save Site to Cockpit</span>
                </button>
                <button
                  onClick={handleExportPDF}
                  className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 font-extrabold text-xs px-5 py-2.5 rounded-full shadow-lg active:scale-95 transition-all"
                >
                  <span>📄</span>
                  <span>Download Blueprint PDF</span>
                </button>
              </div>
            </div>

            {/* Smooth Anchor Sub-Navigation */}
            <div className="sticky top-4 z-40 flex justify-center w-full max-w-xl mx-auto animate-fade-in px-4">
              <div className="glass flex items-center justify-between p-1 rounded-full border border-border bg-glass-bg shadow-lg backdrop-blur-md w-full gap-1 overflow-x-auto scrollbar-none">
                {[
                  { label: 'Overview', id: 'overview' },
                  { label: 'AI Advisor', id: 'ai-assessment' },
                  { label: 'Price Drivers', id: 'shap-drivers' },
                  { label: 'Investment', id: 'investment' },
                  { label: 'Comparables', id: 'comparables' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }}
                    className="px-3.5 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider text-text-secondary hover:text-text-primary hover:bg-black/5 dark:hover:bg-white/10 transition-all whitespace-nowrap"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Unified 2-Column Technical Report Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column: ML & Cost Intelligence */}
              <div className="space-y-8">
                <div id="overview" className="scroll-mt-24">
                  <PriceDisplay
                    price={prediction.predicted_price}
                    low={prediction.price_range_low}
                    high={prediction.price_range_high}
                  />
                </div>
                <ConstructionEstimator
                  floorArea={Number(lastFeatures?.['Floor_area (sqm)']) || 0}
                  quality={lastFeatures?.Quality || 'Standard'}
                />
                <div id="shap-drivers" className="scroll-mt-24">
                  <ShapChart features={prediction.top_features} />
                </div>
              </div>

              {/* Right Column: AI & Investment Intelligence */}
              <div className="space-y-8">
                <div id="ai-assessment" className="scroll-mt-24">
                  <AIAdvisorPanel 
                    advice={advisorData} 
                    isLoading={isAdvisorLoading} 
                    isError={advisorError} 
                    city={lastFeatures?.City}
                    isCondo={Number(lastFeatures?.IsCondo) === 1}
                  />
                </div>
                <MaterialCanvassing />
                <div id="investment" className="scroll-mt-24">
                  <InvestmentDashboard
                    data={investmentData}
                    isLoading={isInvestmentLoading}
                    predictedPrice={prediction.predicted_price}
                  />
                </div>
              </div>
            </div>

            {/* Market Comparables */}
            <div id="comparables" className="scroll-mt-24">
              <RecommendedProperties
                city={lastFeatures?.City}
                predictedPrice={prediction.predicted_price}
                bedrooms={Number(lastFeatures?.Bedrooms) || 0}
                isCondo={Number(lastFeatures?.IsCondo)}
              />
            </div>
          </div>
        ) : (
          !isLoading && (
            <div className="glass p-20 rounded-3xl border-dashed border-border flex flex-col items-center justify-center text-center space-y-6 opacity-40">
              <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-text-muted"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-text-primary mb-2">Awaiting Project Data</h3>
                <p className="text-sm text-text-muted max-w-xs">
                  Fill out the construction parameters above to generate your technical site
                  intelligence report.
                </p>
              </div>
            </div>
          )
        )}
      </div>

      {/* Comparison Cockpit */}
      <SavedComparisonCockpit
        projects={savedProjects}
        onRemoveProject={(id) => {
          const updated = savedProjects.filter(p => p.id !== id);
          updateSavedProjects(updated);
          toast.success('Property removed from deck.');
        }}
        onClearAll={() => {
          updateSavedProjects([]);
          toast.success('Workspace cleared successfully.');
        }}
      />

      {/* Expert Network */}
      <ContactSection />

      {/* Footer */}
      <footer className="mt-32 pt-10 border-t border-border flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-[10px] text-text-muted uppercase tracking-[0.3em] font-bold">
        <span>ProphetIQ Engineering &copy; {new Date().getFullYear()}</span>
        <div className="flex space-x-6">
          <a href="/docs" className="hover:text-primary transition-colors">
            API Docs
          </a>
          <a
            href="https://github.com/Unlighted01/ProphetIQ-"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors"
          >
            GitHub
          </a>
          <a href="#" className="hover:text-primary transition-colors">
            Privacy
          </a>
        </div>
      </footer>

      {/* Floating Action Console */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-3">
        <div className="glass flex flex-col items-center p-2 rounded-2xl border border-border bg-glass-bg shadow-2xl backdrop-blur-md gap-2">
          {/* Scroll to Top */}
          {showScrollUp && (
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="w-10 h-10 rounded-xl bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-all group active:scale-95"
              title="Scroll to Top"
            >
              <svg className="w-5 h-5 text-primary group-hover:-translate-y-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </button>
          )}

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="w-10 h-10 rounded-xl bg-white/5 hover:bg-black/5 dark:hover:bg-white/10 flex items-center justify-center transition-all active:scale-95"
            title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {theme === 'dark' ? (
              <svg className="w-5 h-5 text-yellow-500 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-11.314l.707.707m11.314 11.314l.707-.707M12 5a7 7 0 100 14 7 7 0 000-14z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>

          {/* Scroll to Bottom */}
          <button
            onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
            className="w-10 h-10 rounded-xl bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-all group active:scale-95"
            title="Scroll to Bottom"
          >
            <svg className="w-5 h-5 text-primary group-hover:translate-y-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>
        </div>
      </div>
    </main>
  );
}
