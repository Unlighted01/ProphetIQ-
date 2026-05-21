'use client';

import React, { useState, useEffect } from 'react';

interface PredictionFormProps {
  onSubmit: (features: any) => void;
  isLoading: boolean;
  externalLocation?: { lat: number; lng: number; city: string };
  onCityChange?: (city: string, lat: number, lng: number) => void;
}

const PH_CITY_GROUPS = [
  {
    region: "Cities",
    cities: ["Alaminos", "Dagupan", "San Carlos", "Urdaneta"]
  },
  {
    region: "Municipalities (Districts 1-6)",
    cities: [
      "Agno", "Aguilar", "Alcala", "Anda", "Asingan", "Balungao", "Bani", "Basista", "Bautista", "Bayambang", 
      "Binalonan", "Binmaley", "Bolinao", "Bugallon", "Burgos", "Calasiao", "Dasol", "Infanta", "Labrador", 
      "Laoac", "Lingayen", "Mabini", "Malasiqui", "Manaoag", "Mangaldan", "Mangatarem", "Mapandan", 
      "Natividad", "Pozorrubio", "Rosales", "San Fabian", "San Jacinto", "San Manuel", "San Nicolas", 
      "San Quintin", "Santa Barbara", "Santa Maria", "Santo Tomas", "Sison", "Sual", "Tayug", "Umingan", 
      "Urbiztondo", "Villasis"
    ]
  }
];

const CITY_COORDS: Record<string, { lat: number; lng: number }> = {
  // Cities
  "Alaminos":    { lat: 16.1517, lng: 119.9806 },
  "Dagupan":     { lat: 16.0433, lng: 120.3333 },
  "San Carlos":  { lat: 15.9272, lng: 120.3489 },
  "Urdaneta":    { lat: 15.9758, lng: 120.5707 },
  // Municipalities
  "Agno":        { lat: 16.1119, lng: 119.7997 },
  "Aguilar":     { lat: 15.8906, lng: 120.2411 },
  "Alcala":      { lat: 15.8475, lng: 120.5217 },
  "Anda":        { lat: 16.2892, lng: 119.9606 },
  "Asingan":     { lat: 16.0019, lng: 120.6694 },
  "Balungao":    { lat: 15.8986, lng: 120.6761 },
  "Bani":        { lat: 16.1836, lng: 119.8631 },
  "Basista":     { lat: 15.8528, lng: 120.4011 },
  "Bautista":    { lat: 15.8111, lng: 120.4764 },
  "Bayambang":   { lat: 15.8111, lng: 120.4578 },
  "Binalonan":   { lat: 16.0506, lng: 120.5925 },
  "Binmaley":    { lat: 16.0303, lng: 120.2678 },
  "Bolinao":     { lat: 16.3853, lng: 119.8933 },
  "Bugallon":    { lat: 15.9556, lng: 120.2175 },
  "Burgos":      { lat: 16.0600, lng: 119.8700 },
  "Calasiao":    { lat: 16.0075, lng: 120.3586 },
  "Dasol":       { lat: 15.9911, lng: 119.8803 },
  "Infanta":     { lat: 15.8267, lng: 119.9075 },
  "Labrador":    { lat: 16.0272, lng: 120.1442 },
  "Laoac":       { lat: 16.0539, lng: 120.5408 },
  "Lingayen":    { lat: 16.0204, lng: 120.2315 },
  "Mabini":      { lat: 16.0717, lng: 119.9397 },
  "Malasiqui":   { lat: 15.9189, lng: 120.4144 },
  "Manaoag":     { lat: 16.0426, lng: 120.4878 },
  "Mangaldan":   { lat: 16.0694, lng: 120.4025 },
  "Mangatarem":  { lat: 15.7892, lng: 120.2911 },
  "Mapandan":    { lat: 16.0286, lng: 120.4503 },
  "Natividad":   { lat: 16.0467, lng: 120.7972 },
  "Pozorrubio":  { lat: 16.1086, lng: 120.5428 },
  "Rosales":     { lat: 15.8921, lng: 120.6358 },
  "San Fabian":  { lat: 16.1242, lng: 120.4042 },
  "San Jacinto": { lat: 16.0744, lng: 120.4411 },
  "San Manuel":  { lat: 16.0653, lng: 120.6672 },
  "San Nicolas": { lat: 16.0686, lng: 120.7644 },
  "San Quintin": { lat: 15.9858, lng: 120.8164 },
  "Santa Barbara": { lat: 16.0019, lng: 120.4022 },
  "Santa Maria": { lat: 15.9817, lng: 120.6975 },
  "Santo Tomas": { lat: 15.8753, lng: 120.5842 },
  "Sison":       { lat: 16.1739, lng: 120.5422 },
  "Sual":        { lat: 16.0647, lng: 120.1017 },
  "Tayug":       { lat: 16.0286, lng: 120.7458 },
  "Umingan":     { lat: 15.8344, lng: 120.7811 },
  "Urbiztondo":  { lat: 15.8236, lng: 120.3314 },
  "Villasis":    { lat: 15.9014, lng: 120.5878 },
};

