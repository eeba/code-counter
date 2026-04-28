import { useState, useCallback } from "react";

interface ExcludeRulesProps {
  rules: string[];
  onChange: (rules: string[]) => void;
  onResetToDefault: () => void;
  theme?: "light" | "dark";
}

function getRuleType(rule: string) {
  if (rule.startsWith("/") || /^[A-Za-z]:\\/.test(rule)) return "absolute";
  if (/[*+?{}[\]|()\\^$]/.test(rule)) return "regex";
  return "relative";
}

export function ExcludeRules({ rules, onChange, onResetToDefault, theme = "dark" }: ExcludeRulesProps) {
  const [input, setInput] = useState("");
  const isDark = theme === "dark";
  const colors = {
    bg: isDark ? "#3c3c3c" : "#e5e5e5",
    border: isDark ? "#404040" : "#cccccc",
    text: isDark ? "#cccccc" : "#333333",
    textSecondary: isDark ? "#858585" : "#6e6e6e",
    tagBg: isDark ? "#2d2d2d" : "#f0f0f0",
    hover: isDark ? "#4b4b4b" : "#d4d4d4",
    regex: isDark ? "#4ec9b0" : "#008000",
    absolute: isDark ? "#4fc1ff" : "#0000ff",
    relative: isDark ? "#dcdcaa" : "#800080",
  };

  const addRule = useCallback(() => {
    if (input.trim() && !rules.includes(input.trim())) {
      onChange([...rules, input.trim()]);
      setInput("");
    }
  }, [input, rules, onChange]);

  const removeRule = useCallback(
    (rule: string) => {
      onChange(rules.filter((r) => r !== rule));
    },
    [rules, onChange]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") addRule();
    },
    [addRule]
  );

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 mb-3">
        <div className="relative flex-1">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="添加排除规则，按 Enter 确认..."
            className="w-full px-3 py-1.5 text-sm rounded focus:outline-none font-mono"
            style={{
              backgroundColor: colors.bg,
              border: `1px solid ${colors.bg}`,
              color: colors.text
            }}
          />
        </div>
        <button
          onClick={addRule}
          className="px-3 py-1.5 text-sm rounded transition-colors"
          style={{
            backgroundColor: colors.bg,
            border: `1px solid ${colors.bg}`,
            color: colors.text
          }}
        >
          添加
        </button>
        <button
          onClick={onResetToDefault}
          className="px-3 py-1.5 text-sm rounded transition-colors"
          style={{
            backgroundColor: colors.bg,
            border: `1px solid ${colors.bg}`,
            color: colors.textSecondary
          }}
        >
          重置默认
        </button>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {rules.map((rule) => {
          const type = getRuleType(rule);
          const typeColor = type === "regex" ? colors.regex : type === "absolute" ? colors.absolute : colors.relative;
          return (
            <span
              key={rule}
              className="inline-flex items-center gap-1.5 px-2 py-0.5 text-xs rounded"
              style={{ backgroundColor: colors.tagBg, border: `1px solid ${colors.border}`, color: colors.text }}
            >
              <span style={{ color: typeColor }}>●</span>
              <span className="font-mono max-w-64 truncate">{rule}</span>
              <button
                onClick={() => removeRule(rule)}
                className="transition-colors"
                style={{ color: colors.textSecondary }}
                onMouseOver={(e) => {
                  e.currentTarget.style.color = isDark ? "#f14c4c" : "#cc0000";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.color = colors.textSecondary;
                }}
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            </span>
          );
        })}
      </div>
    </div>
  );
}
