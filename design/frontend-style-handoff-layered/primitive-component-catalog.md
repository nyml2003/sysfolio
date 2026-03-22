# SysFolio Primitive Component Catalog

## 文档目的

这份文档把当前 `primitives` 层已有或计划支持的基础组件整理成统一目录。  
它回答的是：

- 每个 primitive 的职责是什么
- 推荐的结构/slot 是什么
- 当前支持哪些变体和状态
- 还有哪些缺口尚未完全设计完

视觉基线看 [primitive-visual-spec.md](primitive-visual-spec.md)。  
状态优先级与类名契约看 [interaction-state-matrix.md](interaction-state-matrix.md)。

## 使用范围

对应 CSS：

- `styles/primitives/actions.css`
- `styles/primitives/data-entry.css`
- `styles/primitives/navigation.css`
- `styles/primitives/data-display.css`
- `styles/primitives/feedback.css`
- `styles/primitives/overlays.css`

## Actions

### Button

- Purpose: 触发单一步动作。
- Structure/slots: `leadingIcon? / label / trailingIcon? / spinner?`
- Variants: `primary / secondary / success / warning / destructive`
- States: `default / hover / focus-visible / active-press / disabled / loading`
- Known gaps: 图标前后混排、长文本截断、destructive confirm 场景仍需复核。

### IconButton

- Purpose: 承载轻工具动作。
- Structure/slots: `icon / srLabel / spinner?`
- Variants: `primary / ghost / success / warning / destructive`
- States: `default / hover / focus-visible / active-press / disabled / loading`
- Known gaps: 小屏 coarse pointer 的点击边界与 icon-only destructive 权重还需再收。

### ButtonGroup

- Purpose: 组织一组紧邻操作或模式切换。
- Structure/slots: `group / item[]`
- Variants: `default / attached`
- States: `default / hover / focus-visible / active / current / disabled`
- Known gaps: attached 组内单项 current 与 hover 的叠加态还需更明确。

## Data Entry

### Field

- Purpose: 提供 label、hint、message 与控件编排壳层。
- Structure/slots: `label / control / hint? / message?`
- Variants: `default / required / optional`
- States: `default / focus-within / invalid / warning / success / disabled`
- Known gaps: 多行 message、prefix action、复杂表单分组仍未系统化。

### Input

- Purpose: 单行文本输入。
- Structure/slots: `leading? / input / trailing? / clear? / spinner?`
- Variants: `default / invalid / warning / success`
- States: `default / hover / focus-visible / disabled / loading / read-only`
- Known gaps: prefix/suffix、clearable、read-only 和 async validation 场景还需补充。

### Textarea

- Purpose: 多行文本输入。
- Structure/slots: `textarea / counter? / message?`
- Variants: `default / invalid / warning / success`
- States: `default / hover / focus-visible / disabled / loading / resize`
- Known gaps: 自动增高、字数计数、长文本辅助动作尚未细化。

### Select

- Purpose: 离散选项单选输入。
- Structure/slots: `field / trigger / value / indicator / menu`
- Variants: `default / invalid / warning / success`
- States: `default / hover / focus-visible / open / disabled / loading`
- Known gaps: placeholder、分组选项、空结果与多尺寸契约未完全写死。

### SelectTrigger

- Purpose: Select 的表面触发器 primitive。
- Structure/slots: `leading? / value / chevron / status?`
- Variants: `default / invalid / warning / success`
- States: `default / hover / focus-visible / open / disabled / loading`
- Known gaps: 与 Combobox trigger 的视觉边界需要继续统一。

### Combobox

- Purpose: 可输入过滤的选择控件。
- Structure/slots: `field / input / clear? / spinner? / indicator / menu / empty`
- Variants: `default / invalid / warning / success`
- States: `default / hover / focus-visible / open / active-option / disabled / loading`
- Known gaps: `async / multi-select / empty-result / create-option` 还未完全定稿。

### Checkbox

- Purpose: 多选项勾选。
- Structure/slots: `control / label / description?`
- Variants: `default`
- States: `unchecked / checked / indeterminate / hover / focus-visible / disabled`
- Known gaps: 表格行选择、层级勾选与错误提示联动仍需整理。

