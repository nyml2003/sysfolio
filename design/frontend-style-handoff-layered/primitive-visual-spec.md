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

- `styles/primitives/actions.css`
- `styles/primitives/data-entry.css`
- `styles/primitives/navigation.css`
- `styles/primitives/data-display.css`
- `styles/primitives/feedback.css`
- `styles/primitives/overlays.css`

如果后面新增 `Select / Combobox / Menu / Dialog content / Table row`，也应先对齐这份规范，再写具体样式。

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

- `success / warning / destructive` 属于语义变体，不属于基础交互优先级
- `current / selected / search-match` 不在 primitive 里承担主语义

## 二、Actions 家族

对应类：

- `.m-button`
- `.m-icon-button`
- `.m-button-group`

### 家族目标

Actions 家族应传达“可点击、可靠、克制”，而不是“强促销”。

### 视觉规范

| 对象 | 当前尺寸基线 | 目标气质 | 调整重点 |
| --- | --- | --- | --- |
| `m-button` | `40px` 高，touch `44px` | 轻、稳、明确 | 主按钮减重，次按钮可承担更多比例 |
| `m-icon-button` | `36px`，touch `44px` | 工具感强、存在感低于主按钮 | ghost 态不要太虚，primary 态不要比 button primary 更重 |
| `m-button-group` | inline group | 结构清楚、边界稳定 | attached 组更像一个控件组，而不是多个按钮撞在一起 |

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

### 不建议

- 不要让 hover 靠明显上浮制造“高级感”。
- 不要把 primary 按钮做成页面里最抢眼的块。
- 不要让 icon button 的边框和阴影强过正文卡片。

### Phase 1 验收点

- 一个页面里出现 `primary + secondary + icon button` 时，主次关系 1 秒内可读。
- `button group` 不再看起来像临时拼接。
- hover、focus、disabled 在三个 actions 控件上逻辑一致。

## 三、Data Entry 家族

对应类：

- `.m-field`
- `.m-input`
- `.m-textarea`
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
| `m-textarea` | 最小 `104px` | 长文本输入容器 | 保留稳定边界，不要过度像卡片 |
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

## 四、Navigation Controls 家族

对应类：

- `.m-breadcrumb`
- `.m-segmented`
- `.m-tabs-nav`
- `.m-pagination`

### 家族目标

Navigation controls 应传达“可扫描、可切换、可返回”，存在感低于业务导航。

### 视觉规范

| 对象 | 当前尺寸基线 | 目标气质 | 调整重点 |
| --- | --- | --- | --- |
| `m-breadcrumb` | inline | 低噪声路径线索 | current 明确，其余段落退后 |
| `m-segmented` | item `32px`，touch `44px` | 轻切换器 | 容器和当前项更像一个整体系统 |
| `m-tabs-nav` | item `36px`，touch `44px` | 分段视图切换 | 当前下划线轻但稳 |
| `m-pagination` | item `32px`，touch `44px` | 稳定翻页工具 | 当前页清晰，普通项不吵 |

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

### 不建议

- 不要把 segmented、tabs、pagination 做成三种完全不同的视觉语言。
- 不要让 hover 比 current 更重。
- 不要让 breadcrumb current 看起来像可点击普通项。

### Phase 1 验收点

- 四类 navigation controls 在同一页面共存时，仍像一个家族。
- current / hover / disabled 的层级一眼可区分。
- coarse pointer 下 hit area 稳定，视觉比例不失衡。

## 五、Data Display 家族

对应类：

- `.m-card`
- `.m-divider`
- `.m-stat`
- `.m-tag`
- `.m-badge`
- `.m-avatar`

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

### 不建议

- 不要把 card 做成太厚、太立体的 SaaS 卡片。
- 不要给 tag 加太重边框和高饱和背景。
- 不要让 badge 的颜色比当前项、错误态还强。

### Phase 1 验收点

- card、tag、badge、stat、avatar 同时出现时，信息主次稳定。
- data display 控件整体低于 actions 的抢眼程度。
- mobile 下 card 和 stat 不会因为缩放而失衡。

## 六、Feedback 家族

对应类：

- `.m-spinner`
- `.m-skeleton-block`
- `.m-inline-notice`
- `.m-progress`

### 家族目标

Feedback 家族应负责“告诉用户发生了什么”，但不能破坏界面稳定感。

### 视觉规范

| 对象 | 当前尺寸基线 | 目标气质 | 调整重点 |
| --- | --- | --- | --- |
| `m-spinner` | `16px` | 轻加载指示 | 不承担全部 loading 任务 |
| `m-skeleton-block` | block | 结构占位 | 保持最终布局感 |
| `m-inline-notice` | inline container | 温和提示 | success / info / error 语义清楚但不炸 |
| `m-progress` | slim bar | 进度反馈 | 作为补充，而不是主视觉元素 |

### 具体要求

`Spinner`

- 只用于局部加载，不用于整块视图唯一状态表达。

`Skeleton`

- 应更像结构占位，而不是闪烁动画装饰。
- 宽高比例优先贴近真实内容块。

`Inline Notice`

- info、success、error 三种语义应统一容器结构。
- danger / error 不要做成高压告警条。

`Progress`

- 作为过程反馈，应轻、准、稳定。
- bar 的颜色可有语义，但容器不应抢眼。

### 不建议

- 不要用 spinner 替代 skeleton。
- 不要把 inline notice 做成接近页面错误页的重量。
- 不要让 progress 成为最显眼的视觉元素。

### Phase 1 验收点

- loading、notice、progress 的视觉重量排序稳定。
- success / info / error 只改变语义，不改变整个组件家族。
- skeleton 在 light / dark 下都不刺眼。

## 七、Overlays 家族

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

## 八、Phase 1 内部推荐顺序

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

## 九、最终验收清单

Phase 1 完成时，至少应满足：

- 所有 primitive 家族都像同一套系统，而不是不同来源的拼接
- `40px / 44px` 的核心交互尺寸体系稳定成立
- focus-visible、disabled、loading 的表达逻辑跨家族一致
- primary / current / invalid / info / success / error 不互相抢语义
- light 主题下不发灰、不发脏、不发虚
- 后续新增 `Select / Menu / Dialog content` 时，可以直接沿用这份规范

## 当前结论

`Phase 1` 的目标不是“把 primitives 做得更花”，而是：

`把所有基础控件做成一个稳定、克制、可继承的视觉系统。`
