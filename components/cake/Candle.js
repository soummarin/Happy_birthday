"use client";

import { motion } from "framer-motion";

export default function Candle({ isLit, isFlickering, x, y, delay = 0, angle = 0 }) {
  return (
    <motion.g
      initial={{ opacity: 0, x: x, y: y - 50, rotate: 0 }}
      animate={{ opacity: 1, x: x, y: y, rotate: angle }}
      transition={{ delay, duration: 0.8, type: "spring", bounce: 0.4 }}
      style={{ transformOrigin: "0px 45px" }} // Anchor rotation perfectly at the base of the candle
    >
      {/* Anchor Shadow on Cake (Flat rendering, no blur bug) */}
      <ellipse cx="0" cy="45" rx="7" ry="2" fill="rgba(190, 24, 93, 0.5)" />
      {/* Candle Body */}
      <rect x="-6" y="0" width="12" height="45" rx="3" fill="url(#candle-gradient)" />
      
      {/* Stripes */}
      <path d="M-6 5 L6 10 M-6 15 L6 20 M-6 25 L6 30 M-6 35 L6 40" stroke="#fff" strokeWidth="2" opacity="0.6" />

      {/* Wick */}
      <line x1="0" y1="0" x2="0" y2="-5" stroke="#333" strokeWidth="2" strokeLinecap="round" />

      {/* Flame */}
      {isLit && (
        <g className={isFlickering ? "animate-flicker-fast" : "animate-flicker"} style={{ transformOrigin: "0px -5px" }}>
          {/* Inner bright flame */}
          <ellipse cx="0" cy="-15" rx="4" ry="10" fill="#fff" />
          {/* Main flame body */}
          <path
            d="M 0 -5 C -8 -15, -6 -25, 0 -28 C 6 -25, 8 -15, 0 -5 Z"
            fill="url(#flame-gradient)"
            opacity="0.9"
          />
          {/* Outer glow */}
          <ellipse cx="0" cy="-15" rx="8" ry="15" fill="#f59e0b" opacity="0.3" filter="blur(2px)" />
        </g>
      )}

      {/* Smoke when out */}
      {!isLit && (
        <motion.path
          d="M 0 -5 Q -10 -20 0 -35 T -10 -60"
          stroke="#ccc"
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0, opacity: 0.8 }}
          animate={{ pathLength: 1, opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          style={{ filter: "blur(2px)" }}
        />
      )}
    </motion.g>
  );
}
