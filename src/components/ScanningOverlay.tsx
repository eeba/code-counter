import React from "react";

interface ThemeColors {
  bg: string;
  bgSecondary: string;
  border: string;
  inputBg: string;
  text: string;
  textSecondary: string;
  accent: string;
  code: string;
  comment: string;
  errorBg: string;
  errorBorder: string;
  errorText: string;
}

interface ScanningOverlayProps {
  isScanning: boolean;
  isDark: boolean;
  colors: ThemeColors;
}

export const ScanningOverlay: React.FC<ScanningOverlayProps> = ({ isScanning, isDark, colors }) => {
  if (!isScanning) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center transition-all duration-500"
      style={{
        backgroundColor: isDark ? "rgba(0, 0, 0, 0.65)" : "rgba(255, 255, 255, 0.65)",
        backdropFilter: "blur(4px)",
      }}
    >
      <style>
        {`
          @keyframes scan-laser {
            0% { top: 0%; opacity: 0; }
            15% { opacity: 1; }
            85% { opacity: 1; }
            100% { top: 100%; opacity: 0; }
          }
          .laser-line {
            position: absolute;
            left: 0;
            right: 0;
            height: 2px;
            background: ${colors.accent};
            box-shadow: 0 0 15px 2px ${colors.accent};
            animation: scan-laser 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
            z-index: 10;
          }
          @keyframes float-doc {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-8px); }
          }
          .floating-doc {
            animation: float-doc 3s ease-in-out infinite;
          }
          @keyframes pulse-ring {
            0% { transform: scale(0.7); opacity: 0.8; }
            100% { transform: scale(1.8); opacity: 0; }
          }
          .pulse-ring-element {
            position: absolute;
            inset: -20px;
            border: 1px solid ${colors.accent};
            border-radius: 10%;
            animation: pulse-ring 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          }
        `}
      </style>

      <div
        className="relative flex flex-col items-center p-10 rounded-[1rem] overflow-hidden transform scale-100 transition-all duration-500"
        style={{
          backgroundColor: colors.bgSecondary,
          boxShadow: isDark
            ? `0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 0 1px ${colors.border}`
            : `0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px ${colors.border}`,
        }}
      >
        {/* Background Glow */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            background: `radial-gradient(circle at center, ${colors.accent} 0%, transparent 60%)`,
          }}
        ></div>

        {/* Icon Container */}
        <div className="relative mb-8 mt-4 floating-doc">
          <div className="pulse-ring-element"></div>
          <div
            className="relative w-20 h-24 rounded-xl flex items-center justify-center overflow-hidden z-10"
            style={{
              backgroundColor: colors.bg,
              border: `1px solid ${colors.border}`,
              boxShadow: `0 10px 25px -5px rgba(0, 0, 0, 0.2)`,
            }}
          >
            {/* File Icon */}
            <svg
              className="w-10 h-10"
              style={{ color: colors.textSecondary }}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>

            {/* Laser Line */}
            <div className="laser-line"></div>
          </div>
        </div>

        {/* Text Section */}
        <div className="flex flex-col items-center gap-3 relative z-10">
          <div className="flex items-center gap-3">
            <svg
              className="animate-spin w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              style={{ color: colors.accent }}
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="3"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <h2
              className="text-xl font-bold tracking-wider"
              style={{ color: colors.text }}
            >
              正在扫描...
            </h2>
          </div>
          <p
            className="text-sm font-medium tracking-wide opacity-75"
            style={{ color: colors.textSecondary }}
          >
            分析代码结构与文件行数
          </p>
        </div>
      </div>
    </div>
  );
};
