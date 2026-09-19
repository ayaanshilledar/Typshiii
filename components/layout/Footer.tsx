export function Footer() {
  return (
    <footer className="w-full px-6 sm:px-12 lg:px-16 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted font-sans border-t border-subtle/40 mt-auto">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-1.5">
          <kbd className="px-1.5 py-0.5 rounded bg-subtle text-foreground text-[11px] border border-neutral-700 font-mono">
            tab
          </kbd>
          <span>restart test</span>
        </div>
        <div className="flex items-center gap-1.5">
          <kbd className="px-1.5 py-0.5 rounded bg-subtle text-foreground text-[11px] border border-neutral-700 font-mono">
            esc
          </kbd>
          <span>reset</span>
        </div>
      </div>

      <div className="flex items-center gap-2 font-poppins">
        <span className="font-semibold text-foreground/80">typeshii v1.0</span>
        <span>•</span>
        <span className="text-muted/70">typing first, analytics second</span>
      </div>
    </footer>
  );
}
