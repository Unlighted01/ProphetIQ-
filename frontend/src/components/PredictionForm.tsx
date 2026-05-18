'use client';

import React, { useState, useEffect } from 'react';

interface PredictionFormProps {
  onSubmit: (features: any) => void;
  isLoading: boolean;
  externalLocation?: { lat: number; lng: number; city: string };
  onCityChange?: (city: string, lat: number, lng: number) => void;
}

// ── City Data ────────────────────────────────────────────────────────────────
// ── Pangasinan Localization ──────────────────────────────────────────────────
// ── Pangasinan Localization (4 Cities + 44 Municipalities) ──────────────────
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
                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none transition-all text-text-primary appearance-none cursor-pointer"
              >
                {PH_CITY_GROUPS.map(group => (
                  <optgroup key={group.region} label={`── ${group.region} ──`} className="bg-bg-surface text-text-secondary">
                    {group.cities.map(city => (
                      <option key={city} value={city} className="bg-bg-surface text-text-primary">{city}</option>
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
                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-primary outline-none text-text-primary"
              >
                <option value="Economy" className="bg-bg-surface text-text-primary">Economy (Basic Finishes)</option>
                <option value="Standard" className="bg-bg-surface text-text-primary">Standard (Mid-range)</option>
                <option value="Premium" className="bg-bg-surface text-text-primary">Premium (High-end / Luxury)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-text-secondary mb-1.5">Usage Type</label>
              <select
                name="Usage"
                defaultValue="Residential"
                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-primary outline-none text-text-primary"
              >
                <option value="Residential" className="bg-bg-surface text-text-primary">Residential (Home)</option>
                <option value="Commercial" className="bg-bg-surface text-text-primary">Commercial (Shop/Office)</option>
                <option value="Industrial" className="bg-bg-surface text-text-primary">Industrial (Warehouse)</option>
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
              className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none transition-all text-text-primary placeholder:text-text-muted/30"
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
              className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none transition-all text-text-primary placeholder:text-text-muted/30"
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
                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none transition-all text-text-primary placeholder:text-text-muted/30"
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
                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none transition-all text-text-primary placeholder:text-text-muted/30"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-text-secondary mb-1.5">Property Type</label>
            <select
              name="IsCondo"
              value={formData.IsCondo}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none transition-all text-text-primary"
            >
              <option value={1} className="bg-bg-surface text-text-primary">🏢 Condo / Apartment</option>
              <option value={0} className="bg-bg-surface text-text-primary">🏡 House &amp; Lot / Townhouse</option>
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
