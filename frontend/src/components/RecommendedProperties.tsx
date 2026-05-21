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
  { title: "Completed {type} - Modern {city} Villa", variance: -0.05 },
  { title: "Completed {type} - Mid-Rise {city} Frame", variance: 0.08 },
  { title: "Completed {type} - Premium {city} Commercial", variance: 0.13 },
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
  const typeName = isCondo === 1 ? 'High-Rise' : 'Low-Rise';

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
        tag: i === 0 ? '👷 Economy Grade' : i === 2 ? '💎 Premium Spec' : '🏗️ Standard Spec',
        tagColor: i === 0 ? 'text-orange-400 bg-orange-500/10 border-orange-500/20'
            : i === 2 ? 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20'
            : 'text-accent bg-accent/10 border-accent/20',
      };
    });
  }, [city, predictedPrice, bedrooms, isCondo, typeName]);

  return (
      <div className="mt-12 animate-fade-in">
        {/* Section header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
          <div className="border-l-2 border-primary pl-4">
            <h2 className="text-xl font-bold uppercase tracking-wider text-on-surface font-headers">
              Completed Build Portfolio
            </h2>
            <p className="text-xs text-on-muted mt-0.5 font-medium">
              Realized blueprints and actual construction budgets for similar projects in {city}
            </p>
          </div>
          <span className="text-[9px] uppercase tracking-widest font-mono font-bold text-on-faint border border-border-color bg-bg-surface/50 px-3 py-1.5 rounded-lg self-start sm:self-center">
            Historical Records
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {comps.map((comp, i) => (
              <div
                  key={i}
                  className="glass glass-interactive rounded-2xl overflow-hidden border border-border-color group cursor-pointer flex flex-col justify-between"
              >
                {/* Image and badges */}
                <div className="relative h-48 overflow-hidden bg-bg-deep">
                  <img
                      src={comp.image}
                      alt={comp.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  {/* Subtle vignette gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-bg-deep/80 via-transparent to-transparent"></div>
                  
                  {/* Price badge */}
                  <div className="absolute bottom-3 left-3">
                    <span className="bg-bg-deep/80 backdrop-blur-md text-on-surface font-mono tracking-tight font-bold text-sm px-3.5 py-1.5 rounded-xl border border-border-color shadow-lg">
                      {formatPrice(comp.price)}
                    </span>
                  </div>
                  
                  {/* Category tag */}
                  <div className="absolute top-3 right-3">
                    <span className={`text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full border backdrop-blur-md shadow-md ${comp.tagColor}`}>
                      {comp.tag}
                    </span>
                  </div>
                </div>

                {/* Listing Details */}
                <div className="p-5 flex-grow flex flex-col justify-between gap-4">
                  <div className="space-y-2">
                    <h3 className="font-bold text-on-surface text-sm leading-tight line-clamp-2 font-headers uppercase tracking-wide group-hover:text-primary transition-colors">
                      {comp.title}
                    </h3>
                    
                    <p className="text-[10px] text-on-faint font-medium flex items-center gap-1">
                      <svg className="w-3.5 h-3.5 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                      {city}, Pangasinan Region
                    </p>
                  </div>

                  {/* Dimension Matrices */}
                  <div className="grid grid-cols-3 gap-2 bg-bg-deep/35 border border-border-color p-2 rounded-xl text-center text-[10px] font-headers font-bold uppercase tracking-wider text-on-muted">
                    <div className="flex flex-col items-center py-1">
                      <span className="text-[8px] text-on-faint mb-0.5">Rooms</span>
                      <span className="text-primary text-xs font-mono">{comp.beds}</span>
                    </div>
                    <div className="flex flex-col items-center py-1 border-x border-border-color">
                      <span className="text-[8px] text-on-faint mb-0.5">Wet Zones</span>
                      <span className="text-accent text-xs font-mono">{comp.baths}</span>
                    </div>
                    <div className="flex flex-col items-center py-1">
                      <span className="text-[8px] text-on-faint mb-0.5">Build Area</span>
                      <span className="text-secondary text-xs font-mono">{comp.sqm}㎡</span>
                    </div>
                  </div>

                  {/* CTA Footer */}
                  <div className="flex items-center justify-between pt-1 border-t border-border-color/30">
                    <span className="text-[9px] text-on-faint uppercase font-bold tracking-widest font-mono">
                      BLUEPRINT // B-{i + 1}
                    </span>
                    <button className="text-[10px] font-bold text-primary uppercase tracking-wider hover:text-on-surface transition-colors flex items-center gap-1 font-headers">
                      View Blueprints
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
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
