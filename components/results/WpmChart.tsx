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
import { MetricPoint } from '@/lib/typing/types';

interface WpmChartProps {
  timeline: MetricPoint[];
}

export function WpmChart({ timeline }: WpmChartProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || !timeline || timeline.length === 0) {
    return (
      <div className="w-full h-56 flex items-center justify-center bg-surface/30 rounded border border-subtle/50 text-muted text-xs font-mono">
        Recording timeline data...
      </div>
    );
  }

  // Calculate chart bounds
  const maxWpm = Math.max(...timeline.map((p) => Math.max(p.wpm, p.rawWpm)), 30);
  const yMax = Math.ceil(maxWpm / 20) * 20 + 10;

  return (
    <div className="w-full py-4 sm:py-6">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <span className="text-xs uppercase tracking-widest text-muted font-mono">
          performance over time
        </span>
        <div className="flex items-center gap-3 sm:gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-0.5 bg-accent inline-block" />
            <span className="text-foreground">wpm</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-0.5 bg-muted inline-block" />
            <span className="text-muted">raw</span>
          </div>
        </div>
      </div>

      <div className="w-full h-52 sm:h-64 font-mono">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={timeline} margin={{ top: 10, right: 8, left: -25, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
            <XAxis
              dataKey="second"
              stroke="#525252"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#262626' }}
              tickFormatter={(v) => `${v}s`}
            />
            <YAxis
              stroke="#525252"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#262626' }}
              domain={[0, yMax]}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (!active || !payload || !payload.length) return null;
                const point = payload[0].payload as MetricPoint;
                return (
                  <div className="bg-surface border border-subtle p-2.5 rounded shadow-lg text-xs font-mono">
                    <p className="text-muted mb-1">{label} seconds</p>
                    <p className="text-accent font-semibold">WPM: {point.wpm}</p>
                    <p className="text-muted">Raw: {point.rawWpm}</p>
                    <p className="text-foreground">Acc: {point.accuracy}%</p>
                  </div>
                );
              }}
            />
            {/* Raw WPM line */}
            <Line
              type="monotone"
              dataKey="rawWpm"
              stroke="#737373"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 3, fill: '#737373' }}
            />
            {/* Net WPM line */}
            <Line
              type="monotone"
              dataKey="wpm"
              stroke="#9CA3AF"
              strokeWidth={2.5}
              dot={{ r: 2, fill: '#9CA3AF' }}
              activeDot={{ r: 4, fill: '#E5E7EB' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
