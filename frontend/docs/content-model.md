# Content Model

> **本文档**：内容实体、节点 kind、渲染态与 `0.5` 范围。  
> **相关**：[文档索引](./README.md) · [repository 契约](./repository-contract.md) · [mock](./mock-data-spec.md)

## 0.5 Scope

- 当前正式中心区渲染态只有：
  - `home`
  - `directory`
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
- `0.5` 期先做极简模型
- 最小结构固定为：
  - `title: string`
- `0.5` 期默认值为：`"首页"`
- 仍然作为文件树中的正式内容节点存在

### `DirectoryContent`

- 仅供 `DirectoryView` 使用
- 由 repository 聚合返回
- `0.5` 期采用最小结构
- 最小结构固定为：
  - `title: string`
  - `description: Option<string>`
  - `children: DirectoryChildSummary[]`

### `DirectoryChildSummary`

- 目录页里展示的一层子项摘要
- 最小结构固定为：
  - `id`
  - `kind`
  - `status`
  - `title`
  - `slug`
  - `description: Option<string>`
  - `publishedAt: Option<Timestamp>`

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

## Deferred Fields

- `tags` 不进入 `0.5` 期文章模型
- 等 taxonomy / tag 关系真正确定后再补入文章模型

### `RenderableContent`

- repository 对外返回的可渲染内容联合
- 至少包含：
  - `home content`
  - `directory content`
  - `article document`
- 前端不通过特判前端静态配置生成 `home`

### `RenderableFilePayload`

- 页面级聚合读取 helper 的返回值核心数据
- 最小结构固定为：
  - `node: ContentNode`
  - `content: RenderableContent`
  - `context: Option<ContextInfo>`
- 页面层只消费这个聚合结构，不自己拼装 node 和内容详情

### `NavigationView`

- 为未来导航视图切换预留
- `0.5` 期 UI 不实现，但结构先定
- 至少支持：
  - `filesystem`
  - `taxonomy`
  - `timeline`

## Renderer Mapping

- `home + available` -> `HomeRenderer`
- `folder + available` -> `DirectoryView`
- `article + available` -> `ArticleRenderer`
- 其他类型当前不进入正式渲染路径
