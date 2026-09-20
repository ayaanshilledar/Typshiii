'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getLatestSession } from '@/lib/storage/sessions';
import { TypingSession } from '@/lib/typing/types';
import { ResultSummary } from '@/components/results/ResultSummary';
import { WpmChart } from '@/components/results/WpmChart';
import { WordAnalysis } from '@/components/results/WordAnalysis';
import { ErrorAnalysis } from '@/components/results/ErrorAnalysis';
import { RotateCcw, History, ArrowRight } from 'lucide-react';

export default function ResultsPage() {
  const router = useRouter();
  const [session, setSession] = useState<TypingSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const latest = getLatestSession();
    setSession(latest);
    setIsLoading(false);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab' || e.key === 'Enter') {
        e.preventDefault();
        router.push('/');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [router]);

  if (isLoading) {
    return (
      <div className="w-full py-20 flex items-center justify-center font-mono text-xs text-muted">
        Loading session results...
      </div>
    );
  }

  if (!session) {
    return (
      <div className="w-full max-w-xl mx-auto py-20 flex flex-col items-center justify-center text-center font-mono">
        <h2 className="text-xl font-bold text-foreground mb-2">No Recent Test Found</h2>
        <p className="text-xs text-muted mb-6">Complete a typing session to analyze your performance.</p>
        <Link
          href="/"
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface border border-subtle text-accent text-xs font-semibold hover:border-accent transition-colors"
        >
          <span>Start Typing</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full py-4 sm:py-6 flex flex-col gap-6 font-poppins">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 font-poppins">
        <div className="flex items-center gap-2 text-xs text-muted">
          <span>Session Completed</span>
          <span>•</span>
          <span>{new Date(session.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
          <Link
            href="/"
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-accent text-background text-xs font-semibold hover:bg-accent-hover transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Type Again</span>
          </Link>
          <Link
            href="/history"
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface border border-subtle text-muted hover:text-foreground text-xs transition-colors"
          >
            <History className="w-3.5 h-3.5" />
            <span>History</span>
          </Link>
        </div>
      </div>

      {/* Hero Result Summary */}
      <ResultSummary session={session} />

      {/* WPM & Raw WPM Line Chart */}
      <WpmChart timeline={session.timeline} />

      {/* Word Level Analytics */}
      <WordAnalysis words={session.words} />

      {/* Keystroke & Typo Matrix */}
      <ErrorAnalysis session={session} />
    </div>
  );
}