const DEFAULT_CITY = "Lingayen";

const PredictionForm: React.FC<PredictionFormProps> = ({ onSubmit, isLoading, externalLocation, onCityChange }) => {
  const [formData, setFormData] = useState<any>({
    Bedrooms: '',
    Bath: '',
    'Floor_area (sqm)': '',
    'Land_area (sqm)': '',
    City: DEFAULT_CITY,
    IsCondo: 1,
    Quality: 'Standard',
    Usage: 'Residential',
    Latitude: CITY_COORDS[DEFAULT_CITY].lat,
    Longitude: CITY_COORDS[DEFAULT_CITY].lng
  });

  // Sync with map clicks or external changes
  useEffect(() => {
    if (externalLocation) {
      setFormData((prev: any) => ({
        ...prev,
        Latitude: externalLocation.lat,
        Longitude: externalLocation.lng,
        City: externalLocation.city || prev.City
      }));
    }
  }, [externalLocation]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (name === 'City') {
      const coords = CITY_COORDS[value];
      if (coords && onCityChange) {
        onCityChange(value, coords.lat, coords.lng);
      }
      setFormData((prev: any) => ({
        ...prev,
        City: value,
        Latitude: coords?.lat ?? prev.Latitude,
        Longitude: coords?.lng ?? prev.Longitude,
      }));
    } else {
      setFormData((prev: any) => ({
        ...prev,
        [name]: type === 'number' ? (value === '' ? '' : Number(value)) : value
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanData = { ...formData };
    for (const key in cleanData) {
      if (cleanData[key] === '') cleanData[key] = 0;
    }
    onSubmit(cleanData);
  };

  return (
    <form onSubmit={handleSubmit} className="glass p-8 rounded-2xl space-y-6 animate-fade-in border border-border-color relative overflow-hidden">
      {/* Visual Accent Corner Glow */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none rounded-bl-full" />
      
      <div className="flex items-center justify-between mb-2 border-b border-border-color/50 pb-4 font-headers">
        <div>
          <h2 className="text-xl font-bold text-gradient uppercase tracking-wider">PH Property Details</h2>
          <p className="text-[10px] text-on-faint uppercase tracking-wider font-semibold">Geological & Site Parameters</p>
        </div>
        <span className="text-[9px] text-primary uppercase tracking-widest font-extrabold border border-primary/20 bg-primary/5 px-2.5 py-1 rounded-full">
          🇵🇭 Pangasinan Matrix
        </span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Location */}
        <div className="space-y-3 md:col-span-2">
          <h3 className="text-[10px] font-bold text-on-muted uppercase tracking-widest font-headers flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-telemetry-pulse"></span>
            Location Coordinates
          </h3>
          <div>
            <label className="block text-xs font-medium text-on-muted mb-1.5">Municipality / City</label>
            <div className="relative">
              <select
                name="City"
                value={formData.City}
                onChange={handleChange}
                className="w-full bg-bg-surface border border-border-color rounded-xl p-3.5 focus:border-primary outline-none transition-all text-on-surface appearance-none cursor-pointer text-sm font-semibold shadow-inner"
              >
                {PH_CITY_GROUPS.map(group => (
                  <optgroup key={group.region} label={`── ${group.region} ──`} className="bg-bg-surface text-on-muted font-bold font-headers text-xs">
                    {group.cities.map(city => (
                      <option key={city} value={city} className="text-on-surface font-semibold text-sm">{city}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-on-muted">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            <p className="text-[9px] text-on-faint mt-2 flex items-center gap-1.5 font-mono">
              <svg className="w-3.5 h-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              COORDINATES // LAT: {formData.Latitude.toFixed(4)}° · LNG: {formData.Longitude.toFixed(4)}°
            </p>
          </div>
        </div>

        {/* Construction Quality & Type */}
        <div className="space-y-3 md:col-span-2 border-t border-border-color/30 pt-4">
          <h3 className="text-[10px] font-bold text-on-muted uppercase tracking-widest font-headers flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
            Engineering Parameters
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-on-muted uppercase tracking-wider mb-2 font-headers">Project Standard</label>
              <div className="grid grid-cols-3 gap-1 p-1 glass rounded-xl bg-bg-deep/30 border border-border-color font-headers text-[9px]">
                {['Economy', 'Standard', 'Premium'].map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => setFormData((prev: any) => ({ ...prev, Quality: q }))}
                    className={`py-2 px-1 rounded-lg text-center font-bold tracking-widest uppercase transition-all duration-300 ${
                      formData.Quality === q
                        ? 'bg-primary text-white shadow-md'
                        : 'text-on-muted hover:text-on-surface hover:bg-white/5'
                    }`}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-on-muted uppercase tracking-wider mb-2 font-headers">Usage Type</label>
              <div className="grid grid-cols-3 gap-1 p-1 glass rounded-xl bg-bg-deep/30 border border-border-color font-headers text-[9px]">
                {['Residential', 'Commercial', 'Industrial'].map((u) => (
                  <button
                    key={u}
                    type="button"
                    onClick={() => setFormData((prev: any) => ({ ...prev, Usage: u }))}
                    className={`py-2 px-1 rounded-lg text-center font-bold tracking-widest uppercase transition-all duration-300 ${
                      formData.Usage === u
                        ? 'bg-primary text-white shadow-md'
                        : 'text-on-muted hover:text-on-surface hover:bg-white/5'
                    }`}
                  >
                    {u}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Size & Area */}
        <div className="space-y-4 border-t border-border-color/30 pt-4">
          <h3 className="text-[10px] font-bold text-on-muted uppercase tracking-widest font-headers flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
            Sizing Matrices (sqm)
          </h3>
          
          <div className="space-y-3.5">
            <div>
              <label className="block text-xs font-medium text-on-muted mb-1.5">Floor Area (sqm)</label>
              <div className="relative rounded-xl overflow-hidden shadow-inner">
                <input
                  type="number"
                  name="Floor_area (sqm)"
                  placeholder="e.g. 50"
                  value={formData['Floor_area (sqm)']}
                  onChange={handleChange}
                  min={0}
                  className="w-full bg-bg-surface border border-border-color rounded-xl p-3 focus:border-primary outline-none transition-all text-on-surface placeholder:text-on-faint text-sm font-semibold pl-10"
                />
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-muted text-xs font-bold font-headers">📐</span>
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-medium text-on-muted mb-1.5 flex items-center justify-between">
                <span>Land Area (sqm)</span>
                <span className="text-[9px] text-on-faint uppercase font-bold tracking-wider">(0 for Condos)</span>
              </label>
              <div className="relative rounded-xl overflow-hidden shadow-inner">
                <input
                  type="number"
                  name="Land_area (sqm)"
                  placeholder="e.g. 100"
                  value={formData['Land_area (sqm)']}
                  onChange={handleChange}
                  min={0}
                  className="w-full bg-bg-surface border border-border-color rounded-xl p-3 focus:border-primary outline-none transition-all text-on-surface placeholder:text-on-faint text-sm font-semibold pl-10"
                />
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-muted text-xs font-bold font-headers">🌱</span>
              </div>
            </div>
          </div>
        </div>

        {/* Configuration */}
        <div className="space-y-4 border-t border-border-color/30 pt-4">
          <h3 className="text-[10px] font-bold text-on-muted uppercase tracking-widest font-headers flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-warning"></span>
            Configuration Matrix
          </h3>
          
          <div className="space-y-3.5">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-on-muted mb-1.5">Bedrooms</label>
                <div className="relative rounded-xl overflow-hidden shadow-inner">
                  <input
                    type="number"
                    name="Bedrooms"
                    placeholder="2"
                    value={formData.Bedrooms}
                    onChange={handleChange}
                    min={0}
                    className="w-full bg-bg-surface border border-border-color rounded-xl p-3 focus:border-primary outline-none transition-all text-on-surface placeholder:text-on-faint text-sm font-semibold pl-10"
                  />
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-muted text-xs font-bold font-headers">🛏️</span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-on-muted mb-1.5">Bathrooms</label>
                <div className="relative rounded-xl overflow-hidden shadow-inner">
                  <input
                    type="number"
                    name="Bath"
                    placeholder="1"
                    value={formData.Bath}
                    onChange={handleChange}
                    min={0}
                    className="w-full bg-bg-surface border border-border-color rounded-xl p-3 focus:border-primary outline-none transition-all text-on-surface placeholder:text-on-faint text-sm font-semibold pl-10"
                  />
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-muted text-xs font-bold font-headers">🚿</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-on-muted uppercase tracking-wider mb-2 font-headers">Property Type</label>
              <div className="grid grid-cols-2 gap-1 p-1 glass rounded-xl bg-bg-deep/30 border border-border-color font-headers text-[9px]">
                {[
                  { value: 1, label: '🏢 Condo' },
                  { value: 0, label: '🏡 House' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setFormData((prev: any) => ({ ...prev, IsCondo: opt.value }))}
                    className={`py-2 px-1 rounded-lg text-center font-bold tracking-widest uppercase transition-all duration-300 ${
                      formData.IsCondo === opt.value
                        ? 'bg-primary text-white shadow-md'
                        : 'text-on-muted hover:text-on-surface hover:bg-white/5'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-4 rounded-xl font-bold font-headers text-white bg-grad-hero hover:shadow-[0_4px_25px_rgba(6,182,212,0.45)] transition-all duration-300 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 relative overflow-hidden group tracking-widest text-xs uppercase"
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Calculating Philippine Market Price...
            </>
          ) : (
            '🔍 Generate AI Price Prediction (₱)'
          )}
        </span>
        <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></span>
      </button>
    </form>
  );
};

export default PredictionForm;
