# SysFolio 通用组件样式指南 v1

## 1. 使用原则

这份文档定义首版文件系统式阅读页的通用组件外观与交互规则。

组件设计优先级：

1. 阅读稳定性
2. 信息层级
3. 文件系统隐喻
4. 视觉个性

默认引用 [`visual-tokens.md`](./visual-tokens.md) 中的 token，不直接写死色值到组件规则里。

所有组件都必须同时适配浅色与深色主题；组件层禁止直接写死“只适用于浅色”的背景和文字关系。

## 2. 全局布局约束

### 2.1 页面容器

- 页面整体最大宽度使用 `--sys-layout-max-width`。
- 桌面端采用三栏布局：`280 / minmax(0, 820px) / 280`。
- 页面左右安全边距桌面端使用 `24px`，大屏可放宽到 `32px`。
- 主内容区垂直内边距不小于 `32px`。
- 正文阅读宽度需落在 `60ch` 到 `80ch` 之间。

### 2.2 栏位层级

- 左栏和右栏是辅助结构，不与正文抢主位。
- 中栏必须在颜色、留白和宽度上成为页面重心。
- 所有固定栏位都需要有稳定分隔线，避免结构塌陷。

## 3. OnboardingHints

### 3.1 作用

- 在首次访问时用最少的干预解释页面三区职责。
- 降低文件系统容器心智的首次理解门槛。

### 3.2 结构

引导层包含：

- `HintDot[FileTree]`
- `HintDot[ReadingPane]`
- `HintDot[PathBar]`
- 单实例说明浮层 `HintPopover`

### 3.3 外观

| 项目 | 规则 |
| --- | --- |
| 遮罩 | `onboarding-scrim`，透明度轻，不压暗正文到不可读 |
| 提示点尺寸 | `12px` 实心点 + `24px` 外环命中区 |
| 提示点颜色 | `onboarding-dot` |
| 提示点外环 | `onboarding-dot-ring` |
| 浮层背景 | `onboarding-popover` |
| 浮层边框 | `1px solid border-default` |
| 浮层圆角 | `radius-12` |
| 浮层文字 | `font-ui`, `13px`, `text-primary` |

### 3.4 交互

- 默认只显示 3 个提示点，不默认展开文案。
- 点击某个提示点时，仅展开当前提示点的文案。
- 点击页面空白处时关闭整个引导层，并记为已完成。
- 引导层只在首次进入时自动显示一次。
- 首次点击文件夹或文件时不再补充提示。

## 4. PathBar

### 4.1 作用

- 提示当前路径。
- 承担轻量返回语义。
- 强化“当前已打开文件”的状态。

### 4.2 外观

| 项目 | 规则 |
| --- | --- |
| 高度 | `48px` |
| 背景 | `panel-alt` |
| 下边框 | `1px solid border-default` |
| 文本 | `font-ui`, `13px`, `text-secondary` |
| 当前节点 | `text-primary` + `font-weight-semibold` |
| 分隔符 | `icon-default` |
| 右侧工具区 | 保留 `ThemeToggle` 与少量辅助入口 |

### 4.3 交互

- 父级路径 hover 时仅改变文字颜色，不出现大面积底色。
- 当前文件节点不可表现得像主按钮。
- 当路径过长时，中间层级省略，保留根目录、上一级、当前文件。
- 主题切换按钮放在路径栏最右侧，不侵入文件路径阅读顺序。

## 5. FileTree

### 5.1 容器

| 项目 | 规则 |
| --- | --- |
| 背景 | `panel-alt` |
| 右边框 | `1px solid border-default` |
| 内边距 | `16px 12px` |
| 滚动条 | 使用细滚动条，颜色接近 `text-faint` |

### 5.1.1 TreeSearchField

| 项目 | 规则 |
| --- | --- |
| 高度 | `36px` |
| 背景 | `panel` |
| 边框 | `1px solid border-default` |
| 圆角 | `radius-8` |
| 字体 | `font-ui`, `13px` |
| 占位文字 | `text-faint` |
| 与节点列表间距 | `12px` |

### 5.2 分区标题

- 使用 `font-ui`，`12px`，`font-weight-semibold`。
- 字色使用 `text-muted`。
- 与节点列表之间保留 `8px` 间距。

### 5.3 FileNode 结构

