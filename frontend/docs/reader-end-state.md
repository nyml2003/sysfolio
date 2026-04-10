# Reader End State

> **本文档**：SysFolio 文档阅读器的终态架构蓝图。描述长期目标边界，不描述当前实现细节，也不承诺兼容现状。  
> **相关**：[文档索引](./README.md) · [当前架构](./architecture.md) · [状态管理](./state-management.md) · [测试策略](./testing-strategy.md) · [repository 数据边界](./repository-contract.md)

## Goal

- 把当前“由组件和 hooks 驱动的阅读页”升级为“由 reader core 驱动的阅读器系统”。
- 终态关注三件事：
  - 异步结果永远不会污染当前 UI
  - 阅读位置、TOC 激活、恢复提示来自同一个状态源
  - 数据层、阅读状态、DOM 执行层都可以独立测试和演进

## Design Principles

- **Single Source Of Truth**
  - 阅读器运行时只有一个事实源，避免同一业务状态散落在多个 hooks / refs / effects 中。
- **Latest Request Wins**
  - 新请求发起后，旧请求结果必须被取消或丢弃；不能“侥幸依赖返回顺序”。
- **State Is Explicit**
  - 阅读生命周期必须显式建模；不要把 `loading`、`restoring`、`navigating`、`reading` 藏在隐式 effect 联动里。
- **Persistence Flushes On Lifecycle**
  - 日常保存可以节流，但在路径切换、页面隐藏、卸载、程序滚动完成时必须显式 flush。
- **Adapters Execute, Core Decides**
  - DOM、observer、animation、focus trap 只负责读取和执行，不负责业务判断。
- **Failure Is Local**
  - 文件树、正文、右栏、overlay 都要局部失败、局部恢复，不允许一处失败拖垮整页。
- **Shell Behaves Like A Reader**
  - 页面外壳按阅读器设计，而不是按普通 SPA 设计：单一主内容区、稳定导航、明确的辅助信息区和可访问性约束。

## System Layers

### 1. Reader Core

- 职责：
  - 持有阅读器唯一事实源
  - 协调 query、reading session、tree explorer、persistence、overlay a11y
  - 对 React 层暴露 selectors 和 actions
- 输入：
  - query layer 的资源快照
  - 用户事件
  - DOM adapter 发回的观测事件
- 输出：
  - UI 可消费的派生状态
  - 面向 adapter 的执行指令
- 不负责：
  - 直接访问 DOM
  - 直接发网络 / storage 请求

### 2. Query Layer

- 职责：
  - key-based cache
  - request dedupe
  - cancellation
  - stale result discard
  - retry / refresh
- 输入：
  - datasource / repository adapter
  - query key
  - invalidation / reload 请求
- 输出：
  - 统一 query state
- 不负责：
  - 阅读器业务判断
  - DOM 协调

### 3. Reading Session State Machine

- 职责：
  - 管理文档阅读生命周期
  - 统一决定 TOC 激活、恢复提示、程序滚动、阅读进度保存时机
- 输入：
  - 文档加载结果
  - 用户滚动 / TOC 点击 / 路由切换 / 页面隐藏等事件
- 输出：
  - 当前阅读状态
  - 持久化意图
  - 程序滚动意图
- 不负责：
  - 自己直接执行滚动
  - 自己直接写 storage

### 4. Persistence Layer

- 职责：
  - 恢复阅读进度
  - 节流保存
  - 生命周期 flush
- 输入：
  - document identity
  - current position
  - flush reason
- 输出：
  - 已保存位置
  - 恢复结果
  - 保存错误
- 不负责：
  - 决定什么时候进入 `reading` 或 `restoring`

### 5. DOM Adapter Layer

- 职责：
  - 读取滚动容器位置
  - 读取 heading 布局
  - 监听 Intersection / Resize / keyboard / focus
  - 执行滚动、focus trap、restore focus
