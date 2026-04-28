interface ScanOptionsProps {
  includeComments: boolean;
  includeBlanks: boolean;
  extensions: string;
  onChange: (opts: { includeComments: boolean; includeBlanks: boolean; extensions: string }) => void;
  theme?: "light" | "dark";
}

export function ScanOptions({
  includeComments,
  includeBlanks,
  extensions,
  onChange,
  theme = "dark",
}: ScanOptionsProps) {
  const isDark = theme === "dark";
  const colors = {
    bg: isDark ? "#3c3c3c" : "#e5e5e5",
    border: isDark ? "#3c3c3c" : "#cccccc",
    text: isDark ? "#cccccc" : "#333333",
    textSecondary: isDark ? "#858585" : "#6e6e6e",
    accent: isDark ? "#0e639c" : "#0066cc",
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2 cursor-pointer text-sm" style={{ color: colors.text }}>
          <input
            type="checkbox"
            checked={includeComments}
            onChange={(e) => onChange({ includeComments: e.target.checked, includeBlanks, extensions })}
            className="w-3.5 h-3.5"
            style={{ accentColor: colors.accent }}
          />
          包含注释行
        </label>
        <label className="flex items-center gap-2 cursor-pointer text-sm" style={{ color: colors.text }}>
          <input
            type="checkbox"
            checked={includeBlanks}
            onChange={(e) => onChange({ includeComments, includeBlanks: e.target.checked, extensions })}
            className="w-3.5 h-3.5"
            style={{ accentColor: colors.accent }}
          />
          包含空行
        </label>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm whitespace-nowrap" style={{ color: colors.textSecondary }}>文件扩展名：</span>
        <input
          type="text"
          value={extensions}
          onChange={(e) => onChange({ includeComments, includeBlanks, extensions: e.target.value })}
          placeholder="例如：.py,.ts,.jsx (留空=全部)"
          className="flex-1 px-3 py-1.5 text-sm rounded focus:outline-none font-mono max-w-md"
          style={{
            backgroundColor: colors.bg,
            border: `1px solid ${colors.border}`,
            color: colors.text
          }}
        />
      </div>
    </div>
  );
}
