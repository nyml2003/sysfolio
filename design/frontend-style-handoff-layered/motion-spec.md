# SysFolio Motion Spec

## 文档目的

这份文档把 `Phase 6` 的 motion 收敛继续细化成一份可直接指导 token、transition helper 和关键组件动效边界的规范。

它不追求“做更多动画”。  
它主要回答：

- SysFolio 里的动效到底应该帮助什么
- 当前 token 还缺哪一层 motion 语义
- 控件反馈、结构切换、浮层进出、引导提示应该分别多重
- 哪些场景应该动，哪些场景不该动
- `prefers-reduced-motion` 应该如何降级

## 使用范围

这份规范对应以下文件和对象：

- `styles/tokens.css`
- `styles/utilities.css`
- 需要少量回调的 `styles/primitives/*`
- 需要少量回调的 `styles/patterns/*`
- 需要少量回调的 `styles/business/*`

重点对象：

- `Button / IconButton / Input / Select trigger`
- `TreeNav / TOC / FileTree`
- `PathBar / Tabs / Segmented`
- `Dropdown / Tooltip / Dialog / Drawer / ContextPanel`
- `Home / Directory / Document` 的 view state 切换
- `Onboarding hints`

## 一、核心原则

### 1. 动效的第一目标是解释因果，不是制造存在感

SysFolio 的主任务是阅读、浏览和定位。  
所以动效应该主要帮助用户理解：

- 我刚刚触发了什么
- 哪个区域正在展开、进入或退出
- 哪个状态发生了替换

如果一个动效不能回答这三个问题里的任意一个，它大概率就不该存在。

### 2. 阅读系统里，稳定性优先于表现力

长文阅读、目录扫描、路径判断，都要求界面稳定。  
因此：

- 阅读主区不做大位移
- 导航 current 不做追光式滑动
- 列表不做逐项浮起

界面可以有节奏，但不能持续抢眼。

### 3. 动效重量必须匹配结构重量

推荐把动效分成四级：

| 层级 | 典型场景 | 目标 |
| --- | --- | --- |
| `feedback` | hover / focus / press | 让操作有回声 |
| `state` | loading -> ready、empty -> ready | 让状态替换更可读 |
| `structure` | tree 展开、panel 唤起 | 让结构变化有因果 |
| `attention` | onboarding、少量 loading 提示 | 只在确有引导需求时吸引注意 |

原则是：

- 轻交互只用轻反馈
- 结构切换可以比控件反馈稍重
- attention 只能少量使用，不能泛化成系统默认节奏

### 4. 动效不能承载唯一语义

hover、cursor 形态、位移动画都只能增强理解，不能成为唯一反馈。  
同一个状态即使在以下条件下，也必须成立：

- 无 hover
- coarse pointer
- reduced motion
- 键盘导航

### 5. Reduced Motion 不是补丁，是正式分支

`prefers-reduced-motion` 下不是“全都砍掉”，而是：

- 保留状态变化
- 减少位移负担
- 停止持续性注意力动画

这样用户仍然看得懂界面变化，但不会被位移和循环动画打扰。

## 二、当前 token 的问题与建议

## 1. 当前问题

当前 `styles/tokens.css` 已有：

- `--sys-duration-fast`
- `--sys-duration-base`
- `--sys-duration-slow`
- `--sys-duration-overlay`
- `--sys-ease-standard`
- `--sys-ease-emphasized`

这些 token 足够支撑基础 transition，但还不够支撑完整 motion 语义。

当前最大问题有两个：

1. 只有“时长快慢”，缺少“场景重量”。
2. `overlay` 还是一个过宽的桶，`Tooltip` 和 `Drawer` 不应该共用一套重量。

## 2. 建议补成语义 motion alias

正式落地时，建议在 token 层从现有值再抽一层 alias：

| alias | 建议值 | 用途 |
| --- | --- | --- |
| `--sys-motion-duration-feedback` | `120ms` | hover / focus / press |
| `--sys-motion-duration-state` | `160ms - 180ms` | 局部状态替换 |
| `--sys-motion-duration-structure` | `180ms - 220ms` | tree、panel、区域展开 |
| `--sys-motion-duration-overlay-surface` | `160ms - 180ms` | tooltip / dropdown / popover |
| `--sys-motion-duration-overlay-panel` | `200ms - 240ms` | dialog / drawer / context panel |
| `--sys-motion-duration-attention` | `220ms - 260ms` | onboarding / 一次性引导 |
| `--sys-motion-distance-press` | `1px` | press 压感 |
| `--sys-motion-distance-float` | `4px` | 轻浮层进入 |
| `--sys-motion-distance-panel` | `8px - 12px` | panel / drawer 进入 |
| `--sys-motion-stagger-onboarding` | `120ms` | 引导点位与气泡错位进入 |

