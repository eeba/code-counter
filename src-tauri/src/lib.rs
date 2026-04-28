mod analyzer;
mod exclude;
mod languages;
mod scanner;

use crate::scanner::{scan_directory, validate_path, ScanResult};
use crate::languages::list_supported_languages;

#[tauri::command]
async fn scan_directory_command(
    root: String,
    exclude_rules: Vec<String>,
    include_comments: bool,
    include_blanks: bool,
    extensions: Option<Vec<String>>,
) -> Result<ScanResult, String> {
    // 在后台线程执行扫描操作
    tauri::async_runtime::spawn(async move {
        scan_directory(root, exclude_rules, include_comments, include_blanks, extensions)
    })
    .await
    .map_err(|e| format!("执行失败: {}", e))?
}

#[tauri::command]
fn validate_path_command(path: String) -> bool {
    validate_path(path)
}

#[tauri::command]
fn list_supported_languages_command() -> Vec<serde_json::Value> {
    list_supported_languages()
}

#[tauri::command]
async fn tauri_minimize(window: tauri::Window) {
    let _ = window.minimize();
}

#[tauri::command]
async fn tauri_close(window: tauri::Window) {
    window.close().ok();
}

#[tauri::command]
async fn start_dragging(window: tauri::Window) -> Result<(), String> {
    window.start_dragging().map_err(|e| e.to_string())
}

pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![
            scan_directory_command,
            validate_path_command,
            list_supported_languages_command,
            tauri_minimize,
            tauri_close,
            start_dragging
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
