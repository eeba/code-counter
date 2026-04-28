use regex::Regex;
use std::path::{Path, PathBuf};

pub struct ExcludeRules {
    pub absolutes: Vec<PathBuf>,
    pub relatives: Vec<String>,
    pub regexes: Vec<Regex>,
}

fn matches_glob(pattern: &str, s: &str) -> bool {
    let mut p = pattern.chars().peekable();
    let mut s_iter = s.chars().peekable();

    loop {
        match (p.next(), s_iter.next()) {
            (None, None) => return true,
            (None, Some(_)) => return false,
            (Some('*'), None) => {
                while let Some('*') = p.peek() {
                    p.next();
                }
                return p.next().is_none();
            }
            (Some('*'), Some(_)) => {
                while let Some('*') = p.peek() {
                    p.next();
                }
                if p.peek().is_none() {
                    return true;
                }
                let remaining_pattern: String = p.collect();
                for (i, _) in s.char_indices() {
                    if matches_glob(&remaining_pattern, &s[i..]) {
                        return true;
                    }
                }
                if matches_glob(&remaining_pattern, "") {
                    return true;
                }
                return false;
            }
            (Some('?'), Some(_)) => {}
            (Some(pc), Some(sc)) if pc == sc => {}
            _ => return false,
        }
    }
}

impl ExcludeRules {
    pub fn new(rules: &[String]) -> Self {
        let mut absolutes = Vec::new();
        let mut relatives = Vec::new();
        let mut regexes = Vec::new();

        for rule in rules {
            let rule = rule.trim();
            if rule.is_empty() {
                continue;
            }

            if Self::looks_like_regex(rule) {
                if let Ok(re) = Regex::new(rule) {
                    regexes.push(re);
                    continue;
                }
            }

            let p = Path::new(rule);
            if p.is_absolute() {
                if let Ok(abs) = p.canonicalize() {
                    absolutes.push(abs);
                } else {
                    absolutes.push(p.to_path_buf());
                }
            } else {
                relatives.push(rule.to_string());
            }
        }

        ExcludeRules {
            absolutes,
            relatives,
            regexes,
        }
    }

    fn looks_like_regex(s: &str) -> bool {
        let regex_chars = ['+', '?', '{', '}', '[', ']', '|', '(', ')', '\\', '^', '$'];
        s.chars().any(|c| regex_chars.contains(&c))
    }

    pub fn should_exclude(&self, path: &Path, root: &Path) -> bool {
        let resolved = match path.canonicalize() {
            Ok(p) => p,
            Err(_) => path.to_path_buf(),
        };

        let rel = match path.strip_prefix(root) {
            Ok(r) => r,
            Err(_) => path,
        };
        let rel_str = rel.to_string_lossy().replace('\\', "/");

        for ap in &self.absolutes {
            if resolved.starts_with(ap) || resolved == *ap {
                return true;
            }
        }

        for rp in &self.relatives {
            if matches_glob(rp, &rel_str) {
                return true;
            }
            if let Some(name) = path.file_name().and_then(|n| n.to_str()) {
                if matches_glob(rp, name) {
                    return true;
                }
            }
        }

        for rx in &self.regexes {
            if rx.is_match(&rel_str) {
                return true;
            }
            if let Some(name) = path.file_name().and_then(|n| n.to_str()) {
                if rx.is_match(name) {
                    return true;
                }
            }
        }

        false
    }
}

pub fn default_excludes() -> Vec<String> {
    vec![
        ".git".into(),
        ".svn".into(),
        ".hg".into(),
        "__pycache__".into(),
        ".pytest_cache".into(),
        ".mypy_cache".into(),
        "node_modules".into(),
        ".yarn".into(),
        ".pnp".into(),
        "venv".into(),
        ".venv".into(),
        "env".into(),
        ".env".into(),
        ".tox".into(),
        ".eggs".into(),
        "*.egg-info".into(),
        "dist".into(),
        "build".into(),
        "out".into(),
        "target".into(),
        ".idea".into(),
        ".vscode".into(),
        ".DS_Store".into(),
    ]
}
