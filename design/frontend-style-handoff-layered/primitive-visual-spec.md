# SysFolio Primitive Visual Spec

## 文档目的

这份文档把 `Phase 1` 的 primitive 视觉统一工作进一步细化成可直接指导 CSS 调整的规范。

它不讨论业务组件，也不讨论页面布局。  
它只回答：

- `primitives` 这一层现在每个家族应该长成什么气质
- 现有类名对应的控件应采用什么尺寸、层级和状态表达
- 下一轮视觉调整时，哪些地方该收紧，哪些地方不要继续放大

## 使用范围

这份规范对应以下文件：

- `styles/primitives/content.css`
- `styles/primitives/actions.css`
- `styles/primitives/data-entry.css`
- `styles/primitives/navigation.css`
- `styles/primitives/data-display.css`
- `styles/primitives/feedback.css`
- `styles/primitives/overlays.css`

这份规范现在已经覆盖 `Select / Combobox / Menu / Dialog content / Table row` 这批新增 primitive；后续继续扩展同家族控件时，也应先对齐这份规范，再写具体样式。  
`styles/primitives/content.css` 已正式承接 `Heading / Text / Label / Link / CodeInline / CodeBlockSurface / Kbd`；[primitive-component-catalog.md](primitive-component-catalog.md) 中的 `SearchInput / NumberInput / DateInput / Slider / Toolbar / ListItem / MessageBar / Banner` 仍属于下一轮优先补齐对象级合同的主线。

## 文档边界

这份文档只定义 primitive 的视觉基线、家族气质和控件级状态表达。

它不负责：

- `Shell / TreeNav / ReadingPane / ViewState` 这类 pattern 级结构
- `TOC / FileTree / PathBar / HomeView / DirectoryView / DocumentView` 这类 business 级对象
- 页面级状态升级与布局入口策略

配套文档：

- primitive 组件范围、slot、变体与缺口见 [primitive-component-catalog.md](primitive-component-catalog.md)
- 状态优先级与类名契约见 [interaction-state-matrix.md](interaction-state-matrix.md)

## 一、Primitive 的共同基线

### 1. 表面逻辑

- 默认表面以平面为主，不做凸起拟物。
- 主层级差主要靠背景明度、边框实度和文字权重区分。
- 阴影只用于 overlay 和极少量浮起容器，不用于日常控件层级。

### 2. 圆角体系

- 常规控件优先 `8px`
- 容器类控件优先 `12px`
- 大状态容器优先 `16px`
- pill 类控件保持全圆角

这套圆角不应在 primitive 里继续扩散成更多中间值。

### 3. 边框体系

- 常规默认边框应清晰但不抢眼
- hover 只轻微增强边框或底色
- focus-visible 主要靠 outline，不把边框色当成唯一焦点信号
- danger / invalid 优先提升边框和浅底，不先做大面积实底

### 4. 字体和字重

- UI 控件优先统一使用 `ui font`
- 默认控件文字以 `13px medium` 为主
- 次级说明以 `12px regular` 为主
- 容器正文和说明性内容才切到 body font

### 5. 尺寸基线

| 类型 | 桌面基线 | coarse pointer 基线 |
| --- | --- | --- |
| 常规按钮 / 输入 | `40px` | `44px` |
| 图标按钮 | `36px` | `44px` |
| tabs / segmented / pagination 最小点击高 | `32px - 36px` | `44px` |
| checkbox / radio 视觉控件 | `16px` | 保持 `16px`，放大整行点击区 |
| switch | `40x24px` | `46x28px` |

### 6. 状态优先级

primitive 内部统一按以下顺序表达状态：

`disabled > loading > focus-visible > active-press > hover > default`

补充说明：

- `invalid / success / warning / destructive` 属于语义变体，不属于基础交互优先级
- `current / selected / search-match` 不在 primitive 里承担主语义

补充：

- 具体类名契约见 [interaction-state-matrix.md](/C:/Users/nyml/code/work-context/repos/sysfolio/design/frontend-style-handoff-layered/interaction-state-matrix.md)

## 二、Text And Inline Semantics 家族

对应对象：

