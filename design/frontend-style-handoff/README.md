# SysFolio Frontend Style Handoff

这套 handoff 只放在 `design` 下，作为前端样式实现的对接基线，不直接写入 `frontend` 仓库。

## 目标

- 对齐前端现有样式栈：`CSS Modules + PostCSS + postcss-apply + @layer`
- 把设计侧的 `tokens / atomic / molecular` 分层变成可落地的 CSS 基线
- 保留你想要的命名偏好：
  - 原子层偏简写
  - 分子层偏业务语义

## 文件说明

- `index.css`
  入口文件，定义 layer 顺序并导入其他样式文件
- `tokens.css`
  语义变量、主题覆盖、组件别名变量
- `atomic.css`
  原子 mixin 与可选 `.u-*` 简写类
- `molecular.css`
  业务语义分子类，覆盖页面骨架和高频组件

## 命名约定

- Token 变量：`--sys-*`
- 原子 mixin：`--u-*`
- 原子简写类：`.u-*`
- 分子类：`.m-*`
- 状态类：`.is-*`

## 分层策略

### 1. tokens

- 只定义语义变量和主题覆盖
- 不直接承担组件结构

### 2. atomic

- 原子 mixin 是前端实现的低层材料层
- mixin 命名短、稳定、可搜索
- 这里同时暴露一套可选 `.u-*` 简写类，方便极少量模板修正
- 页面模板不应堆叠大量 `.u-*`

### 3. molecular

- 分子层承担业务结构和高频模式
- 命名偏业务，例如：
  - `.m-file-tree`
  - `.m-file-node`
  - `.m-content-pane`
  - `.m-home-view`
  - `.m-directory-view`
  - `.m-document-view`
  - `.m-context-panel`
- 分子层内部可以 `@apply --u-*`

### 4. component

- 真正进入前端实现时，`Component.module.css` 只做 feature 特有差异
- 组件层优先复用 `.m-*` 与 `--u-*`
- 不允许跳过分层直接写死 light/dark 色值

## 推荐接入方式

前端后续接入时，建议顺序为：

1. 将 `tokens.css / atomic.css / molecular.css / index.css` 放入 `src/shared/ui/styles`
2. 在应用入口引入 `index.css`
3. 各 feature 的 `Component.module.css` 优先复用分子类结构
4. 只有组件差异化部分留在 module.css

## 组件层写法建议

### 推荐

```css
@layer component {
  .root {
    @apply --u-col;
    @apply --u-gap12;
  }

  .tree {
    composes: m-file-tree from "../../shared/ui/styles/molecular.css";
  }

  .nodeCurrent {
    @apply --u-w6;
  }
}
```

### 不推荐

```css
.root {
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: #f4e8d1;
  color: #433a30;
}
```

## 当前 handoff 的定位

这不是最终前端代码，而是设计侧已经对齐工程约束后的样式基线。它的目标是减少前端在实现时重复做样式架构决策，而不是替代组件开发本身。

当前版本已把中间主内容区拆成统一的 `ContentPane` 多态结构：

- 首页节点使用 `.m-home-view`
- 目录节点使用 `.m-directory-view`
- 文件节点使用 `.m-document-view`
- `PathBar` 保持全局面包屑，不跟中间区绑定
