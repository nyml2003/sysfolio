# Styling System

> **本文档**：CSS 分层、tokens / atomic / molecular、与 `design` 目录关系、新增 class 审批。  
> **相关**：[文档索引](./README.md) · [代码组织（UI 库与原生 HTML）](./code-organization.md) · [主题映射](./theme-mapping.md) · [架构](./architecture.md)

## Stack

- CSS Modules
- PostCSS
- `postcss-apply`
- `@layer`

## Source Of Truth

- 视觉规范来自 `design` 目录
- `design/frontend-style-handoff` 是前端样式承接基线
- 实现代码只在 `frontend` 目录落地，不直接把 `design` 当运行时代码

## Layers

1. `tokens`
   - 语义变量与主题覆盖
2. `atomic`
   - 基础 property-set mixin
3. `molecular`
   - 通过 `@apply` 组合 atomic 的高频结构
4. `component`
   - 组件局部差异

## Rules

- `@apply` 仅作为构建期语法糖
- 组件不直接写死 light/dark 色值
- mixin 命名稳定、可搜索、按职责命名
- 页面模板不应堆叠大量 `.u-*`
- 复用优先级：token > atomic > molecular > component

## Approval Rule

- 新增未约定的 class 命名模式、atomic 类别、molecular 类别、状态类或共享样式抽象，必须先报备并讨论
- 该规则是仓库共识，不在实现中绕过
