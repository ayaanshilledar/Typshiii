'use client';

import React from 'react';

interface BrandLogoProps {
  size?: number;
  name?: string;
}

/**
 * Self-contained deterministic Blobatar generator.
 * Produces organic SVG blob avatars from a seed string without external module dependencies.
 */
export function BrandLogo({ size = 28, name = 'typeshii' }: BrandLogoProps) {
  // Deterministic seed hash
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

  // Palette variations based on hash (Dark Grey & Metallic tones)
  const palettes = [
    { start: '#D4D4D8', mid: '#A1A1AA', end: '#52525B' },
    { start: '#A1A1AA', mid: '#71717A', end: '#3F3F46' },
    { start: '#E4E4E7', mid: '#71717A', end: '#27272A' },
  ];
  const palette = palettes[hash % palettes.length];

  return (
    <div
      style={{ width: size, height: size }}
      className="relative shrink-0 rounded-full overflow-hidden flex items-center justify-center shadow-md select-none transition-transform hover:scale-105"
      title={name}
    >
      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        className="w-full h-full"
      >
        <defs>
          <linearGradient id="blobatarGrad" x1="10%" y1="0%" x2="90%" y2="100%">
            <stop offset="0%" stopColor={palette.start} />
            <stop offset="60%" stopColor={palette.mid} />
            <stop offset="100%" stopColor={palette.end} />
          </linearGradient>
        </defs>

        {/* Organic Blob Body */}
        <path
          d="M50,12 C74,10 90,26 88,50 C86,74 72,88 50,88 C26,88 12,74 14,50 C16,26 26,14 50,12 Z"
          fill="url(#blobatarGrad)"
        />

        {/* Cute Face Features */}
        <circle cx="37" cy="46" r="4.5" fill="#0A0A0A" />
        <circle cx="63" cy="46" r="4.5" fill="#0A0A0A" />

        {/* Catchlights */}
        <circle cx="38.5" cy="44.5" r="1.5" fill="#EDEDED" />
        <circle cx="64.5" cy="44.5" r="1.5" fill="#EDEDED" />

        {/* Smile */}
        <path
          d="M42,60 Q50,68 58,60"
          stroke="#0A0A0A"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Rosy Cheeks */}
        <circle cx="28" cy="54" r="3" fill="#0A0A0A" opacity="0.15" />
        <circle cx="72" cy="54" r="3" fill="#0A0A0A" opacity="0.15" />
      </svg>
    </div>
  );
}
