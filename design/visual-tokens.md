# SysFolio 视觉 Token

## 1. 使用说明

这份文档用于把 `filesystem-reading-page-v0.5.md` 与 `filesystem-reading-page-v1.md` 里的视觉方向收敛成可实现的设计 token。

版本约定：

- `0.5 期` 关注阅读基线、文件树浏览、轻量搜索和三栏骨架。
- `1 期` 在同一套 token 体系上补充树内统一搜索与高级筛选。
- 本文档默认提供共享 token；只有在 1 期新增能力需要时，才增加新的语义变量。

设计原则：

- 先保证阅读，再强化文件系统隐喻。
- 先保证层级，再增加装饰。
- 先使用语义 token，再决定组件外观。

基础方案默认采用浅色为主、深色同步支持的双主题方案，基于现有 `Work Context Day`、`Work Context Care`、`Work Context Night` 与 `Work Context Focus` 主题收敛而成。

## 2. 色彩系统

### 2.1 基础背景与面板

| Token | Value | 用途 |
| --- | --- | --- |
| `--sys-color-canvas` | `#FBF3DE` | 主阅读区背景，页面主底色 |
| `--sys-color-canvas-soft` | `#F7EFD9` | 局部阅读区、轻分组背景 |
| `--sys-color-panel` | `#F4E8D1` | 侧栏、抽屉、浮层主体背景 |
| `--sys-color-panel-alt` | `#EDE2C6` | 左树、路径栏、状态条背景 |
| `--sys-color-panel-strong` | `#E7DBC0` | 分区头部、强调型面板背景 |
| `--sys-color-surface-hover` | `#EFE1C7` | hover 背景 |
| `--sys-color-surface-active` | `#E7D9BE` | active / selected 背景 |

### 2.2 描边与分隔

| Token | Value | 用途 |
| --- | --- | --- |
| `--sys-color-border-subtle` | `#E2D4BB` | 低存在感分割线 |
| `--sys-color-border-default` | `#D9CAB0` | 面板、输入框、代码块描边 |
| `--sys-color-border-strong` | `#BCAF97` | 激活边界、局部强调 |
| `--sys-color-focus-ring` | `#7487D8` | 键盘焦点环 |

### 2.3 文本与图标

| Token | Value | 用途 |
| --- | --- | --- |
| `--sys-color-text-primary` | `#433A30` | 标题、正文、主信息 |
| `--sys-color-text-secondary` | `#51463A` | 次级标题、路径、标签文本 |
| `--sys-color-text-muted` | `#847765` | 辅助说明、图标、注释 |
| `--sys-color-text-faint` | `#9C8F7C` | 占位、未激活信息 |
| `--sys-color-text-inverse` | `#F9F1E4` | 深背景上的文字 |
| `--sys-color-icon-default` | `#847765` | 默认图标 |
| `--sys-color-icon-active` | `#564A3C` | 当前态图标 |

### 2.4 品牌与语义强调

| Token | Value | 用途 |
| --- | --- | --- |
| `--sys-color-accent` | `#7487D8` | 主交互、选中、链接 |
| `--sys-color-accent-hover` | `#8597E2` | 主交互 hover |
| `--sys-color-accent-soft` | `#DCE3FA` | 链接背景、焦点底 |
| `--sys-color-warm` | `#A3722D` | 阅读进度、章节定位、提醒 |
| `--sys-color-warm-soft` | `#F1E2C8` | 暖色提示底 |
| `--sys-color-success` | `#7E9D63` | 可用、完成、成功 |
| `--sys-color-success-soft` | `#E4ECD8` | 成功态背景 |
| `--sys-color-danger` | `#C75E74` | 错误、风险、无效 |
| `--sys-color-danger-soft` | `#F3DDE3` | 错误态背景 |
| `--sys-color-info` | `#7F94C1` | 中性信息、外部资源 |
| `--sys-color-info-soft` | `#E0E6F2` | 信息态背景 |