### Radio

- Purpose: 单选项互斥选择。
- Structure/slots: `control / label / description?`
- Variants: `default`
- States: `unchecked / checked / hover / focus-visible / disabled`
- Known gaps: radio group 的行密度和辅助说明排版还需补。

### Switch

- Purpose: 二元开关切换。
- Structure/slots: `track / thumb / label? / description?`
- Variants: `default / success / warning / destructive`
- States: `off / on / hover / focus-visible / disabled / loading`
- Known gaps: loading switch、长标签、destructive 开关的语气需要额外验证。

## Navigation Controls

### Breadcrumb

- Purpose: 提供轻量路径回溯。
- Structure/slots: `segment[] / separator`
- Variants: `default`
- States: `default / hover / focus-visible / current / disabled`
- Known gaps: 溢出折叠与小屏压缩策略主要落在 business PathBar，还未完全回写说明。

### Segmented

- Purpose: 在少量离散模式间切换。
- Structure/slots: `container / item[] / indicator?`
- Variants: `default`
- States: `default / hover / focus-visible / current / disabled`
- Known gaps: icon-only、scrollable segmented 与 attached group 的关系还需定。

### TabsNav

- Purpose: 同级内容区切换。
- Structure/slots: `list / tab[] / activeRail`
- Variants: `default`
- States: `default / hover / focus-visible / current / disabled`
- Known gaps: 溢出 tabs、移动端滚动 tabs 与 panel 切换动效仍待补。

### Pagination

- Purpose: 多页数据的分页跳转。
- Structure/slots: `prev / pageItems / next / ellipsis`
- Variants: `default / compact`
- States: `default / hover / focus-visible / current / disabled`
- Known gaps: 输入跳页、极长分页与 compact 模式还未展开。

## Data Display

### Card

- Purpose: 轻信息容器。
- Structure/slots: `header? / body / footer? / meta?`
- Variants: `default / elevated-light`
- States: `default / hover / focus-visible / selected`
- Known gaps: 作为可点击卡片时的 ownership 强度仍需控制。

### Divider

- Purpose: 分组辅助线。
- Structure/slots: `line / label?`
- Variants: `horizontal / vertical`
- States: `default`
- Known gaps: 带标题 divider 的密度和语气没有单独补。

### Stat

- Purpose: 展示单值与说明。
- Structure/slots: `label / value / meta?`
- Variants: `default / compact`
- States: `default / loading / success / warning / destructive`
- Known gaps: 多值对齐、趋势箭头与单位处理还未定稿。

### Tag

- Purpose: 分类或语义标签。
- Structure/slots: `label / icon? / remove?`
- Variants: `default / success / warning / destructive`
- States: `default / hover / focus-visible / removable / disabled`
- Known gaps: removable、interactive tag 与 filter chip 的边界仍需收敛。

### Badge

- Purpose: 计数或状态点。
- Structure/slots: `dot|count / anchor?`
- Variants: `default / success / warning / destructive`
- States: `default / attention / disabled`
- Known gaps: 大数值、省略与与按钮/标签组合时的对齐未完全说明。

### Avatar

- Purpose: 身份占位或缩略头像。
- Structure/slots: `image|initial / fallback`
- Variants: `image / initials / icon`
- States: `default / loading / fallback`
- Known gaps: avatar group 和 presence 状态不是当前重点，尚未正式纳入。

### Table

- Purpose: 表格结构与列头容器。
- Structure/slots: `table / header / row[] / cell[]`
- Variants: `default / compact`
- States: `default / loading / empty`
- Known gaps: sticky header、responsive collapse 与排序状态仍需补足。

### TableRow

- Purpose: 行级数据容器与交互状态承载。
- Structure/slots: `row / cell[] / leadingControl? / actions?`
- Variants: `default / success / warning / destructive`
- States: `default / hover / focus-visible / selected / drag-target / reordering / disabled`
- Known gaps: 批量选择、row actions、drag handle、reorder preview 还未最终系统化。

## Feedback

### Spinner

