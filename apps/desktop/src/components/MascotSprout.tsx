import React from 'react';

export type CompanionMood = 'idle' | 'encouraging' | 'thinking' | 'resting' | 'celebrating';

interface MascotSproutProps {
  mood?: CompanionMood;
  size?: number;
  onClick?: () => void;
}

export const MascotSprout: React.FC<MascotSproutProps> = ({
  mood = 'idle',
  size = 130,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className="relative inline-flex items-center justify-center cursor-pointer select-none transition-transform active:scale-95 hover:scale-105"
      style={{ width: size, height: size }}
      role="button"
      tabIndex={0}
      aria-label={`SparkBuddy sprout feeling ${mood}`}
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-xl"
      >
        <defs>
          <linearGradient id="sproutGrad" x1="50" y1="30" x2="50" y2="90" gradientUnits="userSpaceOnUse">
            <stop stopColor="#bbf7d0" />
            <stop offset="1" stopColor="#86efac" />
          </linearGradient>
          <linearGradient id="sproutLeaves" x1="45" y1="10" x2="60" y2="35" gradientUnits="userSpaceOnUse">
            <stop stopColor="#4ade80" />
            <stop offset="1" stopColor="#15803d" />
          </linearGradient>
          <filter id="companionGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#4ade80" floodOpacity="0.4" />
          </filter>
        </defs>

        {/* Stem */}
        <path
          d="M50 32 C 50 19, 52 15, 54 13"
          stroke="#15803d"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        {/* Left Sprout Leaf */}
        <path
          d="M52 24 C 42 16, 32 20, 34 28 C 36 34, 46 30, 50 26 Z"
          fill="url(#sproutLeaves)"
        />
        {/* Right Sprout Leaf */}
        <path
          d="M52 18 C 64 10, 72 16, 68 25 C 64 30, 55 25, 52 21 Z"
          fill="url(#sproutLeaves)"
        />

        {/* Body */}
        <ellipse
          cx="50"
          cy="60"
          rx="32"
          ry="28"
          fill="url(#sproutGrad)"
          stroke="#22c55e"
          strokeWidth="2.5"
          filter="url(#companionGlow)"
        />

        {/* Cheeks */}
        <circle cx="30" cy="65" r="4.5" fill="#fca5a5" opacity="0.65" />
        <circle cx="70" cy="65" r="4.5" fill="#fca5a5" opacity="0.65" />

        {/* Mood Expressions */}
        {mood === 'resting' ? (
          <g stroke="#166534" strokeWidth="2.8" strokeLinecap="round" fill="none">
            <path d="M35 58 Q 40 53 45 58" />
            <path d="M55 58 Q 60 53 65 58" />
            <path d="M47 68 Q 50 71 53 68" />
            <text x="68" y="42" fill="#3b82f6" fontSize="11" fontWeight="bold" opacity="0.85">
              z<tspan fontSize="8">z</tspan>
            </text>
          </g>
        ) : mood === 'thinking' ? (
          <g>
            <circle cx="39" cy="54" r="3.8" fill="#14532d" />
            <circle cx="41" cy="52" r="1.3" fill="#ffffff" />
            <circle cx="61" cy="54" r="3.8" fill="#14532d" />
            <circle cx="63" cy="52" r="1.3" fill="#ffffff" />
            <ellipse cx="50" cy="67" rx="3.5" ry="4.5" fill="#166534" />
          </g>
        ) : mood === 'celebrating' ? (
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
            <path d="M40 64 Q 50 75 60 64 Z" fill="#dc2626" />
            {/* Sparkle stars */}
            <path d="M18 42 L22 45 L18 48 L15 45 Z" fill="#facc15" />
            <path d="M82 40 L85 43 L82 46 L79 43 Z" fill="#facc15" />
          </g>
        ) : mood === 'encouraging' ? (
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

        {/* Feet */}
        <ellipse cx="40" cy="88" rx="5" ry="3" fill="#86efac" stroke="#16a34a" strokeWidth="1.5" />
        <ellipse cx="60" cy="88" rx="5" ry="3" fill="#86efac" stroke="#16a34a" strokeWidth="1.5" />
      </svg>
    </div>
  );
};

