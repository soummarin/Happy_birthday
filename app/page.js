"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 overflow-hidden relative">
      <div className="orb orb-pink w-[50vh] h-[50vh] top-0 left-0" />
      <div className="orb orb-purple w-[40vh] h-[40vh] bottom-0 right-0" style={{ animationDelay: '-2s' }} />
      <div className="noise" />

      <main className="z-10 w-full max-w-2xl text-center glass p-10 md:p-16 relative">
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 text-6xl">
          🎂
        </div>

        <motion.h1 
          className="font-display text-5xl md:text-7xl mb-4 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          BlowWish <span className="gradient-text">AI</span>
        </motion.h1>
        
        <motion.p 
          className="text-white/80 text-lg md:text-xl mb-10 max-w-lg mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Create magical birthday links. Your friends blow into their microphone to extinguish the candles, trigger confetti, and hear special music! 🎈
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Link href="/create" className="btn-primary text-xl px-8 py-4 w-full md:w-auto shadow-[0_0_40px_rgba(244,63,94,0.3)]">
            Create a Birthday Link ✨
          </Link>
        </motion.div>
      </main>

      <footer className="z-10 mt-12 text-white/40 text-sm">
        Powered by Next.js, Framer Motion & Web Audio API
      </footer>
    </div>
  );
}
