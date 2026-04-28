export interface FileStats {
  path: string;
  language: string;
  total: number;
  code: number;
  comment: number;
  blank: number;
}

export interface LangStats {
  files: number;
  total: number;
  code: number;
  comment: number;
  blank: number;
}

export interface ScanSummary {
  files: number;
  skipped: number;
  total: number;
  code: number;
  comment: number;
  blank: number;
  by_language: Record<string, LangStats>;
}

export interface ScanResult {
  summary: ScanSummary;
  files: FileStats[];
}

export interface LanguageInfo {
  name: string;
  extensions: string[];
}
