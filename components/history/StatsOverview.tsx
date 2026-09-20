'use client';

import { UserStats } from '@/lib/storage/sessions';
import { Trophy, TrendingUp, Target, Hash } from 'lucide-react';

interface StatsOverviewProps {
  stats: UserStats;
}

export function StatsOverview({ stats }: StatsOverviewProps) {
  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    const remainingSecs = seconds % 60;
    return `${mins}m ${remainingSecs}s`;
  };

  const cards = [
    {
      label: 'BEST WPM',
      value: stats.bestWpm,
      suffix: 'WPM',
      icon: Trophy,
      highlight: true,
    },
    {
      label: 'AVERAGE WPM',
      value: stats.averageWpm,
      suffix: 'WPM',
      icon: TrendingUp,
      highlight: false,
    },
    {
      label: 'AVG ACCURACY',
      value: stats.averageAccuracy,
      suffix: '%',
      icon: Target,
      highlight: false,
    },
    {
      label: 'TESTS TAKEN',
      value: stats.totalTests,
      suffix: `(${formatTime(stats.totalTimeSeconds)})`,
      icon: Hash,
      highlight: false,
    },
  ];

  return (
    <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4 font-mono">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={`stat-card-${idx}`}
            className={`p-3 sm:p-4 rounded border bg-surface/60 flex flex-col justify-between ${
              card.highlight ? 'border-accent/40 shadow-sm' : 'border-subtle'
            }`}
          >
            <div className="flex items-center justify-between text-muted mb-1.5 sm:mb-2 text-[10px] sm:text-xs">
              <span className="tracking-wider">{card.label}</span>
              <Icon className={`w-3.5 h-3.5 ${card.highlight ? 'text-accent' : 'text-muted'}`} />
            </div>

            <div className="flex items-baseline gap-1 sm:gap-1.5">
              <span
                className={`text-xl sm:text-2xl md:text-3xl font-bold ${
                  card.highlight ? 'text-accent' : 'text-foreground'
                }`}
              >
                {card.value}
              </span>
              <span className="text-[10px] sm:text-xs text-muted">{card.suffix}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
