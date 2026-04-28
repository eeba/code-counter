import { useState, useMemo } from "react";
import type { LangStats } from "../types";

interface LanguageTableProps {
  summary: Record<string, LangStats>;
  theme?: "light" | "dark";
}

export function LanguageTable({ summary, theme = "dark" }: LanguageTableProps) {
  const [sortBy, setSortBy] = useState<"total" | "code" | "files" | "name">("code");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const isDark = theme === "dark";
  const colors = {
    bg: isDark ? "#252526" : "#f3f3f3",
    border: isDark ? "#333333" : "#d4d4d4",
    headerBg: isDark ? "#2d2d2d" : "#e8e8e8",
    text: isDark ? "#cccccc" : "#333333",
    textSecondary: isDark ? "#858585" : "#6e6e6e",
    hoverBg: isDark ? "#2a2d2e" : "#e8e8e8",
    code: isDark ? "#4ec9b0" : "#008000",
    comment: isDark ? "#4fc1ff" : "#0000ff",
    accent: isDark ? "#007acc" : "#0066cc",
  };

  const sorted = useMemo(() => {
    const arr = Object.entries(summary).map(([name, data]) => ({ ...data, name }));
    arr.sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDir === "asc" ? aVal - bVal : bVal - aVal;
      }
      return sortDir === "asc"
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
    return arr;
  }, [summary, sortBy, sortDir]);

  const toggleSort = (key: "total" | "code" | "files" | "name") => {
    if (sortBy === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortBy(key);
      setSortDir("desc");
    }
  };

  const SortIcon = ({ col }: { col: string }) => {
    if (sortBy !== col) return null;
    return (
      <svg className="w-3.5 h-3.5 inline-block ml-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        {sortDir === "asc" ? <path d="M18 15l-6-6-6 6" /> : <path d="M6 9l6 6 6-6" />}
      </svg>
    );
  };

  return (
    <div className="overflow-hidden" style={{ backgroundColor: colors.bg }}>
      <div className="overflow-auto h-[100vh]">
        <table className="w-full text-xs">
          <thead className="sticky top-0" style={{ backgroundColor: colors.headerBg, color: colors.textSecondary }}>
            <tr className="border-b" style={{ borderColor: colors.border }}>
              <th
                className="px-3 py-1.5 text-left font-medium cursor-pointer select-none hover:opacity-80"
                onClick={() => toggleSort("name")}
              >
                语言 <SortIcon col="name" />
              </th>
              <th
                className="px-3 py-1.5 text-right font-medium cursor-pointer select-none hover:opacity-80"
                onClick={() => toggleSort("files")}
              >
                文件 <SortIcon col="files" />
              </th>
              <th
                className="px-3 py-1.5 text-right font-medium cursor-pointer select-none hover:opacity-80"
                onClick={() => toggleSort("total")}
              >
                总行 <SortIcon col="total" />
              </th>
              <th
                className="px-3 py-1.5 text-right font-medium cursor-pointer select-none hover:opacity-80"
                onClick={() => toggleSort("code")}
              >
                代码 <SortIcon col="code" />
              </th>
              <th className="px-3 py-1.5 text-right font-medium">注释</th>
              <th className="px-3 py-1.5 text-right font-medium">空行</th>
            </tr>
          </thead>
          <tbody style={{ color: colors.text }}>
            {sorted.map((item) => (
              <tr
                key={item.name}
                className="border-b hover:transition-colors"
                style={{ borderColor: colors.headerBg }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = colors.hoverBg;
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                <td className="px-3 py-1.5">{item.name}</td>
                <td className="px-3 py-1.5 text-right font-mono">{item.files.toLocaleString()}</td>
                <td className="px-3 py-1.5 text-right font-mono">{item.total.toLocaleString()}</td>
                <td className="px-3 py-1.5 text-right font-mono" style={{ color: colors.code }}>{item.code.toLocaleString()}</td>
                <td className="px-3 py-1.5 text-right font-mono" style={{ color: colors.comment }}>{item.comment.toLocaleString()}</td>
                <td className="px-3 py-1.5 text-right font-mono" style={{ color: colors.textSecondary }}>{item.blank.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