easing 不建议继续扩太多，当前两组已经够用：

- `--sys-ease-standard`
  用于颜色、边框、opacity 和轻量状态切换
- `--sys-ease-emphasized`
  用于结构进入和浮层进入

除非后续出现明确问题，否则不建议再新增一组 `spring` 或花哨 easing。

## 三、不同动效层级的使用规则

## 1. Feedback Motion

适用对象：

- button
- input
- segmented
- tabs
- path segment
- tree row hover

### 建议表现

- 只动 `color / background / border-color / opacity`
- `press` 最多允许 `1px` 级的压感，或者只收一点阴影
- 不做放大、弹跳、扫光

### 时长建议

- `120ms - 160ms`

### 不建议

- 不要给按钮 hover 加明显位移
- 不要让 focus ring 延迟出现
- disabled 不要保留转场尾音

## 2. State Motion

适用对象：

- loading -> ready
- empty -> ready
- error -> retry loading
- current / selected 的轻切换

### 建议表现

- 以 `opacity` 和局部背景切换为主
- 保持容器稳定，不改变阅读骨架
- 内容替换优先做淡入淡出，不做整块横滑

### 时长建议

- `160ms - 180ms`

### 不建议

- 不要让状态容器整体抖动或漂移
- 不要把 current 变化做成强滑轨动画

## 3. Structure Motion

适用对象：

- tree expand / collapse
- context panel 唤起
- 中屏右栏进入 / 退出
- compact 下导航层显隐

### 建议表现

- 以小距离 `transform + opacity` 或局部展开为主
- 让用户明确看到“哪个结构变了”
- 位移距离要短，避免像页面切换

### 时长建议

- `180ms - 220ms`

### 不建议

- 不要出现大面积推拉
- 不要让 rail、path bar、正文一起联动位移

## 4. Attention Motion

适用对象：

- onboarding 提示
- 少量 loading 提示
- 明确需要吸引第一次注意的位置

### 建议表现

- 只在首次出现时使用
- 可以有轻微 stagger
- 最多使用 1 次到 2 次循环，不常驻脉冲

### 时长建议

- `220ms - 260ms`

### 不建议

- 不要让 attention motion 变成常驻环境噪音
- 不要在阅读模式下给右栏或目录持续脉冲

## 四、关键场景规范

## 1. Actions 与 Data Entry

### Button / IconButton

- hover: 颜色、背景、边框轻过渡
- active press: 最多 `1px` 压感，或者阴影减弱
- focus-visible: 立即给 ring，不依赖 hover
- loading: 只替换内部内容，不让整个按钮抖动

### Input / Textarea / Select trigger

- focus 以边框和 ring 为主，不做整体放大
- placeholder 与正文切换不做显著动画
- 校验态切换优先用颜色和说明文本，不做抖动提示

SysFolio 不是高刺激表单产品，不建议引入 shake、bounce 这类强提醒。

## 2. Tree Navigation

### Toggle

- 箭头旋转可以保留
- 建议时长 `140ms - 160ms`
- 旋转只负责说明 `expanded / collapsed`

### Children 容器

- 展开 / 收起可以做轻量 `opacity + height/clip` 过渡
- 建议时长 `160ms - 180ms`
- 重点是“局部展开”，不是整棵树弹开

### Current / Selected / Search Match

- current 的切换以颜色和 rail 稳定变化为主
- 不做跨多项的滑行动画
- search match 不做闪烁，不做脉冲

### TOC 特别规则

- 自然滚动触发的 current 切换应尽量安静
- 点击目录后的定位是“导航行为”，可以允许滚动和状态一起变化
- scrollspy 本身不应再叠一层强动画

## 3. PathBar / Tabs / Segmented

这些导航件的任务是快速判断与切换，不是展示品牌感。

建议：

- hover / current 只做颜色、背景、边框变化
- 不做横向扫光
- 不做长距离滑块追踪
- overflow 后进入 dropdown，沿用 popover 动效即可

## 4. Overlay 与 Panel

## Tooltip / Dropdown / Popover

- 使用 `surface` 级重量
- 轻微 fade + `4px` 以内位移即可
- 建议时长 `160ms - 180ms`

目标是“浮起来了”，不是“飞进来了”。

## Dialog