单个节点由四个部分组成：

- 展开箭头或缩进占位
- 类型图标
- 文件名
- 状态标记

节点高度建议：

- 常规节点：`32px`
- 紧凑节点：`28px`

默认 v1 使用 `32px`，保证点击区域和可读性。

### 5.4 FileNode 状态

| 状态 | 背景 | 文本 | 图标 | 其他 |
| --- | --- | --- | --- | --- |
| default | transparent | text-secondary | icon-default | 无边框 |
| hover | surface-hover | text-primary | icon-active | `radius-8` |
| selected | surface-active | text-primary | accent | 左侧 `2px` accent 标记 |
| focus-visible | accent-soft | text-primary | accent | 外侧 focus ring |
| disabled | transparent | text-faint | text-faint | 不响应 hover |
| coming-soon | transparent | text-muted | text-muted | 右侧显示小状态点 |
| search-match | search-highlight | search-highlight-text | icon-active | 命中字符高亮 |

### 5.5 使用规则

- 图标不可大于文字视觉权重。
- 当前选中态允许使用左侧竖条，但不要整行高饱和填满。
- 文件夹与文件只通过图标和缩进区分，不额外引入拟真的“文件卡片”。
- `coming_soon` 文件可点击进入空态，但需在树中显示轻量提示。
- 默认展开前 2 层目录，第 3 层及更深层级折叠。
- 首屏只加载前 2 层树节点；更深层节点在展开父目录时按需加载。
- 搜索状态下自动展开命中节点祖先路径；清空搜索后回到默认展开策略。

## 6. ReadingPane

### 6.1 容器

| 项目 | 规则 |
| --- | --- |
| 背景 | `canvas` |
| 宽度 | `minmax(0, 820px)` |
| 水平内边距 | `32px` |
| 垂直内边距 | `40px` 到 `48px` |
| 正文测量宽度 | `60ch` 到 `80ch`，目标值 `72ch` |

### 6.2 结构

ReadingPane 由以下部分组成：

- `DocumentHeader`
- `ProgressRestoreNotice`
- `ArticleBody`
- `DocumentFooter`

这三个区域之间使用明显的垂直节奏分隔，不靠粗线切断。

### 6.3 基础行为

- 默认允许原生文本选择与复制。
- 恢复阅读位置后，`ProgressRestoreNotice` 在顶部轻量出现，不遮挡正文。

## 7. DocumentHeader

### 7.1 结构

- 文件类型与路径提示
- 主标题
- 元信息行
- 摘要或导语

### 7.2 外观规则

| 项目 | 规则 |
| --- | --- |
| 文件类型提示 | `font-mono`, `12px`, `text-muted` |
| 主标题 | `32px`, `font-weight-bold`, `text-primary` |
| 元信息 | `font-ui`, `13px`, `text-muted` |
| 导语 | `18px`, `text-secondary`, `line-height-body` |

### 7.3 间距规则

- 文件类型提示与主标题之间：`8px`
- 主标题与元信息之间：`12px`
- 元信息与导语之间：`16px`
- Header 与正文之间：`32px`

## 8. ProgressRestoreNotice

### 8.1 作用

- 在自动恢复阅读位置后提示用户当前位置已恢复。
- 提供轻量“回到顶部”入口。

### 8.2 外观

| 项目 | 规则 |
| --- | --- |
| 背景 | `panel` |
| 边框 | `1px solid border-default` |
| 圆角 | `radius-8` |
| 字体 | `font-ui`, `13px` |
| 文本 | `text-secondary` |
| 行为按钮 | 次按钮风格，文案不超过 2 个 |

## 9. ArticleBody

### 9.1 段落

| 项目 | 规则 |
| --- | --- |
| 字体 | `font-body` |
| 字号 | `16px` |
| 行高 | `1.8` |
| 颜色 | `text-primary` |
| 段间距 | `1.2em` |

### 9.2 标题

| 元素 | 字号 | 间距策略 |
| --- | --- | --- |
| `h2` | `24px` | 上 `40px`，下 `16px` |
| `h3` | `18px` | 上 `32px`，下 `12px` |
| `h4` | `16px` | 上 `24px`，下 `8px` |

规则：