- 输入：
  - Reader Core 下发的执行指令
- 输出：
  - 标准化的 DOM 观测事件
- 不负责：
  - 判断当前 heading 是否应该成为业务 active heading
  - 决定 overlay 是否应该关闭

### 6. Shell / Accessibility Layer

- 职责：
  - 稳定布局阅读器外壳
  - 保证 overlay、PathBar、Tree、TOC 的可访问性语义
- 输入：
  - Reader Core selectors
- 输出：
  - 用户可操作的阅读器 UI
- 不负责：
  - 存储 query 状态
  - 持久化阅读位置

## Reader Core Domains

Reader Core 内部至少拆成 5 个子域：

1. `content-query domain`
   - 当前路径对应的内容资源、context 资源、错误状态
2. `tree-navigation domain`
   - 文件树节点、展开状态、选中状态、焦点状态、节点级错误
3. `reading-session domain`
   - 当前文档 identity、阅读位置、激活 heading、restore 提示、程序滚动状态
4. `persistence domain`
   - 保存中的状态、最近一次保存位置、恢复结果、flush reason
5. `overlay-accessibility domain`
   - 当前 overlay、focus return target、Escape / keyboard trap 状态

React 组件只能通过：

- `useReaderSelector(selector)`
- `useReaderActions()`

访问这些子域；组件不得直接读 repository，也不得在 feature 组件内自行维护同一份业务状态副本。

## Query Model

终态至少需要下列查询对象：

| Query | Key | Purpose |
| --- | --- | --- |
| `document by path` | `["document", locale, path]` | 解析当前正文内容 |
| `context by path` | `["context", locale, path]` | 解析 breadcrumbs / parent / recent / stats |
| `tree root` | `["tree-root", locale]` | 加载根层与首屏骨架 |
| `children by node` | `["tree-children", locale, nodeId]` | 目录按需展开 |
| `reading progress` | `["reading-progress", documentIdentity]` | 恢复阅读位置 |
| `preferences` | `["preferences"]` 或细分 key | 主题、密度、locale、onboarding |

每个 query state 统一至少包含：

- `status`
- `data`
- `error`
- `requestKey`
- `requestVersion`
- `retry()`
- `reload()`

统一规则：

- 新请求发起时递增 `requestVersion`
- 返回结果如果 version 不匹配，直接丢弃
- 可以取消的请求优先取消
- 不能取消的请求必须忽略过期结果
- UI 不直接把“上次请求的数据”当作“本次状态的真相”

## Reading Session State Machine

### States

| State | Meaning |
| --- | --- |
| `booting` | reader core 还在建立初始运行时 |
| `loading_document` | 当前路径文档尚未可读 |
| `restoring_progress` | 文档已就绪，正在恢复上次位置 |
| `positioning` | 正在把视图放到初始或恢复位置 |
| `reading` | 用户可正常阅读、TOC 正常跟随 |
| `navigating_to_heading` | 程序正在执行 TOC / 回顶导航 |
| `short_content` | 内容不具备滚动阅读语义 |
| `error` | 当前文档或恢复流程失败 |

### Events

| Event | Meaning |
| --- | --- |
| `PATH_CHANGED` | 当前路径切换 |
| `DOCUMENT_LOADED` | query layer 返回正文 |
| `DOCUMENT_FAILED` | 正文加载失败 |
| `RESTORE_RESOLVED` | 恢复位置完成 |
| `USER_SCROLLED` | 用户滚动正文 |
| `TOC_ITEM_SELECTED` | 用户点击 TOC |
| `PROGRAM_SCROLL_COMPLETED` | 程序滚动完成 |
| `PROGRAM_SCROLL_INTERRUPTED` | 用户打断程序滚动 |
| `PAGE_HIDDEN` | 页面进入 hidden |
| `UNLOAD` | 路由切换 / 卸载 |
| `PERSIST_SUCCEEDED` | 保存成功 |
| `PERSIST_FAILED` | 保存失败 |

