import { useCallback } from "react";
import { invoke } from "@tauri-apps/api/core";
import type { ScanResult } from "../types";

export function useScanner() {
  const scan = useCallback(
    async (
      root: string,
      excludeRules: string[],
      includeComments: boolean,
      includeBlanks: boolean,
      extensions: string[] | null
    ) => {
      const res = await invoke<ScanResult>("scan_directory_command", {
        root,
        excludeRules,
        includeComments,
        includeBlanks,
        extensions: extensions && extensions.length > 0 ? extensions : null,
      });
      return res;
    },
    []
  );

  return { scan };
}
