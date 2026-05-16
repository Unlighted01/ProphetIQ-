import React, { useState, useEffect } from 'react';
import PredictionForm from '@/components/PredictionForm';
import PriceDisplay from '@/components/PriceDisplay';
import ShapChart from '@/components/ShapChart';
import AIAdvisorPanel from '@/components/AIAdvisorPanel';
import InvestmentDashboard from '@/components/InvestmentDashboard';
import RecommendedProperties from '@/components/RecommendedProperties';
import ContactSection from '@/components/ContactSection';
import { predictPrice, checkHealth, getAIAdvice, getInvestmentMetrics } from '@/lib/api';
import dynamic from 'next/dynamic';

// Dynamic import for MapView to prevent SSR issues with Leaflet
const MapView = dynamic(() => import('@/components/MapView'), { 
  ssr: false,
  loading: () => <div className="h-[400px] w-full rounded-xl bg-white/5 animate-pulse mt-6 border border-white/10"></div>
});

export default function Home() {
  const [prediction, setPrediction] = useState<any>(null);
  const [advisorData, setAdvisorData] = useState<any>(null);
  const [investmentData, setInvestmentData] = useState<any>(null);
  const [lastFeatures, setLastFeatures] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdvisorLoading, setIsAdvisorLoading] = useState(false);
  const [isInvestmentLoading, setIsInvestmentLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [serverStatus, setServerStatus] = useState<'online' | 'offline' | 'checking'>('checking');

  useEffect(() => {
    async function getStatus() {
      const health = await checkHealth();
      setServerStatus(health.status === 'ok' ? 'online' : 'offline');
    }
    getStatus();
  }, []);

  const handlePredict = async (features: any) => {
    setIsLoading(true);
    setAdvisorData(null);
    setInvestmentData(null);
    setLastFeatures(features);
    setError(null);
    try {
      const result = await predictPrice(features);
      setPrediction(result);
      
      // Smooth scroll to results
      setTimeout(() => {
        document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);

      // Fetch Investment Metrics
      setIsInvestmentLoading(true);
      getInvestmentMetrics(result.predicted_price_php)
        .then(data => setInvestmentData(data))
        .catch(err => console.error("Investment failed:", err))
        .finally(() => setIsInvestmentLoading(false));

      // Fetch AI Advice immediately after prediction
      setIsAdvisorLoading(true);
      try {
        const advice = await getAIAdvice(features, result);
        setAdvisorData(advice);
      } catch (advisorErr) {
        console.error("Advisor failed:", advisorErr);
      } finally {
        setIsAdvisorLoading(false);
      }

    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen py-20 px-6 max-w-6xl mx-auto">
      {/* Header / Hero */}
      <header className="text-center mb-16 animate-fade-in">
        <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full mb-6">
          <span className={`w-2 h-2 rounded-full ${serverStatus === 'online' ? 'bg-accent shadow-[0_0_8px_#10b981]' : 'bg-danger'} animate-pulse`}></span>
          <span className="text-[10px] uppercase tracking-widest font-bold text-text-secondary">
            Systems {serverStatus}
          </span>
        </div>
        
        <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter">
          Prophet<span className="text-gradient">IQ</span>
        </h1>
        <p className="text-text-secondary text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
          The next generation of Philippine real estate intelligence. 
          Analyze property values with institutional-grade AI and transparent feature reasoning.
        </p>
      </header>

      {/* Input Section */}
      <div className="max-w-4xl mx-auto mb-20">
        <PredictionForm onSubmit={handlePredict} isLoading={isLoading} />
        {error && (
          <div className="mt-6 p-4 bg-danger/10 border border-danger/20 rounded-xl text-danger text-sm font-medium animate-shake">
            Error: {error}
          </div>
        )}
      </div>

      {/* Results / Intelligence Report Section */}
      <div id="results-section" className="space-y-12">
        {prediction ? (
          <div className="animate-fade-in space-y-12">
            {/* Report Header */}
            <div className="border-l-4 border-primary pl-6 py-2">
              <h2 className="text-3xl font-black text-white tracking-tight">Intelligence Report</h2>
              <p className="text-text-muted text-sm uppercase tracking-widest font-bold">Analysis for {lastFeatures?.City}, Philippines</p>
            </div>

            {/* Price & Analysis Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-8">
                <PriceDisplay 
                  price={prediction.predicted_price} 
                  low={prediction.price_range_low} 
                  high={prediction.price_range_high} 
                />
                <AIAdvisorPanel 
                  advice={advisorData} 
                  isLoading={isAdvisorLoading} 
                />
              </div>
              <div className="space-y-8">
                <ShapChart features={prediction.top_features} />
                <InvestmentDashboard 
                  data={investmentData} 
                  isLoading={isInvestmentLoading} 
                />
              </div>
            </div>

            {/* Map & Context */}
            <div className="grid grid-cols-1 gap-8">
              <MapView 
                latitude={lastFeatures?.Latitude || 14.58} 
                longitude={lastFeatures?.Longitude || 121.06} 
                city={lastFeatures?.City || 'Pasig'} 
                price={prediction.predicted_price} 
              />
            </div>

            {/* Market Comparables */}
            <RecommendedProperties 
              city={lastFeatures?.City}
              predictedPrice={prediction.predicted_price}
              bedrooms={Number(lastFeatures?.Bedrooms) || 0}
              isCondo={Number(lastFeatures?.IsCondo)}
            />
          </div>
        ) : !isLoading && (
          <div className="glass p-20 rounded-3xl border-dashed border-white/5 flex flex-col items-center justify-center text-center space-y-6 opacity-40">
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center">
              <svg className="w-10 h-10 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Awaiting Analysis</h3>
              <p className="text-sm text-text-muted max-w-xs">Fill out the property details above to generate your customized intelligence report.</p>
            </div>
          </div>
        )}
      </div>

      {/* Expert Network */}
      <ContactSection />

      {/* Footer */}
      <footer className="mt-32 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-[10px] text-text-muted uppercase tracking-[0.3em] font-bold">
        <span>ProphetIQ Platform &copy; {new Date().getFullYear()}</span>
        <div className="flex space-x-6">
          <a href="#" className="hover:text-primary transition-colors">Documentation</a>
          <a href="#" className="hover:text-primary transition-colors">API Keys</a>
          <a href="#" className="hover:text-primary transition-colors">Privacy</a>
        </div>
      </footer>
    </main>
  );
}
