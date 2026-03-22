# SysFolio Layout Behavior Spec

## 文档目的

这份文档把 `Phase 3` 的“Shell 与多端布局行为定稿”继续细化成一份可直接指导布局与入口调整的规范。

它不讨论颜色、字重和状态语义本身。  
它主要回答：

- `Shell` 在 `spacious / medium / compact` 三档下如何组织
- `FileTree / PathBar / ContextPanel / DocumentView` 各自如何进退场
- 哪些区域是常驻层，哪些区域是临时层
- 入口应该放在哪里，避免“直接隐藏”

## 使用范围

这份规范对应以下文件和对象：

- `styles/patterns/shell.css`
- `styles/business/navigation.css`
- `styles/business/explorer.css`
- `styles/business/views.css`

对应对象：

- `Shell`
- `PathBar`
- `FileTree`
- `TOC`
- `ContextPanel`
- `HomeView`
- `DirectoryView`
- `DocumentView`

## 当前落地 hook

当前 CSS 已经把布局切换的关键 hook 固定为：

- `Shell` 打开左侧临时层
  `.m-shell.is-left-open`
- `Shell` 打开右侧临时层
  `.m-shell.is-right-open`
- `Shell` 临时层遮罩
  `.m-shell__scrim`
- `Shell` 面板显式激活
  `.m-shell__left.is-active / .m-shell__right.is-active`
- `PathBar` 中小屏稳定入口
  `.m-path-entry`
- `PathBar` 需要在中屏收起的路径段
  `.is-collapsible`
- `PathBar` 小屏保留的省略路径段
  `.is-ellipsis`

## 一、核心原则

### 1. 布局变化不是压缩，是角色重排

当宽度不够时，不应该先问“哪一栏隐藏掉”，而应先问：

- 当前主任务是什么
- 哪个区域必须持续可见
- 哪个区域可以变成临时层
- 临时层怎么重新进入

### 2. 每个被降级的区域都必须保留稳定入口

如果某个区域从常驻变成临时层，必须满足：

- 有唯一、稳定、可预期的入口
- 入口位置固定
- 用户关闭后知道如何再次找到它

最不推荐的做法是：

- 直接 `display: none`
- 没有稳定入口
- 入口根据页面类型到处漂

### 3. 紧凑环境下同一时间只允许一个临时主层

在 `compact` 下，不建议同时打开：

- 左侧导航层
- 右侧上下文层

原因：

- 会形成层中层
- 返回路径混乱
- 容易打断主内容任务

更稳的规则是：

`compact 下同一时刻只允许一个临时主层占前景。`

## 二、环境分档

### 当前建议

| 档位 | 范围 | 总体目标 |
| --- | --- | --- |
| `spacious` | `>= 1280px` | 三栏并存，保持持续可见的上下文 |
| `medium` | `960px - 1279px` | 主内容 + 左栏优先，右栏改可唤起 |
| `compact` | `< 960px` | 单主列，左右辅助区域改临时层 |

### 这不是单纯 breakpoint

这三档仍然服务于任务，不是只看宽度数字。

例如：

- `DocumentView` 在 medium 下更偏向保住阅读列
- `DirectoryView` 在 medium 下更偏向保住左侧浏览结构
- `HomeView` 在 compact 下可以比 document 更自由地压缩辅助内容

## 三、输入能力补充

这份布局规范不仅受宽度影响，也受输入能力影响。

当前统一按以下原则落地：

- `fine pointer + hover`
  可以用 hover 和 cursor 增强入口可发现性，但不能把关键入口只放在 hover 上。
- `coarse pointer`
  优先放大按钮、箭头和树节点的点击区，不依赖 hover。
- `keyboard`
  右栏、TOC、抽屉和 PathBar 的入口必须可聚焦，且关闭后应回到稳定焦点位置。
- `reduced motion`
  临时层进退场应保留状态变化，但减弱位移，不影响返回路径判断。

## 四、布局 Preference

布局侧的 preference 不负责“强行覆盖环境”，而负责“在可行范围内改变默认驻留方式”。

### 当前核心布局偏好

| 偏好 | 建议值 | 说明 |
| --- | --- | --- |
| `leftRailPref` | `auto / pinned / closed` | 左栏默认常驻还是默认收起 |
| `tocPref` | `auto / open / closed` | 文档 TOC 默认展开还是按入口唤起 |
| `contextPanelPref` | `auto / open / closed` | 右侧上下文区默认是否驻留 |

### 约束原则

1. 环境能力优先于偏好，preference 不能强迫不适合当前宽度的结构继续常驻。
2. preference 决定的是“默认行为”，不是此刻正在打开还是关闭的瞬时状态。
3. 瞬时 UI 状态仍由 `.is-left-open / .is-right-open / .is-active` 这类运行时类名承担。

