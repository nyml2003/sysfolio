# Testing Strategy

## Required Checks

- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`

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

## Must Cover

- `loading / empty / error`
- `Option<T>` 的边界分支
- 大规模节点树下的按需加载
- `home` / `article` 渲染路径
