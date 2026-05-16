'use client';

import React, { useState, useEffect } from 'react';
import PredictionForm from '@/components/PredictionForm';
import PriceDisplay from '@/components/PriceDisplay';
import ShapChart from '@/components/ShapChart';
import AIAdvisorPanel from '@/components/AIAdvisorPanel';
import InvestmentDashboard from '@/components/InvestmentDashboard';
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
          The next generation of real estate intelligence. 
          Analyze property values with institutional-grade AI and transparent feature reasoning.
        </p>
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Form Section */}
        <div className="lg:col-span-7">
          <PredictionForm onSubmit={handlePredict} isLoading={isLoading} />
          
          {error && (
            <div className="mt-6 p-4 bg-danger/10 border border-danger/20 rounded-xl text-danger text-sm font-medium">
              Error: {error}
            </div>
          )}
        </div>

        {/* Results Section */}
        <div id="results-section" className="lg:col-span-5 space-y-8">
          {prediction ? (
            <>
              <PriceDisplay 
                price={prediction.predicted_price} 
                low={prediction.price_range_low} 
                high={prediction.price_range_high} 
              />
              <ShapChart features={prediction.top_features} />
              
              <InvestmentDashboard 
                data={investmentData} 
                isLoading={isInvestmentLoading} 
              />
              
              <MapView 
                latitude={lastFeatures?.Latitude || 14.58} 
                longitude={lastFeatures?.Longitude || 121.06} 
                city={lastFeatures?.City || 'Pasig'} 
                price={prediction.predicted_price} 
              />

              <AIAdvisorPanel 
                advice={advisorData} 
                isLoading={isAdvisorLoading} 
              />
            </>
          ) : (
            <div className="glass p-12 rounded-2xl border-dashed border-white/5 flex flex-col items-center justify-center text-center space-y-4 opacity-50 grayscale">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                <svg className="w-8 h-8 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-text-secondary">Awaiting Analysis</h3>
                <p className="text-xs text-text-muted">Enter property details to generate intelligence report</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-[10px] text-text-muted uppercase tracking-[0.3em] font-bold">
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
