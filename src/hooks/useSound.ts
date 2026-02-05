'use client';

import { useCallback, useRef, useEffect } from 'react';

interface SoundOptions {
  volume?: number;
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

  // Play sound
  const play = useCallback(() => {
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
 * Hook for vibration feedback
 */
export function useVibration() {
  const vibrate = useCallback((pattern: number | number[] = 50) => {
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
