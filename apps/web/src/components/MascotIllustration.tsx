import React from 'react';

export type MascotMood = 'idle' | 'encouraging' | 'thinking' | 'resting' | 'celebrating';

interface MascotProps {
  mood?: MascotMood;
  size?: number;
  className?: string;
}

export const MascotIllustration: React.FC<MascotProps> = ({
  mood = 'idle',
  size = 120,
  className = '',
}) => {
  return (
    <div
      className={`relative inline-flex items-center justify-center transition-transform duration-300 ${className}`}
      style={{ width: size, height: size }}
      role="img"
      aria-label={`SparkBuddy sprout mascot feeling ${mood}`}
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md select-none"
      >
        <defs>
          <linearGradient id="bodyGrad" x1="50" y1="30" x2="50" y2="90" gradientUnits="userSpaceOnUse">
            <stop stopColor="#bbf7d0" />
            <stop offset="1" stopColor="#86efac" />
          </linearGradient>
          <linearGradient id="leafGrad" x1="45" y1="10" x2="60" y2="35" gradientUnits="userSpaceOnUse">
            <stop stopColor="#4ade80" />
            <stop offset="1" stopColor="#16a34a" />
          </linearGradient>
          <filter id="softGlow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#86efac" floodOpacity="0.4" />
          </filter>
        </defs>

        {/* Stem & Leaves */}
        <path
          d="M50 32 C 50 20, 52 16, 54 14"
          stroke="#15803d"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        {/* Left Leaf */}
        <path
          d="M52 24 C 42 16, 32 20, 34 28 C 36 34, 46 30, 50 26 Z"
          fill="url(#leafGrad)"
        />
        {/* Right Sprout Leaf */}
        <path
          d="M52 18 C 64 10, 72 16, 68 25 C 64 30, 55 25, 52 21 Z"
          fill="url(#leafGrad)"
        />

        {/* Main Body (Soft pear/drop shape) */}
        <ellipse
          cx="50"
          cy="60"
          rx="32"
          ry="28"
          fill="url(#bodyGrad)"
          stroke="#22c55e"
          strokeWidth="2.5"
          filter="url(#softGlow)"
        />

        {/* Rosy Cheeks */}
        <circle cx="30" cy="65" r="4.5" fill="#fca5a5" opacity="0.65" />
        <circle cx="70" cy="65" r="4.5" fill="#fca5a5" opacity="0.65" />

        {/* Expressions based on mood */}
        {mood === 'resting' ? (
          // Peaceful Sleeping Eyes ^ _ ^
          <g stroke="#166534" strokeWidth="2.8" strokeLinecap="round" fill="none">
            <path d="M35 58 Q 40 53 45 58" />
            <path d="M55 58 Q 60 53 65 58" />
            <path d="M47 68 Q 50 71 53 68" />
            {/* Zzz symbol */}
            <text x="70" y="40" fill="#3b82f6" fontSize="11" fontWeight="bold" opacity="0.8">
              z<tspan fontSize="8">z</tspan>
            </text>
          </g>
        ) : mood === 'thinking' ? (
          // Inquisitive / Wondering Eyes
          <g>
            <circle cx="39" cy="54" r="3.8" fill="#14532d" />
            <circle cx="41" cy="52" r="1.3" fill="#ffffff" />
            <circle cx="61" cy="54" r="3.8" fill="#14532d" />
            <circle cx="63" cy="52" r="1.3" fill="#ffffff" />
            {/* O-mouth */}
            <ellipse cx="50" cy="67" rx="3.5" ry="4.5" fill="#166534" />
          </g>
        ) : mood === 'celebrating' ? (
          // Cheerful Big Smile & Star Sparkles
          <g>
            <path
              d="M34 54 Q 40 48 46 54"
              stroke="#14532d"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M54 54 Q 60 48 66 54"
              stroke="#14532d"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M40 64 Q 50 75 60 64 Z"
              fill="#dc2626"
            />
            {/* Sparkles */}
            <path d="M18 42 L22 45 L18 48 L15 45 Z" fill="#facc15" />
            <path d="M82 40 L85 43 L82 46 L79 43 Z" fill="#facc15" />
          </g>
        ) : mood === 'encouraging' ? (
          // Warm Uplifting Eyes & Gentle Grin
          <g>
            <circle cx="38" cy="56" r="3.5" fill="#14532d" />
            <circle cx="40" cy="54" r="1.4" fill="#ffffff" />
            <circle cx="62" cy="56" r="3.5" fill="#14532d" />
            <circle cx="64" cy="54" r="1.4" fill="#ffffff" />
            <path
              d="M44 65 Q 50 71 56 65"
              stroke="#166534"
              strokeWidth="2.8"
              strokeLinecap="round"
              fill="none"
            />
          </g>
        ) : (
          // Default Calm Friendly Idle
          <g>
            <circle cx="38" cy="57" r="3.2" fill="#14532d" />
            <circle cx="39.5" cy="55.5" r="1.2" fill="#ffffff" />
            <circle cx="62" cy="57" r="3.2" fill="#14532d" />
            <circle cx="63.5" cy="55.5" r="1.2" fill="#ffffff" />
            <path
              d="M45 66 Q 50 69 55 66"
              stroke="#166534"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
          </g>
        )}

        {/* Tiny Little Feet */}
        <ellipse cx="40" cy="88" rx="5" ry="3" fill="#86efac" stroke="#16a34a" strokeWidth="1.5" />
        <ellipse cx="60" cy="88" rx="5" ry="3" fill="#86efac" stroke="#16a34a" strokeWidth="1.5" />
      </svg>
    </div>
  );
};

