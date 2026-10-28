import React from 'react';
import { CompanionCharacter } from '@sparkstart/shared';

export type CompanionMood = 'idle' | 'encouraging' | 'thinking' | 'resting' | 'celebrating';

interface CharacterIllustrationProps {
  character?: CompanionCharacter;
  mood?: CompanionMood;
  size?: number;
  className?: string;
  onClick?: () => void;
}

export const CharacterIllustration: React.FC<CharacterIllustrationProps> = ({
  character = 'sprout',
  mood = 'idle',
  size = 120,
  className = '',
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`relative inline-flex items-center justify-center select-none transition-transform duration-300 ${
        onClick ? 'cursor-pointer hover:scale-105 active:scale-95' : ''
      } ${className}`}
      style={{ width: size, height: size }}
      role="img"
      aria-label={`${character} mascot feeling ${mood}`}
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md select-none"
      >
        <defs>
          <filter id={`glow-${character}`} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000000" floodOpacity="0.12" />
          </filter>
        </defs>

        {/* 1. SPROUT */}
        {character === 'sprout' && (
          <g filter={`url(#glow-${character})`}>
            {/* Stem & Leaves */}
            <path d="M50 32 C 50 18, 52 14, 54 12" stroke="#15803d" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M52 24 C 42 16, 32 20, 34 28 C 36 34, 46 30, 50 26 Z" fill="#22c55e" />
            <path d="M52 18 C 64 10, 72 16, 68 25 C 64 30, 55 25, 52 21 Z" fill="#16a34a" />
            {/* Body */}
            <ellipse cx="50" cy="62" rx="32" ry="28" fill="#86efac" stroke="#16a34a" strokeWidth="2.5" />
            {/* Cheeks */}
            <circle cx="30" cy="66" r="4.5" fill="#f87171" opacity="0.5" />
            <circle cx="70" cy="66" r="4.5" fill="#f87171" opacity="0.5" />

            {/* Expressions */}
            {mood === 'resting' && (
              <g stroke="#14532d" strokeWidth="2.8" strokeLinecap="round" fill="none">
                <path d="M35 59 Q 40 55 45 59" />
                <path d="M55 59 Q 60 55 65 59" />
                <path d="M47 69 Q 50 72 53 69" />
                <text x="68" y="44" fill="#3b82f6" fontSize="12" fontWeight="bold">zzz</text>
              </g>
            )}
            {mood === 'thinking' && (
              <g>
                <circle cx="39" cy="56" r="4" fill="#14532d" />
                <circle cx="41" cy="54" r="1.5" fill="#ffffff" />
                <circle cx="61" cy="56" r="4" fill="#14532d" />
                <circle cx="63" cy="54" r="1.5" fill="#ffffff" />
                <ellipse cx="50" cy="69" rx="3.5" ry="4.5" fill="#14532d" />
              </g>
            )}
            {mood === 'celebrating' && (
              <g>
                <path d="M35 56 Q 40 50 45 56" stroke="#14532d" strokeWidth="3" strokeLinecap="round" fill="none" />
                <path d="M55 56 Q 60 50 65 56" stroke="#14532d" strokeWidth="3" strokeLinecap="round" fill="none" />
                <path d="M42 66 Q 50 78 58 66 Z" fill="#dc2626" />
                <polygon points="18,35 22,25 26,35 20,29 25,29" fill="#f59e0b" />
                <polygon points="76,32 80,22 84,32 78,26 83,26" fill="#f59e0b" />
              </g>
            )}
            {mood === 'encouraging' && (
              <g>
                <circle cx="38" cy="57" r="4" fill="#14532d" />
                <circle cx="40" cy="55" r="1.5" fill="#ffffff" />
                <circle cx="62" cy="57" r="4" fill="#14532d" />
                <circle cx="64" cy="55" r="1.5" fill="#ffffff" />
                <path d="M44 67 Q 50 74 56 67" stroke="#14532d" strokeWidth="3" strokeLinecap="round" fill="none" />
              </g>
            )}
            {mood === 'idle' && (
              <g>
                <circle cx="38" cy="57" r="3.5" fill="#14532d" />
                <circle cx="62" cy="57" r="3.5" fill="#14532d" />
                <path d="M45 68 Q 50 72 55 68" stroke="#14532d" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              </g>
            )}
          </g>
        )}

        {/* 2. PANDA */}
        {character === 'panda' && (
          <g filter={`url(#glow-${character})`}>
            {/* Ears */}
            <circle cx="26" cy="32" r="13" fill="#1e293b" />
            <circle cx="74" cy="32" r="13" fill="#1e293b" />
            <circle cx="26" cy="32" r="6" fill="#475569" />
            <circle cx="74" cy="32" r="6" fill="#475569" />
            {/* Head */}
            <ellipse cx="50" cy="56" rx="36" ry="32" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
            {/* Eye Patches */}
            <ellipse cx="36" cy="53" rx="10" ry="12" fill="#1e293b" transform="rotate(-15 36 53)" />
            <ellipse cx="64" cy="53" rx="10" ry="12" fill="#1e293b" transform="rotate(15 64 53)" />
            {/* Cheeks */}
            <circle cx="24" cy="65" r="4.5" fill="#fca5a5" opacity="0.6" />
            <circle cx="76" cy="65" r="4.5" fill="#fca5a5" opacity="0.6" />
            {/* Nose */}
            <ellipse cx="50" cy="63" rx="4" ry="3" fill="#0f172a" />

            {/* Expressions */}
            {mood === 'resting' && (
              <g stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" fill="none">
                <path d="M31 54 Q 36 50 41 54" />
                <path d="M59 54 Q 64 50 69 54" />
                <path d="M46 72 Q 50 74 54 72" stroke="#1e293b" />
                <text x="74" y="38" fill="#6366f1" fontSize="12" fontWeight="bold">zzz</text>
              </g>
            )}
            {mood === 'thinking' && (
              <g>
                <circle cx="36" cy="52" r="3.5" fill="#ffffff" />
                <circle cx="64" cy="52" r="3.5" fill="#ffffff" />
                <ellipse cx="50" cy="71" rx="3" ry="4" fill="#0f172a" />
              </g>
            )}
            {mood === 'celebrating' && (
              <g>
                <path d="M31 52 Q 36 46 41 52" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                <path d="M59 52 Q 64 46 69 52" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                <path d="M44 68 Q 50 78 56 68 Z" fill="#ef4444" />
              </g>
            )}
            {mood === 'encouraging' && (
              <g>
                <circle cx="36" cy="52" r="3" fill="#ffffff" />
                <circle cx="64" cy="52" r="3" fill="#ffffff" />
                <path d="M44 69 Q 50 75 56 69" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              </g>
            )}
            {mood === 'idle' && (
              <g>
                <circle cx="36" cy="52" r="2.5" fill="#ffffff" />
                <circle cx="64" cy="52" r="2.5" fill="#ffffff" />
                <path d="M46 69 Q 50 73 54 69" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" fill="none" />
              </g>
            )}
          </g>
        )}

        {/* 3. FOX */}
        {character === 'fox' && (
          <g filter={`url(#glow-${character})`}>
            {/* Ears */}
            <polygon points="20,44 14,14 42,32" fill="#ea580c" />
            <polygon points="80,44 86,14 58,32" fill="#ea580c" />
            <polygon points="22,40 18,18 38,32" fill="#ffffff" />
            <polygon points="78,40 82,18 62,32" fill="#ffffff" />
            {/* Face base */}
            <path d="M20 46 C 14 62, 34 82, 50 82 C 66 82, 86 62, 80 46 C 76 36, 24 36, 20 46 Z" fill="#f97316" />
            {/* White cheeks */}
            <path d="M22 52 C 20 68, 36 78, 50 82 C 38 72, 34 60, 36 50 Z" fill="#ffffff" />
            <path d="M78 52 C 80 68, 64 78, 50 82 C 62 72, 66 60, 64 50 Z" fill="#ffffff" />
            {/* Nose */}
            <circle cx="50" cy="74" r="3.5" fill="#1c1917" />
            {/* Cheeks */}
            <circle cx="32" cy="64" r="4" fill="#fda4af" opacity="0.6" />
            <circle cx="68" cy="64" r="4" fill="#fda4af" opacity="0.6" />

            {/* Expressions */}
            {mood === 'resting' && (
              <g stroke="#7c2d12" strokeWidth="2.5" strokeLinecap="round" fill="none">
                <path d="M34 52 Q 40 48 44 52" />
                <path d="M56 52 Q 60 48 66 52" />
                <text x="74" y="36" fill="#f97316" fontSize="12" fontWeight="bold">zzz</text>
              </g>
            )}
            {mood === 'thinking' && (
              <g>
                <circle cx="38" cy="50" r="3.5" fill="#431407" />
                <circle cx="40" cy="48" r="1.3" fill="#ffffff" />
                <circle cx="62" cy="50" r="3.5" fill="#431407" />
                <circle cx="64" cy="48" r="1.3" fill="#ffffff" />
              </g>
            )}
            {mood === 'celebrating' && (
              <g>
                <path d="M34 49 Q 39 44 44 49" stroke="#431407" strokeWidth="2.8" strokeLinecap="round" fill="none" />
                <path d="M56 49 Q 61 44 66 49" stroke="#431407" strokeWidth="2.8" strokeLinecap="round" fill="none" />
                <path d="M45 77 Q 50 84 55 77 Z" fill="#dc2626" />
              </g>
            )}
            {mood === 'encouraging' && (
              <g>
                <circle cx="38" cy="50" r="3.5" fill="#431407" />
                <circle cx="62" cy="50" r="3.5" fill="#431407" />
                <path d="M45 78 Q 50 82 55 78" stroke="#431407" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              </g>
            )}
            {mood === 'idle' && (
              <g>
                <circle cx="38" cy="50" r="3" fill="#431407" />
                <circle cx="62" cy="50" r="3" fill="#431407" />
              </g>
            )}
          </g>
        )}

        {/* 4. CAT */}
        {character === 'cat' && (
          <g filter={`url(#glow-${character})`}>
            {/* Ears */}
            <polygon points="22,40 18,16 44,30" fill="#a855f7" />
            <polygon points="78,40 82,16 56,30" fill="#a855f7" />
            <polygon points="24,37 22,22 40,30" fill="#f3e8ff" />
            <polygon points="76,37 78,22 60,30" fill="#f3e8ff" />
            {/* Head */}
            <ellipse cx="50" cy="56" rx="35" ry="30" fill="#e9d5ff" stroke="#a855f7" strokeWidth="2" />
            {/* Whiskers */}
            <line x1="16" y1="56" x2="28" y2="58" stroke="#7e22ce" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="16" y1="62" x2="28" y2="61" stroke="#7e22ce" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="84" y1="56" x2="72" y2="58" stroke="#7e22ce" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="84" y1="62" x2="72" y2="61" stroke="#7e22ce" strokeWidth="1.5" strokeLinecap="round" />
            {/* Nose */}
            <polygon points="48,61 52,61 50,64" fill="#db2777" />
            {/* Cheeks */}
            <circle cx="28" cy="62" r="4" fill="#f472b6" opacity="0.6" />
            <circle cx="72" cy="62" r="4" fill="#f472b6" opacity="0.6" />

            {/* Expressions */}
            {mood === 'resting' && (
              <g stroke="#581c87" strokeWidth="2.5" strokeLinecap="round" fill="none">
                <path d="M33 52 Q 38 48 43 52" />
                <path d="M57 52 Q 62 48 67 52" />
                <text x="74" y="38" fill="#a855f7" fontSize="12" fontWeight="bold">zzz</text>
              </g>
            )}
            {mood === 'thinking' && (
              <g>
                <circle cx="38" cy="51" r="3.5" fill="#581c87" />
                <circle cx="62" cy="51" r="3.5" fill="#581c87" />
                <ellipse cx="50" cy="68" rx="2.5" ry="3.5" fill="#581c87" />
              </g>
            )}
            {mood === 'celebrating' && (
              <g>
                <path d="M33 50 Q 38 45 43 50" stroke="#581c87" strokeWidth="2.8" strokeLinecap="round" fill="none" />
                <path d="M57 50 Q 62 45 67 50" stroke="#581c87" strokeWidth="2.8" strokeLinecap="round" fill="none" />
                <path d="M46 66 Q 50 74 54 66 Z" fill="#ec4899" />
              </g>
            )}
            {mood === 'encouraging' && (
              <g>
                <circle cx="38" cy="51" r="3.5" fill="#581c87" />
                <circle cx="62" cy="51" r="3.5" fill="#581c87" />
                <path d="M46 66 Q 50 71 54 66" stroke="#581c87" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              </g>
            )}
            {mood === 'idle' && (
              <g>
                <circle cx="38" cy="51" r="3" fill="#581c87" />
                <circle cx="62" cy="51" r="3" fill="#581c87" />
                <path d="M47 67 Q 50 70 53 67" stroke="#581c87" strokeWidth="2" strokeLinecap="round" fill="none" />
              </g>
            )}
          </g>
        )}

        {/* 5. CLOUD */}
        {character === 'cloud' && (
          <g filter={`url(#glow-${character})`}>
            {/* Cloud body bubbles */}
            <path
              d="M30 65 C 20 65 14 55 18 45 C 16 34 26 28 35 30 C 40 20 58 18 66 28 C 76 25 86 34 84 44 C 92 52 86 65 74 65 Z"
              fill="#e0f2fe"
              stroke="#38bdf8"
              strokeWidth="2.5"
            />
            {/* Cheeks */}
            <circle cx="34" cy="52" r="4.5" fill="#fbcfe8" opacity="0.7" />
            <circle cx="68" cy="52" r="4.5" fill="#fbcfe8" opacity="0.7" />

            {/* Expressions */}
            {mood === 'resting' && (
              <g stroke="#0369a1" strokeWidth="2.5" strokeLinecap="round" fill="none">
                <path d="M38 46 Q 43 42 48 46" />
                <path d="M54 46 Q 59 42 64 46" />
                <text x="74" y="32" fill="#0284c7" fontSize="12" fontWeight="bold">zzz</text>
              </g>
            )}
            {mood === 'thinking' && (
              <g>
                <circle cx="43" cy="45" r="3.5" fill="#0369a1" />
                <circle cx="59" cy="45" r="3.5" fill="#0369a1" />
                <ellipse cx="51" cy="55" rx="3" ry="4" fill="#0369a1" />
              </g>
            )}
            {mood === 'celebrating' && (
              <g>
                <path d="M38 45 Q 43 40 48 45" stroke="#0369a1" strokeWidth="2.8" strokeLinecap="round" fill="none" />
                <path d="M54 45 Q 59 40 64 45" stroke="#0369a1" strokeWidth="2.8" strokeLinecap="round" fill="none" />
                <path d="M46 53 Q 51 61 56 53 Z" fill="#f43f5e" />
                {/* Rainbow spark */}
                <circle cx="20" cy="28" r="2.5" fill="#f59e0b" />
                <circle cx="82" cy="28" r="2.5" fill="#10b981" />
              </g>
            )}
            {mood === 'encouraging' && (
              <g>
                <circle cx="43" cy="45" r="3.5" fill="#0369a1" />
                <circle cx="59" cy="45" r="3.5" fill="#0369a1" />
                <path d="M46 54 Q 51 60 56 54" stroke="#0369a1" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              </g>
            )}
            {mood === 'idle' && (
              <g>
                <circle cx="43" cy="45" r="3" fill="#0369a1" />
                <circle cx="59" cy="45" r="3" fill="#0369a1" />
                <path d="M47 54 Q 51 58 55 54" stroke="#0369a1" strokeWidth="2" strokeLinecap="round" fill="none" />
              </g>
            )}
          </g>
        )}

        {/* 6. ROBOT */}
        {character === 'robot' && (
          <g filter={`url(#glow-${character})`}>
            {/* Antenna */}
            <line x1="50" y1="20" x2="50" y2="30" stroke="#0284c7" strokeWidth="3" strokeLinecap="round" />
            <circle cx="50" cy="18" r="5" fill="#facc15" stroke="#ca8a04" strokeWidth="1.5" />
            {/* Ears */}
            <rect x="18" y="44" width="6" height="14" rx="3" fill="#64748b" />
            <rect x="76" y="44" width="6" height="14" rx="3" fill="#64748b" />
            {/* Head */}
            <rect x="24" y="30" width="52" height="44" rx="10" fill="#e2e8f0" stroke="#0284c7" strokeWidth="2.5" />
            {/* Screen Visor */}
            <rect x="30" y="38" width="40" height="24" rx="6" fill="#0f172a" />

            {/* Expressions */}
            {mood === 'resting' && (
              <g stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" fill="none">
                <line x1="36" y1="50" x2="44" y2="50" />
                <line x1="56" y1="50" x2="64" y2="50" />
                <text x="74" y="34" fill="#38bdf8" fontSize="12" fontWeight="bold">zzz</text>
              </g>
            )}
            {mood === 'thinking' && (
              <g>
                <circle cx="40" cy="48" r="3" fill="#38bdf8" />
                <circle cx="60" cy="48" r="3" fill="#38bdf8" />
                <circle cx="50" cy="54" r="2" fill="#facc15" />
              </g>
            )}
            {mood === 'celebrating' && (
              <g stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" fill="none">
                <path d="M36 47 Q 40 42 44 47" />
                <path d="M56 47 Q 60 42 64 47" />
                <path d="M45 54 Q 50 58 55 54" stroke="#4ade80" />
              </g>
            )}
            {mood === 'encouraging' && (
              <g>
                <circle cx="40" cy="48" r="3" fill="#4ade80" />
                <circle cx="60" cy="48" r="3" fill="#4ade80" />
                <path d="M46 54 Q 50 58 54 54" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" fill="none" />
              </g>
            )}
            {mood === 'idle' && (
              <g>
                <circle cx="40" cy="48" r="3" fill="#38bdf8" />
                <circle cx="60" cy="48" r="3" fill="#38bdf8" />
                <line x1="47" y1="55" x2="53" y2="55" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
              </g>
            )}
          </g>
        )}
      </svg>
    </div>
  );
};