- 文内标题不要过度装饰。
- 不使用夸张彩色下划线和厚重背景。
- 当前章节被右侧目录高亮时，正文标题本身只做轻微定位感增强。

### 9.3 链接

| 状态 | 规则 |
| --- | --- |
| default | `link`, 细下划线 |
| hover | `link-hover`, 下划线加深 |
| focus-visible | `accent-soft` 背景 + focus ring |
| visited | 保持与默认接近，不引入强紫色 |

### 9.4 行内代码

- 背景：`inline-code-bg`
- 文字：`code-text`
- 字体：`font-mono`
- 圆角：`radius-4`
- 内边距：`2px 6px`

### 9.5 代码块

| 项目 | 规则 |
| --- | --- |
| 背景 | `code-bg` |
| 边框 | `1px solid code-border` |
| 圆角 | `radius-12` |
| 内边距 | `16px` |
| 字体 | `font-mono`, `14px` |
| 行高 | `1.6` |

代码块不做编辑器 tab 条，不做仿终端红黄绿按钮。

语法高亮要求：

- 关键字、函数、类型、字符串、数字、变量、注释分别映射到 `visual-tokens.md` 中的代码语义 token。
- 高亮对比度低于 IDE 默认强度，避免代码块成为页面最响的区域。
- 浅色和深色主题切换时，同步切换代码高亮语义色。

### 9.6 引用块

| 项目 | 规则 |
| --- | --- |
| 左侧标记 | `3px solid quote-border` |
| 背景 | `warm-soft` 或 `canvas-soft`，保持轻微区分 |
| 文字 | `text-secondary` |
| 内边距 | `16px 20px` |
| 圆角 | `radius-8` |

### 9.7 脚注

桌面端：

- hover 或 focus 脚注引用时显示 `FootnotePopover`。
- 悬浮层宽度不超过 `320px`。
- 浮层位置优先贴近引用点，避免遮挡当前行。

移动端：

- 不使用 hover。
- 点击脚注引用后，改为行内展开或底部面板显示。

## 10. ContextPanel

### 10.1 容器

| 项目 | 规则 |
| --- | --- |
| 背景 | `panel` |
| 左边框 | `1px solid border-default` |
| 内边距 | `20px 16px` |

### 10.2 信息模块

右栏按模块分组：

- `TableOfContents`
- `MetadataBlock`
- `SeriesBlock`
- `ReadingProgress`

模块间距使用 `24px`，不使用厚重卡片套卡片。

### 10.3 分组标题

- `font-ui`
- `12px`
- `font-weight-semibold`
- `text-muted`
- 全大写可选，但中文环境下默认不用全大写风格模拟

## 11. TableOfContents

### 11.1 项目样式

| 状态 | 背景 | 文本 | 其他 |
| --- | --- | --- | --- |
| default | transparent | text-secondary | 无标记 |
| hover | transparent | text-primary | 左侧轻点亮 |
| active | warm-soft | text-primary | 左侧 `2px` warm 标记 |
| focus-visible | accent-soft | text-primary | focus ring |

### 11.2 排版

- 一级目录 `13px`
- 二级目录 `12px`
- 超过二级后默认折叠，不在右栏展开深层树
- 行高使用 `1.45`

### 11.3 规则

- TOC 是定位器，不是第二份正文摘要。
- 当前章节高亮必须克制，不能像告警信息。

## 12. Tag 与状态标签

### 12.1 普通 Tag

| 项目 | 规则 |
| --- | --- |
| 背景 | `panel-alt` |
| 文字 | `text-secondary` |
| 边框 | `1px solid border-default` |
| 圆角 | `pill` |
| 内边距 | `4px 10px` |
| 字号 | `12px` |

### 12.2 文件类型标签

| 类型 | 背景 | 文字 |
| --- | --- | --- |
| article | `accent-soft` | `accent` |
| game | `warm-soft` | `warm` |
| media | `info-soft` | `info` |
| coming-soon | `panel-alt` | `text-muted` |

规则：

- 标签用于补充语义，不代替标题或状态文案。
- 同一区域不连续堆超过 4 个标签。

## 13. EmptyState

### 13.1 适用场景

- `game` 文件未开放
- `media` 文件未开放
- 空目录
- 未知类型文件

### 13.2 外观