### 2.5 内容专用颜色

| Token | Value | 用途 |
| --- | --- | --- |
| `--sys-color-link` | `#6F82D1` | 正文链接 |
| `--sys-color-link-hover` | `#5F73C7` | 正文链接 hover |
| `--sys-color-code-bg` | `#F0E3CB` | 代码块背景 |
| `--sys-color-code-border` | `#D9CAB0` | 代码块描边 |
| `--sys-color-code-text` | `#3A352E` | 代码文本 |
| `--sys-color-inline-code-bg` | `#EBDDC3` | 行内代码背景 |
| `--sys-color-quote-border` | `#A3722D` | 引用块左侧标记 |
| `--sys-color-selection` | `#E6D7BC` | 选中文本背景 |
| `--sys-color-search-highlight` | `#F1E2C8` | 文件树搜索命中背景 |
| `--sys-color-search-highlight-text` | `#433A30` | 搜索命中文字 |
| `--sys-color-filter-chip-bg` | `#EBDDC3` | 已生效筛选条件背景 |
| `--sys-color-filter-chip-text` | `#51463A` | 已生效筛选条件文字 |
| `--sys-color-filter-chip-border` | `#D9CAB0` | 已生效筛选条件描边 |
| `--sys-color-filter-divider` | `#E2D4BB` | 筛选组分隔线 |
| `--sys-color-result-dimmed` | `#C7BCA9` | 非命中节点弱化态 |
| `--sys-color-current-out-of-filter` | `#A3722D` | 当前阅读但不在结果中的提示色 |
| `--sys-color-onboarding-dot` | `rgba(116, 135, 216, 0.72)` | 新手引导提示点 |
| `--sys-color-onboarding-dot-ring` | `rgba(251, 243, 222, 0.82)` | 引导提示点外环 |
| `--sys-color-onboarding-popover` | `#F4E8D1` | 引导说明浮层 |
| `--sys-color-onboarding-scrim` | `rgba(67, 58, 48, 0.08)` | 引导层轻遮罩 |

### 2.6 使用规则

- 页面背景只使用 `canvas` 系列，不用纯白。
- 面板之间最多使用 2 个明度层级，避免切得太碎。
- 蓝色只给可交互内容和当前状态，不给大面积装饰。
- 赭色只表达“阅读定位”与“温和提醒”，不混用为主按钮色。
- 红色只保留给错误、失败、不可用，不参与普通层级。

### 2.7 夜间主题覆盖

以下为深色模式下的语义 token 覆盖值：

