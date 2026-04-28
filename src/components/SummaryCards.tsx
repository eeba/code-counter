import type { ScanSummary } from "../types";

function formatNum(n: number) {
  return n.toLocaleString();
}

interface SummaryCardsProps {
  summary: ScanSummary;
  theme?: "light" | "dark";
}

export function SummaryCards({ summary, theme = "dark" }: SummaryCardsProps) {
  const isDark = theme === "dark";
  const colors = {
    text: isDark ? "#cccccc" : "#333333",
    textSecondary: isDark ? "#858585" : "#6e6e6e",
    hoverBg: isDark ? "#2a2d2e" : "#e8e8e8",
  };

  const cards = [
    { label: "文件数", value: summary.files },
    { label: "总行数", value: summary.total },
    { label: "代码行", value: summary.code },
    { label: "注释行", value: summary.comment },
    { label: "空行", value: summary.blank },
    { label: "跳过文件", value: summary.skipped },
  ];

  return (
    <div className="space-y-1">
      {cards.map((card) => (
        <div
          key={card.label}
          className="flex items-center justify-between px-3 py-2 rounded transition-colors"
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = colors.hoverBg;
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
          }}
        >
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: colors.textSecondary }}>
              {card.label === "文件数" && <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/>}
              {card.label === "总行数" && <path d="M4 6h16M4 12h16M4 18h16"/>}
              {card.label === "代码行" && <path d="M16 18l6-6-6-6M8 6l-6 6 6 6"/>}
              {card.label === "注释行" && <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>}
              {card.label === "空行" && <rect x="3" y="3" width="18" height="18" rx="2"/>}
              {card.label === "跳过文件" && <path d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/>}
            </svg>
            <span className="text-xs" style={{ color: colors.textSecondary }}>{card.label}</span>
          </div>
          <span className="text-sm font-medium font-mono" style={{ color: colors.text }}>{formatNum(card.value)}</span>
        </div>
      ))}
    </div>
  );
}
