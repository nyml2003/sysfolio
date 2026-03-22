# SysFolio Dark Theme Spec

## 文档目的

这份文档把 `Phase 5` 的 dark theme 复核继续细化成一份可直接指导 token 调整与深色主题验收的规范。

它不重新定义整套视觉方向。  
它主要回答：

- dark theme 到底要保住什么
- 哪些 token 先调，哪些组件后调
- 哪些对象最容易在 dark 下失真
- 什么样的 dark theme 才算真的可读、可用，而不是“只是有一个 dark 版本”

## 使用范围

这份规范对应以下文件和对象：

- `styles/tokens.css`
- 需要少量回调的 `styles/patterns/*`
- 需要少量回调的 `styles/business/*`

重点对象：

- `Document` 正文
- `Code block`
- `Inline code`
- `TOC current`
- `FileTree current / selected`
- `PathBar current`
- `Inline notice`

## 一、核心原则

### 1. Dark theme 的第一目标不是酷，是可长期阅读

SysFolio 当前最重的场景不是 dashboard，而是：

- 文档阅读
- 目录浏览
- 上下文切换

所以 dark theme 的第一目标应是：

- 正文长读不刺眼
- 导航层级仍清楚
- 暖色语义不丢

如果 dark theme 只追求更亮、更冷、更强对比，短看可能更“有科技感”，但长读会很累。

### 2. 不做“浅色主题反相”

当前视觉方向的价值之一，是暖色纸面、暖色 rail、暖色引用边界、暖色搜索命中。  
这些语义到了 dark 下，不能全部被洗成一套蓝灰。

更稳的做法是：

- 背景改深
- 对比度重校
- 暖色语义保留，但控制饱和度和发光感

### 3. 先调 token 关系，再调单个组件

Phase 5 应该先从 token 关系入手，而不是直接进具体组件里局部补色。

顺序建议：

1. 文本层级
2. 背景层级
3. 边框层级
4. 语义色
5. 代码色
6. 特例组件回调

## 二、Dark Theme 需要保住的关系

## 1. 背景层级

dark 下至少要保住以下顺序：

`canvas < panel-alt < panel < panel-strong < surface-hover / active`

这里的“<”表示层级从更退后到更前景，而不是简单明暗值。

### 目标

- 页面画布最退后
- 面板有层级差，但不是一堆黑盒子
- hover / active 能被看见，但不发亮

### 不建议

- 不要让 panel 和 canvas 几乎一样，导致结构塌平
- 不要让 hover / active 比当前项还亮

## 2. 文本层级

dark 下至少要保住：

`text-primary > text-secondary > text-muted > text-faint`

### 目标

- primary 用于正文和核心标题
- secondary 用于摘要、正文辅助句和说明
- muted 用于 meta、标签说明、分组名
- faint 只用于 placeholder、弱提示、非主信息

### 不建议

- 不要把正文做成接近纯白
- 不要把 muted 压到几乎不可读
- 不要让 secondary 和 muted 太接近

## 3. 语义色关系

dark 下仍要保住：

- `accent`
- `current-rail`
- `warm`
- `success`
- `danger`
- `info`
- `search-highlight`

### 目标

- accent / current 仍偏暖，不切成冷蓝
- success / danger / info 语义清楚，但不发光
- search highlight 仍然是“命中”，不是“警告”

### 不建议

- 不要让 danger 变荧光粉红
- 不要让 success 变状态灯绿
- 不要让 info 和 link 完全混成一种蓝

## 三、优先复核的 token 组

## 1. 背景与边框

优先复核：

- `--sys-color-canvas`
- `--sys-color-canvas-soft`
- `--sys-color-panel`
- `--sys-color-panel-alt`
- `--sys-color-panel-strong`
- `--sys-color-surface-hover`
- `--sys-color-surface-active`
- `--sys-color-border-subtle`
- `--sys-color-border-default`
- `--sys-color-border-strong`

### 验收标准

- 三栏结构仍能看出层级
- 卡片、输入框、树节点和浮层不会全糊成一片
- hover 和 active 足够可见，但不抢主阅读内容

## 2. 文本与图标

优先复核：

- `--sys-color-text-primary`
- `--sys-color-text-secondary`
- `--sys-color-text-muted`
- `--sys-color-text-faint`
- `--sys-color-icon-default`
- `--sys-color-icon-active`

