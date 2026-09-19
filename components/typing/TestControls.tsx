'use client';

import { RotateCcw } from 'lucide-react';

interface TestControlsProps {
  onRestart: () => void;
  onOpenSettings?: () => void;
}

export function TestControls({ onRestart, onOpenSettings }: TestControlsProps) {
  return (
    <div className="w-full flex flex-col items-center justify-center gap-5 mt-10">
      <button
        type="button"
        onClick={onRestart}
        title="Restart (Tab)"
        className="p-3 rounded-lg text-muted/80 hover:text-foreground hover:bg-surface border border-transparent hover:border-subtle transition-all duration-150 active:scale-95 group focus:outline-none"
      >
        <RotateCcw className="w-5 h-5 group-hover:rotate-45 transition-transform duration-200" />
      </button>

      {/* Styled Keyboard Shortcut Guide */}
      <div className="flex flex-col items-center gap-2.5 font-mono text-[12px] text-muted/60 select-none">
        <div className="flex items-center gap-2">
          <kbd className="px-2 py-0.5 rounded bg-surface border border-subtle text-muted text-[11px] shadow-sm">
            tab &gt; enter
          </kbd>
          <span className="text-muted/40">-</span>
          <span className="text-muted/70">restart test</span>
        </div>

        <div className="flex items-center gap-2">
          <kbd
            onClick={onOpenSettings}
            className="px-2 py-0.5 rounded bg-surface border border-subtle text-muted text-[11px] shadow-sm cursor-pointer hover:text-foreground hover:border-accent/40 transition-colors"
          >
            escape
          </kbd>
          <span className="text-muted/50 text-[11px]">or</span>
          <kbd
            onClick={onOpenSettings}
            className="px-2 py-0.5 rounded bg-surface border border-subtle text-muted text-[11px] shadow-sm cursor-pointer hover:text-foreground hover:border-accent/40 transition-colors"
          >
            ctrl + shift + p
          </kbd>
          <span className="text-muted/40">-</span>
          <span
            onClick={onOpenSettings}
            className="text-muted/70 cursor-pointer hover:text-foreground transition-colors"
          >
            command line
          </span>
        </div>
      </div>
    </div>
  );
}
