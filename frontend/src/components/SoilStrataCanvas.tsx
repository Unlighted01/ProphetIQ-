'use client';

import React, { useRef, useEffect } from 'react';

interface SoilStrataCanvasProps {
  city: string;
  isCondo: boolean;
}

const SoilStrataCanvas: React.FC<SoilStrataCanvasProps> = ({ city = 'Lingayen', isCondo = false }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Normalize city to classify geological zones
  const cityUpper = city.trim().toUpperCase();
  const isLiquefactionZone = ['DAGUPAN', 'CALASIAO', 'SAN FABIAN', 'MANGALDAN', 'BINMALEY'].some(c => cityUpper.includes(c));
  const isMountainZone = ['SISON', 'NATIVIDAD', 'SAN MANUEL', 'SAN QUINTIN', 'BALUNGAO'].some(c => cityUpper.includes(c));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set pixel density ratio for crisp vector rendering on high-DPI displays
    const dpr = window.devicePixelRatio || 1;
    const width = 450;
    const height = 300;
    
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // ─── Drawing Configs ──────────────────────────────────────────────────────
    // Color Palettes
    const skyColor = '#0b0f19';
    const topsoilColor = '#3f2d20';
    const concreteColor = '#a1a1aa';
    const concreteOutline = '#d4d4d8';
    
    let layer1Color = '#5c4033'; // Brown loam
    let layer2Color = '#8b5a2b'; // Sandy loam
    let layer3Color = '#b58055'; // Coarse gravel
    let bedrockColor = '#333b4d'; // Stable dense rock

    let layer1Label = 'Topsoil / Organic Loam';
    let layer2Label = 'Sandy Loam & Silt';
    let layer3Label = 'Dense Gravelly Sand';
    let bedrockLabel = 'Bedrock Level';
    let foundationLabel = isCondo ? 'Deep Bored Concrete Piles' : 'Spread Footing Foundation';

    if (isLiquefactionZone) {
      layer1Color = '#2b3345'; // Dark grey-blue wet mud
      layer2Color = '#4a576e'; // Saturated grey silt
      layer3Color = '#728196'; // Saturated loose sand
      bedrockColor = '#1f2533';

      layer1Label = 'Saturated Mud (Liquefaction Risk) 🌊';
      layer2Label = 'Unstable Silty Clay';
      layer3Label = 'Fine Saturated Sand';
      bedrockLabel = 'Stable Bedrock Anchor (+12m)';
      foundationLabel = isCondo ? 'Deep Drilled Bored Columns' : 'Elevated Friction Slabs & Piles';
    } else if (isMountainZone) {
      layer1Color = '#8b4513'; // Red mountain clay
      layer2Color = '#a0522d'; // Weathered shale
      layer3Color = '#708090'; // Hard slate
      bedrockColor = '#475569';

      layer1Label = 'Rocky Red Mountain Clay 🏔️';
      layer2Label = 'Highly Weathered Rock';
      layer3Label = 'Rigid Sandstone Stratum';
      bedrockLabel = 'Dense Granite / Bedrock (Shallow)';
      foundationLabel = 'Direct Anchor Isolated Footings';
    }

    // ─── Draw Strata Layers ──────────────────────────────────────────────────
    // Layer 1: Top (y: 60 -> 120)
    ctx.fillStyle = layer1Color;
    ctx.fillRect(0, 60, width, 60);

    // Layer 2: Mid (y: 120 -> 180)
    ctx.fillStyle = layer2Color;
    ctx.fillRect(0, 120, width, 60);

    // Layer 3: Lower (y: 180 -> 240)
    ctx.fillStyle = layer3Color;
    ctx.fillRect(0, 180, width, 60);

    // Bedrock: Bottom (y: 240 -> 300)
    ctx.fillStyle = bedrockColor;
    ctx.fillRect(0, 240, width, 60);

    // Draw grid layer lines
    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.lineWidth = 1;
    for (let y = 60; y <= 240; y += 60) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // ─── Draw Water Table Line if Liquefaction Zone ────────────────────────────
    if (isLiquefactionZone) {
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([6, 4]);
      ctx.beginPath();
      ctx.moveTo(0, 95);
      ctx.lineTo(width, 95);
      ctx.stroke();
      ctx.setLineDash([]); // Reset line dash

      ctx.fillStyle = '#60a5fa';
      ctx.font = 'bold 8px sans-serif';
      ctx.fillText('HIGH WATER TABLE LIMIT ───', 10, 90);
    }

    // ─── Draw Superstructure Above Ground ──────────────────────────────────────
    // Drawing a simple industrial warehouse/condo frame outline
    ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    ctx.lineWidth = 1;
    // Ground line (y: 60)
    ctx.beginPath();
    ctx.moveTo(0, 60);
    ctx.lineTo(width, 60);
    ctx.stroke();

    // Sky/above ground area
    ctx.fillStyle = skyColor;
    ctx.fillRect(0, 0, width, 60);

    // Columns/Frame (Above ground)
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.lineWidth = 2;
    // Outer structure box
    ctx.strokeRect(100, 15, 250, 45);
    // Roof truss lines
    ctx.beginPath();
    ctx.moveTo(100, 15);
    ctx.lineTo(225, 2);
    ctx.lineTo(350, 15);
    ctx.stroke();
    // Grid lines for stories
    ctx.beginPath();
    ctx.moveTo(100, 37);
    ctx.lineTo(350, 37);
    ctx.moveTo(183, 15);
    ctx.lineTo(183, 60);
    ctx.moveTo(266, 15);
    ctx.lineTo(266, 60);
    ctx.stroke();

    // ─── Draw Concrete Columns and Footings ─────────────────────────────────────
    ctx.fillStyle = concreteColor;
    ctx.strokeStyle = concreteOutline;
    ctx.lineWidth = 1.5;

    const colXPositions = [140, 225, 310];

    colXPositions.forEach((x) => {
      if (isLiquefactionZone) {
        // Friction Piles: Deep columns extending deep into Bedrock (y: 60 down to 260)
        const pileWidth = 14;
        const pileDepth = 200; // Deep anchor

        ctx.fillRect(x - pileWidth / 2, 60, pileWidth, pileDepth);
        ctx.strokeRect(x - pileWidth / 2, 60, pileWidth, pileDepth);

        // Cap connection block
        ctx.fillRect(x - 20, 50, 40, 12);
        ctx.strokeRect(x - 20, 50, 40, 12);

        // Bored shaft rebar lines (dashed inside concrete)
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.4)'; // Red warning lines
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x - 3, 60);
        ctx.lineTo(x - 3, 60 + pileDepth);
        ctx.moveTo(x + 3, 60);
        ctx.lineTo(x + 3, 60 + pileDepth);
        ctx.stroke();
        ctx.strokeStyle = concreteOutline; // Restore stroke
      } else if (isMountainZone) {
        // Mountain Zone: Shallow pad footing (y: 60 down to 100) anchored onto stable rock
        ctx.fillRect(x - 6, 60, 12, 35);
        ctx.strokeRect(x - 6, 60, 12, 35);

        // Wide pad anchor directly at rock limit
        ctx.fillRect(x - 22, 95, 44, 12);
        ctx.strokeRect(x - 22, 95, 44, 12);
      } else {
        // Default: Standard deep spread footings (y: 60 down to 140)
        ctx.fillRect(x - 8, 60, 16, 70);
        ctx.strokeRect(x - 8, 60, 16, 70);

        // Spread footing pad
        ctx.fillRect(x - 26, 130, 52, 14);
        ctx.strokeRect(x - 26, 130, 52, 14);
      }
    });

    // ─── Technical Labels & Notations ──────────────────────────────────────────
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.font = 'bold 9px monospace';

    // Strata Labels
    ctx.fillText(`[1] ${layer1Label}`, 15, 80);
    ctx.fillText(`[2] ${layer2Label}`, 15, 140);
    ctx.fillText(`[3] ${layer3Label}`, 15, 200);
    ctx.fillStyle = isMountainZone ? '#10b981' : 'rgba(255,255,255,0.7)';
    ctx.fillText(`[4] ${bedrockLabel}`, 15, 260);

    // Foundation type bubble overlay
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(width - 210, 8, 200, 24);
    ctx.strokeStyle = isLiquefactionZone ? '#ef4444' : isMountainZone ? '#10b981' : '#eab308';
    ctx.strokeRect(width - 210, 8, 200, 24);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 9px sans-serif';
    ctx.fillText(foundationLabel.toUpperCase(), width - 200, 23);

    // Load path indicators
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.4)'; // Emerald load vector
    ctx.lineWidth = 1.5;
    colXPositions.forEach((x) => {
      ctx.beginPath();
      ctx.moveTo(x, 10);
      ctx.lineTo(x, 48);
      ctx.stroke();
      
      // Arrow head
      ctx.beginPath();
      ctx.moveTo(x - 3, 44);
      ctx.lineTo(x, 49);
      ctx.lineTo(x + 3, 44);
      ctx.stroke();
    });

  }, [city, isCondo, isLiquefactionZone, isMountainZone]);

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-black/40 border border-white/5 rounded-2xl space-y-3">
      <div className="flex justify-between w-full text-[10px] text-text-secondary uppercase tracking-widest font-bold px-1">
        <span>Soil Strata Profile: {city}</span>
        <span className={isLiquefactionZone ? 'text-danger animate-pulse' : isMountainZone ? 'text-accent' : 'text-yellow-500'}>
          {isLiquefactionZone ? 'Liquefaction Warning' : isMountainZone ? 'Stable Rock Bed' : 'Optimal Cohesion'}
        </span>
      </div>
      
      <div className="relative rounded-xl overflow-hidden border border-white/10 shadow-lg">
        <canvas ref={canvasRef} />
      </div>

      <div className="grid grid-cols-2 gap-4 w-full text-[9px] text-text-muted leading-relaxed border-t border-white/5 pt-3">
        <div>
          <span className="block text-white font-bold mb-0.5">Civil Spec Guide:</span>
          {isLiquefactionZone ? (
            <span>High friction concrete piles required to bypass weak silt layers. Anchor pile depth &gt; 12 meters.</span>
          ) : isMountainZone ? (
            <span>Direct anchoring to bedrock simplifies footing excavation. Highly resilient to structural shears.</span>
          ) : (
            <span>Standard isolated spread footings using standard dense gravel layers are sufficient for stability.</span>
          )}
        </div>
        <div>
          <span className="block text-white font-bold mb-0.5">Site Grade Class:</span>
          {isLiquefactionZone ? (
            <span className="text-danger font-semibold">Grade E (Weak Soils & High Water Saturation)</span>
          ) : isMountainZone ? (
            <span className="text-accent font-semibold">Grade A-B (Dense Crystalline Mountain Rock)</span>
          ) : (
            <span className="text-yellow-500 font-semibold">Grade C (Standard Medium Compact Cohesion)</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default SoilStrataCanvas;
