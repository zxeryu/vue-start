---
description: "分析git工作区代码变更，更新对应包的CHANGELOG.md"
---

# 斜杠命令：更新 CHANGELOG

## 命令目的

分析 git 工作区代码变化，自动更新各 `@vue-start/*` 包的 CHANGELOG.md 文档，版本号在最新版本基础上加 0.01。

## 工作流程

1. **分析阶段**：读取 git 工作区已修改/新增的代码文件
2. **识别阶段**：根据文件路径识别变更涉及的包（如 `@vue-start/config`、`@vue-start/map`、`@vue-start/media`）
3. **变更检测**：分析代码变更内容，提取新增功能（feat）、性能优化（perf）、bug修复（fix）等信息
4. **更新 CHANGELOG**：
   - 如果 CHANGELOG.md 存在：在顶部添加新版本记录
   - 如果 CHANGELOG.md 不存在：创建新文件并写入当前计划的版本和变动内容
5. 版本号为最新版本 + 0.01

## 版本号规则

- 当前最新版本：`x.y.z`
- 新版本号：`x.y.(z+1)` 即在最后一位加 0.01
- 例如：0.1.6 → 0.1.7

## 包目录映射

| 包名 | CHANGELOG 路径 |
|------|----------------|
| @vue-start/antd-pro | @vue-start/antd-pro/CHANGELOG.md |
| @vue-start/chart | @vue-start/chart/CHANGELOG.md |
| @vue-start/config | @vue-start/config/CHANGELOG.md |
| @vue-start/css | @vue-start/css/CHANGELOG.md |
| @vue-start/element-pro | @vue-start/element-pro/CHANGELOG.md |
| @vue-start/hooks | @vue-start/hooks/CHANGELOG.md |
| @vue-start/map | @vue-start/map/CHANGELOG.md |
| @vue-start/media | @vue-start/media/CHANGELOG.md |
| @vue-start/persist | @vue-start/persist/CHANGELOG.md |
| @vue-start/pro | @vue-start/pro/CHANGELOG.md |
| @vue-start/request | @vue-start/request/CHANGELOG.md |
| @vue-start/store | @vue-start/store/CHANGELOG.md |

## CHANGELOG 新增文件规则

如果某个包没有 CHANGELOG.md 文件，需要创建新文件，格式如下：

```markdown
# Change Log

# x.y.z

- feat: 新增功能描述
- perf: 性能优化描述
- fix: bug修复描述
```

## CHANGELOG 已有文件追加格式

```markdown
# Change Log

# x.y.z

- feat: 新增功能描述
- perf: 性能优化描述
- fix: bug修复描述

# x.y.(z-1)

- ...
```

## 示例

**场景 1**：在 `@vue-start/config` 中新增了 `withPrefix` 和 `stringify` 函数（已有 CHANGELOG.md）

1. 分析 git diff，发现 `@vue-start/config/configvalue.ts` 文件有新增导出
2. 识别变更类型为 feat（新功能）
3. 读取 CHANGELOG.md 获取当前最新版本：0.1.6
4. 计算新版本号：0.1.7
5. 在 `@vue-start/config/CHANGELOG.md` 顶部添加：
   ```markdown
   # 0.1.7

   - feat: 新增 withPrefix 配置前缀支持
   - feat: 新增 stringify 配置序列化方法

   # 0.1.6

   - perf: preset config value
   ```

**场景 2**：在 `@vue-start/chart` 中有代码变更（无 CHANGELOG.md）

1. 分析 git diff，发现 `@vue-start/chart/src/Chart.tsx` 文件有变更
2. 计算新版本号：0.0.1（从 0.0.0 + 0.01）
3. 创建 `@vue-start/chart/CHANGELOG.md`：
   ```markdown
   # Change Log

   # 0.0.1

   - feat: 新增图表组件核心功能
   ```

## 注意事项

- 仅处理 `@vue-start/` 目录下的包
- 只分析 src 目录下的代码变更
- 版本号增加只在有实际代码变更时进行