- `Heading`
- `Text`
- `Label`
- `Link`
- `CodeInline`
- `CodeBlockSurface`
- `Kbd`

### 家族目标

这组原件应传达“可读、可引用、可识别语义”，而不是沦为业务页面里的散装文字样式。

### 视觉规范

| 对象 | 当前状态 | 目标气质 | 调整重点 |
| --- | --- | --- | --- |
| `Heading` | 主要散落在 doc header 和 article body | 结构标题、稳定层级 | level 清楚，但不靠上层自由改字号 |
| `Text` | 尚未单独建 primitive | 稳定 UI 文本原件 | 建立 `ui / body / subtle / caption / mono` 的清晰层级 |
| `Label` | 主要被 Field 吸收 | 控件名称、结构清楚 | required / optional 语气要稳定，不抢 message |
| `Link` | 多数还混在业务文本里 | 可点击但克制 | 导航感清楚，不按钮化 |
| `CodeInline` | 仅有零散样式需求 | 技术字面量 | 与正文区分，但不变成高亮标签 |
| `CodeBlockSurface` | 主要散落在 reading pattern 的 `pre / code` 样式里 | 稳定代码表面 | 块级代码不再靠业务层自由配 `pre` 外观 |
| `Kbd` | 仍未正式纳入 | 快捷键标记 | 轻量、规则、对齐稳定 |

### 具体要求

`Heading`

- 先定义视觉等级，再映射到语义层级，不能让上层逐个页面手调 `h1 / h2 / h3` 的字号和 margin。
- UI heading 和 prose heading 应共用同一套 typographic scale，但由不同容器决定间距和上下文关系。

`Text`

- `ui` 用于控件与导航短文本。
- `body` 用于说明性正文，不替代长篇阅读排版系统。
- `subtle / caption` 负责退后，不负责隐藏。

`Label`

- 与输入控件距离必须稳定。
- required / optional 只能做轻语义差异，不应制造额外视觉噪音。

`Link`

- 默认应清楚可点击，但视觉重量低于按钮。
- hover 和 focus-visible 必须可感知，visited 应存在但不能破坏整体色阶。

`CodeInline`

- 应保持句内语气，不应把一行里的 inline code 做成强标签块。
- 与正文和 UI 文本都要能共存，不打断阅读节奏。

`CodeBlockSurface`

- 只负责块级代码的表面能力，不负责 line number、copy、language badge 这类 richer viewer 功能。
- `body` slot 必须是自足的代码展示面，不应强迫调用方再手写 `pre / code` 才能获得正确排版。
- 应和正文区块明确分层，但不能比 dialog / drawer 更重。

`Kbd`

- 应靠字族、底色和边框轻度区分，不靠高饱和色。
- 与正文行高、基线对齐优先于“像代码块”。

### 不建议

- 不要把普通说明文本和 link 靠同一套颜色处理。
- 不要让业务层通过局部样式去重写 `h1 / h2 / p` 的字面表现。
- 不要把 label 做成近似标题。
- 不要把 code inline 做成和 tag 一样的胶囊块。
- 不要让页面各自去写一套 `pre / code` 容器样式。

### Phase 1 验收点

- 页面中的普通文本、标签文本、链接文本和技术字面量能在 1 秒内区分职责。
- heading 的等级感主要靠系统 scale，而不是靠业务层手调。
- link 看起来像导航，不像次级按钮。
- inline code 和 code block 的气质一眼可区分，但仍属于同一套系统。
- label、hint、message 形成稳定文本层级。

## 三、Actions 家族

对应类：

- `.m-button`
- `.m-icon-button`
- `.m-button-group`
- `.m-toolbar`
- `.m-split-button`

### 家族目标

Actions 家族应传达“可点击、可靠、克制”，而不是“强促销”。

### 视觉规范

| 对象 | 当前尺寸基线 | 目标气质 | 调整重点 |
| --- | --- | --- | --- |
| `m-button` | `40px` 高，touch `44px` | 轻、稳、明确 | 主按钮减重，次按钮可承担更多比例 |
| `m-icon-button` | `36px`，touch `44px` | 工具感强、存在感低于主按钮 | ghost 态不要太虚，primary 态不要比 button primary 更重 |
| `m-button-group` | inline group | 结构清楚、边界稳定 | attached 组更像一个控件组，而不是多个按钮撞在一起 |
| `m-toolbar` | row container | 轻工具带 | 分组清楚、溢出有秩序，不长成业务导航 |
| `m-split-button` | `40px` 高，touch `44px` | 主动作明确、次动作克制 | 主按钮和 toggle 要像一个复合控件，而不是两个拼块 |

