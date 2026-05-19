import React, { useMemo } from 'react';

interface RecommendedPropertiesProps {
  city: string;
  predictedPrice: number;
  bedrooms: number;
  isCondo: number;
}

// Curated Unsplash photos for properties
const PROPERTY_IMAGES = [
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80",  // modern condo
  "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&q=80",  // luxury house
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80",  // villa
  "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&q=80",  // modern exterior
  "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&q=80",  // house front
  "https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=600&q=80",  // condo pool
];

const PROPERTY_TEMPLATES = [
  { title: "Premier {type} near {city} CBD", variance: -0.05 },
  { title: "Modern {type} in {city}", variance: 0.08 },
  { title: "Luxury {type} — {city} Prestige", variance: 0.13 },
];

function formatPrice(n: number) {
  if (n >= 1_000_000) return `₱${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `₱${(n / 1_000).toFixed(0)}K`;
  return `₱${n.toFixed(0)}`;
}

const RecommendedProperties: React.FC<RecommendedPropertiesProps> = ({
  city,
  predictedPrice,
  bedrooms,
  isCondo,
}) => {
  const typeName = isCondo === 1 ? 'Condo' : 'House';

  const comps = useMemo(() => {
    return PROPERTY_TEMPLATES.map((tmpl, i) => {
      const price = predictedPrice * (1 + tmpl.variance);
      const beds = Math.max(1, bedrooms + (i === 1 ? 1 : 0));
      const baths = Math.max(1, Math.floor(beds * 0.7));
      const sqm = Math.round((60 + i * 20) * (1 + tmpl.variance));
      const title = tmpl.title
        .replace('{type}', typeName)
        .replace('{city}', city);
      return {
        title,
        price,
        beds,
        baths,
        sqm,
        image: PROPERTY_IMAGES[i % PROPERTY_IMAGES.length],
        tag: i === 0 ? '🔥 Hot Deal' : i === 2 ? '⭐ Premium' : '✅ Good Value',
        tagColor: i === 0 ? 'text-orange-400 bg-orange-500/10 border-orange-500/30'
                : i === 2 ? 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30'
                : 'text-accent bg-accent/10 border-accent/30',
      };
    });
  }, [city, predictedPrice, bedrooms, isCondo, typeName]);

  return (
    <div className="mt-8 animate-fade-in">
      {/* Section header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl font-bold text-text-primary">Comparable Listings</h2>
          <p className="text-xs text-text-muted mt-0.5">Similar properties in {city} near your estimated price</p>
        </div>
        <span className="text-[10px] uppercase tracking-widest font-bold text-text-muted border border-white/10 px-2 py-1 rounded-full">
          AI Generated
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {comps.map((comp, i) => (
          <div
            key={i}
            className="glass rounded-2xl overflow-hidden border border-white/10 hover:border-primary/40 hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(59,130,246,0.2)] transition-all duration-300 group cursor-pointer"
          >
            {/* Image */}
            <div className="relative h-44 overflow-hidden">
              <img
                src={comp.image}
                alt={comp.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              {/* Price badge */}
              <div className="absolute bottom-3 left-3">
                <span className="bg-black/70 backdrop-blur-sm text-white font-bold text-sm px-3 py-1 rounded-lg border border-white/20">
                  {formatPrice(comp.price)}
                </span>
              </div>
              {/* Tag */}
              <div className="absolute top-3 right-3">
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full border backdrop-blur-sm ${comp.tagColor}`}>
                  {comp.tag}
                </span>
              </div>
            </div>

            {/* Details */}
            <div className="p-4">
              <h3 className="font-semibold text-text-primary text-sm leading-tight mb-3 line-clamp-2">
                {comp.title}
              </h3>

              <div className="flex items-center gap-3 text-xs text-text-muted">
                <span className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  {comp.beds} Beds
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                  {comp.baths} Baths
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                  {comp.sqm} sqm
                </span>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <span className="text-[10px] text-text-muted flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  {city}
                </span>
                <button className="text-[10px] font-semibold text-primary hover:text-white transition-colors">
                  View Details →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendedProperties;
