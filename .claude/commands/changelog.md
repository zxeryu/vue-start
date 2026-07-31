---
description: "分析git工作区代码变更，更新对应包的CHANGELOG.md"
---

# 斜杠命令：更新 CHANGELOG

## 命令目的

分析 git 工作区代码变化，自动更新各 `@vue-start/*` 包的 CHANGELOG.md 文档，版本号在最新版本基础上加 0.01。

## 工作流程

### 模式 A：工作区有未提交变更

当 `@vue-start/` 目录下有未提交的代码变更时：

1. **分析阶段**：`git diff --name-only` 获取工作区已修改/新增的代码文件
2. **识别阶段**：根据文件路径识别变更涉及的包（如 `@vue-start/config`、`@vue-start/map`、`@vue-start/media`）
3. **变更检测**：结合 `git diff` 分析代码变更内容，提取新增功能（feat）、性能优化（perf）、bug修复（fix）等信息
4. **更新 CHANGELOG**：
   - 如果 CHANGELOG.md 存在：在顶部添加新版本记录
   - 如果 CHANGELOG.md 不存在：创建新文件并写入当前计划的版本和变动内容
5. 版本号为最新版本 + 0.01

### 模式 B：工作区无未提交变更（已提交模式）

当 `@vue-start/` 目录下没有未提交的代码变更时，从已提交的 commit 中追溯：

1. **查找基准提交**：`git log --oneline --grep="chore(release):" -1` 获取最近一次发布提交
2. **获取 diff 范围**：`git diff <基准commit>..HEAD --stat -- @vue-start/*/src/` 获取该范围内所有 `@vue-start/*` 包的变更
3. **列出待更新包**：按包名分组，提取每个包的变更摘要：

   ```
   ┌──────┬──────────────────────┬────────┬──────────────────────────────────┐
   │  #  │ 包名                │ 文件数 │ 变更摘要                        │
   ├──────┼──────────────────────┼────────┼──────────────────────────────────┤
   │  1  │ @vue-start/map      │      7 │ feat: 新增 DistrictLayer 组件   │
   │     │                      │        │ feat: 新增 MapFitView 组件      │
   │     │                      │        │ fix: 修复 toTop 条件判断        │
   ├──────┼──────────────────────┼────────┼──────────────────────────────────┤
   │  2  │ @vue-start/pro      │      1 │ feat: 更新 RouterView 布局      │
   ├──────┼──────────────────────┼────────┼──────────────────────────────────┤
   │  3  │ @vue-start/element-pro│     1 │ feat: 更新 index.css           │
   ├──────┼──────────────────────┼────────┼──────────────────────────────────┤
   │  4  │ 全部更新            │        │                                  │
   └──────┴──────────────────────┴────────┴──────────────────────────────────┘
   ```

   变更摘要提取规则：`git log <基准>..HEAD --oneline -- <包路径>` 获取 commit，解析 feat/perf/fix 前缀。

4. **交互选择**：用户输入编号选择要更新 CHANGELOG 的包（支持多选，如 `1,3` 或 `1-3` 或 `1,2,3`）
5. **逐个处理**：对选中的每个包：
   - 读取该包 CHANGELOG.md 获取当前最新版本
   - 计算新版本号：`x.y.(z+1)`
   - 分析 `git log` 中该包的 commit 信息，提取 feat / perf / fix 等内容
   - 更新 CHANGELOG.md 顶部追加新版本记录
6. 如果该范围内没有 `@vue-start/*` 的变更，则跳过

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

**场景 2（模式 A）**：在 `@vue-start/chart` 中有代码变更（无 CHANGELOG.md）

1. 分析 git diff，发现 `@vue-start/chart/src/Chart.tsx` 文件有变更
2. 计算新版本号：0.0.1（从 0.0.0 + 0.01）
3. 创建 `@vue-start/chart/CHANGELOG.md`：
   ```markdown
   # Change Log

   # 0.0.1

   - feat: 新增图表组件核心功能
   ```

**场景 3（模式 B）**：`@vue-start/map` 代码已提交，工作区无变更

1. 检查工作区：`git status --short -- @vue-start/` 返回空
2. 查找基准提交：`git log --oneline --grep="chore(release):" -1` → `94287c1`
3. 获取 diff 范围：`git diff 94287c1..HEAD --stat -- @vue-start/*/src/`
   ```
   @vue-start/map/src/Map.tsx                 | 107 ++++++++++++++++-
   @vue-start/map/src/comp/DistrictLayer.tsx  | 177 +++++++++++++++++++
   @vue-start/map/src/comp/FitView.tsx        |  75 +++++++++++
   @vue-start/map/src/comp/Loc.tsx            |   3 +
   @vue-start/map/src/comp/index.ts           |   4 +-
   @vue-start/map/src/layer/LayerGroup.ts     |   7 +-
   @vue-start/map/src/overlay/OverlayGroup.ts |   7 +-
   @vue-start/pro/src/comp/layout/RouterView.tsx | 8 +-
   @vue-start/element-pro/index.css             | 7 +
   ```
4. 列出待更新包及变更摘要：
   ```
   ┌──────┬──────────────────────┬────────┬──────────────────────────────────┐
   │  #  │ 包名                │ 文件数 │ 变更摘要                        │
   ├──────┼──────────────────────┼────────┼──────────────────────────────────┤
   │  1  │ @vue-start/map      │      7 │ feat: 新增 DistrictLayer 组件   │
   │     │                      │        │ feat: 新增 MapFitView 组件      │
   │     │                      │        │ fix: 修复 toTop 条件判断        │
   ├──────┼──────────────────────┼────────┼──────────────────────────────────┤
   │  2  │ @vue-start/pro      │      1 │ feat: 更新 RouterView 布局      │
   ├──────┼──────────────────────┼────────┼──────────────────────────────────┤
   │  3  │ @vue-start/element-pro│     1 │ feat: 更新 index.css           │
   ├──────┼──────────────────────┼────────┼──────────────────────────────────┤
   │  4  │ 全部更新            │        │                                  │
   └──────┴──────────────────────┴────────┴──────────────────────────────────┘
   ```
5. 用户输入 `1` 选择只更新 `@vue-start/map`
6. 读取 `@vue-start/map/CHANGELOG.md` 当前最新版本：`0.0.9`
7. 计算新版本号：`0.0.10`
8. 分析 `git log 94287c1..HEAD --oneline -- @vue-start/map/` 获取 commit 信息
9. 在 `@vue-start/map/CHANGELOG.md` 顶部追加：
   ```markdown
   # 0.0.10

   - feat: 拆分 IMapProvide/IGroupProvide 上下文
   - feat: Loc 新增 enableGeo prop
   - feat: 新增 MapFitView 组件
   - feat: 新增 DistrictLayer 组件
   - feat: 新增 getGeoJson 数据源机制
   - feat: 新增 normalizeAdcode 统一 adcode 类型
   - feat: 新增 disabled prop
   - fix: 修复 toTop 条件判断
   ```

## 注意事项

- 仅处理 `@vue-start/` 目录下的包
- 只分析 src 目录下的代码变更
- 版本号增加只在有实际代码变更时进行
- 模式 B 中，基准 commit 通过 `git log --grep="chore(release):"` 查找，如果不存在则从头开始分析
- 模式 B 中，多个 commit 涉及同一包时合并为一条 CHANGELOG 记录