### 具体要求

`m-button`

- `primary`
  只给单个主动作使用。
- `secondary`
  应成为最常见通用按钮。
- 如后续补 `danger`
  优先边框 + 浅底，不直接上重红底。

`m-icon-button`

- 默认态应该更像工具按钮，不应和普通按钮争主次。
- ghost 仍需保留清晰 hit area，不能只剩图标漂在空中。

`m-button-group`

- attached 组要像一个整体控件组。
- 选中态或当前态应优先通过单项底色和字重区分，不靠额外大阴影。

`m-toolbar`

- 优先承担工具分组，不承担页面级导航 ownership。
- overflow 入口要像同一家族动作，而不是突然变成 menu button 特例。

`m-split-button`

- 主动作永远比 toggle 更明确。
- 分隔线、圆角和焦点环必须说明它是一个复合控件。

### 不建议

- 不要让 hover 靠明显上浮制造“高级感”。
- 不要把 primary 按钮做成页面里最抢眼的块。
- 不要让 icon button 的边框和阴影强过正文卡片。

### Phase 1 验收点

- 一个页面里出现 `primary + secondary + icon button` 时，主次关系 1 秒内可读。
- `button group` 不再看起来像临时拼接。
- hover、focus、disabled 在三个 actions 控件上逻辑一致。

## 四、Data Entry 家族

对应类：

- `.m-field`
- `.m-input`
- `.m-search-input`
- `.m-number-input`
- `.m-textarea`
- `.m-date-input`
- `.m-slider`
- `.m-file-trigger`
- `.m-select-trigger`
- `.m-checkbox`
- `.m-radio`
- `.m-switch`

### 家族目标

Data Entry 家族应传达“可输入、可校正、可恢复”，而不是“厚重表单控件”。

### 视觉规范

| 对象 | 当前尺寸基线 | 目标气质 | 调整重点 |
| --- | --- | --- | --- |
| `m-input / m-select-trigger` | `40px` 高，touch `44px` | 平面可写表面 | 焦点更明确，hover 更轻 |
| `m-search-input / m-number-input / m-date-input` | `40px` 高，touch `44px` | 专项输入原件 | 专项 affordance 清楚，但不偏离输入家族 |
| `m-textarea` | 最小 `104px` | 长文本输入容器 | 保留稳定边界，不要过度像卡片 |
| `m-slider` | row control | 连续值选择 | thumb、track、value label 层次稳定 |
| `m-file-trigger` | trigger + hint | 文件入口 | 上传前、拖入中、失败后要有统一表面 |
| `m-checkbox / m-radio` | 控件 `16px` | 轻表单标记 | 强化整行点击区，弱化 hover 装饰 |
| `m-switch` | `40x24px`，touch `46x28px` | 二元切换 | 开关感明确，但不要像系统原生拼贴 |

### 具体要求

`Field`

- label 与输入控件的距离应稳定。
- hint 与 error message 使用同一排版层级，靠语义色区分。

`Input / Textarea / SelectTrigger`

- 默认态优先平面，不做凸起渐变。
- placeholder 必须明显弱于正文。
- invalid 优先边框和 message 联动，不额外叠加过强背景。

`SearchInput / NumberInput / DateInput`

- 应保留 Input 家族同源感，不应因为图标、步进器、日历按钮而变成另一套控件。
- 清空、步进、calendar trigger 这类附属 affordance 必须次于主输入内容。

`Slider`

- track 应稳定退后，thumb 才是主要可抓取点。
- dragging / keyboard focus 要比单纯 hover 更明确。

`FileTrigger`

- 应把“选择文件”和“已选文件结果”视作同一控件生命周期。
- drag-target 可以增强表面，但不能比错误 message 更重。

`Checkbox / Radio`

