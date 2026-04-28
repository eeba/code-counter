use crate::languages::LanguageInfo;

#[derive(Debug, Clone, Default)]
pub struct LineStats {
    pub code: u64,
    pub comment: u64,
    pub blank: u64,
}

pub fn analyze_lines(content: &str, lang_info: &LanguageInfo) -> LineStats {
    let mut stats = LineStats::default();
    let mut in_block = false;
    let block_start = lang_info.block_comment.map(|(s, _)| s);
    let block_end = lang_info.block_comment.map(|(_, e)| e);

    for line in content.lines() {
        let stripped = line.trim();

        if stripped.is_empty() {
            stats.blank += 1;
            continue;
        }

        if in_block {
            stats.comment += 1;
            if let Some(end) = block_end {
                if stripped.contains(end) {
                    in_block = false;
                }
            }
            continue;
        }

        if let Some(start) = block_start {
            if let Some(start_idx) = stripped.find(start) {
                stats.comment += 1;
                if let Some(end) = block_end {
                    let after_start = &stripped[start_idx + start.len()..];
                    if !after_start.contains(end) {
                        in_block = true;
                    }
                } else {
                    in_block = true;
                }
                continue;
            }
        }

        let mut is_comment = false;
        for prefix in &lang_info.single_prefixes {
            if stripped.starts_with(prefix) {
                stats.comment += 1;
                is_comment = true;
                break;
            }
        }

        if !is_comment {
            stats.code += 1;
        }
    }

    stats
}
