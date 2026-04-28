use serde::{Serialize, Deserialize};
use std::collections::HashMap;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LanguageInfo {
    pub name: &'static str,
    pub single_prefixes: Vec<&'static str>,
    pub block_comment: Option<(&'static str, &'static str)>,
}

pub fn get_language_map() -> HashMap<&'static str, LanguageInfo> {
    let mut map = HashMap::new();

    macro_rules! add_lang {
        ($ext:expr, $name:expr, $single:expr, $block:expr) => {
            map.insert($ext, LanguageInfo {
                name: $name,
                single_prefixes: $single,
                block_comment: $block,
            });
        };
    }

    add_lang!(".py", "Python", vec!["#"], Some(("\"\"\"", "\"\"\"")));
    add_lang!(".pyw", "Python", vec!["#"], Some(("\"\"\"", "\"\"\"")));
    add_lang!(".js", "JavaScript", vec!["//"], Some(("/*", "*/")));
    add_lang!(".mjs", "JavaScript", vec!["//"], Some(("/*", "*/")));
    add_lang!(".cjs", "JavaScript", vec!["//"], Some(("/*", "*/")));
    add_lang!(".ts", "TypeScript", vec!["//"], Some(("/*", "*/")));
    add_lang!(".tsx", "TypeScript", vec!["//"], Some(("/*", "*/")));
    add_lang!(".jsx", "JavaScript", vec!["//"], Some(("/*", "*/")));
    add_lang!(".java", "Java", vec!["//"], Some(("/*", "*/")));
    add_lang!(".c", "C", vec!["//"], Some(("/*", "*/")));
    add_lang!(".h", "C/C++", vec!["//"], Some(("/*", "*/")));
    add_lang!(".cpp", "C++", vec!["//"], Some(("/*", "*/")));
    add_lang!(".cc", "C++", vec!["//"], Some(("/*", "*/")));
    add_lang!(".cxx", "C++", vec!["//"], Some(("/*", "*/")));
    add_lang!(".hpp", "C++", vec!["//"], Some(("/*", "*/")));
    add_lang!(".cs", "C#", vec!["//"], Some(("/*", "*/")));
    add_lang!(".go", "Go", vec!["//"], Some(("/*", "*/")));
    add_lang!(".rs", "Rust", vec!["//"], Some(("/*", "*/")));
    add_lang!(".rb", "Ruby", vec!["#"], Some(("=begin", "=end")));
    add_lang!(".php", "PHP", vec!["//", "#"], Some(("/*", "*/")));
    add_lang!(".swift", "Swift", vec!["//"], Some(("/*", "*/")));
    add_lang!(".kt", "Kotlin", vec!["//"], Some(("/*", "*/")));
    add_lang!(".kts", "Kotlin", vec!["//"], Some(("/*", "*/")));
    add_lang!(".scala", "Scala", vec!["//"], Some(("/*", "*/")));
    add_lang!(".sh", "Shell", vec!["#"], None);
    add_lang!(".bash", "Shell", vec!["#"], None);
    add_lang!(".zsh", "Shell", vec!["#"], None);
    add_lang!(".fish", "Shell", vec!["#"], None);
    add_lang!(".ps1", "PowerShell", vec!["#"], Some(("<#", "#>")));
    add_lang!(".lua", "Lua", vec!["--"], Some(("--[[", "]]")));
    add_lang!(".r", "R", vec!["#"], None);
    add_lang!(".R", "R", vec!["#"], None);
    add_lang!(".sql", "SQL", vec!["--"], Some(("/*", "*/")));
    add_lang!(".html", "HTML", vec![], Some(("<!--", "-->")));
    add_lang!(".htm", "HTML", vec![], Some(("<!--", "-->")));
    add_lang!(".xml", "XML", vec![], Some(("<!--", "-->")));
    add_lang!(".css", "CSS", vec![], Some(("/*", "*/")));
    add_lang!(".scss", "SCSS", vec!["//"], Some(("/*", "*/")));
    add_lang!(".sass", "Sass", vec!["//"], Some(("/*", "*/")));
    add_lang!(".less", "Less", vec!["//"], Some(("/*", "*/")));
    add_lang!(".vue", "Vue", vec!["//"], Some(("/*", "*/")));
    add_lang!(".svelte", "Svelte", vec!["//"], Some(("/*", "*/")));
    add_lang!(".yaml", "YAML", vec!["#"], None);
    add_lang!(".yml", "YAML", vec!["#"], None);
    add_lang!(".toml", "TOML", vec!["#"], None);
    add_lang!(".ini", "INI", vec![";", "#"], None);
    add_lang!(".conf", "Config", vec!["#"], None);
    add_lang!(".tf", "Terraform", vec!["#"], Some(("/*", "*/")));
    add_lang!(".dart", "Dart", vec!["//"], Some(("/*", "*/")));
    add_lang!(".ex", "Elixir", vec!["#"], None);
    add_lang!(".exs", "Elixir", vec!["#"], None);
    add_lang!(".erl", "Erlang", vec!["%"], None);
    add_lang!(".hrl", "Erlang", vec!["%"], None);
    add_lang!(".hs", "Haskell", vec!["--"], Some(("{-", "-}")));
    add_lang!(".ml", "OCaml", vec![], Some(("(*", "*)")));
    add_lang!(".mli", "OCaml", vec![], Some(("(*", "*)")));
    add_lang!(".clj", "Clojure", vec![";"], None);
    add_lang!(".fs", "F#", vec!["//"], Some(("(*", "*)")));
    add_lang!(".fsx", "F#", vec!["//"], Some(("(*", "*)")));
    add_lang!(".m", "MATLAB", vec!["%"], Some(("%{", "%}")));
    add_lang!(".jl", "Julia", vec!["#"], Some(("#=", "=#")));
    add_lang!(".nim", "Nim", vec!["#"], None);
    add_lang!(".zig", "Zig", vec!["//"], None);
    add_lang!(".v", "V", vec!["//"], Some(("/*", "*/")));
    add_lang!(".groovy", "Groovy", vec!["//"], Some(("/*", "*/")));
    add_lang!(".gradle", "Gradle", vec!["//"], Some(("/*", "*/")));
    add_lang!(".cmake", "CMake", vec!["#"], None);
    add_lang!(".makefile", "Makefile", vec!["#"], None);
    add_lang!("makefile", "Makefile", vec!["#"], None);
    add_lang!("Makefile", "Makefile", vec!["#"], None);
    add_lang!(".mk", "Makefile", vec!["#"], None);
    add_lang!(".proto", "Protobuf", vec!["//"], Some(("/*", "*/")));
    add_lang!(".graphql", "GraphQL", vec!["#"], None);

    map
}

