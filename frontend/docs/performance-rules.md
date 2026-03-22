# Performance Rules

> **本文档**：树虚拟化、按需加载、memo、搜索相关复杂度归属。  
> **相关**：[文档索引](./README.md) · [状态管理](./state-management.md) · [架构](./architecture.md)

## Baseline

- 左侧树必须虚拟化
- 深层目录必须按需加载
- 高频渲染组件默认纳入 `memo` 策略
- store 读取必须 selector 化

## Tree Rules

- 默认只读前两层
- 深层节点展开时再读取
- 不在 TSX 中做整树重算
- flatten / merge / expand 推导必须放在纯 TS model

## Memo Rules

- `memo` 只用在高频和长列表组件
- 使用前先确保 props 稳定
- 不做无差别全量包裹

## Search Reservation

- 搜索 UI 虽然不在 `0.5` 期实现，但数据结构必须能承接分页和加载更多
- 搜索 model 的复杂度要留在纯 TS 层，不侵入渲染组件
