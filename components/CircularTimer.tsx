import React, { useEffect, useState } from 'react';

interface TimerProps {
  totalSeconds: number; // Estimated duration
  elapsedSeconds: number; // Current elapsed
}

export const CircularTimer: React.FC<TimerProps> = ({ totalSeconds, elapsedSeconds }) => {
  // SVG Config
  const size = 200;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

  const progress = Math.min(elapsedSeconds / totalSeconds, 1);
  const offset = circumference - progress * circumference;

  // Formatting Time
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };
  
  // Color Logic based on progress
  const getColor = () => {
    if (progress > 1) return '#ff375f'; // Overtime (Red)
    if (progress > 0.8) return '#ff9f0a'; // Warning (Orange)
    return 'url(#gradient)'; // Normal (Gradient)
  };

  return (
    <div className="relative flex flex-col items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90 drop-shadow-[0_0_10px_rgba(0,245,255,0.3)]">
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00f5ff" />
            <stop offset="100%" stopColor="#bf5af2" />
          </linearGradient>
        </defs>
        {/* Background Circle */}
        <circle
          stroke="rgba(255,255,255,0.1)"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        {/* Progress Circle */}
        <circle
          stroke={getColor()}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          r={radius}
          cx={size / 2}
          cy={size / 2}
          className="transition-all duration-1000 ease-linear"
        />
      </svg>
      <div className="absolute text-center">
        <div className="text-3xl font-bold font-mono tracking-wider">{formatTime(elapsedSeconds)}</div>
        <div className="text-xs text-white/50 uppercase tracking-widest mt-1">Elapsed</div>
      </div>
    </div>
  );
};