- 视觉控件保持小而准，不要跟着 touch 一起放大到失衡。
- coarse pointer 环境通过整行点击区解决可用性，不靠把方框/圆点做大。

`Switch`

- 选中态要明确，但不应该比主按钮还亮。
- knob 与轨道的移动逻辑要清楚，不加多余 glow。

### 不建议

- 不要把输入焦点做成发光输入框。
- 不要让 invalid 只靠边框色变化，没有 message 辅助。
- 不要把开关选中态做成高饱和霓虹。

### Phase 1 验收点

- Input、Textarea、SelectTrigger 的边界和焦点逻辑一致。
- Checkbox / Radio / Switch 的视觉语言仍属于同一家族。
- disabled、invalid、focus-visible 在不同输入控件上不打架。

## 五、Navigation Controls 家族

对应类：

- `.m-breadcrumb`
- `.m-segmented`
- `.m-tabs-nav`
- `.m-pagination`
- `.m-disclosure`

### 家族目标

Navigation controls 应传达“可扫描、可切换、可返回”，存在感低于业务导航。

### 视觉规范

| 对象 | 当前尺寸基线 | 目标气质 | 调整重点 |
| --- | --- | --- | --- |
| `m-breadcrumb` | inline | 低噪声路径线索 | current 明确，其余段落退后 |
| `m-segmented` | item `32px`，touch `44px` | 轻切换器 | 容器和当前项更像一个整体系统 |
| `m-tabs-nav` | item `36px`，touch `44px` | 分段视图切换 | 当前下划线轻但稳 |
| `m-pagination` | item `32px`，touch `44px` | 稳定翻页工具 | 当前页清晰，普通项不吵 |
| `m-disclosure` | row item | 折叠/展开开关 | indicator、label、meta 的关系要像一条可展开行 |

### 具体要求

`Breadcrumb`

- 普通项应更轻，current 项更实。
- 分隔符只能起结构作用，不能抢节奏。

`Segmented`

- 容器像一块轻底板，当前项像板上的活动标签。
- 当前项优先靠底色、字重和轻阴影区分，不要做强按钮感。

`TabsNav`

- 下划线应比 rail 更轻，比 hover 更稳。
- 普通态的文字不能太淡，否则 current 看起来像只有一个可用 tab。

`Pagination`

- 普通页码是工具项，不是按钮墙。
- 当前页明确即可，不需要过度填充。

`Disclosure`

- 只负责展开/收起，不提前承担 TreeNav 的 current 语义。
- chevron 的旋转和 label 的点击区要作为一体设计。

### 不建议

- 不要把 segmented、tabs、pagination 做成三种完全不同的视觉语言。
- 不要让 hover 比 current 更重。
- 不要让 breadcrumb current 看起来像可点击普通项。

### Phase 1 验收点

- 四类 navigation controls 在同一页面共存时，仍像一个家族。
- current / hover / disabled 的层级一眼可区分。
- coarse pointer 下 hit area 稳定，视觉比例不失衡。

## 六、Data Display 家族

对应类：

- `.m-card`
- `.m-divider`
- `.m-stat`
- `.m-tag`
- `.m-badge`
- `.m-avatar`
- `.m-list`
- `.m-list-item`
- `.m-key-value`
- `.m-token`

### 家族目标

Data Display 家族应传达“承载信息，而不是争夺注意力”。

### 视觉规范

| 对象 | 当前尺寸基线 | 目标气质 | 调整重点 |
| --- | --- | --- | --- |
| `m-card` | padding `16px`，mobile `12px` | 轻容器 | 边界明确，但不厚重 |
| `m-divider` | `1px` | 分组辅助线 | 足够可见，但不切碎页面 |
| `m-stat` | value `24px`，mobile `18px` | 单值信息块 | label 和 value 对比更稳 |
| `m-tag` | small pill | 分类标签 | 保持轻，不要像按钮 |
| `m-badge` | min `20px` | 计数或状态标记 | 更偏信息点，不偏操作点 |
| `m-avatar` | `32px` | 身份占位 | 不抢标题和正文 |
| `m-list / m-list-item` | row container | 高复用信息行 | 既可扫描，也可承接轻交互，但不业务化 |
| `m-key-value` | two-column / inline | 术语值对 | term 退后，value 稳定可读 |
| `m-token` | compact pill | 已选值或过滤值 | removable 时像值，不像按钮 |

