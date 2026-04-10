"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Meyda from "meyda";

// Helper hook to capture microphone audio and analyze its intensity (RMS)
export function useBlowDetection({ isActive = false, threshold = 6 }) {
  const [blowIntensity, setBlowIntensity] = useState(0);
  const [isBlowing, setIsBlowing] = useState(false);
  const [error, setError] = useState(null);
  
  const audioContextRef = useRef(null);
  const analyzerRef = useRef(null);
  const streamRef = useRef(null);

  const startAnalyzing = useCallback(async () => {
    if (streamRef.current) return; // Already started
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        },
        video: false,
      });
      streamRef.current = stream;

      const AudioContextCtor = window.AudioContext || window.webkitAudioContext;
      const audioContext = new AudioContextCtor();
      audioContextRef.current = audioContext;

      const source = audioContext.createMediaStreamSource(stream);

      // Meyda needs an AudioContext to analyze
      const analyzer = Meyda.createMeydaAnalyzer({
        audioContext: audioContext,
        source: source,
        bufferSize: 512,
        featureExtractors: ["rms"],
        callback: (features) => {
          if (features && typeof features.rms === "number") {
             // Scale up the reading. usually rms is small
             // A threshold of 6 is quite sensitive, perfect for a short quick blow.
             const value = features.rms * 1000;
             
             // Smooth the values to prevent flickering
             setBlowIntensity(prev => {
                const smoothed = prev * 0.4 + value * 0.6;
                setIsBlowing(smoothed > threshold);
                return smoothed;
             });
          }
        },
      });
      
      analyzer.start();
      analyzerRef.current = analyzer;
      setError(null);
    } catch (err) {
      console.error("Microphone access failed", err);
      setError("Microphone access denied. Tap to manually blow candles.");
    }
  }, [threshold]);

  const stopAnalyzing = useCallback(() => {
    if (analyzerRef.current) {
      analyzerRef.current.stop();
      analyzerRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current) {
      if(audioContextRef.current.state !== 'closed') {
          audioContextRef.current.close().catch(console.error);
      }
      audioContextRef.current = null;
    }
    setBlowIntensity(0);
    setIsBlowing(false);
  }, []);

  useEffect(() => {
    if (isActive) {
      startAnalyzing();
    } else {
      stopAnalyzing();
    }
    return () => stopAnalyzing();
  }, [isActive, startAnalyzing, stopAnalyzing]);

  return { blowIntensity, isBlowing, error, startAnalyzing, stopAnalyzing };
}