- 使用 `panel` 级重量
- 建议 `opacity + 轻微 vertical settle`
- 位移建议不超过 `8px`
- 不建议做明显 scale

Dialog 在 SysFolio 里应显得稳，不应像 marketing modal。

## Drawer / ContextPanel

- 使用 `panel` 级重量
- 从边缘进入是合理的，但距离应短
- 建议位移 `8px - 12px`
- 建议时长 `200ms - 240ms`

进入时 scrim 应与容器几乎同步建立，不要等内容进完 scrim 才补上。

## 5. View State 与内容替换

### Loading

- `Skeleton` 可以保留，但只用于真正需要占位的区域
- shimmer 不应过亮、过快
- 持续时间较短的加载，不必强行显式骨架

### Ready

- 从 loading 到 ready，优先保证容器稳定
- 不做列表逐项浮起
- 不做整页滑入

### Empty / Error

- 进入时最多做轻 fade
- 不建议再叠加位移强调

### Route / View 切换

- `home / directory / document` 之间优先保持 shell 稳定
- 变化重点应落在主内容区
- 不建议做全页左右滑动

## 6. Onboarding

当前最合理的节奏仍然是：

`点位先出现 -> 气泡后出现 -> 用户完成理解后停止运动`

建议：

- dot 和 popover 用 `120ms` 左右 stagger
- 自动 pulse 最多 1 次到 2 次
- 用户开始操作后停止重复提醒

不建议：

- 一直呼吸闪烁
- 同时点亮多个引导热点
- 在正文阅读区边上长期悬浮晃动

## 五、Reduced Motion 规则

## 1. 必须保留的东西

即使进入 reduced motion，以下信息仍然必须可见：

- current
- selected
- focus-visible
- expanded / collapsed
- loading / ready / empty / error 的状态差异

## 2. 必须减弱的东西

| 正常模式 | Reduced Motion |
| --- | --- |
| transform 位移 | 去掉或压到接近 0 |
| tree expand 过渡 | 改为几乎直接切换，最多保留极轻 opacity |
| panel / drawer 滑入 | 改为淡入或极短位移 |
| skeleton shimmer | 停止流动，改静态占位 |
| onboarding pulse | 去掉循环，只保留直接出现 |

## 3. 实施原则

- 优先保留 `opacity / color / border-color`
- 优先去掉 `transform / long duration / infinite animation`
- 不要因为 reduced motion 就把 focus ring 或 current 也一起弱化掉

## 六、不应出现的动效

以下动效不符合当前 SysFolio 的任务特征，默认不建议采用：

- 列表项逐个浮起
- 当前目录项的长距离滑轨
- 跟随滚动持续漂移的辅助元素
- hover 扫光
- 无限呼吸灯
- parallax
- 用强 easing 掩盖布局问题
- 用强动画掩盖状态机问题

## 七、按 6 层架构的落地边界

## 1. `tokens`

负责：

- motion duration alias
- motion distance alias
- easing alias

不负责：

- 具体组件该怎么动

## 2. `utilities`

负责：

- 通用 transition helper
- reduced motion reset / helper
- 通用 focus 与 state 切换能力

不负责：

- 业务组件的进出策略

## 3. `primitives`

负责：

- button / input / nav controls 的 feedback motion
- tooltip / dropdown / dialog / drawer 的基础进出基线
- spinner / skeleton / inline notice 的基础节奏

## 4. `patterns`

负责：

- `TreeNav` 展开收起
- `view-states` 容器切换
- `shell` 区域显隐骨架

## 5. `business`

负责：

- `TOC` 的 current 切换是否安静
- `ContextPanel` 的唤起方式
- `Onboarding hints` 的节奏和停机条件

## 6. `component / page edge`

负责：

- 局部状态是否升级成整页切换
- route 切换是否需要任何动效
- 不同 panel 同时出现时谁优先、谁退后

## 八、验收标准

Phase 6 做完后，至少要满足以下标准：

1. 同一重量的动效在不同组件里节奏一致。
2. hover / focus 比结构切换轻，结构切换比 onboarding 克制。
3. 目录、路径栏、正文阅读不再被多余动画打扰。
4. reduced motion 下仍能看懂状态，但不再承担位移负担。
5. light / dark 主题切换不改变动效重量，只改变视觉表现。

## 当前结论

对 SysFolio 来说，最合理的 motion 方向不是“做更多”，而是：

`把反馈动效做轻，把结构动效做稳，把注意力动效做少，并把 reduced motion 视为同等级契约。`