### 具体要求

`Card`

- 更像信息容器，不像营销卡片。
- header、body、meta 的层级应靠排版，而不是靠重阴影。

`Divider`

- 只能帮助分段，不能让页面被切成很多碎块。

`Stat`

- value 要有明确权重，但不能变成大标题系统的一部分。
- label 应清楚退后。

`Tag / Badge`

- Tag 是分类语义，不是二级按钮。
- Badge 是状态点或计数点，不是主信息块。

`Avatar`

- 默认应作为身份线索，不该与业务重点争主次。

`List / ListItem`

- 默认更像信息项，而不是菜单项或树节点。
- selectable / actionable 只能做轻 ownership，不应抢走 navigation system 的 current 层级。

`KeyValue`

- term 和 value 应靠排版区分，不靠强背景或重边框。
- 长值优先保证读完，不优先保证完全对齐。

`Token`

- removable affordance 必须存在，但不能让 token 整体按钮化。
- 选中值与分类标签要有边界，不能与 tag 混成一个视觉对象。

### 不建议

- 不要把 card 做成太厚、太立体的 SaaS 卡片。
- 不要给 tag 加太重边框和高饱和背景。
- 不要让 badge 的颜色比当前项、错误态还强。

### Phase 1 验收点

- card、tag、badge、stat、avatar 同时出现时，信息主次稳定。
- data display 控件整体低于 actions 的抢眼程度。
- mobile 下 card 和 stat 不会因为缩放而失衡。

## 七、Feedback 家族

对应类：

- `.m-spinner`
- `.m-skeleton-block`
- `.m-inline-notice`
- `.m-progress`
- `.m-message-bar`
- `.m-banner`
- `.m-toast`

### 家族目标

Feedback 家族应负责“告诉用户发生了什么”，但不能破坏界面稳定感。

### 视觉规范

| 对象 | 当前尺寸基线 | 目标气质 | 调整重点 |
| --- | --- | --- | --- |
| `m-spinner` | `16px` | 轻加载指示 | 不承担全部 loading 任务 |
| `m-skeleton-block` | block | 结构占位 | 保持最终布局感 |
| `m-inline-notice` | inline container | 温和提示 | success / info / error 语义清楚但不炸 |
| `m-progress` | slim bar | 进度反馈 | 作为补充，而不是主视觉元素 |
| `m-message-bar` | section / panel row | 可恢复消息 | 比 inline notice 重，但低于 blocking error |
| `m-banner` | full-width strip | 页面级提示 | 横向存在感明确，但不能像系统告警墙 |
| `m-toast` | floating small surface | 非阻塞结果反馈 | 仅在极少场景使用，且重量最低 |

### 具体要求

`Spinner`

- 只用于局部加载，不用于整块视图唯一状态表达。

`Skeleton`

- 应更像结构占位，而不是闪烁动画装饰。
- 宽高比例优先贴近真实内容块。

`Inline Notice`

- info、success、error 三种语义应统一容器结构。
- danger / error 不要做成高压告警条。

`MessageBar / Banner`

- 需要形成消息升级梯度，而不是各自独立做一套样式。
- MessageBar 偏容器内恢复，Banner 偏跨区域提醒，两者不能只差宽度。

`Progress`

- 作为过程反馈，应轻、准、稳定。
- bar 的颜色可有语义，但容器不应抢眼。

`Toast`

- 必须是最轻量的结果反馈，不承担关键恢复动作。
- entering / exiting 动效要比 drawer / dialog 更克制，并服从 reduced motion。

### 不建议

- 不要用 spinner 替代 skeleton。
- 不要把 inline notice 做成接近页面错误页的重量。
- 不要让 progress 成为最显眼的视觉元素。
- 不要把 toast 当成默认反馈方案。

### Phase 1 验收点

- loading、notice、progress 的视觉重量排序稳定。
- success / info / error 只改变语义，不改变整个组件家族。
- skeleton 在 light / dark 下都不刺眼。

## 八、Overlays 家族

对应类：

