'use client';

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { toast } from 'sonner';
import { reverseGeocodeProxy } from '@/lib/api';

interface MapViewProps {
  latitude: number;
  longitude: number;
  city: string;
  price?: number;
  onLocationSelect?: (lat: number, lng: number) => void;
  isInteractive?: boolean;
  isPinned?: boolean;
}

// Helper to center the map when coordinates change
const MapUpdater: React.FC<{ 
  lat: number; 
  lng: number; 
  isPinned: boolean 
}> = ({ lat, lng, isPinned }) => {
  const map = useMap();
  useEffect(() => {
    if (isPinned) {
      // User manually pinned — pan only, keep current zoom
      map.panTo([lat, lng], { animate: true });
    } else {
      // City dropdown changed — full reset to zoom 14
      map.setView([lat, lng], 14, { animate: true });
    }
  }, [lat, lng, map, isPinned]);
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

// Location picker component with geocoding validation on right-click
const LocationPicker: React.FC<{ 
  onSelect: (lat: number, lng: number) => void 
}> = ({ onSelect }) => {
  const [markerState, setMarkerState] = useState<
    'idle' | 'validating' | 'valid' | 'invalid'
  >('idle');
  const [pendingPos, setPendingPos] = useState<
    [number, number] | null
  >(null);

  useMapEvents({
    contextmenu: async (e) => {
      if (e.originalEvent) e.originalEvent.preventDefault();
      
      const { lat, lng } = e.latlng;
      setPendingPos([lat, lng]);
      setMarkerState('validating');

      try {
        const data = await reverseGeocodeProxy(lat, lng);

        const isInPH = data.address?.country_code === 'ph';
        const isOnLand = !!(
          data.address?.road ||
          data.address?.suburb ||
          data.address?.village ||
          data.address?.municipality ||
          data.address?.city ||
          data.address?.town
        );
        const hasError = !!data.error;

        if (hasError || !isInPH) {
          setMarkerState('invalid');
          toast.error(
            !isInPH 
              ? 'ProphetIQ covers Philippine properties only'
              : 'Could not detect a valid location here'
          );
          return;
        }

        if (!isOnLand) {
          setMarkerState('invalid');
          toast.error(
            'Invalid location — please pin on land within Pangasinan'
          );
          return;
        }

        setMarkerState('valid');
        toast.success('Location pinned successfully');
        onSelect(lat, lng);

      } catch {
        setMarkerState('invalid');
        toast.error('Location validation failed — please try again');
      }
    },
  });

  // Render colored marker based on state
  if (!pendingPos || markerState === 'idle') return null;

  const markerColor = 
    markerState === 'validating' ? '#3b82f6' :  // blue
    markerState === 'valid'      ? 'var(--primary)' :  // theme cyan/charcoal
                                   '#ef4444';   // red

  const icon = L.divIcon({
    className: '',
    html: `<div style="
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: ${markerColor};
      border: 2px solid white;
      box-shadow: 0 0 10px ${markerColor};
    "></div>`,
    iconAnchor: [7, 7],
  });

  return <Marker position={pendingPos} icon={icon} />;
};

const MapView: React.FC<MapViewProps> = ({ latitude, longitude, city, price, onLocationSelect, isInteractive = true, isPinned = false }) => {
  const [pinnedCoords, setPinnedCoords] = useState({ lat: latitude, lng: longitude });
  const [currentTheme, setCurrentTheme] = useState('dark');

  // Monitor DOM dataset changes to toggle tiles on theme flip
  useEffect(() => {
    const checkTheme = () => {
      const activeTheme = document.documentElement.dataset.theme || 'dark';
      setCurrentTheme(activeTheme);
    };
    checkTheme();
    
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    });
    
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setPinnedCoords({ lat: latitude, lng: longitude });
  }, [latitude, longitude]);

  // Define dynamic basemaps depending on active theme
  const tileUrl = currentTheme === 'light'
    ? 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
    : 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';

  // High-fidelity pulsing telemetry sonar pin
  const pulsingIcon = L.divIcon({
    className: '',
    html: `
      <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 32px; height: 32px;">
        <div style="position: absolute; width: 32px; height: 32px; background-color: var(--primary); opacity: 0.3; border-radius: 50%; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
        <div style="position: absolute; width: 14px; height: 14px; background-color: var(--primary); border: 2px solid var(--bg-deep); border-radius: 50%; box-shadow: 0 0 10px var(--primary);"></div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16]
  });

  return (
    <div className="glass p-4 rounded-2xl mt-6 border border-border-color overflow-hidden animate-fade-in relative z-0 shadow-lg">
      <div className="flex items-center justify-between mb-4 px-4 pt-2 font-headers">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center mr-3 shadow-[0_0_10px_var(--border-glow)] border border-primary/20">
            <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-on-surface tracking-tight uppercase">Site Intelligence Map</h3>
            <p className="text-[9px] text-on-faint uppercase tracking-widest font-semibold mt-0.5">Telemetry & Geospatial Lock</p>
          </div>
        </div>
        {isInteractive && (
          <span className="text-[9px] font-bold text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-full uppercase tracking-wider animate-pulse">
            Right-Click Map to Pin
          </span>
        )}
      </div>
      
      <div className="h-[400px] w-full rounded-xl overflow-hidden relative border border-border-color shadow-inner">
        <MapContainer 
          center={[pinnedCoords.lat, pinnedCoords.lng]} 
          zoom={14} 
          scrollWheelZoom={false}
          style={{ height: '100%', width: '100%', zIndex: 10 }}
        >
          <TileLayer
            key={currentTheme}
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url={tileUrl}
          />
          <MapUpdater lat={pinnedCoords.lat} lng={pinnedCoords.lng} isPinned={isPinned} />
          <MapInteractionController />
          {isInteractive && onLocationSelect && (
            <LocationPicker 
              key={`${latitude}-${longitude}`} 
              onSelect={onLocationSelect} 
            />
          )}
          
          <Marker position={[pinnedCoords.lat, pinnedCoords.lng]} icon={pulsingIcon}>
            <Popup>
              <div className="text-center font-sans min-w-[140px] p-1">
                <p className="font-bold text-xs m-0 text-slate-800 uppercase tracking-wider font-headers">{city} Site</p>
                {price && (
                  <p className="text-xs text-cyan-600 font-extrabold m-0 mt-1 italic font-mono">Est. ₱{price.toLocaleString()}</p>
                )}
                <p className="text-[9px] text-slate-500 mt-1 font-mono">
                  {pinnedCoords.lat.toFixed(5)}° N, {pinnedCoords.lng.toFixed(5)}° E
                </p>
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      </div>
      <div className="mt-3 px-4 flex justify-between items-center text-[9px] text-on-muted uppercase tracking-wider font-bold">
        <p className="flex items-center gap-1.5 font-medium leading-relaxed text-on-muted normal-case">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-telemetry-pulse"></span>
          Click map once to enable scroll-zoom. Right-Click to pin precision geotech coordinates.
        </p>
      </div>
    </div>
  );
};

export default MapView;