### 解析规则

`leftRailPref`

- `spacious`
  `auto / pinned` 都解析为常驻；`closed` 解析为默认收起但保留稳定入口。
- `medium`
  `auto / pinned` 默认仍可常驻；`closed` 解析为默认收起。
- `compact`
  无论偏好为何，都退化为临时层；preference 只影响是否更强调入口，不影响默认自动弹出。

`tocPref`

- `spacious`
  `auto` 可按文档长度和页面类型决定；`open` 可默认常驻；`closed` 走稳定入口。
- `medium`
  `open` 也只应解析为“默认可唤起且更容易进入”，不应强行常驻占宽。
- `compact`
  一律退化为临时层；`open` 不能在进入页面时直接遮挡正文。

`contextPanelPref`

- `spacious`
  可按 `auto / open / closed` 解析为常驻或默认收起。
- `medium`
  一律转右侧临时 inspector，只区分默认入口强调程度，不区分是否常驻。
- `compact`
  一律转 sheet / 次级层，preference 不得打断主内容优先级。

## 五、Shell 总规则

## 1. Spacious

### 结构

- 左栏常驻
- 主内容常驻
- 右栏常驻

### 目标

- 让导航、内容、上下文信息同时可见
- 减少来回切换
- 保持阅读与浏览并行

### 适用

- 目录浏览
- 文档阅读同时查看 TOC / context
- 文件树 + 内容 + 右侧说明并存

## 2. Medium

### 结构

- 左栏常驻
- 主内容常驻
- 右栏退出主栅格，改为可唤起侧板

### 目标

- 保住主内容宽度和左侧浏览结构
- 把右栏从“持续占宽”改成“按需查看”

### 关键结论

medium 下右栏不是“消失”，而是：

- 有稳定入口
- 以临时侧板进入
- 关闭后回到主内容，不改变页面主任务

## 3. Compact

### 结构

- 单主列
- 左栏改导航抽屉或独立导航层
- 右栏改底部 sheet、全屏上下文层或次级页面

### 目标

- 让主内容成为唯一持续焦点
- 把浏览和上下文都转成按需进入

### 关键结论

compact 下主内容优先级最高。  
任何辅助区域都不应默认长期占用可视空间。

## 六、区域级行为

## 1. FileTree / 左栏

### Spacious

- 常驻在左栏
- 搜索框和树列表都可持续可见
- 适合长时间浏览与快速切换

### Medium

- 仍然优先常驻
- 但应控制搜索区和节点密度，避免左栏太厚重
- 如果某些页面没有左侧浏览必要性，可以收缩为较窄 rail，而不是直接消失

### Compact

- 不再常驻
- 改为：
  - 左侧抽屉
  - 全屏导航层
  - 或独立导航页

### 入口规则

compact 下 `FileTree` 必须有稳定入口，建议只保留一个主入口：

- PathBar 左侧导航按钮

不建议：

- 有时放在 PathBar，有时放在页面正文里
- 不同页面用不同位置打开左栏

### 关闭规则

- 进入内容后，导航层默认关闭
- 再次需要浏览时，通过同一入口重新打开

## 2. TOC / 右侧文档导航

### Spacious

- 可与右侧上下文区共存
- 对文档阅读场景，TOC 可以作为右栏核心内容之一

### Medium

- 不再持续占据右栏宽度
- 改为：
  - 右侧 inspector panel 中的一个 section
  - 或一个独立的 “目录” 面板入口

### Compact

- 不建议常驻
- 推荐作为：
  - “目录” 底部 sheet
  - 或“目录”全屏层

### 入口规则

`DocumentView` 下，TOC 的入口建议固定在：

- PathBar 工具区的目录按钮
- 或正文顶部稳定的目录入口

但二者不要同时作为主入口。  
要给用户一个明确心智：目录从哪里开。

## 3. ContextPanel / 右侧上下文区

### Spacious

- 常驻
- 可承接关联信息、元数据、补充操作或 secondary navigation

### Medium

- 变成右侧临时 inspector
- 推荐以侧板形式进入，而不是 modal dialog

### Compact

- 改为：
  - bottom sheet
  - full-height sheet
  - 或二级详情页

### 入口规则

右侧上下文区在 medium / compact 下应有一个稳定入口，建议：

- 放在 PathBar 右侧工具区
- 使用单一“信息 / 详情 / 面板”入口

不建议：

- 某些页面叫 “info”，某些页面叫 “panel”，某些页面只剩图标没有语义

## 4. PathBar

### Spacious

- 显示完整路径
- 保留工具区
- 允许显示主题切换、目录入口、上下文入口等次级工具

