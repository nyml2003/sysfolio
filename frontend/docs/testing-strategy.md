# Testing Strategy

> **本文档**：合并前必跑命令、测试分层、`0.5` 聚焦范围、必覆盖场景。  
> **相关**：[文档索引](./README.md) · [依赖](./dependencies.md) · [实现阶段](./implementation-phases.md) · [阅读器终态蓝图](./reader-end-state.md)

## Required Checks

- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm test:coverage`（见下「覆盖率」）

## 覆盖率

- 命令：`pnpm test:coverage`（Vitest + `@vitest/coverage-v8`，报告输出到 `coverage/`）。
- **阈值**：对下列**纯 TS 模块**（`vite.config.ts` 中 `coverage.include`）要求 **语句/行/函数/分支均 ≥ 80%**：路径工具、`format-date`、资源状态、`detach-promise`、`Option`/`Result` helpers、文件树 model、`app-shell.model`（面包屑纯函数）。
- 全仓 `.tsx` 与未列入 `include` 的文件**不计入**该阈值，避免与 UI 混测；新增纯逻辑文件时，应同步加入 `include` 并补测。

## 0.5 Focus

- 这一期不测搜索 UI、不测标签树 UI，因为 UI 不做
- 这一期要先把契约和数据模型的测试面定义清楚

## Test Layers

- 纯 TS model 单测
- repository 行为测试
- mock generator 输出稳定性测试
- 文件树加载和虚拟化测试
- 阅读进度恢复测试
- 路由与 renderer 分派测试
- 主题与引导偏好层测试
- 基础 a11y smoke checks

## Reader End State Expansion

- 当前测试分层描述的是现阶段质量门槛。
- 终态阅读器落地后，测试面应扩展到：
  - query layer 的 cancellation / dedupe / stale discard
  - reading session state machine 的状态迁移表
  - persistence layer 的 lifecycle flush
  - tree explorer 的节点级失败恢复与键盘导航
  - shell / overlay 的焦点恢复与 a11y 交互
- 终态设计边界见 [`reader-end-state.md`](./reader-end-state.md)。

## Must Cover

- `loading / empty / error`
- `Option<T>` 的边界分支
- 大规模节点树下的按需加载
- `home` / `directory` / `article` 渲染路径
