# SysFolio Frontend Style Handoff Layered Changelog

## 2026-03-22

### 变更背景

这一版不是视觉重绘，而是在保留现有视觉方向的前提下，先把样式分层语义对齐，解决原 `tokens / atomic / molecular` 结构中“样式抽象”和“组件抽象”混层的问题。

### 本次变更

- 新增并行目录 `frontend-style-handoff-layered`，不覆盖原 `frontend-style-handoff`
- 将原 `atomic.css` 语义重定义为 `utilities.css`
- 将原 `molecular.css` 拆分为：
  - `primitives.css`
  - `patterns.css`
  - `business.css`
- 新增新的入口文件 `index.css`
- 新增新的分层说明文档 `README.md`
- 新增 `responsive-and-multi-input-strategy.md`，补充响应式布局和多端交互设计约束
- 新增 `toc-activation-strategy.md`，定义 TOC 当前项的激活线、到底兜底和正文底部留白策略

### 新分层

新的依赖顺序为：

`tokens -> utilities -> primitives -> patterns -> business -> component`

对应职责：

- `tokens`
  只定义设计变量和主题覆盖
- `utilities`
  只定义低层样式能力，不表达业务语义
- `primitives`
  放基础控件样式
- `patterns`
  放可复用结构模式
- `business`
  放当前产品语义更强的组件和页面视图

### 旧文件到新文件的映射

- `tokens.css` -> `tokens.css`
- `atomic.css` -> `utilities.css`
- `molecular.css` -> `primitives.css + patterns.css + business.css`

### 当前已归位的内容

`primitives.css`

- `.m-button`
- `.m-tag`
- `.m-footnote-popover`

`patterns.css`

- `.m-shell`
- `.m-content-pane`
- `.m-reading-pane`
- `.m-doc-header`
- `.m-progress-notice`
- `.m-article-body`
- `.m-code-block`
- `.m-toc`
- `.m-empty-state`

`business.css`

- `.m-path-bar`
- `.m-theme-toggle`
- `.m-file-tree`
- `.m-file-node`
- `.m-home-view`
- `.m-directory-view`
- `.m-document-view`
- `.m-context-panel`
- `.m-onboarding-hints`

### 本轮没有做的事

- 没有修改现有 token 数值
- 没有大规模改 selector 命名
- 没有重绘现有视觉风格
- 没有新增完整基础组件库
- 没有把移动端交互模式设计完整

### 视觉侧仍待设计的内容

1. 基础控件视觉规范还不完整。
当前只有按钮、标签和少量浮层样式；`Input`、`IconButton`、`Field`、`Menu`、`Dialog` 等基础控件还没有统一视觉定义。

2. 交互状态矩阵还没补齐。
目前主要覆盖了 `hover / focus / selected`，但 `active / disabled / loading / success / error` 还没有系统化。

3. 左右栏在中小屏下的行为还只是工程占位。
当前是 `1120px` 隐藏右栏、`800px` 隐藏左栏，这只是临时响应式策略，不是完整移动端方案。

4. 树状导航和路径栏的层级关系还可以再收敛。
现在能用，但“当前位置、选中态、搜索命中态、导航可点击态”之间的视觉区分还可以再拉开一点。

5. 业务视图的版式密度还没做最终校准。
`home / directory / document` 三类视图的标题权重、段落节奏、列表密度已经有基线，但还不是最终视觉稿级别。

6. 深色主题需要做一轮对比度复核。
token 已有 dark theme 覆盖，但还没做完整的对比度和长文阅读舒适度检查。

7. 动效规则还是弱定义。
现在只有基础 transition token，没有正式定义页面切换、树节点展开、面板显隐和 onboarding 的节奏。

### 给前端的说明

- 这版目录的重点是“分层清晰”，不是“视觉已冻结”
- 如果前端开始接入，优先按新的 layer 关系组织文件
- 不建议再往 `utilities` 塞业务语义
- 不建议让 `primitives` 直接绑定业务数据结构
- 如果后续确认这套结构成立，再考虑是否做第二轮 selector 和前缀收敛

### 当前判断

这一轮已经足够给前端讨论样式架构，但还不应该被视为最终视觉定稿。  
更准确地说：样式组织方式已经可以讨论接入，视觉细节还需要继续设计。