### Medium

- 保住当前位置与祖先结构
- 中间段落可压缩、折叠或省略
- 右侧工具区保留最核心 1 到 2 个入口

### Compact

- PathBar 应转成更接近“顶部任务栏”
- 只保留：
  - 左侧导航入口
  - 中间当前位置
  - 右侧一个主要上下文入口

### 关键结论

compact 下 PathBar 的主要职责不是“展示完整路径”，而是：

- 提供返回和导航入口
- 告诉用户当前在哪
- 提供一个稳定的次级上下文入口

## 5. DocumentView

### Spacious

- 阅读列居中
- TOC / ContextPanel 可以并存
- 正文 measure 优先稳定，不因两侧存在就被压坏

### Medium

- 保住阅读主列
- 右侧信息移出主栅格
- 目录入口和上下文入口通过 PathBar 或正文顶部进入

### Compact

- 纯单列阅读
- 目录与上下文都临时进入
- 正文区优先最大化连续阅读空间

### 关键规则

无论哪个档位，DocumentView 都应优先保阅读连续性，而不是保三栏形式。

## 6. DirectoryView

### Spacious

- 左栏常驻
- 列表与元信息并行

### Medium

- 左栏仍优先保留
- 右栏信息按需查看

### Compact

- 列表成为主任务
- 左侧树和右侧上下文都改临时层

### 关键规则

DirectoryView 在 medium 下的优先级应是：

`浏览结构 > 右侧上下文`

## 7. HomeView

### Spacious

- 可保留三栏，但右栏价值通常低于 document / directory

### Medium

- 更容易收缩成两栏甚至单焦点入口页

### Compact

- 优先保住主入口、分类和推荐路径
- 左右辅助层不应默认出现

### 关键规则

HomeView 的布局自由度最大，不必机械沿用 document 的三栏逻辑。

## 七、入口与返回行为

## 1. Left Nav Entry

建议统一：

- medium：通常不需要主入口，因为左栏仍在
- compact：PathBar 左侧按钮打开导航层

按钮语义建议稳定，不要在不同页面改名。

## 2. TOC Entry

建议统一：

- `DocumentView` 中提供一个稳定“目录”入口
- 打开后进入 TOC 层
- 关闭后回到阅读位置，不打断正文

## 3. Context Entry

建议统一：

- 右侧上下文的入口在 PathBar 右侧工具区
- medium 打开 inspector side panel
- compact 打开 sheet 或次级详情层

## 4. Close / Back

规则建议：

- 临时层关闭后回到原主内容位置
- compact 下系统返回优先关闭当前临时层
- 不在关闭临时层后让页面重新定位到开头

## 八、同屏并存规则

### Spacious

可以并存：

- 左栏
- 主内容
- 右栏

### Medium

持续并存：

- 左栏
- 主内容

按需进入：

- 右栏

### Compact

持续并存：

- 主内容

按需进入，且一次只开一个：

- 左栏导航层
- TOC 层
- Context 层

## 九、Phase 3 推荐实施边界

这一轮建议只做以下几类事情：

1. 明确三档布局下每个区域的驻留方式
2. 确定 `PathBar` 在 medium / compact 下的入口职责
3. 确定 `FileTree / TOC / ContextPanel` 进入临时层后的唯一入口
4. 保证 `DocumentView` 在所有档位下都优先保阅读连续性

这一轮不建议混入：

- 业务视图密度微调
- dark theme 颜色重校
- motion 节奏统一
- 复杂状态语义回改

## 十、Phase 3 验收清单

Phase 3 完成时，至少应满足：

- `spacious / medium / compact` 三档下的 Shell 行为都能一句话说清
- medium 下右栏不再只是 `display: none`
- compact 下左栏、TOC、ContextPanel 都有稳定入口
- compact 下不会同时打开两个主临时层
- PathBar 在 compact 下已经从“完整路径条”转成“顶部任务栏”
- DocumentView 在 medium / compact 下都优先保住阅读连续性

## 当前结论

`Phase 3` 的核心不是“把三栏做成更复杂的响应式”，而是：

`把常驻层、可唤起层和临时层的角色彻底定稳。`

## Remaining TODO

1. 定稿 `medium / compact` 下左右栏、TOC、ContextPanel 与 PathBar 的最终交互稿。
2. 再校准 fine pointer / coarse pointer 下树节点、箭头按钮、顶部入口的点击区与 affordance。
3. 验证临时层关闭、返回、滚动保持与焦点回退在真实前端接线中的一致性。
4. 把 `leftRailPref / tocPref / contextPanelPref` 的实际 entry、默认值和持久化范围再收一遍。
