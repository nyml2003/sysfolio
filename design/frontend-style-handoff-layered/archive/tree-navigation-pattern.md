# Archived: SysFolio Tree Navigation Pattern

> 已归档。当前树导航边界请优先阅读 `../design-overview.md` 与 `../navigation-state-spec.md`。

# SysFolio Tree Navigation Pattern

## 文档目的

这份文档定义 `Tree Navigation Pattern`，作为 `TOC` 和 `File Tree` 的共享模式层。

它回答的是：

- 树形导航在共享层应该长什么样
- 哪些结构、状态和交互可以共用
- 哪些能力必须留到业务层处理

这份文档对应当前 6 层架构中的：

- `primitives`
  基础按钮、图标、可聚焦行、文本标签
- `patterns`
  树形导航模式本身
- `business`
  `TocTree` 和 `FileTree`

## 结论

推荐把共享层定义为一套 `Tree Navigation Pattern`，由业务层分别实现：

- `TocTree`
- `FileTree`

也就是说：

- 共享树结构
- 共享基础交互
- 共享视觉骨架
- 不共享业务状态来源

## Pattern 定位

`Tree Navigation Pattern` 是一种通用层级导航模式，适用于：

- 文档大纲
- 文件树
- 分组目录
- 多级导航

它不是最终业务组件，也不是单个 primitive。  
它的职责是定义“树形导航应该如何被组织和操作”。

## 一、推荐结构

建议模式层至少包含以下部分：

- `TreeNav`
  树形导航整体容器
- `TreeNavGroup`
  同级节点集合
- `TreeNavItem`
  单个节点
- `TreeNavRow`
  节点的可交互行
- `TreeNavToggle`
  展开/收起控件
- `TreeNavIcon`
  节点图标或类型图标区域
- `TreeNavLabel`
  节点文本区域
- `TreeNavMeta`
  次级信息区域，可选
- `TreeNavChildren`
  子节点容器
- `TreeNavActiveRail`
  当前项或激活项的视觉指示

结构原则：

- 行容器和子节点容器要分开
- toggle 区域和 label 区域要有明确职责
- 缩进不应由业务层临时硬写

## 二、推荐视觉骨架

共享层建议统一以下视觉能力：

- 行高基线
- 缩进节奏
- 当前项左侧指示
- hover 反馈
- focus-visible 反馈
- 展开/收起图标位置
- 文本截断规则
- 选中行的基础背景与边界表达

建议共享的视觉方向：

- 树节点行保持轻量、密实、可扫描
- 当前项指示优先通过左侧 rail、背景和字重建立
- 展开箭头是结构提示，不抢主信息
- 层级通过缩进表达，不靠过多边框

## 三、共享状态

模式层建议只定义“树导航通用状态”，不要直接定义业务语义。

推荐共享状态：

- `default`
- `hover`
- `focus-visible`
- `active-press`
- `expanded`
- `collapsed`
- `current`
- `disabled`（如有需要）

状态说明：

- `current`
  表示“当前上下文所对应的节点”
- `expanded / collapsed`
  表示树结构展开状态
- `active-press`
  表示用户正在按压或点击中

共享层不应直接定义：

- `search-match`
- `current-reading-section`
- `selected-file`
- `permission-locked`
- `lazy-loading`

这些都属于业务层状态。

## 四、当前项语义

模式层可以定义 `current` 这个抽象状态，但不能决定它从哪里来。

在业务层中：

- `TocTree`
  `current` 来自 TOC 状态机和阅读定位
- `FileTree`
  `current` 来自当前文档节点或当前浏览上下文

所以共享层只负责：

- 提供 `current` 的视觉表现
- 不负责计算 `current`

## 五、交互规则

### 1. 点击

共享层建议定义：

- 点击 `TreeNavRow`
  触发节点主动作
- 点击 `TreeNavToggle`
  只切换展开/收起

不要让业务层每次重新定义：

- 哪一块是 toggle hit area
- 哪一块是 label hit area

### 2. 键盘

如果树是可聚焦结构，建议共享以下键盘规则：

- `ArrowUp`
  聚焦上一个可见节点
- `ArrowDown`
  聚焦下一个可见节点
- `ArrowRight`
  若可展开则展开，否则进入第一个子节点
- `ArrowLeft`
  若已展开则收起，否则回到父节点
- `Home`
  聚焦第一个可见节点
- `End`
  聚焦最后一个可见节点
- `Enter / Space`
  触发节点主动作或展开动作

业务层可以覆盖“主动作是什么”，但不建议覆盖基础方向键模型。

### 3. 焦点

共享层应统一：

- 焦点落在 row 上还是 label 上
- focus-visible 样式
- toggle 和 row 的焦点关系

推荐：

- 整个 `TreeNavRow` 作为主要焦点单元
- toggle 如果可单独聚焦，要有明确理由

## 六、响应式和多端交互

`Tree Navigation Pattern` 应天然兼容不同输入能力。

### 桌面端

- 支持 hover
- 支持 cursor
- 支持完整键盘导航
- 当前项和焦点项需要明显区分

### 触屏端

- 不依赖 hover
- 扩大 toggle 和 row 的点击区域
- 减少过细的点击目标
- 保证展开和节点进入不会误触

### 小屏环境

- 保持层级感，但缩进不能过深
- 节点行应优先保证点击区，而不是堆过多次级信息
- 必要时简化 icon / meta 区域

## 七、可访问性约束

共享层应至少满足：

- 层级结构可被语义化表达
- 当前项和焦点项可区分
- 键盘用户能完成遍历
- 展开与收起状态可感知
- 点击目标足够稳定

如果使用 ARIA tree 语义，需要谨慎，因为：

- `TOC` 和 `FileTree` 不一定都必须走同一套 ARIA 角色
- 共享层应先定义行为模型，再由业务层选择最合适的语义策略

一句话：

- 共享层保证“可操作”
- 业务层再决定“用哪种语义角色更合适”

## 八、共享层与业务层的边界

### 共享层负责

- 树结构骨架
- 行容器布局
- 缩进规则
- toggle 位置
- 基础 hover / focus / current 视觉
- 键盘方向导航模型
- 展开收起的基础节奏

### 业务层负责

- 数据结构映射
- 当前项计算
- 自动展开规则
- 搜索命中
- 文件类型图标
- 权限、菜单、拖拽、懒加载
- TOC 的阅读定位状态机

## 九、推荐组件命名

共享 pattern 层推荐命名：

- `TreeNav`
- `TreeNavItem`
- `TreeNavRow`
- `TreeNavToggle`
- `TreeNavLabel`
- `TreeNavChildren`

业务层推荐命名：

- `TocTree`
- `FileTree`

不建议：

- 直接让 `TocTree` 复用 `FileTree` 全部实现
- 用 `FileNode` 这类强业务命名去承载 TOC

## 十、针对当前 SysFolio 的建议

当前最适合的做法是：

1. 先定义 `Tree Navigation Pattern`
2. 再让 `TocTree` 和 `FileTree` 同时复用这套模式层
3. TOC 的 active 规则继续由 TOC 状态机控制
4. File Tree 的 selected / expanded / search match 继续由文件树业务逻辑控制

视觉建议：

- 两者共享行高、缩进、展开箭头、当前项左侧指示
- 两者不强求同样的节点重量和状态数量

## 当前判断

`TOC` 和 `File Tree` 的最佳关系不是“完全独立”，也不是“完全同构复用”，而是：

`共享 Tree Navigation Pattern，拆分业务组件实现`

这是当前最稳、最容易扩展、也最不容易把交互语义搞混的方案。
