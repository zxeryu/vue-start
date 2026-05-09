# Issue tracker

Issues 作为本地 markdown 文件存放在 `.scratch/<feature>/` 目录下。

## 工作流

- Issues 创建为 `.scratch/` 下以功能命名的目录内的 `.md` 文件
- 每个文件包含 frontmatter，包含标题、状态和元数据
- Skills 直接读写这些文件

## 示例结构

```
.scratch/
  feature-name/
    issue-title.md
```

## 创建 issue

创建新的 `.md` 文件，包含：
- `title`：issue 标题
- `status`：初始状态（默认为 `needs-triage`）
- `created`：ISO 日期字符串