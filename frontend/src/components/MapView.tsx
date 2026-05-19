'use client';

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { toast } from 'sonner';

// Define custom icons for different validation states
const ValidIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const InvalidIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const LoadingIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface MapViewProps {
  latitude: number;
  longitude: number;
  city: string;
  price?: number;
  onLocationSelect?: (lat: number, lng: number) => void;
  isInteractive?: boolean;
}

// Helper to center the map when coordinates change
const MapUpdater: React.FC<{ lat: number; lng: number }> = ({ lat, lng }) => {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], 14, { animate: true });
  }, [lat, lng, map]);
  return null;
};

// Component to handle map interaction (scroll zoom activation on click, deactivation on mouseout)
const MapInteractionController: React.FC = () => {
  const map = useMap();

  useMapEvents({
    click() {
      map.scrollWheelZoom.enable();
    },
    mouseout() {
      map.scrollWheelZoom.disable();
    }
  });

  return null;
};

// Component to handle right-click location pinning
const LocationPicker: React.FC<{ onSelect: (lat: number, lng: number) => void }> = ({ onSelect }) => {
  useMapEvents({
    contextmenu(e) {
      if (e.originalEvent) {
        e.originalEvent.preventDefault();
      }
      onSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

const MapView: React.FC<MapViewProps> = ({ latitude, longitude, city, price, onLocationSelect, isInteractive = true }) => {
  const [pinnedCoords, setPinnedCoords] = useState({ lat: latitude, lng: longitude });
  const [isValidating, setIsValidating] = useState(false);
  const [validationStatus, setValidationStatus] = useState<'valid' | 'invalid'>('valid');

  useEffect(() => {
    setPinnedCoords({ lat: latitude, lng: longitude });
    setValidationStatus('valid');
  }, [latitude, longitude]);

  const handleLocationPin = async (lat: number, lng: number) => {
    if (isValidating) return;

    setPinnedCoords({ lat, lng });
    setIsValidating(true);

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lng=${lng}&format=json`,
        { headers: { 'Accept-Language': 'en', 'User-Agent': 'ProphetIQ-Land-Validation-Agent' } }
      );
      const data = await res.json();

      if (data.error) {
        setValidationStatus('invalid');
        toast.error("Invalid location — please pin on land within Pangasinan");
        return;
      }

      // 1. Must be in the Philippines
      if (data.address?.country_code !== 'ph') {
        setValidationStatus('invalid');
        toast.error("ProphetIQ covers Philippine properties only");
        return;
      }

      // 2. Must have some land address (not open water)
      const hasLand = data.address?.road || 
                      data.address?.suburb || 
                      data.address?.village || 
                      data.address?.municipality ||
                      data.address?.city ||
                      data.address?.county ||
                      data.address?.neighbourhood ||
                      data.address?.hamlet;

      if (!hasLand) {
        setValidationStatus('invalid');
        toast.error("Invalid location — please pin on land within Pangasinan");
        return;
      }

      // Validation passed
      setValidationStatus('valid');
      if (onLocationSelect) {
        onLocationSelect(lat, lng);
      }
    } catch (err) {
      console.error(err);
      toast.error("Geocoding failed — please try again");
      setValidationStatus('invalid');
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className="glass p-4 rounded-2xl mt-6 border border-white/10 overflow-hidden animate-fade-in relative z-0">
      <div className="flex items-center justify-between mb-4 px-4 pt-2">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center mr-3 shadow-[0_0_10px_rgba(234,179,8,0.3)]">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-text-primary tracking-tight">Project Site Intelligence</h3>
        </div>
        {isInteractive && (
          <span className="text-[9px] font-bold text-yellow-500 bg-yellow-500/10 border border-yellow-500/30 px-2 py-1 rounded-full uppercase tracking-widest animate-pulse">
            {isValidating ? "Validating..." : "Right-Click to Pin"}
          </span>
        )}
      </div>
      
      <div className="h-[400px] w-full rounded-xl overflow-hidden relative border border-white/10">
        <MapContainer 
          center={[pinnedCoords.lat, pinnedCoords.lng]} 
          zoom={14} 
          scrollWheelZoom={false}
          style={{ height: '100%', width: '100%', zIndex: 10 }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapUpdater lat={pinnedCoords.lat} lng={pinnedCoords.lng} />
          <MapInteractionController />
          {isInteractive && (
            <LocationPicker onSelect={handleLocationPin} />
          )}
          
          <Marker 
            position={[pinnedCoords.lat, pinnedCoords.lng]}
            icon={isValidating ? LoadingIcon : validationStatus === 'valid' ? ValidIcon : InvalidIcon}
          >
            <Popup>
              <div className="text-center font-sans min-w-[120px]">
                {isValidating ? (
                  <p className="font-bold text-sm m-0 text-slate-800 animate-pulse">Checking location...</p>
                ) : (
                  <>
                    <p className="font-bold text-sm m-0 text-slate-800">
                      {validationStatus === 'valid' ? `${city} Project Site` : 'Invalid Location'}
                    </p>
                    {price && validationStatus === 'valid' && (
                      <p className="text-xs text-blue-600 font-bold m-0 mt-1 italic">Est. ₱{price.toLocaleString()}</p>
                    )}
                    <p className="text-[10px] text-slate-500 mt-1">
                      {pinnedCoords.lat.toFixed(5)}, {pinnedCoords.lng.toFixed(5)}
                    </p>
                  </>
                )}
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      </div>
      <div className="mt-3 px-4 flex justify-between items-center text-[10px] text-text-muted">
        <p className="flex items-center gap-1">
          <span className={`w-2 h-2 rounded-full ${isValidating ? 'bg-blue-500 animate-ping' : validationStatus === 'valid' ? 'bg-yellow-500' : 'bg-red-500'}`}></span>
          Click the map once to scroll-zoom. Right-Click anywhere to pin the exact site location.
        </p>
      </div>
    </div>
  );
};

export default MapView;