pub fn get_lang_info(path: &std::path::Path) -> Option<LanguageInfo> {
    let map = get_language_map();
    if let Some(suffix) = path.extension().and_then(|s| s.to_str()) {
        let suffix_lower = suffix.to_lowercase();
        let key = format!(".{}", suffix_lower);
        if let Some(info) = map.get(key.as_str()) {
            return Some(info.clone());
        }
    }
    if let Some(name) = path.file_name().and_then(|n| n.to_str()) {
        let name_lower = name.to_lowercase();
        if let Some(info) = map.get(name_lower.as_str()) {
            return Some(info.clone());
        }
        if let Some(info) = map.get(name) {
            return Some(info.clone());
        }
    }
    None
}

pub fn list_supported_languages() -> Vec<serde_json::Value> {
    let map = get_language_map();
    let mut seen = std::collections::HashMap::new();

    for (ext, info) in map {
        seen.entry(info.name).or_insert_with(Vec::new).push(ext);
    }

    let mut result = Vec::new();
    let mut sorted_langs: Vec<_> = seen.keys().cloned().collect();
    sorted_langs.sort();

    for lang in sorted_langs {
        let mut exts = seen.remove(lang).unwrap();
        exts.sort();
        result.push(serde_json::json!({
            "name": lang,
            "extensions": exts
        }));
    }

    result
}
