# Domain docs

## 布局

单上下文：一个 `CONTEXT.md` 在仓库根目录，`docs/adr/` 用于架构决策记录。

## 使用规则

- `CONTEXT.md` — 项目领域语言，被 `improve-codebase-architecture`、`diagnose`、`tdd` 读取
- `docs/adr/` — 架构决策记录，同上消费者

## 创建 context

将 `CONTEXT.md` 放在仓库根目录。ADR 放在 `docs/adr/` 下，命名为 `####-adr-name.md`。