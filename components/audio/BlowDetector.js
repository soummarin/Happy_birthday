"use client";

import { useState, useEffect } from "react";
import { Mic, MicOff, Wind } from "lucide-react";

export default function BlowDetector({ 
  onBlow, 
  isBlowing, 
  intensity, 
  isActive, 
  onToggle 
}) {
  const [permissionGranted, setPermissionGranted] = useState(false);

  useEffect(() => {
    if (isActive) setPermissionGranted(true);
  }, [isActive]);

  return (
    <div className="flex flex-col items-center gap-4 my-8">
      
      {/* Microphone Toggle Button */}
      <button 
        onClick={onToggle}
        className={`relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
          isActive 
            ? "bg-rose-500 shadow-[0_0_30px_rgba(244,63,94,0.6)]" 
            : "bg-white/10 hover:bg-white/20 border border-white/20"
        }`}
      >
        {isActive ? (
          <Mic className="w-6 h-6 text-white" />
        ) : (
          <MicOff className="w-6 h-6 text-white/60" />
        )}
        
        {/* Ripple effect when active */}
        {isActive && !isBlowing && (
          <span className="absolute inset-0 rounded-full animate-ping bg-rose-400 opacity-20 pointer-events-none" style={{ animationDuration: '2s' }}></span>
        )}
        
        {/* Intense ripple when blowing */}
        {isBlowing && (
          <span className="absolute inset-0 rounded-full bg-orange-400 animate-ping opacity-40 pointer-events-none" style={{ animationDuration: '0.5s' }}></span>
        )}
      </button>

      <div className="text-center space-y-2">
        <h3 className="font-display text-xl text-white">
          {isActive ? (isBlowing ? "Whoosh!" : "Blow into the mic!") : "Enable Microphone"}
        </h3>
        
        {!isActive && !permissionGranted && (
          <p className="text-sm text-white/50 max-w-xs">
            We need audio access to detect your breath. Sound never leaves your device!
          </p>
        )}
        
        {/* Intensity Meter */}
        {isActive && (
          <div className="flex items-end justify-center gap-1 h-8 mt-2">
            {[...Array(10)].map((_, i) => {
              // Calculate how many bars should light up based on intensity (0 to ~100 scale)
              const mappedIntensity = Math.min(Math.floor(intensity / 10), 10);
              const isActiveBar = i < mappedIntensity;
              return (
                <div 
                  key={i} 
                  className={`w-1.5 rounded-full transition-all duration-75 ${
                    isActiveBar 
                      ? 'bg-gradient-to-t from-orange-400 to-rose-500' 
                      : 'bg-white/10'
                  }`}
                  style={{ 
                    height: isActiveBar ? `${Math.max(20 + i*8, (intensity/100)*100)}%` : '20%',
                    boxShadow: isActiveBar ? '0 0 8px rgba(244,63,94,0.5)' : 'none'
                  }}
                />
              )
            })}
          </div>
        )}
      </div>

      {/* Manual Blow Fallback */}
      <button 
        onClick={onBlow}
        className="mt-4 text-xs font-semibold text-white/40 hover:text-white/80 transition-colors uppercase tracking-wider flex items-center gap-1"
      >
        <Wind className="w-3 h-3" />
        Tap to blow manually
      </button>
    </div>
  );
}