| Token | Dark Value | 用途 |
| --- | --- | --- |
| `--sys-color-canvas` | `#2E333B` | 主阅读区背景 |
| `--sys-color-canvas-soft` | `#30353D` | 局部阅读区背景 |
| `--sys-color-panel` | `#2A2E36` | 面板背景 |
| `--sys-color-panel-alt` | `#24272D` | 左树、路径栏背景 |
| `--sys-color-panel-strong` | `#31363F` | 分区头部背景 |
| `--sys-color-surface-hover` | `#343942` | hover 背景 |
| `--sys-color-surface-active` | `#393F49` | active / selected 背景 |
| `--sys-color-border-subtle` | `#424853` | 低存在感分割线 |
| `--sys-color-border-default` | `#444B57` | 默认描边 |
| `--sys-color-border-strong` | `#596270` | 强描边 |
| `--sys-color-focus-ring` | `#88A3F7` | 焦点环 |
| `--sys-color-text-primary` | `#E0E5EC` | 主文本 |
| `--sys-color-text-secondary` | `#C5CAD3` | 次级文本 |
| `--sys-color-text-muted` | `#8C94A1` | 辅助文本 |
| `--sys-color-text-faint` | `#69727F` | 更弱辅助文本 |
| `--sys-color-text-inverse` | `#17191E` | 反色文本 |
| `--sys-color-icon-default` | `#8C94A1` | 默认图标 |
| `--sys-color-icon-active` | `#E0E5EC` | 激活图标 |
| `--sys-color-accent` | `#88A3F7` | 主交互 |
| `--sys-color-accent-hover` | `#9AB0FB` | 主交互 hover |
| `--sys-color-accent-soft` | `#34415F` | 轻强调底色 |
| `--sys-color-warm` | `#D9B574` | 阅读定位 |
| `--sys-color-warm-soft` | `#4C402A` | 暖色提示底 |
| `--sys-color-success` | `#8FBF8A` | 成功态 |
| `--sys-color-success-soft` | `#314035` | 成功态背景 |
| `--sys-color-danger` | `#E1848F` | 风险态 |
| `--sys-color-danger-soft` | `#4B3137` | 风险态背景 |
| `--sys-color-info` | `#9FB0DA` | 信息态 |
| `--sys-color-info-soft` | `#313A4C` | 信息态背景 |
| `--sys-color-link` | `#9CB4FF` | 正文链接 |
| `--sys-color-link-hover` | `#B1C2FF` | 正文链接 hover |
| `--sys-color-code-bg` | `#2A2E36` | 代码块背景 |
| `--sys-color-code-border` | `#444B57` | 代码块描边 |
| `--sys-color-code-text` | `#D8DDE4` | 代码文本 |
| `--sys-color-inline-code-bg` | `#333840` | 行内代码背景 |
| `--sys-color-quote-border` | `#D9B574` | 引用块标记 |
| `--sys-color-selection` | `#404651` | 选中文本背景 |
| `--sys-color-search-highlight` | `#4C402A` | 搜索命中背景 |
| `--sys-color-search-highlight-text` | `#E0E5EC` | 命中文字 |
| `--sys-color-filter-chip-bg` | `#333840` | 已生效筛选条件背景 |
| `--sys-color-filter-chip-text` | `#C5CAD3` | 已生效筛选条件文字 |
| `--sys-color-filter-chip-border` | `#444B57` | 已生效筛选条件描边 |
| `--sys-color-filter-divider` | `#424853` | 筛选组分隔线 |
| `--sys-color-result-dimmed` | `#5E6673` | 非命中节点弱化态 |
| `--sys-color-current-out-of-filter` | `#D9B574` | 当前阅读但不在结果中的提示色 |
| `--sys-color-onboarding-dot` | `rgba(136, 163, 247, 0.78)` | 引导提示点 |
| `--sys-color-onboarding-dot-ring` | `rgba(23, 25, 30, 0.82)` | 引导点外环 |
| `--sys-color-onboarding-popover` | `#2A2E36` | 引导说明浮层 |
| `--sys-color-onboarding-scrim` | `rgba(23, 25, 30, 0.18)` | 引导层轻遮罩 |

### 2.8 代码高亮语义颜色

代码高亮沿用 VS Code 式语义，但保持较低噪声：

| Token | Light | Dark | 用途 |
| --- | --- | --- | --- |
| `--sys-code-keyword` | `#8973C1` | `#C4A1F6` | 关键字 |
| `--sys-code-function` | `#7487D8` | `#88A3F7` | 函数名 |
| `--sys-code-type` | `#8B7EC0` | `#A99EDC` | 类型名 |
| `--sys-code-string` | `#B66F58` | `#D8B4A0` | 字符串 |
| `--sys-code-number` | `#A3722D` | `#D9B574` | 数字 |
| `--sys-code-variable` | `#3A352E` | `#E0E5EC` | 变量 |
| `--sys-code-comment` | `#998B79` | `#69707C` | 注释 |

## 3. 字体与排版

### 3.1 字体角色

| Token | 建议值 | 用途 |
| --- | --- | --- |
| `--sys-font-body` | `"Source Han Sans SC", "Noto Sans SC", "PingFang SC", sans-serif` | 正文阅读 |
| `--sys-font-ui` | `"IBM Plex Sans", "Noto Sans SC", sans-serif` | 导航、标签、面板 |
| `--sys-font-mono` | `"JetBrains Mono", "Maple Mono", monospace` | 路径、代码、文件名 |

