'use client';

import { useEffect, useState } from 'react';

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  rotation: number;
  color: string;
  size: number;
  delay: number;
}

const COLORS = [
  '#f59e0b', // amber
  '#3b82f6', // blue
  '#10b981', // emerald
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#ef4444', // red
];

interface ConfettiProps {
  isActive: boolean;
  duration?: number;
}

export default function Confetti({ isActive, duration = 3000 }: ConfettiProps) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!isActive) return;

    // Generate confetti pieces
    const newPieces: ConfettiPiece[] = [];
    for (let i = 0; i < 50; i++) {
      newPieces.push({
        id: i,
        x: Math.random() * 100, // percentage
        y: -10 - Math.random() * 20, // start above viewport
        rotation: Math.random() * 360,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: 8 + Math.random() * 8,
        delay: Math.random() * 500,
      });
    }
    setPieces(newPieces);
    setVisible(true);

    // Hide after duration
    const timer = setTimeout(() => {
      setVisible(false);
      setPieces([]);
    }, duration);

    return () => clearTimeout(timer);
  }, [isActive, duration]);

  if (!visible || pieces.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className="absolute animate-confetti-fall"
          style={{
            left: `${piece.x}%`,
            top: `${piece.y}%`,
            width: piece.size,
            height: piece.size * 0.6,
            backgroundColor: piece.color,
            transform: `rotate(${piece.rotation}deg)`,
            animationDelay: `${piece.delay}ms`,
            borderRadius: '2px',
          }}
        />
      ))}
    </div>
  );
}
