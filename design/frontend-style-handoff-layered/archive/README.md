# Archive

## 文档目的

这个目录用于存放已经被当前主结构吸收、但仍值得保留的历史专题文档。

这些文档通常属于以下类型：

- 讨论阶段的过渡总纲
- 已拆分进 active docs 的专题说明
- 曾经单独存在、现在已被更高层文档吸收的过程文档

## 使用规则

1. `archive/` 中的文档不再作为当前主规范入口。
2. 当前规范请优先阅读根目录下的 active docs。
3. 如果 archive 中仍有有效信息，应在 active docs 中吸收后再继续引用。
4. archive 文档可以保留原始推导痕迹，但应明确标注为归档文档。

## 当前归档对象

当前已归档的文档包括：

- `overall-design-strategy.md`
- `primitive-inventory.md`
- `visual-refinement-strategy.md`
- `visual-delivery-roadmap.md`
- `responsive-and-multi-input-strategy.md`
- `tree-navigation-pattern.md`
- `toc-activation-strategy.md`
- `page-view-state-strategy.md`

这些主题现在分别由以下 active docs 承接：

- 总体方案与阅读入口：`design-overview.md`、`README.md`
- 当前待办：`design-todo.md`
- primitive 范围与组件合同：`primitive-visual-spec.md`、`primitive-component-catalog.md`
- 状态与 view state：`interaction-state-matrix.md`
- 导航与 TOC：`navigation-state-spec.md`
- 响应式与布局：`layout-behavior-spec.md`
