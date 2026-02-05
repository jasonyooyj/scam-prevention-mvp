'use client';

import { useCallback, useRef, useEffect, useState } from 'react';

interface SoundOptions {
  volume?: number;
}

/**
 * Check if user prefers reduced motion
 */
function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Hook for playing sound effects
 * Handles autoplay restrictions gracefully
 */
export function useSound(soundPath: string, options: SoundOptions = {}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { volume = 0.5 } = options;

  // Initialize audio element lazily
  const getAudio = useCallback(() => {
    if (typeof window === 'undefined') return null;

    if (!audioRef.current) {
      audioRef.current = new Audio(soundPath);
      audioRef.current.volume = volume;
      audioRef.current.preload = 'auto';
    }
    return audioRef.current;
  }, [soundPath, volume]);

  // Play sound (respects reduced motion preference)
  const play = useCallback(() => {
    // Skip sound if user prefers reduced motion
    if (prefersReducedMotion()) return;

    const audio = getAudio();
    if (!audio) return;

    // Reset to beginning if already playing
    audio.currentTime = 0;

    // Play and handle autoplay restrictions gracefully
    audio.play().catch((err) => {
      // Silently fail if autoplay is blocked
      if (err.name !== 'NotAllowedError') {
        console.log('Sound play failed:', err);
      }
    });
  }, [getAudio]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  return { play };
}

/**
 * Hook for vibration feedback (respects reduced motion preference)
 */
export function useVibration() {
  const vibrate = useCallback((pattern: number | number[] = 50) => {
    // Skip vibration if user prefers reduced motion
    if (prefersReducedMotion()) return;

    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch {
        // Silently fail if not supported
      }
    }
  }, []);

  return { vibrate };
}
