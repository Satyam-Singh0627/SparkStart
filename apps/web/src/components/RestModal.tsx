import React, { useState, useEffect } from 'react';
import { Coffee, Play, Pause, RotateCcw, X, Heart, Plus } from 'lucide-react';
import { MascotIllustration } from './MascotIllustration';

interface RestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RestModal: React.FC<RestModalProps> = ({ isOpen, onClose }) => {
  const [selectedMinutes, setSelectedMinutes] = useState<number>(5);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(5 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');

  useEffect(() => {
    setSecondsRemaining(selectedMinutes * 60);
    setIsRunning(true);
  }, [selectedMinutes, isOpen]);

  // Timer countdown
  useEffect(() => {
    if (!isOpen || !isRunning) return;

    if (secondsRemaining <= 0) {
      setIsRunning(false);
      return;
    }

    const interval = setInterval(() => {
      setSecondsRemaining((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, isRunning, secondsRemaining]);

  // Breathing guide cycle (12s total: 4s inhale, 4s hold, 4s exhale)
  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      const sec = Math.floor(Date.now() / 1000) % 12;
      if (sec < 4) {
        setBreathPhase('Inhale');
      } else if (sec < 8) {
        setBreathPhase('Hold');
      } else {
        setBreathPhase('Exhale');
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const timeFormatted = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm transition-opacity"
      role="dialog"
      aria-modal="true"
      aria-label="Guilt-Free Rest Break"
    >
      <div className="relative w-full max-w-md rounded-3xl bg-white border border-purple-100 p-6 sm:p-8 shadow-xl text-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
          title="Return to workspace"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Mascot in Resting State */}
        <div className="mb-3 flex justify-center">
          <MascotIllustration mood="resting" size={100} />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 border border-purple-200 mb-2">
          <Coffee className="w-3.5 h-3.5 text-purple-600" />
          <span>Guilt-Free Recovery</span>
        </div>

        <h3 className="text-xl font-bold text-slate-800">
          Take a gentle moment
        </h3>
        <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
          Rest is biological maintenance, not something you have to earn. Step away freely.
        </p>

        {/* Duration Selectors */}
        <div className="flex items-center justify-center gap-2 my-5">
          {[5, 10, 15].map((m) => (
            <button
              key={m}
              onClick={() => setSelectedMinutes(m)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedMinutes === m
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-purple-50 text-purple-800 hover:bg-purple-100'
              }`}
            >
              {m} Minutes
            </button>
          ))}
        </div>

        {/* Circular Breathing Graphic & Timer */}
        <div className="relative w-44 h-44 mx-auto my-3 flex flex-col items-center justify-center">
          {/* Animated breath ring */}
          <div
            className={`absolute inset-0 rounded-full border-4 border-purple-200 transition-transform duration-1000 ease-in-out ${
              breathPhase === 'Inhale'
                ? 'scale-105 border-purple-400 bg-purple-50/50'
                : breathPhase === 'Hold'
                ? 'scale-105 border-purple-300 bg-purple-50/30'
                : 'scale-95 border-purple-100 bg-transparent'
            }`}
          />
          <span className="text-3xl font-extrabold text-slate-800 tracking-tight font-mono">
            {timeFormatted}
          </span>
          <span className="text-xs font-semibold text-purple-600 mt-1">
            {secondsRemaining > 0 ? breathPhase : 'Rest Complete ✨'}
          </span>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-3 mt-4">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
          >
            {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isRunning ? 'Pause' : 'Resume'}</span>
          </button>

          <button
            onClick={() => setSecondsRemaining((prev) => prev + 5 * 60)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold bg-purple-50 hover:bg-purple-100 text-purple-800 transition-colors cursor-pointer"
            title="Add 5 more minutes"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+5 Mins</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors cursor-pointer"
          >
            I'm Ready to Resume
          </button>
        </div>
      </div>
    </div>
  );
};

