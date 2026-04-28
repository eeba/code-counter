import { useState, useCallback, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { DirectoryPicker } from "./components/DirectoryPicker";
import { ExcludeRules } from "./components/ExcludeRules";
import { ScanOptions } from "./components/ScanOptions";
import { SummaryCards } from "./components/SummaryCards";
import { LanguageTable } from "./components/LanguageTable";
import { ScanningOverlay } from "./components/ScanningOverlay";
import { useScanner } from "./hooks/useScanner";
import { default_excludes } from "./exclude";
import type { ScanResult } from "./types";

const DEFAULT_EXCLUDES: string[] = default_excludes;
const APP_VERSION = "1.0.0";

type Theme = "light" | "dark" | "system";
type View = "settings" | "results";

const getThemeColors = (isDark: boolean) => ({
  bg: isDark ? "#1e1e1e" : "#ffffff",
  bgSecondary: isDark ? "#252526" : "#f3f3f3",
  border: isDark ? "#333333" : "#d4d4d4",
  inputBg: isDark ? "#3c3c3c" : "#e5e5e5",
  text: isDark ? "#cccccc" : "#333333",
  textSecondary: isDark ? "#858585" : "#6e6e6e",
  accent: isDark ? "#007acc" : "#0066cc",
  code: isDark ? "#4ec9b0" : "#008000",
  comment: isDark ? "#4fc1ff" : "#0000ff",
  errorBg: isDark ? "#3c1f1f" : "#ffe6e6",
  errorBorder: isDark ? "#5a2d2d" : "#ffcccc",
  errorText: isDark ? "#f14c4c" : "#cc0000",
});

function App() {
  const [view, setView] = useState<View>("settings");
  const [path, setPath] = useState("");
  const [excludeRules, setExcludeRules] = useState<string[]>(DEFAULT_EXCLUDES);
  const [includeComments, setIncludeComments] = useState(true);
  const [includeBlanks, setIncludeBlanks] = useState(true);
  const [extensions, setExtensions] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [theme, setTheme] = useState<Theme>("system");
  const [isDarkMode, setIsDarkMode] = useState(true);
  const { scan } = useScanner();

  useEffect(() => {
    const checkTheme = () => {
      if (theme === "system") {
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        setIsDarkMode(prefersDark);
      } else {
        setIsDarkMode(theme === "dark");
      }
    };

    checkTheme();
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", checkTheme);
    return () => mediaQuery.removeEventListener("change", checkTheme);
  }, [theme]);

  const colors = getThemeColors(isDarkMode);

  const handleDragStart = useCallback(async (e: React.MouseEvent) => {
    // 只有在标题栏空白区域点击时才触发拖拽
    const target = e.target as HTMLElement;
    if (target.tagName === 'BUTTON' || target.closest('button')) {
      return;
    }
    try {
      await invoke('start_dragging');
    } catch (error) {
      console.error("Failed to start dragging:", error);
    }
  }, []);

  const handleScan = useCallback(async () => {
    if (!path) return;
    const extList = extensions
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s);

    try {
      setError(null);
      setIsScanning(true);
      const result = await scan(path, excludeRules, includeComments, includeBlanks, extList.length ? extList : null);
      setScanResult(result);
      setView("results");
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg);
      console.error(e);
    } finally {
      setIsScanning(false);
    }
  }, [path, excludeRules, includeComments, includeBlanks, extensions, scan]);

  const handleReset = useCallback(() => {
    setView("settings");
    setScanResult(null);
    setError(null);
    setPath("");
  }, []);

  const isMac = navigator.userAgent.includes("Mac");

  return (
    <div
      className="w-screen h-screen overflow-hidden flex flex-col font-sans select-none"
      style={{ backgroundColor: colors.bg, color: colors.text }}
    >
      {/* 自定义标题栏 */}
      <div
        data-tauri-drag-region
        className={`h-11 flex items-center justify-between draggable-titlebar ${isMac ? 'pl-[80px] pr-4' : 'px-4'}`}
        style={{ backgroundColor: colors.bgSecondary }}
        onMouseDown={handleDragStart}
      >
        {/* 中间标题 - 绝对定位居中 */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: colors.accent }}>
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
            <polyline points="14,2 14,8 20,8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
            <polyline points="10,9 9,9 8,9"/>
          </svg>
          <span className="text-sm font-medium" style={{ color: colors.text }}>源码统计</span>
          <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: colors.accent, color: '#ffffff' }}>v{APP_VERSION}</span>
          {view === "results" && (
            <>
              <button
                onClick={handleScan}
                disabled={!path || isScanning}
                className="px-2 py-0.5 text-xs rounded flex items-center gap-1 transition-colors"
                style={{
                  backgroundColor: !path || isScanning ? colors.inputBg : colors.accent,
                  color: !path || isScanning ? colors.textSecondary : "#ffffff",
                  cursor: !path || isScanning ? "not-allowed" : "pointer"
                }}
              >
                {isScanning ? (
                  <>
                    <svg className="animate-spin w-3 h-3" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>
                    统计中...
                  </>
                ) : (
                  <>
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                    </svg>
                    重新统计
                  </>
                )}
              </button>
              <button
                onClick={handleReset}
                className="px-2 py-0.5 text-xs rounded flex items-center gap-1 transition-colors"
                style={{
                  backgroundColor: colors.inputBg,
                  color: colors.text,
                  border: `1px solid ${colors.border}`
                }}
              >
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                  <path d="M3 3v5h5"/>
                </svg>
                新建统计
              </button>
            </>
          )}
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {view === "results" && scanResult && (
          <aside
            className="w-64 flex flex-col border-r"
            style={{ borderColor: colors.border }}
          >
            <div className="flex-1 overflow-auto p-2">
              <SummaryCards summary={scanResult.summary} theme={isDarkMode ? "dark" : "light"} />
            </div>
          </aside>
        )}

        <main className="flex-1 flex flex-col overflow-hidden" style={{ backgroundColor: colors.bg }}>
          {view === "settings" && (
            <div className="flex-1 overflow-auto">
              <div className="max-w-4xl mx-auto p-6">
                {error && (
                  <div
                    className="mb-4 p-3 rounded text-sm"
                    style={{
                      backgroundColor: colors.errorBg,
                      border: `1px solid ${colors.errorBorder}`,
                      color: colors.errorText
                    }}
                  >
                    {error}
                  </div>
                )}

                <div className="mb-4 rounded" style={{ backgroundColor: colors.bgSecondary, border: `1px solid ${colors.border}` }}>
                  <div className="p-4 flex items-center gap-4">
                    <div className="flex-1">
                      <DirectoryPicker path={path} onChange={setPath} theme={isDarkMode ? "dark" : "light"} />
                    </div>
                    <button
                      onClick={handleScan}
                      disabled={!path || isScanning}
                      className="px-4 py-1.5 text-white text-sm rounded flex items-center gap-2 transition-colors"
                      style={{
                        backgroundColor: !path || isScanning ? colors.inputBg : colors.accent,
                        color: !path || isScanning ? colors.textSecondary : "#ffffff",
                        cursor: !path || isScanning ? "not-allowed" : "pointer"
                      }}
                    >
                      {isScanning ? (
                        <>
                          <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                          </svg>
                          统计中...
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                          </svg>
                          开始统计
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="grid gap-4">
                  <div className="rounded" style={{ backgroundColor: colors.bgSecondary, border: `1px solid ${colors.border}` }}>
                    <div className="p-3 flex items-center gap-2 border-b" style={{ borderColor: colors.border }}>
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: colors.textSecondary }}>
                        <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591-3.822 10.29-9 11.622C9.822 22.29 14 17.591 14 12c0-3.025-1.665-5.657-4-7"/>
                      </svg>
                      <span className="text-sm font-medium">排除规则</span>
                    </div>
                    <div className="p-4">
                      <ExcludeRules
                        rules={excludeRules}
                        onChange={setExcludeRules}
                        onResetToDefault={() => setExcludeRules(DEFAULT_EXCLUDES)}
                        theme={isDarkMode ? "dark" : "light"}
                      />
                    </div>
                  </div>

                  <div className="rounded" style={{ backgroundColor: colors.bgSecondary, border: `1px solid ${colors.border}` }}>
                    <div className="p-3 flex items-center gap-2 border-b" style={{ borderColor: colors.border }}>
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: colors.textSecondary }}>
                        <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                        <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                      </svg>
                      <span className="text-sm font-medium">统计选项</span>
                    </div>
                    <div className="p-4">
                      <ScanOptions
                        includeComments={includeComments}
                        includeBlanks={includeBlanks}
                        extensions={extensions}
                        onChange={(opts) => {
                          setIncludeComments(opts.includeComments);
                          setIncludeBlanks(opts.includeBlanks);
                          setExtensions(opts.extensions);
                        }}
                        theme={isDarkMode ? "dark" : "light"}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {view === "results" && scanResult && (
            <div className="flex-1">
              <LanguageTable summary={scanResult.summary.by_language} theme={isDarkMode ? "dark" : "light"} />
            </div>
          )}
        </main>
      </div>

      {scanResult && (
        <footer
          className="h-6 text-white text-xs flex items-center justify-between px-3"
          style={{ backgroundColor: colors.accent }}
        >
          <div className="flex items-center gap-4">
            {path && (
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/>
                </svg>
                {path.split("/").pop() || path}
              </span>
            )}
          </div>
          <div className="flex items-center gap-4">
            <span>{scanResult.summary.files.toLocaleString()} 个文件</span>
            <span>{scanResult.summary.total.toLocaleString()} 行代码</span>
            <button
              onClick={handleReset}
              className="px-2 py-0.5 text-xs rounded flex items-center gap-1 transition-colors"
              style={{ backgroundColor: "rgba(255,255,255,0.2)", color: "#ffffff" }}
            >
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                <path d="M3 3v5h5"/>
              </svg>
              新建统计
            </button>
          </div>
        </footer>
      )}

      {/* 全屏扫描动画遮罩 */}
      <ScanningOverlay isScanning={isScanning} isDark={isDarkMode} colors={colors} />
    </div>
  );
}

export default App;
