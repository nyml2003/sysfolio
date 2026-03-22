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

## Primitive Set Strategy

当前 catalog 不再把 `primitives` 理解成“眼前已经写完 CSS 的那几个控件”，而是理解成：

- 非业务语义
- 可跨页面复用
- 可被 pattern 继续组合
- 能独立定义结构、状态和 a11y 契约

这意味着 SysFolio 的 primitive 集合应当比现在的 CSS 落点更完整，但仍然不追求照搬 Ant Design 一整套产品组件树。

参考的组件谱系主要对照：

- Ant Design Components Overview
- Fluent 2 React components overview
- Carbon components overview
- Primer components overview

当前支持等级用三档理解：

| 等级 | 含义 |
| --- | --- |
| `baseline` | 当前已在文档和现有样式中有明确落点 |
| `priority-next` | 应尽快进入 primitive 层，支撑后续 patterns / business |
| `later` | 仍属于 primitive，但应排在当前主线之后 |

未单独标注 `Support` 的既有组件，默认按 `baseline` 理解。

补齐方向上，优先补：

1. `text / link / label` 这类基础语义原件
2. `search / number / date / slider / file trigger` 这类常见输入
3. `toolbar / disclosure / list item / message bar / banner` 这类高复用结构控件

补齐后，pattern 层再去承接：

- `TreeNav`
- `CommandPalette`
- `SearchResultPanel`
- `TableToolbar`
- `BannerStack`
- `ViewStates`

## Text And Inline Semantics

这组对象目前还没有单独拆出 `styles/primitives/content.css`，但在设计层面已经应被视作 primitive。

### Heading

- Support: `priority-next`
- Purpose: 承担结构化标题，而不是让上层自由配置 `h1 / h2 / h3` 的字面样式。
- Structure/slots: `content / anchor? / leadingIcon? / trailingMeta?`
- Variants: `display / section / subsection / caption-heading`
- States: `default / current / muted`
- Known gaps: level 和视觉 variant 的映射、anchor affordance、heading group 与 summary 的组合还需补。

### Text

- Support: `priority-next`
- Purpose: 统一 UI 文案、说明文、弱化文本与技术文本的排版原件。
- Structure/slots: `content`
- Variants: `ui / body / strong / subtle / caption / mono`
- States: `default / muted / success / warning / destructive / disabled`
- Known gaps: 长篇阅读正文仍由 `patterns / business` 承担，不在这里重新发明正文系统。

### Label

- Support: `priority-next`
- Purpose: 为单个控件或一组控件提供名称。
- Structure/slots: `content / requiredMark? / optionalMark? / infoAffordance?`
- Variants: `default / strong / subtle`
- States: `default / disabled / required / optional`
- Known gaps: multiline label、label action 和 info affordance 的组合边界还需补。

### Link

- Support: `priority-next`
- Purpose: 承担导航型文本交互，而不是动作型点击。
- Structure/slots: `label / leadingIcon? / trailingIcon?`
- Variants: `default / subtle / external`
- States: `default / hover / focus-visible / visited / current`
- Known gaps: visited policy、external affordance、一行内多 link 密度还要继续收。

### CodeInline

- Support: `later`
- Purpose: 展示命令、路径、代码标识等技术字面量。
- Structure/slots: `content`
- Variants: `code / code-strong`
- States: `default / selected`
- Known gaps: copy affordance 是否属于 primitive 还未最终定稿。

### Kbd

- Support: `later`
- Purpose: 展示快捷键按键组合。
- Structure/slots: `key[]`
- Variants: `default`
- States: `default`
- Known gaps: 多平台快捷键映射和本地化展示规则需要和 preference / capability 一起看。

### Tag Ownership Note

- `h1 - h6`
  语义层级由上层结构决定，但视觉必须通过 `Heading primitive` 或 `Prose pattern` 统一承接。
- `p`
  在 prose/reading 容器中由 pattern 自动接管；在普通 UI 中应落到 `Text.body`。
- `span`
  默认只是 inline wrapper，不是设计对象；只有承担明确角色时才升级成 `Link / CodeInline / Kbd / emphasis / hit` 等受控原件。

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

### Toolbar

- Support: `priority-next`
- Purpose: 组织一组高频工具动作、分组和溢出入口。
- Structure/slots: `toolbar / group[] / item[] / overflow?`
- Variants: `default / dense`
- States: `default / focus-within / disabled-item / overflow-open`
- Known gaps: roving tabindex、overflow 收拢和 mobile 下的横向滚动边界仍需补。

### SplitButton

- Support: `later`
- Purpose: 组合“主动作 + 次级菜单”。
- Structure/slots: `primaryAction / separator / toggle / menu`
- Variants: `secondary / warning / destructive`
- States: `default / hover / focus-visible / open / disabled / loading`
- Known gaps: destructive split 的语气、menu anchor 和 loading ownership 还没完全定稿。

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

### SearchInput

- Support: `priority-next`
- Purpose: 承担关键词查找，而不是通用文本填写。
- Structure/slots: `leadingSearchIcon / input / clear? / submit? / spinner? / scope?`
- Variants: `default / subtle`
- States: `default / hover / focus-visible / filled / loading / disabled`
- Known gaps: debounced search、scope switch、mobile submit 和 recent queries 的边界还需补。

### NumberInput

- Support: `priority-next`
- Purpose: 承担数值输入、步进和单位显示。
- Structure/slots: `input / stepDown / stepUp / prefix? / suffix?`
- Variants: `default / invalid / warning / success`
- States: `default / hover / focus-visible / disabled / read-only / loading`
- Known gaps: locale formatting、mouse wheel、large step 和 unit message 还未系统化。

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

