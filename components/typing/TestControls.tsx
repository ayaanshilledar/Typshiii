'use client';

import { RotateCcw } from 'lucide-react';

interface TestControlsProps {
  onRestart: () => void;
  onOpenSettings?: () => void;
}

export function TestControls({ onRestart, onOpenSettings }: TestControlsProps) {
  return (
    <div className="w-full flex flex-col items-center justify-center gap-3 sm:gap-5 mt-6 sm:mt-10">
      <button
        type="button"
        onClick={onRestart}
        title="Restart test"
        aria-label="Restart test"
        className="p-3 sm:p-3 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-muted/80 hover:text-foreground hover:bg-surface border border-subtle/40 hover:border-subtle transition-all duration-150 active:scale-95 group focus:outline-none shadow-sm"
      >
        <RotateCcw className="w-5 h-5 group-hover:rotate-45 transition-transform duration-200" />
      </button>

      {/* Mobile touch hint */}
      <span className="sm:hidden text-[11px] font-mono text-muted/60 select-none">
        tap to restart
      </span>

      {/* Desktop Styled Keyboard Shortcut Guide */}
      <div className="hidden sm:flex flex-col items-center gap-2.5 font-mono text-[12px] text-muted/60 select-none">
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
