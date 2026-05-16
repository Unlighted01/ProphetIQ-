'use client';

import React, { useState } from 'react';

interface PredictionFormProps {
  onSubmit: (features: any) => void;
  isLoading: boolean;
}

const PH_CITIES = [
  "Pasig", "Baguio", "Cebu", "Lapu-Lapu", "General Trias", 
  "Mandaluyong", "Makati", "Quezon City", "Davao", "Taguig"
];

const PredictionForm: React.FC<PredictionFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<any>({
    Bedrooms: '',
    Bath: '',
    'Floor_area (sqm)': '',
    'Land_area (sqm)': '',
    City: 'Pasig',
    IsCondo: 1,
    Latitude: 14.58,
    Longitude: 121.06
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? '' : Number(value)) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clean data before submitting: convert empty strings to 0
    const cleanData = { ...formData };
    for (const key in cleanData) {
      if (cleanData[key] === '') {
        cleanData[key] = 0;
      }
    }
    
    onSubmit(cleanData);
  };

  return (
    <form onSubmit={handleSubmit} className="glass p-8 rounded-2xl space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold mb-6 text-gradient">PH Property Details</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Location */}
        <div className="space-y-4 md:col-span-2">
          <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">Location</h3>
          <div>
            <label className="block text-sm text-text-secondary mb-1">City / Region</label>
            <select
              name="City"
              value={formData.City}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 focus:border-primary outline-none transition-colors"
            >
              {PH_CITIES.map(city => (
                <option key={city} value={city} className="bg-bg-deep">{city}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Size & Area */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">Area (sqm)</h3>
          
          <div>
            <label className="block text-sm text-text-secondary mb-1">Floor Area (sqm)</label>
            <input
              type="number"
              name="Floor_area (sqm)"
              placeholder="e.g. 50"
              value={formData['Floor_area (sqm)']}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 focus:border-primary outline-none transition-colors"
            />
          </div>
          
          <div>
            <label className="block text-sm text-text-secondary mb-1">Land Area (sqm) <span className="text-[10px] opacity-50">(0 for Condos)</span></label>
            <input
              type="number"
              name="Land_area (sqm)"
              placeholder="e.g. 100"
              value={formData['Land_area (sqm)']}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 focus:border-primary outline-none transition-colors"
            />
          </div>
        </div>

        {/* Configuration */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">Configuration</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-text-secondary mb-1">Bedrooms</label>
              <input
                type="number"
                name="Bedrooms"
                placeholder="e.g. 2"
                value={formData.Bedrooms}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 focus:border-primary outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm text-text-secondary mb-1">Bathrooms</label>
              <input
                type="number"
                name="Bath"
                placeholder="e.g. 1"
                value={formData.Bath}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 focus:border-primary outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-text-secondary mb-1">Property Type</label>
            <select
              name="IsCondo"
              value={formData.IsCondo}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 focus:border-primary outline-none transition-colors"
            >
              <option value={1} className="bg-bg-deep">Condo / Apartment</option>
              <option value={0} className="bg-bg-deep">House & Lot / Townhouse</option>
            </select>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-4 rounded-xl font-bold text-white bg-grad-hero hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all active:scale-[0.98] disabled:opacity-50 disabled:scale-100"
      >
        {isLoading ? 'Calculating Philippine Market Price...' : 'Generate AI Price Prediction (₱)'}
      </button>
    </form>
  );
};

export default PredictionForm;
