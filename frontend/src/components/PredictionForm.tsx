'use client';

import React, { useState } from 'react';

interface PredictionFormProps {
  onSubmit: (features: any) => void;
  isLoading: boolean;
}

// ── City Data ────────────────────────────────────────────────────────────────
// Grouped by region for the optgroup UI
const PH_CITY_GROUPS = [
  {
    region: "Metro Manila",
    cities: ["Manila", "Makati", "Taguig", "Pasig", "Quezon City", "Mandaluyong", "Pasay", "Parañaque", "Marikina", "Caloocan", "Las Piñas", "Muntinlupa", "Valenzuela"]
  },
  {
    region: "Luzon",
    cities: ["Baguio", "Angeles", "San Fernando", "Cabanatuan", "General Trias", "Lipa", "Batangas City", "Lucena", "Legazpi", "Naga"]
  },
  {
    region: "Visayas",
    cities: ["Cebu City", "Lapu-Lapu", "Mandaue", "Iloilo City", "Bacolod", "Tacloban", "Dumaguete", "Ormoc"]
  },
  {
    region: "Mindanao",
    cities: ["Davao City", "General Santos", "Cagayan de Oro", "Zamboanga City", "Cotabato City", "Iligan", "Butuan"]
  }
];

// Auto-mapping: city → lat/lng for auto-centering the map
const CITY_COORDS: Record<string, { lat: number; lng: number }> = {
  // Metro Manila
  "Manila":         { lat: 14.5995, lng: 120.9842 },
  "Makati":         { lat: 14.5547, lng: 121.0244 },
  "Taguig":         { lat: 14.5176, lng: 121.0509 },
  "Pasig":          { lat: 14.5764, lng: 121.0851 },
  "Quezon City":    { lat: 14.6760, lng: 121.0437 },
  "Mandaluyong":    { lat: 14.5794, lng: 121.0359 },
  "Pasay":          { lat: 14.5378, lng: 121.0014 },
  "Parañaque":      { lat: 14.4793, lng: 121.0198 },
  "Marikina":       { lat: 14.6507, lng: 121.1029 },
  "Caloocan":       { lat: 14.6492, lng: 120.9673 },
  "Las Piñas":      { lat: 14.4453, lng: 120.9830 },
  "Muntinlupa":     { lat: 14.4081, lng: 121.0415 },
  "Valenzuela":     { lat: 14.7011, lng: 120.9830 },
  // Luzon
  "Baguio":         { lat: 16.4023, lng: 120.5960 },
  "Angeles":        { lat: 15.1450, lng: 120.5887 },
  "San Fernando":   { lat: 15.0288, lng: 120.6924 },
  "Cabanatuan":     { lat: 15.4866, lng: 120.9686 },
  "General Trias":  { lat: 14.3855, lng: 120.8807 },
  "Lipa":           { lat: 13.9411, lng: 121.1631 },
  "Batangas City":  { lat: 13.7565, lng: 121.0583 },
  "Lucena":         { lat: 13.9322, lng: 121.6170 },
  "Legazpi":        { lat: 13.1391, lng: 123.7438 },
  "Naga":           { lat: 13.6192, lng: 123.1814 },
  // Visayas
  "Cebu City":      { lat: 10.3157, lng: 123.8854 },
  "Lapu-Lapu":      { lat: 10.3103, lng: 123.9494 },
  "Mandaue":        { lat: 10.3236, lng: 123.9223 },
  "Iloilo City":    { lat: 10.6969, lng: 122.5644 },
  "Bacolod":        { lat: 10.6713, lng: 122.9511 },
  "Tacloban":       { lat: 11.2543, lng: 125.0000 },
  "Dumaguete":      { lat: 9.3068,  lng: 123.3054 },
  "Ormoc":          { lat: 11.0064, lng: 124.6079 },
  // Mindanao
  "Davao City":     { lat: 7.1907,  lng: 125.4553 },
  "General Santos": { lat: 6.1164,  lng: 125.1716 },
  "Cagayan de Oro": { lat: 8.4542,  lng: 124.6319 },
  "Zamboanga City": { lat: 6.9214,  lng: 122.0790 },
  "Cotabato City":  { lat: 7.2236,  lng: 124.2469 },
  "Iligan":         { lat: 8.2280,  lng: 124.2452 },
  "Butuan":         { lat: 8.9475,  lng: 125.5406 },
};

const DEFAULT_CITY = "Pasig";

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
            <select
              name="City"
              value={formData.City}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none transition-all text-white"
            >
              {PH_CITY_GROUPS.map(group => (
                <optgroup key={group.region} label={`── ${group.region} ──`} className="bg-[#0d1117] text-text-muted">
                  {group.cities.map(city => (
                    <option key={city} value={city} className="bg-[#0d1117] text-white">{city}</option>
                  ))}
                </optgroup>
              ))}
            </select>
            <p className="text-[10px] text-text-muted mt-1.5 flex items-center gap-1">
              <svg className="w-3 h-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              Map auto-centers to selected city · {formData.Latitude.toFixed(4)}°, {formData.Longitude.toFixed(4)}°
            </p>
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
