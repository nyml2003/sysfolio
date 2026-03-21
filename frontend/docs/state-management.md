# State Management

## Rule

- 真正全局统一的状态才进全局 store / 全局 Provider
- 复杂 feature 状态优先放动态创建的 Provider Context
- 简单局部状态留在 hook / component
- 不用 `Result`
- 不用 `null` / `undefined`
- 可选值统一使用 `Option<T>`

## Why Not `Result`

- 前端资源状态不只有“成功 / 失败”两种。
- 对页面来说，真正需要表达的是：
  - `idle`
  - `loading`
  - `ready`
  - `empty`
  - `error`
- 如果业务层统一使用 `Result<Err, T>`，仍然需要在外层再套一层“是否开始加载、是否正在加载、是否为空”的状态。
- 这样会把状态拆成两层：
  - 一层表示加载生命周期
  - 一层表示成功或失败
- 对前端 UI 来说，这种拆法会让 renderer、provider、selector 的分支判断更绕。
- 因此业务层直接使用显式资源状态联合，而不是通用 `Result`。

## Resource State Example

- 文章资源建议表达成这种思路：
  - `idle`: 还没触发加载
  - `loading`: 正在加载
  - `ready`: 成功拿到文档
  - `empty`: 请求成功但没有内容
  - `error`: 请求失败
- 这样 UI 可以直接一一映射到骨架屏、正文、空态、错误态，而不需要先解包 `Result` 再判断额外状态。

## Global Scope

全局 Provider 应该比较少，只保留跨页面、跨 feature、跨生命周期都需要统一读取的状态。

### 允许进入全局 store / 全局 Provider 的状态

- `theme`
  - 当前主题枚举
  - 已持久化主题偏好快照
- `onboarding`
  - 是否已完成首次引导
- `deep-link intent`
  - 路由解析后需要跨区共享的跳链参数
  - 例如进入某篇文章时的锚点、恢复位置或初始聚焦目标
- `navigation view id`
  - 未来多导航视图上线后，当前采用哪种导航视图
  - `0.5` 期可只预留，不必实现

## Dynamic Provider Scope

下列状态不应直接进入全局 store，而应在页面壳或 feature 根部动态创建 Context Provider：

- 文件树状态
  - 当前展开集
  - 当前可见节点
  - 当前加载页
  - 懒加载中的目录状态
- 当前内容状态
  - 当前可渲染文件资源
  - 右栏上下文信息
  - 当前页面级错误 / empty / loading
- 阅读态状态
  - 当前 active heading
  - 当前文章恢复提示
  - 当前页内阅读位置同步
- 面板级 UI 状态
  - 左栏抽屉开关
  - 右栏面板显隐
  - 页内浮层协调状态

## Non-store Scope

- hover
- focus
- 局部浮层开关
- 单组件内的短生命周期派生值

## Boundary Rule

- 全局 store / Context 都不直接读浏览器 API
- 偏好读写通过 repository-style adapter 进入
- 路由是路径和 query 的事实来源，除非需要跨 feature 协调，否则不复制到全局 store

## Provider Rule

- App 根部全局 Provider 数量必须克制
- 复杂状态优先在 feature 根部按需创建 Provider Context
- 如果某个状态只在单个页面树内使用，就不升级为全局 Provider
