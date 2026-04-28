import { open } from "@tauri-apps/plugin-dialog";

interface DirectoryPickerProps {
  path: string;
  onChange: (path: string) => void;
  theme?: "light" | "dark";
}

export function DirectoryPicker({ path, onChange, theme = "dark" }: DirectoryPickerProps) {
  const isDark = theme === "dark";
  const colors = {
    bg: isDark ? "#3c3c3c" : "#e5e5e5",
    border: isDark ? "#3c3c3c" : "#cccccc",
    text: isDark ? "#cccccc" : "#333333",
    hover: isDark ? "#4b4b4b" : "#d4d4d4",
    hoverBorder: isDark ? "#505050" : "#bbbbbb",
  };

  const handlePick = async () => {
    try {
      const selected = await open({
        directory: true,
        multiple: false,
        title: "选择要统计的目录",
      });
      if (selected && typeof selected === "string") {
        onChange(selected);
      }
    } catch (e) {
      console.error("Failed to open directory picker:", e);
    }
  };

  return (
    <div className="flex items-center gap-2 flex-1">
      <div className="relative flex-1 max-w-xl">
        <div className="absolute left-2.5 top-1/2 -translate-y-1/2">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: isDark ? "#858585" : "#6e6e6e" }}>
            <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/>
          </svg>
        </div>
        <input
          type="text"
          value={path}
          onChange={(e) => onChange(e.target.value)}
          placeholder="选择目录..."
          className="w-full pl-8 pr-3 py-1.5 text-sm rounded focus:outline-none font-mono"
          style={{
            backgroundColor: colors.bg,
            border: `1px solid ${colors.border}`,
            color: colors.text
          }}
        />
      </div>
      <button
        onClick={handlePick}
        className="px-3 py-1.5 text-sm rounded flex items-center gap-1.5 transition-colors"
        style={{
          backgroundColor: colors.bg,
          border: `1px solid ${colors.border}`,
          color: colors.text
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = colors.hover;
          e.currentTarget.style.borderColor = colors.hoverBorder;
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = colors.bg;
          e.currentTarget.style.borderColor = colors.border;
        }}
      >
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/>
          <path d="M12 4v16m8-8H4"/>
        </svg>
        浏览...
      </button>
    </div>
  );
}