- Purpose: 局部加载指示。
- Structure/slots: `glyph / label?`
- Variants: `default / subtle`
- States: `spinning / paused`
- Known gaps: 仅适合局部 loading，不应用于替代大块 view-state skeleton。

### SkeletonBlock

- Purpose: 内容骨架占位。
- Structure/slots: `block / line / circle`
- Variants: `text / title / paragraph / card / media`
- States: `default / shimmer / reduced-motion`
- Known gaps: 与三类主视图的结构映射还要继续细化。

### InlineNotice

- Purpose: 行内反馈或恢复提示。
- Structure/slots: `icon / title? / body / action? / dismiss?`
- Variants: `info / success / warning / destructive`
- States: `default / emphasis / dismissible`
- Known gaps: 长内容 notice、堆叠 notice 与内联表单错误的边界仍需校准。

### Progress

- Purpose: 展示过程进度。
- Structure/slots: `track / indicator / label? / meta?`
- Variants: `default / success / warning / destructive`
- States: `default / indeterminate / complete / error`
- Known gaps: 分段进度与上传/处理类场景还未沉淀。

## Overlays

### SurfacePopover

- Purpose: 通用浮层表面基底。
- Structure/slots: `surface / header? / body / footer?`
- Variants: `default`
- States: `closed / open`
- Known gaps: 锚点偏移与窄视口回退策略还需补。

### FootnotePopover

- Purpose: 阅读型脚注或补充说明浮层。
- Structure/slots: `surface / body / source?`
- Variants: `default`
- States: `closed / open`
- Known gaps: 长注释、移动端阅读体验尚未完全说明。

### Tooltip

- Purpose: 极短解释性提示。
- Structure/slots: `surface / label`
- Variants: `default`
- States: `closed / open`
- Known gaps: 多行 tooltip、延迟策略和 touch fallback 需要再收。

### DropdownSurface

- Purpose: 菜单或轻操作列表容器。
- Structure/slots: `surface / menu / section?`
- Variants: `default`
- States: `closed / open`
- Known gaps: 与 menu item 的组合规则需继续细化。

### OverlayScrim

- Purpose: Dialog / Drawer 等临时层的背景阻隔。
- Structure/slots: `scrim`
- Variants: `default`
- States: `open / closed`
- Known gaps: 减弱 motion 和 stacked overlay 策略仍待统一。

### Menu

- Purpose: 操作项集合。
- Structure/slots: `menu / item[] / group? / separator / shortcut? / checkmark? / submenu?`
- Variants: `default / warning / destructive`
- States: `default / hover / focus-visible / selected / disabled`
- Known gaps: `submenu / checkable / shortcut / nested menu` 还没完全定稿。

### DialogSurface

- Purpose: Dialog 的外层表面与分区容器。
- Structure/slots: `surface / header / body / footer / close`
- Variants: `default / destructive`
- States: `closed / open`
- Known gaps: 尺寸级别、滚动 body、长表单布局需要继续完善。

### DialogContent

- Purpose: Dialog 内的正文编排层。
- Structure/slots: `title / description / content / actions`
- Variants: `default / confirm / form`
- States: `default / loading / error`
- Known gaps: `destructive confirm / form layout / dense content` 仍需补齐。

### DrawerSurface

- Purpose: Drawer 的容器表面。
- Structure/slots: `surface / header / body / footer / close`
- Variants: `side / sheet`
- States: `closed / open`
- Known gaps: `medium / compact` 下的进入方向和尺寸策略还需与布局文档再对齐。

### DrawerContent

- Purpose: Drawer 内部正文编排层。
- Structure/slots: `title / meta? / content / actions?`
- Variants: `default / inspector / task`
- States: `default / loading / empty / error`
- Known gaps: inspector 型内容与 task 型内容的层级还未完全系统化。

## 当前边界

以下对象不属于这份 catalog：

- `Shell / ReadingPane / ContentPane / ContextPanel`
- `TreeNav / TOC / FileTree / PathBar`
- `IdleState / LoadingState / EmptyState / ErrorState`

这些对象分别属于 `patterns` 或 `business`，不再回塞到 `primitives`。
