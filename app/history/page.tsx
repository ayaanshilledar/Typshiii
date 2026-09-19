'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getSavedSessions, calculateOverallStats, clearHistory } from '@/lib/storage/sessions';
import { TypingSession } from '@/lib/typing/types';
import { StatsOverview } from '@/components/history/StatsOverview';
import { ProgressChart } from '@/components/history/ProgressChart';
import { HistoryTable } from '@/components/history/HistoryTable';
import { ArrowLeft, Play } from 'lucide-react';

export default function HistoryPage() {
  const [sessions, setSessions] = useState<TypingSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const data = getSavedSessions();
    setSessions(data);
    setIsLoading(false);
  }, []);

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear your entire typing history? This cannot be undone.')) {
      clearHistory();
      setSessions([]);
    }
  };

  const stats = calculateOverallStats(sessions);

  if (isLoading) {
    return (
      <div className="w-full py-20 flex items-center justify-center font-mono text-xs text-muted">
        Loading test history...
      </div>
    );
  }

  return (
    <div className="w-full py-4 sm:py-6 flex flex-col gap-6 font-poppins">
      {/* Header */}
      <div className="flex items-center justify-between font-poppins">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs text-muted hover:text-foreground transition-colors px-2.5 py-1.5 rounded-lg bg-surface/70 border border-subtle/80 hover:border-subtle"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>start typing</span>
          </Link>
          <span className="text-subtle">/</span>
          <h1 className="text-sm font-semibold uppercase tracking-wider text-foreground">
            performance history
          </h1>
        </div>
      </div>

      {/* Aggregate Stats Cards */}
      <StatsOverview stats={stats} />

      {/* Progress Trends over time */}
      {sessions.length > 1 && <ProgressChart sessions={sessions} />}

      {/* Chronological Session History Table */}
      <HistoryTable sessions={sessions} onClear={handleClear} />
    </div>
  );
}