说明：

- 如果前端不便引入三套字体，至少保留 `body` 与 `mono` 的区分。
- 中文环境下，正文优先保证字面稳定和段落节奏，不追求过强技术感。
- 正文默认采用无衬线字体，不再使用书卷感较强的衬线体路线。

### 3.2 字号系统

| Token | Value | 用途 |
| --- | --- | --- |
| `--sys-font-size-11` | `0.6875rem` | 极小说明，不建议正文使用 |
| `--sys-font-size-12` | `0.75rem` | 标签、路径辅助文本 |
| `--sys-font-size-13` | `0.8125rem` | 侧栏节点、次要元信息 |
| `--sys-font-size-14` | `0.875rem` | UI 默认字号 |
| `--sys-font-size-16` | `1rem` | 正文基础字号 |
| `--sys-font-size-18` | `1.125rem` | 导语、强调段 |
| `--sys-font-size-24` | `1.5rem` | 二级标题 |
| `--sys-font-size-32` | `2rem` | 页面主标题 |
| `--sys-font-size-40` | `2.5rem` | 长文头图标题上限 |

### 3.3 行高系统

| Token | Value | 用途 |
| --- | --- | --- |
| `--sys-line-height-tight` | `1.25` | 标签、标题、按钮 |
| `--sys-line-height-ui` | `1.45` | 导航、面板文本 |
| `--sys-line-height-body` | `1.78` | 正文 |
| `--sys-line-height-body-loose` | `1.92` | 长段落阅读、引用 |

### 3.4 字重系统

| Token | Value | 用途 |
| --- | --- | --- |
| `--sys-font-weight-regular` | `400` | 常规文本 |
| `--sys-font-weight-medium` | `500` | 导航、标签、元信息 |
| `--sys-font-weight-semibold` | `600` | 分区标题、当前文件 |
| `--sys-font-weight-bold` | `700` | 主标题 |

### 3.5 正文排版约束

- 正文基础字号默认 `16px`，大屏可放宽到 `17px`。
- 主正文行宽控制在 `60ch` 到 `80ch`，默认目标值为 `72ch`。
- 段间距默认不小于 `1.2em`。
- 一级标题与正文之间留出明显呼吸区，不使用编辑器式紧密排布。
- 列表、引用、代码块和脚注必须与段落形成可见分组。

## 4. 间距系统

### 4.1 间距刻度

| Token | Value |
| --- | --- |
| `--sys-space-2` | `0.125rem` |
| `--sys-space-4` | `0.25rem` |
| `--sys-space-6` | `0.375rem` |
| `--sys-space-8` | `0.5rem` |
| `--sys-space-10` | `0.625rem` |
| `--sys-space-12` | `0.75rem` |
| `--sys-space-16` | `1rem` |
| `--sys-space-20` | `1.25rem` |
| `--sys-space-24` | `1.5rem` |
| `--sys-space-32` | `2rem` |
| `--sys-space-40` | `2.5rem` |
| `--sys-space-48` | `3rem` |
| `--sys-space-64` | `4rem` |

### 4.2 使用规则

- 同类组件优先使用统一内边距，不在单个组件里随意发明尺寸。
- 侧栏项目间距用 `8` 或 `12`，正文区块间距用 `24` 或 `32`。
- 大块内容之间用 `40` 或 `48` 建立节奏，避免连续中等间距导致结构发虚。

## 5. 圆角、描边、阴影

### 5.1 圆角

| Token | Value | 用途 |
| --- | --- | --- |
| `--sys-radius-4` | `0.25rem` | 小标签、代码块小元素 |
| `--sys-radius-8` | `0.5rem` | 按钮、输入框、卡片 |
| `--sys-radius-12` | `0.75rem` | 浮层、面板卡片 |
| `--sys-radius-16` | `1rem` | 大型空态容器 |
| `--sys-radius-pill` | `999px` | 标签与状态点 |

