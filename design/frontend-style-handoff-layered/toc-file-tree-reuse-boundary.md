# SysFolio TOC And File Tree Reuse Boundary

## 文档目的

这份文档用于回答一个具体问题：

`TOC` 和 `File Tree` 是否应该复用同一套组件结构？

结论是：

- 适合复用同一套树形导航 `pattern`
- 不适合复用成同一个业务组件

更准确地说：

`TOC` 和 `File Tree` 是同一家族的树形导航，但不是同一个业务对象。

## 结论

推荐分层如下：

- `primitives`
  提供按钮、图标按钮、可聚焦行、文本标签等基础控件
- `patterns`
  提供通用树形导航模式
- `business`
  分别实现 `TocTree` 和 `FileTree`

如果用当前方案语言表达，就是：

`TOC` 和 `File Tree` 应共享同一套 `Tree Navigation Pattern`，但应拆成两个独立的业务组件。

## 为什么不能直接做成同一个业务组件

虽然它们都长得像树，但语义不同：

- `TOC`
  是文档大纲树，核心任务是“阅读定位”
- `File Tree`
  是内容浏览树，核心任务是“导航和切换”

它们的核心状态来源也不同：

- `TOC active`
  来自滚动状态机和点击导航状态
- `File Tree selected`
  来自当前节点、展开状态、搜索命中和内容上下文

如果强行做成同一个业务组件，通常会出现两个问题：

1. `TOC` 被迫继承文件系统的重量感  
会显得过重，阅读定位组件被文件管理语义污染。

2. `File Tree` 被迫迁就阅读目录逻辑  
后续一旦加入搜索命中、异步加载、节点操作、右键、拖拽或权限逻辑，组件边界会很快失控。

## 为什么适合复用同一套 pattern

从结构上看，它们确实有很高重合度：

- 都是层级列表
- 都有缩进
- 都可能有展开/收起
- 都有当前项 / 激活项 / 焦点项
- 都需要稳定的键盘和点击交互

所以更合理的方式不是“完全分开”，而是把共性沉到 `pattern` 层。

## 推荐的共享边界

### 1. 可以共享的 pattern 能力

建议共享以下结构和表现：

- `TreeNav`
  树形导航容器
- `TreeNavItem`
  单个树节点行
- `TreeNavToggle`
  展开/收起控件
- `TreeNavLabel`
  节点文本区域
- `TreeNavIndent`
  缩进规则
- `TreeNavActiveRail`
  当前项或激活项的左侧指示

建议共享以下交互底线：

- 行高
- 点击区域
- 缩进节奏
- hover / focus-visible / active 的基础样式
- 键盘导航基础行为
- 展开收起的轻量动效节奏

### 2. 不应共享的业务状态模型

以下内容不建议硬塞进同一个共享组件：

- `TOC active` 的滚动状态机
- `File Tree selected` 的节点选中逻辑
- `File Tree` 的搜索命中和过滤状态
- 文件 / 目录 / 文档类型图标和节点语义
- 文档目录的标题层级规则
- 与内容阅读进度绑定的自动展开逻辑
- 与文件系统绑定的异步加载、权限、拖拽、上下文菜单

一句话：

- 共享树结构
- 不共享状态来源

## 推荐分层

### 1. Primitives

适合放：

- `Button`
- `IconButton`
- `FocusableRow`
- `TextLabel`

职责：

- 解决最小点击区域
- 解决基础焦点态
- 解决图标、文字、行容器的底层能力

### 2. Patterns

适合放：

- `TreeNav`
- `TreeNavItem`
- `TreeNavToggle`
- `TreeNavLabel`
- `TreeNavChildren`

职责：

- 定义树形布局骨架
- 定义缩进和展开关系
- 定义树节点行的共通视觉与交互

### 3. Business

适合放：

- `TocTree`
- `FileTree`

职责：

- 接入各自不同的数据结构
- 接入各自不同的 active / selected / expanded 规则
- 接入各自不同的状态机、过滤、自动展开和上下文行为

## TOC 和 File Tree 的关键差异

### 1. 当前项来源不同

`TOC`

- 当前项由阅读定位决定
- 需要接入 `initial / short_content / navigating / reading` 这套 TOC 状态机

`File Tree`

- 当前项由当前文档节点决定
- 不依赖阅读滚动状态机

### 2. 展开逻辑不同

`TOC`

- 可能随当前阅读位置自动展开当前分支
- 也可能受点击目录层级控制

`File Tree`

- 通常以用户显式展开/收起为主
- 可能还要记忆展开状态

### 3. 节点语义不同

`TOC`

- 节点是 `h1 / h2 / h3` 等标题层级

`File Tree`

- 节点是目录、文档、叶子节点、分类节点或搜索结果

### 4. 后续复杂度不同

`TOC`

- 更偏阅读辅助
- 更强调当前项感知和定位一致性

`File Tree`

- 更偏导航和资源浏览
- 更容易继续长出搜索、筛选、拖拽、菜单、权限、懒加载

## 对当前 SysFolio 的建议

当前最合适的结构是：

- `patterns`
  设计一套 `Tree Navigation Pattern`
- `business`
  分出 `TocTree` 和 `FileTree`

视觉上建议共享：

- 缩进节奏
- 行容器结构
- 当前项左侧指示
- hover / focus-visible 基线
- 展开箭头的节奏和动效

语义上建议拆开：

- `TOC` 的 active 规则
- `File Tree` 的 selected / expanded / search match 规则

## 给前端的实现约束

1. 不要让 `TocTree` 直接复用 `FileTree` 的完整状态模型。
2. 不要把 `TOC` 的滚动状态机塞进共享树形 pattern。
3. 不要把文件类型、搜索命中、权限、拖拽等逻辑放进 `TocTree`。
4. 优先复用树节点结构、缩进、toggle、行样式和焦点规则。
5. 在共享层只保留“树形导航”的普遍能力，不保留任何单一业务假设。

## 当前判断

如果继续沿用旧术语，可以粗略理解为：

- 不是“同一个分子组件”
- 而是“同一类 pattern 家族 + 两个不同业务组件”

如果用当前这套新分层语言，最准确的说法是：

`TOC` 和 `File Tree` 应共享 `Tree Navigation Pattern`，但应分别实现为 `TocTree` 和 `FileTree`。
