"use client";

import Candle from "./Candle";
import { motion } from "framer-motion";

export default function BirthdayCake({ candles = 3, litCandlesCount = 3, isFlickering = false }) {
  
  // Distribute candles nicely across the top tier, ensuring they are bounded within the cake width
  const getCandlePositions = () => {
    const positions = [];
    
    // Hard restrict visual candles so it's always elegant (max 6)
    const displayCandles = Math.min(candles, 6);
    
    // Top tier has rx=60. The max safe width is ~70 to avoid floating off edges
    const width = displayCandles > 1 ? 70 : 0; 
    
    const rows = 1; // Enforce single row for elegant design when capped
    
    for (let i = 0; i < displayCandles; i++) {
        // distribute across rows roughly evenly
        const rowIndex = 0;
        const itemsInThisRow = displayCandles;
        const colIndex = i;
        
        const rowWidth = width;
        const step = rowWidth / Math.max(1, (itemsInThisRow - 1));
        
        let x;
        if (itemsInThisRow === 1) {
            x = 0;
        } else {
            // center around 0
            x = - (rowWidth / 2) + (step * colIndex);
        }

        // Base Y needs to sit perfectly on the cy="-100" top tier ellipse.
        // Candle body goes from 0 to 45. Base of candle is at y+45
        // If we want y+45 = -100, then y should be -145.
        // We add slight arc for 3D realism
        const baseY = -145;
        const arcY = Math.pow(Math.abs(x), 1.5) * 0.02; // better natural curve
        const y = baseY + arcY;

        // Add subtle rotation based on x coordinate so they spray outwards
        const angle = x * 0.15; 
        
        positions.push({ x: x, y, angle, layer: 1 });
    }
    
    // Sort by layer so front candles render last (on top)
    return positions.sort((a,b) => a.layer - b.layer);
  };

  const candlePositions = getCandlePositions();

  return (
    <div className="relative w-64 md:w-80 mx-auto aspect-square flex items-center justify-center">
      <svg viewBox="-150 -200 300 300" className="w-full h-full drop-shadow-2xl overflow-visible">
        <defs>
          <linearGradient id="candle-gradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#f43f5e" />
            <stop offset="100%" stopColor="#be123c" />
          </linearGradient>
          
          <radialGradient id="flame-gradient" cx="50%" cy="80%" r="50%">
            <stop offset="0%" stopColor="#fff" />
            <stop offset="40%" stopColor="#fef08a" />
            <stop offset="80%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#ea580c" />
          </radialGradient>

          <linearGradient id="cake-base" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fbcfe8" />
            <stop offset="100%" stopColor="#be185d" />
          </linearGradient>

          <linearGradient id="cake-icing" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fff" />
            <stop offset="100%" stopColor="#f3f4f6" />
          </linearGradient>
        </defs>

        <motion.g
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Plate */}
          <ellipse cx="0" cy="80" rx="130" ry="30" fill="#e5e7eb" />
          <ellipse cx="0" cy="85" rx="130" ry="30" fill="#9ca3af" />

          {/* Bottom Tier */}
          <path d="M -100 20 L 100 20 L 100 70 A 100 25 0 0 1 -100 70 Z" fill="url(#cake-base)" />
          <ellipse cx="0" cy="20" rx="100" ry="25" fill="#f9a8d4" />
          
          {/* Icing Drips Bottom Tier */}
          <path d="M -100 20 Q -80 40 -60 20 Q -40 50 -20 20 Q 0 45 20 20 Q 40 35 60 20 Q 80 45 100 20 A 100 25 0 0 1 -100 20 Z" fill="url(#cake-icing)" />

          {/* Middle Tier */}
          <path d="M -80 -40 L 80 -40 L 80 10 A 80 20 0 0 1 -80 10 Z" fill="url(#cake-base)" />
          <ellipse cx="0" cy="-40" rx="80" ry="20" fill="#f472b6" />

          {/* Icing Drips Middle Tier */}
          <path d="M -80 -40 Q -60 -20 -40 -40 Q -20 -15 0 -40 Q 20 -10 40 -40 Q 60 -25 80 -40 A 80 20 0 0 1 -80 -40 Z" fill="url(#cake-icing)" />

          {/* Top Tier */}
          <path d="M -60 -100 L 60 -100 L 60 -50 A 60 15 0 0 1 -60 -50 Z" fill="url(#cake-base)" />
          <ellipse cx="0" cy="-100" rx="60" ry="15" fill="#ec4899" />

          {/* Icing Drips Top Tier */}
          <path d="M -60 -100 Q -40 -80 -20 -100 Q 0 -75 20 -100 Q 40 -85 60 -100 A 60 15 0 0 1 -60 -100 Z" fill="url(#cake-icing)" />

        </motion.g>

        {/* Candles */}
        {candlePositions.map((pos, index) => (
          <Candle 
            key={index} 
            x={pos.x} 
            y={pos.y} 
            isLit={index < litCandlesCount} 
            isFlickering={isFlickering}
            angle={pos.angle}
            delay={0.8 + (index * 0.05)} 
          />
        ))}

      </svg>
    </div>
  );
}