### 5.2 描边

| Token | Value |
| --- | --- |
| `--sys-border-width-1` | `1px` |
| `--sys-border-width-2` | `2px` |

默认策略：

- 绝大多数组件使用 `1px` 描边。
- 当前选中、拖入态或焦点态可使用 `2px` 外环，不加粗组件自身边框。

### 5.3 阴影

| Token | Value | 用途 |
| --- | --- | --- |
| `--sys-shadow-soft` | `0 8px 24px rgba(67, 58, 48, 0.08)` | 浮层、抽屉 |
| `--sys-shadow-panel` | `0 4px 12px rgba(67, 58, 48, 0.05)` | 悬浮面板 |
| `--sys-shadow-none` | `none` | 默认容器 |

规则：

- 页面主体区域默认不依赖阴影建立层级。
- 阴影只给浮层和脱离文流的面板，不给普通卡片堆视觉重量。

## 6. 动效 Token

| Token | Value | 用途 |
| --- | --- | --- |
| `--sys-duration-fast` | `120ms` | hover、图标反馈 |
| `--sys-duration-base` | `180ms` | 面板切换、选中变化 |
| `--sys-duration-slow` | `260ms` | 抽屉开合、内容切换 |
| `--sys-duration-overlay` | `160ms` | 新手引导提示层淡入淡出 |
| `--sys-ease-standard` | `cubic-bezier(0.2, 0, 0, 1)` | 默认 |
| `--sys-ease-emphasized` | `cubic-bezier(0.2, 0.8, 0.2, 1)` | 层级切换 |

规则：

- 阅读区切换不超过 `260ms`。
- hover 反馈不超过 `120ms`。
- 支持 `prefers-reduced-motion`，在减少动画时保留状态切换，取消位移和渐入渐出叠加。

## 7. 布局 Token

| Token | Value | 用途 |
| --- | --- | --- |
| `--sys-layout-max-width` | `1600px` | 页面整体最大宽度 |
| `--sys-layout-left-rail` | `280px` | 桌面端左栏 |
| `--sys-layout-right-rail` | `280px` | 桌面端右栏 |
| `--sys-layout-reading-max` | `820px` | 正文容器上限 |
| `--sys-layout-reading-measure-min` | `60ch` | 正文最小字符行宽 |
| `--sys-layout-reading-measure-max` | `80ch` | 正文最大字符行宽 |
| `--sys-layout-pathbar-height` | `48px` | 顶部路径栏 |
| `--sys-layout-header-offset` | `64px` | 吸顶定位补偿 |
| `--sys-layout-tree-search-height` | `36px` | 文件树搜索框高度 |
| `--sys-layout-tree-filter-max-height` | `18rem` | 左栏筛选区最大高度 |

## 8. 语义映射建议

组件层不要直接引用原始色值，优先用语义 token：

- 页面背景用 `canvas`
- 面板背景用 `panel`
- 文本主色用 `text-primary`
- 当前选中用 `accent` + `surface-active`
- 风险提示用 `danger` + `danger-soft`
- 未上线内容用 `text-muted` + `panel-alt`
- 已生效筛选条件用 `filter-chip-*`
- 当前阅读但不在结果中用 `current-out-of-filter`

## 9. 可访问性底线

- 正文文本与背景对比度不低于 WCAG AA。
- 辅助文本只用于非关键内容，不承载核心决策信息。
- 焦点态必须独立于 hover 态存在。
- 颜色不能成为状态识别的唯一方式，选中和警告都需要同时具备形态变化。

## 10. 工程映射建议

前端实现时建议保留两层命名：

- 原始变量层：`--sys-color-*`、`--sys-space-*`、`--sys-radius-*`
- 组件映射层：`--file-tree-node-bg-active`、`--toc-item-text-active` 之类

这样可以在不修改设计 token 的前提下做局部组件微调。
