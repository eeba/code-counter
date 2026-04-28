use crate::analyzer::analyze_lines;
use crate::exclude::{default_excludes, ExcludeRules};
use crate::languages::get_lang_info;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::path::Path;
use walkdir::WalkDir;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FileStats {
    pub path: String,
    pub language: String,
    pub total: u64,
    pub code: u64,
    pub comment: u64,
    pub blank: u64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LangStats {
    pub files: u64,
    pub total: u64,
    pub code: u64,
    pub comment: u64,
    pub blank: u64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ScanSummary {
    pub files: u64,
    pub skipped: u64,
    pub total: u64,
    pub code: u64,
    pub comment: u64,
    pub blank: u64,
    pub by_language: HashMap<String, LangStats>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ScanResult {
    pub summary: ScanSummary,
    pub files: Vec<FileStats>,
}

// 限制单个文件的最大大小（10MB），避免大文件阻塞
const MAX_FILE_SIZE: u64 = 10 * 1024 * 1024;

pub fn scan_directory(
    root: String,
    exclude_rules: Vec<String>,
    include_comments: bool,
    include_blanks: bool,
    extensions: Option<Vec<String>>,
) -> Result<ScanResult, String> {
    let root_path = Path::new(&root);
    if !root_path.exists() || !root_path.is_dir() {
        return Err("路径不存在或不是目录".into());
    }

    let rules = if exclude_rules.is_empty() {
        default_excludes()
    } else {
        exclude_rules
    };
    let exclude = ExcludeRules::new(&rules);

    let mut file_results = Vec::new();
    let mut skipped = 0;

    for entry in WalkDir::new(root_path)
        .into_iter()
        .filter_map(|e| e.ok())
    {
        let path = entry.path();
        if path.is_dir() {
            continue;
        }

        if exclude.should_exclude(path, root_path) {
            skipped += 1;
            continue;
        }

        // 检查文件大小，跳过超大文件
        if let Ok(metadata) = entry.metadata() {
            if metadata.len() > MAX_FILE_SIZE {
                skipped += 1;
                continue;
            }
        }

        let Some(lang_info) = get_lang_info(path) else {
            skipped += 1;
            continue;
        };

        if let Some(ref exts) = extensions {
            let Some(ext) = path.extension().and_then(|e| e.to_str()) else {
                skipped += 1;
                continue;
            };
            let ext_dot = format!(".{}", ext.to_lowercase());
            if !exts.contains(&ext_dot) && !exts.contains(&ext.to_lowercase()) {
                skipped += 1;
                continue;
            }
        }

        let Ok(content) = std::fs::read_to_string(path) else {
            skipped += 1;
            continue;
        };

        let line_stats = analyze_lines(&content, &lang_info);

        let effective_code = line_stats.code;
        let effective_comment = if include_comments { line_stats.comment } else { 0 };
        let effective_blank = if include_blanks { line_stats.blank } else { 0 };
        let total = effective_code + effective_comment + effective_blank;

        let rel_path = match path.strip_prefix(root_path) {
            Ok(r) => r.to_string_lossy().into_owned(),
            Err(_) => path.to_string_lossy().into_owned(),
        };

        file_results.push(FileStats {
            path: rel_path,
            language: lang_info.name.to_string(),
            total,
            code: effective_code,
            comment: effective_comment,
            blank: effective_blank,
        });
    }

    let summary = build_summary(&file_results, skipped);

    Ok(ScanResult {
        summary,
        files: file_results,
    })
}

fn build_summary(files: &[FileStats], skipped: u64) -> ScanSummary {
    let mut summary = ScanSummary {
        files: files.len() as u64,
        skipped,
        total: 0,
        code: 0,
        comment: 0,
        blank: 0,
        by_language: HashMap::new(),
    };

    for f in files {
        summary.total += f.total;
        summary.code += f.code;
        summary.comment += f.comment;
        summary.blank += f.blank;

        let entry = summary.by_language.entry(f.language.clone()).or_insert(LangStats {
            files: 0,
            total: 0,
            code: 0,
            comment: 0,
            blank: 0,
        });
        entry.files += 1;
        entry.total += f.total;
        entry.code += f.code;
        entry.comment += f.comment;
        entry.blank += f.blank;
    }

    summary
}

pub fn validate_path(path: String) -> bool {
    Path::new(&path).exists() && Path::new(&path).is_dir()
}
