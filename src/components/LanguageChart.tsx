import type { ScanSummary } from "../types";

interface LanguageChartProps {
  summary: ScanSummary;
  theme?: "light" | "dark";
}

export function LanguageChart({ summary, theme = "dark" }: LanguageChartProps) {
  const isDark = theme === "dark";
  const colors = {
    bg: isDark ? "#252526" : "#f3f3f3",
    border: isDark ? "#333333" : "#d4d4d4",
    text: isDark ? "#cccccc" : "#333333",
    textSecondary: isDark ? "#858585" : "#6e6e6e",
    barBg: isDark ? "#3c3c3c" : "#e5e5e5",
    barColors: isDark
      ? ["#007acc", "#4ec9b0", "#dcdcaa", "#4fc1ff", "#c586c0", "#ce9178", "#6a9955", "#d7ba7d"]
      : ["#0066cc", "#008000", "#800080", "#0000ff", "#cc00cc", "#cc6600", "#008080", "#808000"]
  };

  const entries = Object.entries(summary.by_language).sort((a, b) => b[1].total - a[1].total);
  const maxTotal = Math.max(...entries.map((e) => e[1].total), 1);

  return (
    <div className="rounded" style={{ backgroundColor: colors.bg, border: `1px solid ${colors.border}` }}>
      <div className="p-3 flex items-center gap-2 border-b" style={{ borderColor: colors.border }}>
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: colors.text }}>
          <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2z"/>
          <path d="M19 19V9a2 2 0 00-2-2h-2a2 2 0 00-2 2v10"/>
        </svg>
        <span className="text-sm font-medium" style={{ color: colors.text }}>语言分布</span>
      </div>
      <div className="p-4">
        <div className="space-y-1.5">
          {entries.slice(0, 10).map(([lang, stats], idx) => {
            const pct = (stats.total / maxTotal) * 100;
            return (
              <div key={lang} className="flex items-center gap-3">
                <span className="w-28 text-xs truncate text-right" style={{ color: colors.textSecondary }}>{lang}</span>
                <div className="flex-1 h-4 rounded-sm overflow-hidden" style={{ backgroundColor: colors.barBg }}>
                  <div
                    className="h-full rounded-sm transition-all duration-500"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: colors.barColors[idx % colors.barColors.length],
                    }}
                  />
                </div>
                <span className="w-20 text-right text-xs font-mono" style={{ color: colors.textSecondary }}>
                  {stats.total.toLocaleString()}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