| 项目 | 规则 |
| --- | --- |
| 容器背景 | `panel` |
| 边框 | `1px solid border-default` |
| 圆角 | `radius-16` |
| 内边距 | `32px` |
| 标题 | `24px`, `text-primary` |
| 说明 | `16px`, `text-secondary` |
| 辅助信息 | `13px`, `text-muted` |

### 13.3 行为

- 主操作优先是“返回可阅读内容”。
- 次操作可展示“这个类型未来会支持什么”。
- 不把空态做成失败态。

## 14. ThemeToggle

### 14.1 位置

- 默认放在 `PathBar` 最右侧。
- 不在正文区悬浮，不与阅读进度竞争。

### 14.2 外观

| 项目 | 规则 |
| --- | --- |
| 尺寸 | `32px` 到 `36px` 高 |
| 风格 | 次按钮或图标按钮 |
| 图标 | 太阳 / 月亮语义明确 |
| focus-visible | 必须有独立 focus ring |

### 14.3 行为

- 一键切换浅色与深色主题。
- 主题偏好跨会话保存。
- 切换后不触发布局跳动。

## 15. Button

### 15.1 主按钮

| 状态 | 背景 | 文字 | 其他 |
| --- | --- | --- | --- |
| default | accent | text-inverse | 无阴影 |
| hover | accent-hover | text-inverse | 轻微提亮 |
| active | accent | text-inverse | 轻微压暗 |
| focus-visible | accent | text-inverse | 外侧 focus ring |
| disabled | border-default | text-faint | 不可点击 |

### 15.2 次按钮

| 状态 | 背景 | 文字 | 其他 |
| --- | --- | --- | --- |
| default | transparent | text-secondary | `1px solid border-default` |
| hover | surface-hover | text-primary | 描边保持 |
| active | surface-active | text-primary | 描边保持 |

规则：

- 页面里主按钮数量必须克制，正文页首屏最多 1 个。
- 不用高饱和暖色做主按钮，避免打断阅读氛围。

## 16. 输入与搜索框

v1 已明确支持文件树搜索，因此输入框不再是预留样式，而是首屏实际组件。

| 项目 | 规则 |
| --- | --- |
| 背景 | `panel` |
| 边框 | `1px solid border-default` |
| 文字 | `text-primary` |
| 占位 | `text-faint` |
| 圆角 | `radius-8` |
| 高度 | `36px` 到 `40px` |

focus-visible 时只加外侧 focus ring，不做高饱和实心描边替换。

搜索交互补充：

- 支持按文件夹名和文件名搜索。
- 搜索结果中的命中字符使用 `search-highlight`。
- 搜索时不改变正文区当前阅读状态。

## 17. FootnotePopover

### 17.1 外观

| 项目 | 规则 |
| --- | --- |
| 背景 | `panel` |
| 边框 | `1px solid border-default` |
| 圆角 | `radius-12` |
| 阴影 | `shadow-soft` |
| 内边距 | `12px 14px` |
| 字体 | `font-body`, `14px` |

### 17.2 行为

- 默认由 hover 或 focus 触发。
- 悬浮层显示脚注正文摘要，不强制跳转到底部。
- 当脚注内容过长时，保留“查看完整脚注”的次入口。

## 18. 响应式规则

### 18.1 平板

- 隐藏 `ContextPanel` 为折叠抽屉。
- `FileTree` 保留，但宽度可缩到 `240px`。
- `ReadingPane` 内边距降到 `24px`。

### 18.2 手机

- 页面退化为单栏。
- `PathBar` 压缩层级。
- `FileTree` 改抽屉。
- `TableOfContents` 改为顶部入口或悬浮入口。
- `DocumentHeader` 主标题可降到 `28px`。
- `FootnotePopover` 改为点击后行内展开或底部面板。

### 18.3 不可妥协项

- 正文行高不能因为窄屏而压缩到 UI 密度。
- 点击区不能小于 `32px` 高。
- 焦点态和当前态在移动端仍需可辨识。

## 19. 组件一致性检查表

每个新组件接入时都要检查：

- 是否优先复用了既有 token，而不是新增色值
- 是否明确了 default / hover / active / focus-visible / disabled
- 是否在阅读环境中保持克制
- 是否在窄屏下保留主要任务
- 是否只承担一个主要职责，没有跨区重复导航
- 是否同时定义了浅色与深色主题映射
