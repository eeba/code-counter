import { useState, useMemo } from "react";
import type { FileStats } from "../types";

interface FileTableProps {
  files: FileStats[];
  theme?: "light" | "dark";
}

export function FileTable({ files, theme = "dark" }: FileTableProps) {
  const [sortBy, setSortBy] = useState<keyof FileStats>("total");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const isDark = theme === "dark";
  const pageSize = 50;

  const colors = {
    bg: isDark ? "#252526" : "#f3f3f3",
    border: isDark ? "#333333" : "#d4d4d4",
    headerBg: isDark ? "#2d2d2d" : "#e8e8e8",
    inputBg: isDark ? "#3c3c3c" : "#e5e5e5",
    text: isDark ? "#cccccc" : "#333333",
    textSecondary: isDark ? "#858585" : "#6e6e6e",
    hoverBg: isDark ? "#2a2d2e" : "#e8e8e8",
    code: isDark ? "#4ec9b0" : "#008000",
    comment: isDark ? "#4fc1ff" : "#0000ff",
    accent: isDark ? "#007acc" : "#0066cc",
  };

  const filteredAndSorted = useMemo(() => {
    let result = files.filter((f) =>
      f.path.toLowerCase().includes(search.toLowerCase())
    );
    result.sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDir === "asc" ? aVal - bVal : bVal - aVal;
      }
      return sortDir === "asc"
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
    return result;
  }, [files, sortBy, sortDir, search]);

  const totalPages = Math.ceil(filteredAndSorted.length / pageSize);
  const paged = filteredAndSorted.slice((page - 1) * pageSize, page * pageSize);

  const toggleSort = (key: keyof FileStats) => {
    if (sortBy === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortBy(key);
      setSortDir("desc");
    }
  };

  const SortIcon = ({ col }: { col: keyof FileStats }) => {
    if (sortBy !== col) return null;
    return (
      <svg className="w-3.5 h-3.5 inline-block ml-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        {sortDir === "asc" ? <path d="M18 15l-6-6-6 6" /> : <path d="M6 9l6 6 6-6" />}
      </svg>
    );
  };

  return (
    <div className="rounded flex flex-col overflow-hidden" style={{ backgroundColor: colors.bg, border: `1px solid ${colors.border}` }}>
      <div className="p-3 flex items-center justify-between border-b" style={{ borderColor: colors.border }}>
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: colors.text }}>
            <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span className="text-sm font-medium" style={{ color: colors.text }}>文件列表</span>
        </div>
        <div className="relative">
          <svg className="w-3.5 h-3.5 absolute left-2 top-1/2 -translate-y-1/2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: colors.textSecondary }}>
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="搜索..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-7 pr-3 py-1 text-xs rounded focus:outline-none"
            style={{
              backgroundColor: colors.inputBg,
              border: `1px solid ${colors.inputBg}`,
              color: colors.text
            }}
          />
        </div>
      </div>
      <div className="overflow-auto flex-1 max-h-96">
        <table className="w-full text-xs">
          <thead className="sticky top-0" style={{ backgroundColor: colors.headerBg, color: colors.textSecondary }}>
            <tr className="border-b" style={{ borderColor: colors.border }}>
              <th className="px-3 py-1 text-left font-medium">路径</th>
              <th
                className="px-3 py-1 text-right font-medium cursor-pointer select-none hover:opacity-80"
                onClick={() => toggleSort("total")}
              >
                总行 <SortIcon col="total" />
              </th>
              <th
                className="px-3 py-1 text-right font-medium cursor-pointer select-none hover:opacity-80"
                onClick={() => toggleSort("code")}
              >
                代码 <SortIcon col="code" />
              </th>
              <th
                className="px-3 py-1 text-right font-medium cursor-pointer select-none hover:opacity-80"
                onClick={() => toggleSort("comment")}
              >
                注释 <SortIcon col="comment" />
              </th>
              <th
                className="px-3 py-1 text-right font-medium cursor-pointer select-none hover:opacity-80"
                onClick={() => toggleSort("blank")}
              >
                空行 <SortIcon col="blank" />
              </th>
            </tr>
          </thead>
          <tbody style={{ color: colors.text }}>
            {paged.map((item, idx) => (
              <tr
                key={item.path + idx}
                className="border-b hover:transition-colors"
                style={{ borderColor: colors.headerBg }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = colors.hoverBg;
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                <td className="px-3 py-1 font-mono truncate max-w-md">{item.path}</td>
                <td className="px-3 py-1 text-right font-mono">{item.total.toLocaleString()}</td>
                <td className="px-3 py-1 text-right font-mono" style={{ color: colors.code }}>{item.code.toLocaleString()}</td>
                <td className="px-3 py-1 text-right font-mono" style={{ color: colors.comment }}>{item.comment.toLocaleString()}</td>
                <td className="px-3 py-1 text-right font-mono" style={{ color: colors.textSecondary }}>{item.blank.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="p-2 border-t flex items-center justify-between text-xs" style={{ borderColor: colors.border, color: colors.textSecondary }}>
          <span>共 {filteredAndSorted.length} 个文件</span>
          <div className="flex items-center gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
              className="px-2 py-0.5 rounded transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ backgroundColor: colors.inputBg, color: colors.text }}
            >
              上一页
            </button>
            <span>
              {page} / {totalPages}
            </span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
              className="px-2 py-0.5 rounded transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ backgroundColor: colors.inputBg, color: colors.text }}
            >
              下一页
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
