import React from 'react';
import { BatteryCharging, BatteryLow, BatteryMedium, Sparkles, HelpCircle } from 'lucide-react';
import { EnergyLevel, ENERGY_OPTIONS } from '@sparkstart/shared';

interface EnergyCheckInProps {
  selectedEnergy: EnergyLevel;
  onSelectEnergy: (energy: EnergyLevel) => void;
  compact?: boolean;
}

export const EnergyCheckIn: React.FC<EnergyCheckInProps> = ({
  selectedEnergy,
  onSelectEnergy,
  compact = false,
}) => {
  const getIcon = (level: EnergyLevel) => {
    switch (level) {
      case 'low':
        return <BatteryLow className="w-5 h-5 text-emerald-600" />;
      case 'medium':
        return <BatteryMedium className="w-5 h-5 text-blue-600" />;
      case 'high':
        return <BatteryCharging className="w-5 h-5 text-purple-600" />;
      default:
        return <HelpCircle className="w-5 h-5 ss-text-muted" />;
    }
  };

  return (
    <section className={`ss-card p-6 sm:p-7 ${compact ? 'py-4 px-5' : ''}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold ss-text-primary flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[var(--accent)]" />
            <span>How does your energy feel right now?</span>
          </h2>
          {!compact && (
            <p className="ss-support mt-1">
              Self-reported preference, not a diagnosis. We adapt the recommended step size to your current capacity.
            </p>
          )}
        </div>
        <button
          onClick={() => onSelectEnergy('unsure')}
          className="text-xs font-semibold ss-text-muted hover:ss-text-primary underline self-start sm:self-auto cursor-pointer"
        >
          Skip / Flexible
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {ENERGY_OPTIONS.map((option) => {
          const isSelected = selectedEnergy === option.value;
          return (
            <button
              key={option.value}
              onClick={() => onSelectEnergy(option.value)}
              className={`flex flex-col items-start p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                isSelected
                  ? 'border-[var(--accent)] bg-[var(--accent-light)] ring-2 ring-[var(--focus-ring)] shadow-sm'
                  : 'border-[var(--border)] bg-[var(--bg-card)] hover:bg-[var(--bg-hover)] hover:border-[var(--border-accent)]'
              }`}
            >
              <div className="flex items-center gap-2.5 mb-2">
                <span className="text-xl" role="img" aria-hidden="true">{option.emoji}</span>
                <span className="text-base font-bold ss-text-primary">{option.label}</span>
              </div>
              <p className="text-xs sm:text-sm leading-relaxed ss-text-secondary">
                {option.description}
              </p>
            </button>
          );
        })}
      </div>
    </section>
  );
};
