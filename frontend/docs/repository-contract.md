# Repository Contract

## Core Rule

- repository 是前端唯一数据访问边界。
- 组件、store、feature 不直接读取 fixtures。
- 边界层负责处理浏览器 API、storage 和未来网络响应。
- 页面层不手动串联“先查 node 再查内容”的两段式流程。

## Return Style

- 对 feature / store / renderer 的公开返回不使用 `Result`
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

- `getRenderableEntryByPath(path)`
- `getTreeRoot()`
- `loadChildren(nodeId, page)`
- `getNodeByPath(path)`
- `getHomeContentById(documentId)`
- `getDirectoryContentByNodeId(nodeId)`
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

## Read Path Rule

### 页面层主读取路径

- 页面、feature、page-level provider 统一使用：
  - `getRenderableEntryByPath(path)`

这个方法负责返回当前 path 对应的可渲染资源，供页面直接消费。

### `getRenderableEntryByPath(path)` Return Shape

- 返回方向固定为页面可直接消费的资源状态：

```ts
type RenderableEntryResource = ResourceState<
  RenderableEntryPayload,
  RepositoryError
>;
```

- 其中：

```ts
type RenderableEntryPayload = {
  node: ContentNode;
  content: RenderableContent;
  context: Option<ContextInfo>;
};
```

- `content` 可以是：
  - `HomeContent`
  - `DirectoryContent`
  - `ArticleDocument`
- 这样页面侧只处理一段式聚合资源，不自己协调双阶段读取。

### repository 内部底层路径

- repository 内部保留两段式读取：
  - `getNodeByPath(path)`
  - `getHomeContentById(documentId)`
  - `getDirectoryContentByNodeId(nodeId)`
  - `getArticleDocumentById(documentId)`

这样可以兼顾：

- 页面层接入简单
- 节点和内容分层清晰
- 响应体不过分大
- 后续后端实现也更自然

## Boundary Validation

- repository 读取外部输入时允许使用 `zod`
- repository 内部 adapter / helper 可以使用 `Result`
- repository 对内只输出业务层允许的数据结构
- 任何浏览器原生空值、异常值、非法 JSON 都必须在 adapter 层归一化

## Notes

- tree 索引与文档 payload 分离存储
- `loadChildren` 必须模拟异步按需加载
- `home`、`directory` 与 `article` 都通过 repository 返回，避免前端维护内容特例
- 页面层只消费聚合读取 helper，不自己做双阶段加载编排
- 偏好层通过 repository 风格 adapter 暴露，不让组件直接访问 `localStorage`
