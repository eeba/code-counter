<div align="center">
  <img src="src-tauri/icons/icon.png" alt="源码统计 Logo" width="128" height="128" />
  <h1>源码统计 (Code Counter)</h1>
  <p>一个基于 Tauri + Rust + React 开发的极速跨平台源码统计工具 🚀</p>

  [![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)]()
  [![Platform](https://img.shields.io/badge/platform-macOS%20%7C%20Windows%20%7C%20Linux-lightgrey.svg)]()
  [![Built with Tauri](https://img.shields.io/badge/built%20with-Tauri-FFC131.svg)](https://tauri.app/)
  [![Built with Rust](https://img.shields.io/badge/built%20with-Rust-black.svg)](https://www.rust-lang.org/)
  [![Built with React](https://img.shields.io/badge/built%20with-React-61DAFB.svg)](https://reactjs.org/)
</div>

---

## 📖 简介

**源码统计** 是一款现代化、高性能的桌面应用程序，专为开发者设计。它可以帮助你快速、准确地统计项目代码行数。得益于底层 Rust 强劲的性能，即使面对百万级代码量的巨型项目，也能在瞬间完成扫描与统计。

软件界面采用现代化的设计语言（支持浅色/深色模式自动切换），并提供了丰富的过滤和图表分析功能，让你对代码库的结构一目了然。

## ✨ 核心特性

- ⚡️ **极速扫描**：底层采用 Rust 并发处理，扫描速度极快。
- 🌍 **跨平台**：完美支持 macOS (Intel & Apple Silicon)、Windows、Linux。
- 📊 **可视化图表**：直观展示各种编程语言的代码占比、空行率、注释率等数据。
- 🛠 **灵活的过滤规则**：
  - 支持按扩展名精确包含/排除。
  - 支持通过绝对路径、相对路径、通配符（Glob）甚至正则表达式进行目录/文件排除。
  - 内置了常用环境和编译产物的默认排除规则（如 `node_modules`、`dist`、`.git`、`target` 等）。
- 📝 **精细的行统计**：
  - 智能识别 90+ 种主流编程语言。
  - 准确区分 **代码行**、**空白行** 和 **注释行**（支持单行注释及多行注释块）。
  - 可自由选择是否将注释和空行计入总数。
- 🎨 **现代 UI**：支持跟随系统的深色/浅色模式，提供流畅的交互体验。

## 📸 界面预览

*(你可以稍后在这里补充软件运行时的截图)*

## 🚀 快速开始

### 环境要求

如果你想在本地编译运行该项目，请确保你已经安装了以下环境：
- [Node.js](https://nodejs.org/) (v18 或更高版本)
- [Rust](https://www.rust-lang.org/tools/install) (v1.70 或更高版本)
- 对应操作系统的 C++ 构建工具链 (详见 [Tauri 官方文档](https://tauri.app/v1/guides/getting-started/prerequisites))

### 安装依赖

克隆仓库并安装前端依赖：

```bash
git clone https://github.com/eeba/code-counter.git
cd code-counter
npm install
```

### 开发模式运行

以开发模式启动应用（支持热更新）：

```bash
npm run tauri dev
```

### 📦 构建与打包

构建生产版本或特定平台的安装包：

```bash
# 默认打包（为当前系统架构打包）
npm run package

# --- macOS 专用 ---
# 打包为通用架构（包含 Intel + Apple Silicon）
npm run package:mac:universal
# 仅打包 Apple Silicon (M1/M2/M3)
npm run package:mac:aarch64
# 仅打包 Intel
npm run package:mac:x86_64

# --- Windows 专用 ---
npm run package:win:x86_64
npm run package:win:aarch64

# --- Linux 专用 ---
npm run package:linux:x86_64
npm run package:linux:aarch64
```
*注：构建出的安装包（如 `.app`、`.dmg`、`.exe` 等）将存放在 `src-tauri/target/release/bundle/` 目录下。*

## 🏗 技术栈

- **底层引擎**: Rust, [Tauri v2](https://v2.tauri.app/)
- **前端框架**: React 18, TypeScript, Vite
- **UI 样式**: Tailwind CSS
- **图表展示**: Echarts

## 🤝 参与贡献

欢迎提交 Issue 和 Pull Request 来帮助改进这个项目！
1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启一个 Pull Request

## 📄 开源协议

本项目基于 [MIT License](LICENSE) 开源，你可以自由地使用、修改和分发。
