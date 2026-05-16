'use client';

import React, { useState } from 'react';

interface PredictionFormProps {
  onSubmit: (features: any) => void;
  isLoading: boolean;
}

// ── City Data ────────────────────────────────────────────────────────────────
// ── Pangasinan Localization ──────────────────────────────────────────────────
const PH_CITY_GROUPS = [
  {
    region: "Cities",
    cities: ["Dagupan", "Urdaneta", "San Carlos", "Alaminos"]
  },
  {
    region: "Major Municipalities",
    cities: ["Lingayen", "Calasiao", "Mangaldan", "Manaoag", "Binmaley", "Bayambang", "Malasiqui", "Rosales", "Villasis", "Binalonan", "Tayug", "Mangatarem", "Bolinao", "San Fabian", "Manaoag", "Pozorrubio"]
  }
];

const CITY_COORDS: Record<string, { lat: number; lng: number }> = {
  "Dagupan":     { lat: 16.0433, lng: 120.3333 },
  "Urdaneta":    { lat: 15.9758, lng: 120.5707 },
  "San Carlos":  { lat: 15.9272, lng: 120.3489 },
  "Alaminos":    { lat: 16.1517, lng: 119.9806 },
  "Lingayen":    { lat: 16.0204, lng: 120.2315 },
  "Calasiao":    { lat: 16.0075, lng: 120.3586 },
  "Mangaldan":   { lat: 16.0694, lng: 120.4025 },
  "Manaoag":     { lat: 16.0426, lng: 120.4878 },
  "Binmaley":    { lat: 16.0303, lng: 120.2678 },
  "Bayambang":   { lat: 15.8111, lng: 120.4578 },
  "Malasiqui":   { lat: 15.9189, lng: 120.4144 },
  "Rosales":     { lat: 15.8921, lng: 120.6358 },
  "Villasis":    { lat: 15.9014, lng: 120.5878 },
  "Binalonan":   { lat: 16.0506, lng: 120.5925 },
  "Tayug":       { lat: 16.0286, lng: 120.7458 },
  "Mangatarem":  { lat: 15.7892, lng: 120.2911 },
  "Bolinao":     { lat: 16.3853, lng: 119.8933 },
  "San Fabian":  { lat: 16.1242, lng: 120.4042 },
  "Pozorrubio":  { lat: 16.1086, lng: 120.5428 },
};

const DEFAULT_CITY = "Lingayen";

const PredictionForm: React.FC<PredictionFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<any>({
    Bedrooms: '',
    Bath: '',
    'Floor_area (sqm)': '',
    'Land_area (sqm)': '',
    City: DEFAULT_CITY,
    IsCondo: 1,
    Latitude: CITY_COORDS[DEFAULT_CITY].lat,
    Longitude: CITY_COORDS[DEFAULT_CITY].lng
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (name === 'City') {
      // Auto-update coordinates when city changes
      const coords = CITY_COORDS[value];
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
    <form onSubmit={handleSubmit} className="glass p-8 rounded-2xl space-y-6 animate-fade-in">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-bold text-gradient">PH Property Details</h2>
        <span className="text-[10px] text-text-muted uppercase tracking-widest font-semibold border border-white/10 px-2 py-1 rounded-full">
          🇵🇭 Philippines
        </span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Location */}
        <div className="space-y-3 md:col-span-2">
          <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block"></span>
            Location
          </h3>
          <div>
            <label className="block text-sm text-text-secondary mb-1.5">City / Region</label>
            <div className="relative">
              <select
                name="City"
                value={formData.City}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none transition-all text-white appearance-none cursor-pointer"
              >
                {PH_CITY_GROUPS.map(group => (
                  <optgroup key={group.region} label={`── ${group.region} ──`} className="bg-[#0d1117] text-text-muted">
                    {group.cities.map(city => (
                      <option key={city} value={city} className="bg-[#0d1117] text-white">{city}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            <p className="text-[10px] text-text-muted mt-1.5 flex items-center gap-1">
              <svg className="w-3 h-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              Map auto-centers to selected city · {formData.Latitude.toFixed(4)}°, {formData.Longitude.toFixed(4)}°
            </p>
          </div>
        </div>

        {/* Construction Quality & Type */}
        <div className="space-y-3 md:col-span-2">
          <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 inline-block"></span>
            Construction Parameters
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-text-secondary mb-1.5">Project Standard</label>
              <select
                name="Quality"
                defaultValue="Standard"
                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-primary outline-none text-white"
              >
                <option value="Economy" className="bg-[#0d1117]">Economy (Basic Finishes)</option>
                <option value="Standard" className="bg-[#0d1117]">Standard (Mid-range)</option>
                <option value="Premium" className="bg-[#0d1117]">Premium (High-end / Luxury)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-text-secondary mb-1.5">Usage Type</label>
              <select
                name="Usage"
                defaultValue="Residential"
                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-primary outline-none text-white"
              >
                <option value="Residential" className="bg-[#0d1117]">Residential (Home)</option>
                <option value="Commercial" className="bg-[#0d1117]">Commercial (Shop/Office)</option>
                <option value="Industrial" className="bg-[#0d1117]">Industrial (Warehouse)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Size & Area */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block"></span>
            Area (sqm)
          </h3>
          
          <div>
            <label className="block text-sm text-text-secondary mb-1.5">Floor Area (sqm)</label>
            <input
              type="number"
              name="Floor_area (sqm)"
              placeholder="e.g. 50"
              value={formData['Floor_area (sqm)']}
              onChange={handleChange}
              min={0}
              className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none transition-all text-white placeholder:text-white/20"
            />
          </div>
          
          <div>
            <label className="block text-sm text-text-secondary mb-1.5">
              Land Area (sqm)
              <span className="text-[10px] opacity-50 ml-1">(0 for Condos)</span>
            </label>
            <input
              type="number"
              name="Land_area (sqm)"
              placeholder="e.g. 100"
              value={formData['Land_area (sqm)']}
              onChange={handleChange}
              min={0}
              className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none transition-all text-white placeholder:text-white/20"
            />
          </div>
        </div>

        {/* Configuration */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary inline-block"></span>
            Configuration
          </h3>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-text-secondary mb-1.5">Bedrooms</label>
              <input
                type="number"
                name="Bedrooms"
                placeholder="e.g. 2"
                value={formData.Bedrooms}
                onChange={handleChange}
                min={0}
                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none transition-all text-white placeholder:text-white/20"
              />
            </div>
            <div>
              <label className="block text-sm text-text-secondary mb-1.5">Bathrooms</label>
              <input
                type="number"
                name="Bath"
                placeholder="e.g. 1"
                value={formData.Bath}
                onChange={handleChange}
                min={0}
                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none transition-all text-white placeholder:text-white/20"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-text-secondary mb-1.5">Property Type</label>
            <select
              name="IsCondo"
              value={formData.IsCondo}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none transition-all text-white"
            >
              <option value={1} className="bg-[#0d1117]">🏢 Condo / Apartment</option>
              <option value={0} className="bg-[#0d1117]">🏡 House &amp; Lot / Townhouse</option>
            </select>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-4 rounded-xl font-bold text-white bg-grad-hero hover:shadow-[0_0_25px_rgba(59,130,246,0.5)] transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 relative overflow-hidden group"
      >
        <span className="relative z-10">
          {isLoading
            ? '⚡ Calculating Philippine Market Price...'
            : '🔍 Generate AI Price Prediction (₱)'}
        </span>
        <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></span>
      </button>
    </form>
  );
};

export default PredictionForm;
