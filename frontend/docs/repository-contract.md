# Repository Contract

## Core Rule

- repository 是前端唯一数据访问边界。
- 组件、store、feature 不直接读取 fixtures。
- 边界层负责处理浏览器 API、storage 和未来网络响应。

## Return Style

- 不返回 `Result`
- 不返回 `null`
- 不返回 `undefined`
- 使用显式资源状态结构，例如：
  - `idle`
  - `loading`
  - `ready`
  - `empty`
  - `error`
- 可选字段统一使用 `Option<T>`

## Core API

- `getTreeRoot()`
- `loadChildren(nodeId, page)`
- `getNodeByPath(path)`
- `getRenderableFileByPath(path)`
- `getHomeContentById(documentId)`
- `getArticleDocumentById(documentId)`
- `getContextInfoByPath(path)`
- `getThemePreference()`
- `setThemePreference(theme)`
- `getOnboardingState()`
- `dismissOnboarding()`
- `getSavedReadingProgress(path)`
- `saveReadingProgress(path, position)`

## Reserved API

- `searchTree(query, cursor)`
- `getNavigationViews()`
- `getTaxonomyTree(viewId, cursor)`

这些接口在 `0.5` 期只定契约，不做 UI。

## Boundary Validation

- repository 读取外部输入时允许使用 `zod`
- repository 对内只输出业务层允许的数据结构
- 任何浏览器原生空值、异常值、非法 JSON 都必须在 adapter 层归一化

## Notes

- tree 索引与文档 payload 分离存储
- `loadChildren` 必须模拟异步按需加载
- `home` 与 `article` 都通过 repository 返回，避免前端维护内容特例
- 偏好层通过 repository 风格 adapter 暴露，不让组件直接访问 `localStorage`