### Session Outputs

下列 UI 信号必须统一由 reading session 导出，而不是由多个 hooks 各自推断：

- `activeHeadingId`
- `restoreNoticeVisible`
- `canRestore`
- `lastSavedPosition`
- `isProgrammaticScrolling`
- `readingMode`（normal / short_content / restoring）

## Tree Explorer End State

文件树终态是完整的 explorer 子系统，不是“一个组件 + 一个 hook”。

### 数据状态

- `nodesById`
- `childrenByParentId`
- `nodeQueryStatusById`
- `nodeErrorById`
- `nodeFreshnessById`

### UI 状态

- `expandedIds`
- `selectedPath`
- `focusedNodeId`
- `typeaheadBuffer`
- `scrollAnchor`

### Hard Rules

- 节点级 children 加载失败只能污染该节点，不得污染整棵树
- locale 切换后旧 children 查询不得合并回当前树
- 深链路径必须能驱动祖先链自动展开
- virtualization 只是渲染优化，不是业务状态来源
- explorer 必须支持完整键盘导航：
  - 上下移动
  - 左折叠 / 到父级
  - 右展开 / 进入子级
  - `Home` / `End`
  - `Enter` / `Space`
  - typeahead

## Reading Progress End State

持久化层对 reading session 暴露 3 类动作：

- `restore(documentIdentity)`
- `scheduleSave(position)`
- `flush(reason)`

统一策略：

- 用户持续滚动时：后台 throttle / debounce
- 路由切换前：flush
- 页面隐藏时：flush
- 组件卸载前：flush
- 程序滚动完成时：flush

终态主键应以 **document identity** 为核心，而不是偶然 path 字符串；如果 path 会变化但文档 identity 不变，阅读进度仍应正确恢复。

## DOM Adapter Rules

DOM adapter 只允许做两类事：

1. **Read**
   - 读 scrollTop / clientHeight / scrollHeight
   - 读 heading offsets
   - 监听 observer / keyboard / focus
2. **Execute**
   - 执行滚动
   - 执行 focus trap
   - 恢复焦点

DOM adapter 必须禁止：

- 直接决定当前业务 active heading
- 直接切换 reader state
- 直接写持久化
- 把浏览器对象扩散到业务层

## Shell And Accessibility End State

Shell 必须满足：

- 页面只有一个 `main`
- 左右临时面板都是标准 dialog / drawer
- overlay 打开时 focus 进入 panel
- overlay 关闭时 focus 回到触发按钮
- 支持 `Escape` 关闭
- 背景内容不可误聚焦

PathBar、Tree、TOC 终态都必须有稳定的：

- landmark / aria label
- keyboard navigation
- current / selected / expanded / focused 语义
- screen reader 可读顺序

## What This Replaces

终态会替换掉下列模式：

- 组件内手写 `useEffect + async + setState`
- 多个 hooks 共同维护一个阅读流程
- debounce-only 的阅读进度保存
- DOM adapter 混入业务判断
- repository 被页面层直接消费后再各自拼接状态

## Acceptance Criteria

满足以下条件时，才算接近终态：

- 旧请求结果无法污染当前 UI
- 阅读位置、TOC 激活、restore hint 来自同一个状态源
- 文件树、正文、右栏、overlay 均可局部失败、局部恢复
- query layer、reading session、DOM adapters 可独立单测
- e2e 能覆盖：
  - 从树进入正文
  - TOC 导航
  - 阅读进度恢复
  - locale / layout 切换
  - overlay 键盘交互与焦点恢复

## Relation To Current Docs

- `architecture.md`
  - 描述当前与近期实现约束
- `state-management.md`
  - 描述当前 store / Context / 局部状态放置规则
- `testing-strategy.md`
  - 描述当前质量门槛与现阶段测试分层

本文件只定义终态蓝图，不替代上述当前规则文档。
