# Content Model

## 0.5 Scope

- 当前正式 renderer 只有：
  - `home`
  - `article`
- `game`、`media`、`unknown` 只保留类型定义，供文件树和 mock 覆盖使用。
- `richtext` 当前不定义占位策略，也不进入 0.5 行为。

## Node Kind

- `folder`
- `home`
- `article`
- `game`
- `media`
- `unknown`

## Status

- `available`
- `coming_soon`
- `external`

## Core Entities

### `ContentNode`

- 文件系统树上的节点
- 包含：
  - `id`
  - `kind`
  - `status`
  - `title`
  - `slug`
  - `parentId: Option<NodeId>`
  - `ancestorIds`
  - `pathSegments`
  - `childrenCount`
  - `hasChildren`
  - `documentId: Option<DocumentId>`
  - `publishedAt: Option<Timestamp>`
  - `updatedAt: Option<Timestamp>`
  - `readingMinutes: Option<number>`

### `HomeContent`

- 仅供 `HomeRenderer` 使用
- 内容由 repository 返回
- 不复用文章 schema
- 结构由固定 sections 组成，但 section 细节在编码前另行报备
- 仍然作为文件树中的正式内容节点存在

### `ArticleDocument`

- 仅供 `ArticleRenderer` 使用
- `0.5` 期只支持纯文本阅读内容
- 至少包含：
  - `id`
  - `title`
  - `summary`
  - `eyebrow`
  - `toc`
  - `sections`
  - `tags`

### `RenderableContent`

- repository 对外返回的可渲染内容联合
- 至少包含：
  - `home content`
  - `article document`
- 前端不通过特判前端静态配置生成 `home`

### `NavigationView`

- 为未来导航视图切换预留
- `0.5` 期 UI 不实现，但结构先定
- 至少支持：
  - `filesystem`
  - `taxonomy`
  - `timeline`

## Renderer Mapping

- `home + available` -> `HomeRenderer`
- `article + available` -> `ArticleRenderer`
- 其他类型当前不进入正式渲染路径