- `.m-surface-popover`
- `.m-footnote-popover`
- `.m-tooltip`
- `.m-dropdown-surface`
- `.m-dialog-surface`
- `.m-drawer-surface`

### 家族目标

Overlays 应传达“临时浮到上层的上下文”，不是新的主界面。

### 视觉规范

| 对象 | 当前尺寸基线 | 目标气质 | 调整重点 |
| --- | --- | --- | --- |
| `m-surface-popover` | max `320px` | 轻上下文说明 | 作为 overlay 基底，不偏业务 |
| `m-footnote-popover` | max `320px` | 阅读型补充说明 | 更偏正文阅读，不偏菜单 |
| `m-tooltip` | max `256px` | 极轻提示 | 只承担一句话信息 |
| `m-dropdown-surface` | min `192px` | 操作列表容器 | 比 tooltip 更稳，比 dialog 更轻 |
| `m-dialog-surface` | max `576px` | 确认 / 编辑容器 | 清楚分区，不做厚窗体 |
| `m-drawer-surface` | max `384px`，mobile `320px` | 渐进上下文层 | 更像附加工作区，而非页面替身 |

### 具体要求

共同规则：

- overlay 的边界应比底层面板更清楚，但不需要更高饱和度。
- 阴影只用于说明层级上浮，不用来制造存在感。

`Tooltip`

- 只允许一句或两句极短提示。
- 不承载复杂操作和长说明。

`Dropdown`

- 更像操作列表容器，不应接近 dialog 重量。
- 项目间距和内边距应更贴近工具菜单，而不是阅读卡片。

`Dialog`

- 标题、正文、操作区必须分段明确。
- 适合确认和轻编辑，不适合复杂多步任务。

`Drawer`

- 用来承接次级上下文，不替代主任务页面。
- 移动端更应接近 sheet 逻辑，而不是窄侧栏逻辑。

### 不建议

- 不要让 tooltip、dropdown、dialog 共享完全相同的表面重量。
- 不要把 drawer 做成只是一个更高的 card。
- 不要让 overlay 的阴影重过正文层级。

### Phase 1 验收点

- tooltip、dropdown、dialog、drawer 的重量关系清楚。
- overlay 家族整体一致，但每种用途仍可分辨。
- mobile 下 drawer / dialog 的气质不会继续沿用桌面窗体思路。

## 九、Phase 1 内部推荐顺序

在 `Phase 1` 里，建议不要六个家族同时开始改，顺序应是：

1. `actions + data-entry`
2. `navigation`
3. `data-display + feedback`
4. `overlays`

原因：

- actions 和 data-entry 最容易定义系统基线
- navigation 依赖前两者，但还不该提前掺入 business 导航语义
- data-display 和 feedback 主要跟随基线收敛
- overlays 最后做，避免早期用阴影和浮层重量带歪整套系统

## 十、最终验收清单

Phase 1 完成时，至少应满足：

- 所有 primitive 家族都像同一套系统，而不是不同来源的拼接
- 文本、标签、链接、消息、输入、列表项之间的角色一眼可分
- `40px / 44px` 的核心交互尺寸体系稳定成立
- focus-visible、disabled、loading 的表达逻辑跨家族一致
- primary / current / invalid / info / success / error 不互相抢语义
- light 主题下不发灰、不发脏、不发虚
- 后续新增 `Select / Menu / Dialog content / MessageBar / SearchInput` 时，可以直接沿用这份规范

## 当前结论

`Phase 1` 的目标不是“把 primitives 做得更花”，而是：

`把所有基础控件做成一个稳定、克制、可继承的视觉系统。`

## Remaining TODO

1. 继续补齐 `Combobox / Menu / DialogContent / DrawerContent / TableRow` 的高级子场景。
2. 收完整体 primitive 的 `success / warning / destructive` 在不同家族中的重量边界。
3. 再校准 coarse pointer 下 icon-only 控件、trigger 类控件和 overlay 关闭控件的点击基线。
4. 继续把 `SearchInput / NumberInput / DateInput / Slider / Toolbar / ListItem / MessageBar / Banner` 从家族级视觉原则细化到对象级视觉合同，并补内容 primitives 的复杂组合示例。
