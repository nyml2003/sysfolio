# Search And Tag Navigation

> **本文档**：搜索/标签/时间线导航的**数据与契约预留**，`0.5` 不定 UI。  
> **相关**：[文档索引](./README.md) · [架构范围](./architecture.md) · [repository 预留 API](./repository-contract.md)

## 0.5 Scope

- `0.5` 期不实现搜索 UI
- `0.5` 期不实现标签树 UI
- 当前只定义可扩展的数据结构和 repository 契约

## Search Contract

- 未来搜索支持：
  - 分页
  - 加载更多
  - 异步延迟
  - 高亮范围
  - 祖先链信息
- 返回方向：
  - `total`
  - `nextCursor`
  - 命中节点最小信息
  - `ancestorIds`
  - 高亮信息
- 不返回可渲染树行

## Search Responsibility Split

- repository
  - 返回命中节点与祖先链
- tree model
  - 推导展开建议
  - 合并结果与当前树状态
- FileTree UI
  - 只消费处理后的渲染数据

## Navigation Expansion

- 左侧未来不仅支持文件系统树，还要支持其他导航视图
- 至少预留：
  - `filesystem`
  - `taxonomy`
  - `timeline`

## Taxonomy / Tag Rule

- taxonomy 和 tag 当前不拍死最终产品关系
- 只要求数据结构可扩展到：
  - 第一层分类
  - 第二层子分类
  - 时间分组
  - 标签聚合
- `0.5` 期不把 taxonomy/tag 混入文件系统树 UI
