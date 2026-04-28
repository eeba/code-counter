# 源码统计工具

基于 Tauri 2 + React + TypeScript + Rust 构建的跨平台源码统计工具。

## 功能

- 支持 50+ 编程语言
- 灵活的排除规则（绝对路径/相对路径/正则表达式）
- 可配置是否统计注释行和空行
- 按扩展名过滤
- 可视化统计结果

## 环境要求

- Node.js 20+
- Rust 1.75+
- Tauri CLI

## 安装与运行

```bash
# 安装前端依赖
npm install

# 开发模式运行
npm run tauri dev

# 构建生产版本
npm run tauri build
```

## 项目结构

```
code-counter/
├── src-tauri/
│   ├── src/
│   │   ├── main.rs          # 入口
│   │   ├── lib.rs           # Tauri 命令注册
│   │   ├── scanner.rs       # 目录扫描
│   │   ├── analyzer.rs      # 行统计
│   │   ├── exclude.rs       # 排除规则
│   │   └── languages.rs     # 语言定义
│   └── Cargo.toml
├── src/
│   ├── App.tsx
│   ├── components/
│   ├── hooks/
│   └── types.ts
└── package.json
```
