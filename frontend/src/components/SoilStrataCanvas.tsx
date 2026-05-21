'use client';

import React, { useRef, useEffect, useState } from 'react';

interface SoilStrataCanvasProps {
  city: string;
  isCondo: boolean;
}

const SoilStrataCanvas: React.FC<SoilStrataCanvasProps> = ({ city = 'Lingayen', isCondo = false }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentTheme, setCurrentTheme] = useState('dark');

  // Monitor DOM dataset changes to redraw canvas on theme flip
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

  // Normalize city to classify geological zones
  const cityUpper = city.trim().toUpperCase();
  const isLiquefactionZone = ['DAGUPAN', 'CALASIAO', 'SAN FABIAN', 'MANGALDAN', 'BINMALEY'].some(c => cityUpper.includes(c));
  const isMountainZone = ['SISON', 'NATIVIDAD', 'SAN MANUEL', 'SAN QUINTIN', 'BALUNGAO'].some(c => cityUpper.includes(c));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const isLight = currentTheme === 'light';

    // Set pixel density ratio for crisp vector rendering on high-DPI displays
    const dpr = window.devicePixelRatio || 1;
    const width = 360;
    const height = 280;
    
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // ─── Theme Aware Colors ──────────────────────────────────────────────────
    const skyColor = isLight ? '#fafaf9' : '#030712';
    const gridLineColor = isLight ? 'rgba(28, 25, 23, 0.05)' : 'rgba(255, 255, 255, 0.03)';
    const boundaryLineColor = isLight ? 'rgba(28, 25, 23, 0.08)' : 'rgba(255, 255, 255, 0.06)';
    const groundLineColor = isLight ? '#78716c' : 'rgba(255, 255, 255, 0.15)';
    const superstructureColor = isLight ? 'rgba(28, 25, 23, 0.15)' : 'rgba(255, 255, 255, 0.12)';
    const columnStrokeColor = isLight ? 'rgba(28, 25, 23, 0.25)' : 'rgba(255, 255, 255, 0.2)';
    
    const concreteColor = isLight ? '#d6d3d1' : '#71717a';
    const concreteOutline = isLight ? '#78716c' : '#a1a1aa';
    const rebarColor = 'rgba(239, 68, 68, 0.45)'; // Crimson rebar vectors
    const loadVectorColor = isLight ? 'rgba(4, 120, 87, 0.5)' : 'rgba(16, 185, 129, 0.45)';
    
    const textPrimaryColor = isLight ? '#1c1917' : '#f8fafc';
    const textMutedColor = isLight ? '#78716c' : '#94a3b8';

    // Strata Palettes
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
      layer1Color = isLight ? '#cbd5e1' : '#2b3345'; // Dark grey-blue wet mud
      layer2Color = isLight ? '#94a3b8' : '#4a576e'; // Saturated grey silt
      layer3Color = isLight ? '#64748b' : '#728196'; // Saturated loose sand
      bedrockColor = isLight ? '#334155' : '#1f2533';

      layer1Label = 'Saturated Mud (Liquefaction Risk) 🌊';
      layer2Label = 'Unstable Silty Clay';
      layer3Label = 'Fine Saturated Sand';
      bedrockLabel = 'Stable Bedrock Anchor (+12m)';
      foundationLabel = isCondo ? 'Deep Drilled Bored Columns' : 'Elevated Friction Slabs & Piles';
    } else if (isMountainZone) {
      layer1Color = isLight ? '#fca5a5' : '#8b4513'; // Red mountain clay
      layer2Color = isLight ? '#f87171' : '#a0522d'; // Weathered shale
      layer3Color = isLight ? '#94a3b8' : '#708090'; // Hard slate
      bedrockColor = isLight ? '#475569' : '#334155';

      layer1Label = 'Rocky Red Mountain Clay 🏔';
      layer2Label = 'Highly Weathered Rock';
      layer3Label = 'Rigid Sandstone Stratum';
      bedrockLabel = 'Dense Granite Bedrock (Shallow)';
      foundationLabel = 'Direct Anchor Isolated Footings';
    }

    // ─── Draw Sky above Ground (y: 0 -> 50) ──────────────────────────────────
    ctx.fillStyle = skyColor;
    ctx.fillRect(0, 0, width, 50);

    // ─── Draw Strata Layers ──────────────────────────────────────────────────
    // Layer 1: Top (y: 50 -> 105)
    ctx.fillStyle = layer1Color;
    ctx.fillRect(0, 50, width, 55);

    // Layer 2: Mid (y: 105 -> 160)
    ctx.fillStyle = layer2Color;
    ctx.fillRect(0, 105, width, 55);

    // Layer 3: Lower (y: 160 -> 215)
    ctx.fillStyle = layer3Color;
    ctx.fillRect(0, 160, width, 55);

    // Bedrock: Bottom (y: 215 -> 280)
    ctx.fillStyle = bedrockColor;
    ctx.fillRect(0, 215, width, 65);

    // Draw grid horizontal line separators
    ctx.strokeStyle = boundaryLineColor;
    ctx.lineWidth = 1;
    for (let y = 50; y <= 215; y += 55) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Draw technical blueprint background vertical grid
    ctx.strokeStyle = gridLineColor;
    ctx.lineWidth = 0.5;
    for (let x = 40; x < width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // ─── Draw Water Table Line if Liquefaction Zone ────────────────────────────
    if (isLiquefactionZone) {
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([5, 3]);
      ctx.beginPath();
      ctx.moveTo(0, 85);
      ctx.lineTo(width, 85);
      ctx.stroke();
      ctx.setLineDash([]); // Reset

      ctx.fillStyle = '#06b6d4';
      ctx.font = 'bold 8px monospace';
      ctx.fillText('HIGH WATER TABLE LIMIT ──────', 10, 80);
    }

    // Ground line (y: 50)
    ctx.strokeStyle = groundLineColor;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, 50);
    ctx.lineTo(width, 50);
    ctx.stroke();

    // ─── Draw Superstructure Above Ground ──────────────────────────────────────
    ctx.strokeStyle = superstructureColor;
    ctx.lineWidth = 1;
    ctx.strokeRect(80, 10, 200, 40);
    
    // Grid frames
    ctx.beginPath();
    ctx.moveTo(80, 30);
    ctx.lineTo(280, 30);
    ctx.moveTo(146, 10);
    ctx.lineTo(146, 50);
    ctx.moveTo(213, 10);
    ctx.lineTo(213, 50);
    ctx.stroke();

    ctx.strokeStyle = columnStrokeColor;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(80, 10);
    ctx.lineTo(180, 2);
    ctx.lineTo(280, 10);
    ctx.stroke();

    // ─── Draw Concrete Columns and Footings ─────────────────────────────────────
    ctx.fillStyle = concreteColor;
    ctx.strokeStyle = concreteOutline;
    ctx.lineWidth = 1.2;

    const colPositions = [113, 180, 247];

    colPositions.forEach((x) => {
      if (isLiquefactionZone) {
        // Bored Columns (Deep Anchor Piles) extending into Bedrock
        const pileWidth = 10;
        const pileDepth = 190; // Deep anchor

        ctx.fillRect(x - pileWidth / 2, 50, pileWidth, pileDepth);
        ctx.strokeRect(x - pileWidth / 2, 50, pileWidth, pileDepth);

        // Cap cap footing block
        ctx.fillRect(x - 14, 42, 28, 10);
        ctx.strokeRect(x - 14, 42, 28, 10);

        // Bored shaft rebar lines (red telemetry rebar)
        ctx.strokeStyle = rebarColor;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(x - 2, 50);
        ctx.lineTo(x - 2, 50 + pileDepth);
        ctx.moveTo(x + 2, 50);
        ctx.lineTo(x + 2, 50 + pileDepth);
        ctx.stroke();
        ctx.strokeStyle = concreteOutline; // Restore
      } else if (isMountainZone) {
        // Mountain Footing: Shallow block anchored to stable rock
        ctx.fillRect(x - 4, 50, 8, 30);
        ctx.strokeRect(x - 4, 50, 8, 30);

        // Wide pad anchor
        ctx.fillRect(x - 18, 80, 36, 10);
        ctx.strokeRect(x - 18, 80, 36, 10);
      } else {
        // Standard spread footing
        ctx.fillRect(x - 6, 50, 12, 60);
        ctx.strokeRect(x - 6, 50, 12, 60);

        // Pad
        ctx.fillRect(x - 22, 110, 44, 12);
        ctx.strokeRect(x - 22, 110, 44, 12);
      }
    });

    // ─── Technical Labels & Notations ──────────────────────────────────────────
    ctx.fillStyle = textPrimaryColor;
    ctx.font = 'bold 8px monospace';

    // Strata Labels
    ctx.fillText(`[1] ${layer1Label}`, 15, 68);
    ctx.fillText(`[2] ${layer2Label}`, 15, 123);
    ctx.fillText(`[3] ${layer3Label}`, 15, 178);
    ctx.fillStyle = isMountainZone ? (isLight ? '#047857' : '#10b981') : textPrimaryColor;
    ctx.fillText(`[4] ${bedrockLabel}`, 15, 235);

    // Foundation type bubble overlay
    ctx.fillStyle = isLight ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(width - 175, 6, 168, 20);
    ctx.strokeStyle = isLiquefactionZone ? '#f43f5e' : isMountainZone ? '#10b981' : '#f59e0b';
    ctx.strokeRect(width - 175, 6, 168, 20);

    ctx.fillStyle = textPrimaryColor;
    ctx.font = 'bold 7.5px sans-serif';
    ctx.fillText(foundationLabel.toUpperCase(), width - 169, 18);

    // Dimension lines on the left side
    ctx.strokeStyle = textMutedColor;
    ctx.lineWidth = 0.5;
    ctx.fillStyle = textMutedColor;
    ctx.font = '7px monospace';

    // Draw ticks
    const depthTicks = [
      { y: 50, label: '0.0m' },
      { y: 105, label: '1.5m' },
      { y: 160, label: '6.0m' },
      { y: 215, label: '10.5m' },
      { y: 270, label: '15.0m' }
    ];

    depthTicks.forEach(tick => {
      ctx.beginPath();
      ctx.moveTo(3, tick.y);
      ctx.lineTo(9, tick.y);
      ctx.stroke();
      ctx.fillText(tick.label, 12, tick.y + 2.5);
    });

    // Draw load vector lines down columns
    ctx.strokeStyle = loadVectorColor;
    ctx.lineWidth = 1.2;
    colPositions.forEach((x) => {
      ctx.beginPath();
      ctx.moveTo(x, 6);
      ctx.lineTo(x, 40);
      ctx.stroke();
      
      // Arrow head
      ctx.beginPath();
      ctx.moveTo(x - 2.5, 36);
      ctx.lineTo(x, 41);
      ctx.lineTo(x + 2.5, 36);
      ctx.stroke();
    });

  }, [city, isCondo, isLiquefactionZone, isMountainZone, currentTheme]);

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-bg-surface/40 border border-border-color rounded-2xl space-y-3 w-full">
      <div className="flex justify-between w-full text-[9px] text-on-muted uppercase tracking-[0.2em] font-bold px-1 font-headers">
        <span>Soil Strata Profile: {city}</span>
        <span className={isLiquefactionZone ? 'text-danger animate-pulse font-extrabold' : isMountainZone ? 'text-accent font-extrabold' : 'text-warning font-extrabold'}>
          {isLiquefactionZone ? 'Liquefaction Alert' : isMountainZone ? 'Stable Granitic Bed' : 'Stable Cohesive Sand'}
        </span>
      </div>
      
      <div className="relative rounded-xl overflow-hidden border border-border-color shadow-lg">
        <canvas ref={canvasRef} />
      </div>

      <div className="grid grid-cols-2 gap-4 w-full text-[9px] text-on-faint leading-relaxed border-t border-border-color/30 pt-3 font-medium">
        <div>
          <span className="block text-on-surface font-bold mb-0.5 font-headers uppercase tracking-wider">Civil Spec:</span>
          {isLiquefactionZone ? (
            <span>High friction concrete piles required to bypass weak silt layers. Anchor pile depth &gt; 12 meters.</span>
          ) : isMountainZone ? (
            <span>Direct anchoring to bedrock simplifies footing excavation. Highly resilient to structural shears.</span>
          ) : (
            <span>Standard isolated spread footings using standard dense gravel layers are sufficient for stability.</span>
          )}
        </div>
        <div>
          <span className="block text-on-surface font-bold mb-0.5 font-headers uppercase tracking-wider">Site Grade Class:</span>
          {isLiquefactionZone ? (
            <span className="text-danger font-bold uppercase">Grade E (Weak soils & saturation)</span>
          ) : isMountainZone ? (
            <span className="text-accent font-bold uppercase">Grade A-B (Dense granite rock)</span>
          ) : (
            <span className="text-warning font-bold uppercase">Grade C (Medium compact cohesion)</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default SoilStrataCanvas;
