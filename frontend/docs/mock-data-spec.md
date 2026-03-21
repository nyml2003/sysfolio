# Mock Data Spec

## Strategy

- 不使用 `mockjs`
- 使用 `TS fixtures + generator + in-memory repository`
- 目标不是随机假数据，而是稳定、可复现、可测试的大规模结构化数据
- 执行顺序先小后大：
  - 先用一棵小而完整的树跑通三种渲染态
  - 再补 generator 扩容到 `1000+`

## Data Sources

- 手工 fixtures
  - 根目录
  - 前两层关键节点
  - `home` 内容
  - 典型 `article` 文档
  - 特殊状态样本
- generator
  - 扩容到 `1000+` 节点
  - 维持 `3-5` 层深度
  - 注入可搜索、可懒加载、可分页的数据分布

## Tree Scale

- 第一阶段：
  - 先构建一棵小而完整的样本树
  - 能覆盖 `home / directory / article / empty / unsupported`
- 目标规模：`1000+` 节点
- 深度：`3-5` 层
- 默认仅前两层立即可见
- 第三层及更深层由 repository 模拟按需读取

## Coverage

- 节点种类：
  - `home`
  - `folder`
  - `article`
  - `game`
  - `media`
  - `unknown`
- 状态：
  - `available`
  - `coming_soon`
  - `external`
- 结构样本：
  - 空目录
  - 超长名称
  - 深层目录
  - 同级大量节点
  - 系列文章
- 偏好样本：
  - light / dark
  - 首次引导显示 / 已关闭
  - 已保存 / 未保存阅读进度

## 0.5 Content Defaults

- `HomeContent` 最小结构只有 `title`
- 默认 `home` 样本标题使用：`"首页"`
- `DirectoryContent` 必须至少覆盖：
  - 普通目录
  - 空目录
  - 仅子目录目录
  - 同时包含子目录和文章的目录

## Runtime Simulation

- mock repository 必须支持：
  - `loading`
  - `empty`
  - `error`
  - 可配置延迟
  - 分页返回

## Reserved Structures

- taxonomy
- tag
- timeline view
- search result pagination

这些结构先定数据模型和 fixture 组织方式，不要求 0.5 期做 UI。
