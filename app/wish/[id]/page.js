"use client";

import { useState, useEffect, use, useRef } from "react";
import { useSearchParams } from "next/navigation";
import BirthdayCake from "../../../components/cake/BirthdayCake";
import BlowDetector from "../../../components/audio/BlowDetector";
import { useBlowDetection } from "../../../hooks/useBlowDetection";
import confetti from "canvas-confetti";
import { motion, AnimatePresence } from "framer-motion";
import { Gift } from "lucide-react";
import { supabase } from "../../../lib/supabase";

export default function WishExperiencePage({ params }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const searchParams = useSearchParams();

  // Data States
  const [wishData, setWishData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasOpenedGift, setHasOpenedGift] = useState(false);
  
  // Interaction States
  const [litCandles, setLitCandles] = useState(0); 
  const [isMicActive, setIsMicActive] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const audioRef = useRef(null);

  // Fetch or Parse Data
  useEffect(() => {
    const loadData = async () => {
      try {
        if (id === "fallback") {
           setWishData({
              birthday_name: searchParams.get("name") || "Friend",
              age: parseInt(searchParams.get("age")) || 3,
              ai_message: searchParams.get("msg") || "May all your dreams come true ✨",
              music_url: "preset" 
           });
        } else {
           const { data, error } = await supabase
             .from("wishes")
             .select("*")
             .eq("id", id)
             .single();
             
           if (error) throw error;
           setWishData(data);
        }
      } catch (err) {
        console.error("Failed to load wish", err);
        setWishData({
            birthday_name: "Friend",
            age: 3,
            ai_message: "May all your dreams come true ✨",
            music_url: "preset" 
        });
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id, searchParams]);

  // Detector hook
  const { blowIntensity, isBlowing, error } = useBlowDetection({
    isActive: isMicActive && litCandles > 0,
    threshold: 6,
  });

  // Mechanics
  useEffect(() => {
    if (isBlowing && litCandles > 0) {
      const timer = setTimeout(() => {
        setLitCandles(prev => Math.max(0, prev - 1));
      }, 100); 
      return () => clearTimeout(timer);
    }
  }, [isBlowing, litCandles]);

  // Victory
  useEffect(() => {
    if (litCandles === 0 && !showConfetti && hasOpenedGift) {
      setShowConfetti(true);
      setIsMicActive(false);
      
      const end = Date.now() + 3 * 1000;
      const colors = ['#f43f5e', '#a855f7', '#fbbf24', '#14b8a6'];

      (function frame() {
        confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 }, colors: colors });
        confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 }, colors: colors });
        if (Date.now() < end) requestAnimationFrame(frame);
      }());
    }
  }, [litCandles, showConfetti, hasOpenedGift]);

  // Open Gift
  const handleOpenGift = () => {
     setHasOpenedGift(true);
     // Capping the literal amount of candles to a maximum of 5 so it never looks cluttered
     setLitCandles(Math.min(wishData.age, 5)); 
     
     if (wishData.music_url && wishData.music_url !== 'preset') {
        if (audioRef.current) {
            audioRef.current.play().catch(e => console.log('Audio play blocked:', e));
        }
     }
  };

  if (loading) {
     return <div className="min-h-screen flex items-center justify-center text-white">Loading your magic box...</div>;
  }

  // We no longer early return for !hasOpenedGift to keep the audio tag stable in the DOM.

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 overflow-hidden relative">
      <div className="orb orb-pink w-[50vh] h-[50vh] top-[5%] left-[5%]" />
      <div className="orb orb-gold w-[40vh] h-[40vh] bottom-[5%] right-[5%]" style={{ animationDelay: '-1s' }} />
      <div className="noise" />

      {/* STABLE Hidden Audio Player */}
      {wishData.music_url && wishData.music_url !== 'preset' && (
         <audio ref={audioRef} src={wishData.music_url} preload="auto" loop crossOrigin="anonymous" />
      )}

      {!hasOpenedGift ? (
         <motion.button
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleOpenGift}
            className="z-20 bg-white/10 p-12 rounded-3xl border border-white/20 glass flex flex-col items-center gap-6 cursor-pointer hover:bg-white/20 transition-all shadow-[0_0_50px_rgba(244,63,94,0.3)] group"
         >
            <div className="text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] group-hover:animate-shake">
                <Gift size={80} strokeWidth={1} />
            </div>
            <h2 className="text-3xl font-display text-white">Open Your Gift!</h2>
            <p className="text-white/60 text-sm">Tap to unwrap</p>
         </motion.button>
      ) : (
         <main className="z-10 w-full max-w-2xl text-center flex flex-col items-center glass p-6 md:p-10 lg:p-12 mt-4 mb-8">
        
        {/* Structure everything cleanly into a flex column with gap instead of rigid margins */}
        <div className="flex flex-col items-center justify-center w-full gap-8 md:gap-10">

            {/* Custom Personal Message Container (Glassmorphism) */}
            {wishData.ai_message && (
                <motion.div 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="w-full max-w-lg p-5 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-inner relative"
                >
                    <div className="absolute top-2 right-4 text-3xl opacity-20">"</div>
                    <p className="text-white text-lg md:text-xl italic leading-relaxed font-medium px-4">
                        {wishData.ai_message}
                    </p>
                </motion.div>
            )}

            {/* Header Structure */}
            <div className="flex flex-col items-center gap-4">
                <motion.h1 
                  className="font-display text-4xl sm:text-5xl md:text-6xl text-white drop-shadow-xl leading-[1.4] md:leading-[1.4]"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <span className="block mb-1">
                    {litCandles === 0 ? "Happy Birthday" : "Make a Wish"},
                  </span>
                  <span className="gradient-text font-bold tracking-wide">
                     {wishData.birthday_name}
                  </span>! 🎉
                </motion.h1>
                
                <p className="text-white/60 text-base md:text-lg max-w-md font-light leading-relaxed">
                  {litCandles === 0 
                    ? "Your candles are out! Time to party! ✨" 
                    : `You are turning ${wishData.age}! Blow out your candles!`
                  }
                </p>
            </div>

            {/* Cake Section with proper visual boundaries */}
            <div className="py-2 w-full flex justify-center">
                <BirthdayCake 
                  candles={Math.min(wishData.age, 5)} 
                  litCandlesCount={litCandles} 
                  isFlickering={isBlowing || (blowIntensity > 4)} 
                />
            </div>

            {/* Action / Sensor area */}
            <div className="min-h-[140px] w-full flex items-center justify-center">
                <AnimatePresence mode="wait">
                  {litCandles > 0 ? (
                    <motion.div
                      key="detector"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0 }}
                      className="w-full flex flex-col items-center gap-4"
                    >
                      <BlowDetector 
                        isActive={isMicActive}
                        onToggle={() => setIsMicActive(!isMicActive)}
                        isBlowing={isBlowing}
                        intensity={blowIntensity}
                        onBlow={() => setLitCandles(prev => Math.max(0, prev - 1))}
                      />
                      {error && <p className="text-red-400 text-sm font-medium">{error}</p>}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="message"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1 }}
                      className="w-full max-w-sm bg-white/5 border border-white/10 rounded-xl p-6"
                    >
                      <p className="text-white text-lg font-medium">
                        Your wish is sealed in the stars ✨
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
            </div>

        </div>
      </main>
      )}
    </div>
  );
}