### DateInput

- Support: `priority-next`
- Purpose: 承担日期或日期范围输入的字段表面。
- Structure/slots: `field / value / calendarTrigger / clear? / helper?`
- Variants: `date / date-range`
- States: `default / hover / focus-visible / open / disabled / invalid`
- Known gaps: locale、timezone、range preview 和 mobile picker 回退规则还未正式定义。

### Slider

- Support: `priority-next`
- Purpose: 以连续区间方式选择值或范围。
- Structure/slots: `track / filledTrack / thumb / marks? / valueLabel?`
- Variants: `default / range`
- States: `default / hover / focus-visible / dragging / disabled`
- Known gaps: 双 thumb、keyboard granularity、value label 和 tick mark 密度需要继续收。

### FileTrigger

- Support: `priority-next`
- Purpose: 承接文件选择入口，以及与 dropzone pattern 的交接。
- Structure/slots: `trigger / label / hint? / fileList? / action?`
- Variants: `button / inline-dropzone`
- States: `default / hover / focus-visible / drag-target / loading / disabled / error`
- Known gaps: multiple file、retry / remove、upload lifecycle 与 progress ownership 还未最终定稿。

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

### Disclosure

- Support: `priority-next`
- Purpose: 展开或折叠就近内容区，而不是承载完整树导航语义。
- Structure/slots: `chevron / label / meta?`
- Variants: `default / compact`
- States: `collapsed / expanded / hover / focus-visible / disabled`
- Known gaps: 与 `TreeNav`、`Accordion`、`Section fold` 的 ownership 边界仍需继续写清。

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

### List

- Support: `priority-next`
- Purpose: 提供垂直信息项容器，而不是树、表格或业务导航。
- Structure/slots: `list / item[] / divider?`
- Variants: `plain / divided / inset`
- States: `default / loading / empty`
- Known gaps: rich row 和简单列表的密度边界仍需补充。

### ListItem

- Support: `priority-next`
- Purpose: 承载单行信息、可选中项或可点击项。
- Structure/slots: `leadingVisual? / content / meta? / trailing? / action?`
- Variants: `default / selectable / actionable`
- States: `default / hover / focus-visible / current / selected / disabled / drag-target`
- Known gaps: `current / selected / clickable / search-match` 的叠加语义还要继续和导航系统对齐。

### KeyValue

- Support: `priority-next`
- Purpose: 承载术语和值的轻量展示。
- Structure/slots: `term / value / meta?`
- Variants: `default / compact / inline`
- States: `default / loading`
- Known gaps: 长值换行、代码值、状态值和 copy affordance 的边界尚未固定。

### Token

- Support: `priority-next`
- Purpose: 展示一个已选值、可移除实体或过滤条件。
- Structure/slots: `label / leadingIcon? / remove?`
- Variants: `default / selected / removable`
- States: `default / hover / focus-visible / disabled`
- Known gaps: 和 `Tag`、`filter chip`、`multi-select value` 的边界需要继续收敛。

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

### MessageBar

- Support: `priority-next`
- Purpose: 承担 section / panel / page 级别的可恢复消息，而不是瞬时提示。
- Structure/slots: `icon / title? / body / actions? / dismiss?`
- Variants: `info / success / warning / destructive`
- States: `default / emphasis / persistent / dismissible`
- Known gaps: `aria-live`、容器级别和与 error state 的升级边界仍需补齐。

### Banner

- Support: `priority-next`
- Purpose: 承担跨内容区或页面顶层公告、警示与恢复入口。
- Structure/slots: `body / action? / dismiss?`
- Variants: `info / success / warning / destructive`
- States: `default / sticky / dismissible`
- Known gaps: global vs contextual banner、stacking 和持久化规则还未正式定义。

### Progress

- Purpose: 展示过程进度。
- Structure/slots: `track / indicator / label? / meta?`
- Variants: `default / success / warning / destructive`
- States: `default / indeterminate / complete / error`
- Known gaps: 分段进度与上传/处理类场景还未沉淀。

### Toast

- Support: `later`
- Purpose: 承担极少量非阻塞、短时、可忽略的结果反馈。
- Structure/slots: `icon? / body / action? / dismiss?`
- Variants: `info / success / warning / destructive`
- States: `entering / visible / exiting / paused`
- Known gaps: 可访问性风险较高，只能在 messaging system 明确限制后再正式放开。

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

## Remaining TODO

1. 继续补齐 `Combobox / Menu / DialogContent / DrawerContent / TableRow` 的高级子场景。
2. 收完整体 primitive 的 `success / warning / destructive` 在不同家族中的重量边界。
3. 再校准 coarse pointer 下 icon-only 控件、trigger 类控件和 overlay 关闭控件的点击基线。
4. 把新增的 `Text / Label / Link / SearchInput / NumberInput / DateInput / Slider / Toolbar / ListItem / MessageBar / Banner` 继续细化到视觉 spec 和状态矩阵。

## 当前边界

以下对象不属于这份 catalog：

- `Shell / ReadingPane / ContentPane / ContextPanel`
- `TreeNav / TOC / FileTree / PathBar`
- `IdleState / LoadingState / EmptyState / ErrorState`
- `CommandPalette / SearchResultPanel / TableToolbar / BannerStack`

这些对象分别属于 `patterns` 或 `business`，不再回塞到 `primitives`。