### 验收标准

- 正文与背景对比舒适
- meta、标签、分组文字仍可读
- icon 默认态不抢，但 hover / current 下能稳地变实

## 3. 导航与搜索语义

优先复核：

- `--sys-color-current-rail`
- `--sys-color-current-soft`
- `--sys-color-search-highlight`
- `--sys-color-search-highlight-text`
- `--sys-color-focus-ring`

### 验收标准

- TOC current、FileTree current、PathBar current 仍然清楚
- search hit 不会压过 current
- focus ring 在 dark 下仍能被看见

## 4. 代码与引用

优先复核：

- `--sys-color-code-bg`
- `--sys-color-code-border`
- `--sys-color-code-text`
- `--sys-color-inline-code-bg`
- `--sys-color-quote-border`
- `--sys-code-keyword`
- `--sys-code-function`
- `--sys-code-type`
- `--sys-code-string`
- `--sys-code-number`
- `--sys-code-variable`
- `--sys-code-comment`

### 验收标准

- code block 与正文区分明确
- inline code 不像脏块，也不发亮
- code token 之间有层级，但不刺眼
- comment 可以弱，但不能完全退没

## 四、对象级复核规范

## 1. Document 正文

### 目标

- 长时间阅读舒适
- 段落、标题、摘要、meta 层级仍成立

### 检查项

- 正文 primary text 是否过亮
- summary 和 secondary text 是否还能看清
- heading 是否足够抬起，但不过于冷硬
- selection 背景是否清楚且不脏

### 不建议

- 不要做“黑底白字”极端对比
- 不要让正文比导航还亮

## 2. Code Block

### 目标

- 与正文有明确分区
- token 有层级但不过激

### 检查项

- code bg 是否和 panel 区分明确
- code border 是否足够收住容器
- keyword / string / comment 是否形成稳定层级

### 不建议

- 不要把代码块做成更深的纯黑洞
- 不要让 token 色像霓虹主题

## 3. Inline Code

### 目标

- 与正文中普通词汇拉开
- 仍然属于正文行内，不炸出整句

### 检查项

- inline code bg 是否过于厚重
- text 与 bg 是否仍有可读对比

## 4. TOC / FileTree / PathBar

### 目标

- 当前项仍然清楚
- hover 不抢 current
- search hit 不抢 selected / current

### 检查项

- TOC current 的 rail 和底色是否仍稳定
- FileTree current / selected 是否还能分清
- PathBar current 是否比祖先段落更实
- toggle / icon 在 dark 下是否发灰过头

## 5. Inline Notice

### 目标

- info / success / error 仍然可分
- 不像控制台警报条

### 检查项

- 背景浅层语义是否成立
- 边界和文字是否可读
- error 是否过亮、过粉、过硬

## 五、Phase 5 推荐实施边界

这一轮建议只做以下几类事情：

1. 先从 `styles/tokens.css` 调背景、文本、边框、语义色关系
2. 再最少量回调 `reading / tree-navigation / views / navigation / explorer`
3. 重点围绕 document、navigation、code、inline notice 复核

这一轮不建议混入：

- 布局入口行为回改
- primitive 新家族扩展
- motion 节奏统一
- 为了 dark theme 重新换整套视觉方向

## 六、Phase 5 验收清单

Phase 5 完成时，至少应满足：

- 正文在 dark 下长读不刺眼
- panel / canvas / hover / active 层级仍成立
- TOC current、FileTree current / selected、PathBar current 都能稳定看懂
- code block 与 inline code 可读且不发亮
- success / danger / info / search highlight 语义仍然清楚
- dark 主题看起来仍然属于当前 SysFolio，而不是另一套产品

## 当前结论

`Phase 5` 的核心不是“做出一个更暗的界面”，而是：

`让深色主题在阅读、导航和语义表达上都继续成立。`

## Remaining TODO

1. 继续复核长文阅读、代码块、inline code 与导航 ownership 在 dark 下的舒适度和区分度。
2. 再检查 `success / warning / destructive / search highlight` 在 dark 下的饱和度与对比边界。
3. 等中小屏交互定稿后，再回看 overlay、sheet、drawer 在 dark 下的层级是否仍然成立。
