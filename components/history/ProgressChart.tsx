'use client';

import React, { useEffect, useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { TypingSession } from '@/lib/typing/types';

interface ProgressChartProps {
  sessions: TypingSession[];
}

export function ProgressChart({ sessions }: ProgressChartProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || !sessions || sessions.length === 0) {
    return null;
  }

  // Chronological order (oldest to newest)
  const chartData = [...sessions].reverse().map((s, idx) => ({
    testNumber: idx + 1,
    wpm: Math.round(s.wpm),
    rawWpm: Math.round(s.rawWpm),
    accuracy: Math.round(s.accuracy),
    date: new Date(s.date).toLocaleDateString([], { month: 'short', day: 'numeric' }),
  }));

  const maxWpm = Math.max(...chartData.map((d) => d.wpm), 40);

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6 py-2">
      {/* Chart 1: WPM Over Time */}
      <div className="p-4 rounded border border-subtle bg-surface/40 font-mono">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs uppercase tracking-widest text-muted">
            wpm progression
          </span>
          <span className="text-xs text-accent">Speed</span>
        </div>

        <div className="w-full h-52">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
              <XAxis
                dataKey="testNumber"
                stroke="#525252"
                fontSize={10}
                tickLine={false}
                axisLine={{ stroke: '#262626' }}
                tickFormatter={(v) => `#${v}`}
              />
              <YAxis
                stroke="#525252"
                fontSize={10}
                tickLine={false}
                axisLine={{ stroke: '#262626' }}
                domain={[0, Math.ceil(maxWpm / 20) * 20 + 10]}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload || !payload.length) return null;
                  const d = payload[0].payload;
                  return (
                    <div className="bg-surface border border-subtle p-2 rounded shadow text-xs font-mono">
                      <p className="text-muted mb-1">Test #{d.testNumber} ({d.date})</p>
                      <p className="text-accent font-semibold">WPM: {d.wpm}</p>
                      <p className="text-muted">Raw: {d.rawWpm}</p>
                    </div>
                  );
                }}
              />
              <Line
                type="monotone"
                dataKey="wpm"
                stroke="#E2B714"
                strokeWidth={2}
                dot={{ r: 3, fill: '#E2B714' }}
                activeDot={{ r: 5, fill: '#E2B714' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2: Accuracy Over Time */}
      <div className="p-4 rounded border border-subtle bg-surface/40 font-mono">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs uppercase tracking-widest text-muted">
            accuracy progression
          </span>
          <span className="text-xs text-foreground">Precision</span>
        </div>

        <div className="w-full h-52">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
              <XAxis
                dataKey="testNumber"
                stroke="#525252"
                fontSize={10}
                tickLine={false}
                axisLine={{ stroke: '#262626' }}
                tickFormatter={(v) => `#${v}`}
              />
              <YAxis
                stroke="#525252"
                fontSize={10}
                tickLine={false}
                axisLine={{ stroke: '#262626' }}
                domain={[80, 100]}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload || !payload.length) return null;
                  const d = payload[0].payload;
                  return (
                    <div className="bg-surface border border-subtle p-2 rounded shadow text-xs font-mono">
                      <p className="text-muted mb-1">Test #{d.testNumber} ({d.date})</p>
                      <p className="text-foreground font-semibold">Accuracy: {d.accuracy}%</p>
                    </div>
                  );
                }}
              />
              <Line
                type="monotone"
                dataKey="accuracy"
                stroke="#EDEDED"
                strokeWidth={2}
                dot={{ r: 3, fill: '#EDEDED' }}
                activeDot={{ r: 5, fill: '#EDEDED' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
