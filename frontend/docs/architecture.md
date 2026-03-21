# Architecture

## Scope

- `0.5` 期只实现文件系统视图。
- 当前中心区正式支持三种渲染态：
  - `home`
  - `directory`
  - `article`
- 左侧导航 `0.5` 期不做搜索 UI、不做标签树 UI、不做筛选 UI。
- taxonomy、tag、按时间/按分类导航只定数据结构与接口预留，不定 UI。

## Layers

1. `app`
   - 路由入口、页面壳、少量全局 providers
2. `shared/data`
   - repository 接口
   - mock repository
   - 偏好层 adapter
3. `entities/content`
   - 内容实体、导航视图、taxonomy 预留结构
4. `shared/store`
   - 极少数全局统一状态
5. `features/*`
   - 文件树、内容区、右栏、主题、引导
6. `shared/ui`
   - tokens、atomic、molecular、primitives
7. `shared/lib`
   - 纯 TS 模型与算法

## Runtime Flow

1. `react-router-dom` 解析 URL。
2. 路由层把 URL 归一化为 content path。
3. 页面层通过 repository 的聚合读取入口按 path 获取可渲染资源。
4. repository 内部先解析 `path -> node`，再根据 `documentId` 读取具体内容。
5. `ContentPane` 根据节点 kind 分派到 `HomeRenderer`、`DirectoryView` 或 `ArticleRenderer`。
6. theme、onboarding、reading progress 通过统一偏好层读写。
7. 页面级复杂状态优先通过动态 Provider Context 在 feature 根部创建，而不是直接进全局 store。

## Data Shape Rules

- 内部数据只允许：
  - `number`
  - `string`
  - `boolean`
  - 数组
  - `Option<T>`
  - 由这些组成的结构体
- 枚举语义允许，但运行时值必须落成字符串或数字常量。
- `Option<T>` 和 `Result<E, T>` 都作为 `shared` 基础工具类型存在。
- `Result<E, T>` 只允许用于工具方法和边界层：
  - 网络
  - native 桥
  - 浏览器 API 适配
  - storage / URL / 外部输入适配
- 前端业务代码不直接传递或存储 `Result<E, T>`。
- 内部数据不使用：
  - `null`
  - `undefined`
  - `Date`
  - `Map`
  - `Set`
  - `Proxy`
  - 其他复杂 class 实例
- 时间字段统一使用 ISO 字符串或时间戳。

## Error And Loading Semantics

- 业务层不用 `Result` 表达页面资源状态。
- 失败边界通过显式资源状态表达：
  - `idle`
  - `loading`
  - `ready`
  - `empty`
  - `error`
- 这样建模的原因是：前端关心的不只是“成功 / 失败”，还关心“尚未加载”“加载中”“成功但为空”等 UI 生命周期。
- `Result` 可以在底层工具方法和边界适配层里使用，但进入 feature、store、renderer 前必须转换成业务层可读的资源状态。
- repository 边界负责把异常输入转换为显式状态结构，不把异常直接扩散到 feature 层。

## Resource State Shape

- 资源状态统一使用纯数据 TS 类型。
- 推荐统一形状：

```ts
type ResourceState<T, E> =
  | { tag: "idle" }
  | { tag: "loading" }
  | { tag: "ready"; value: T }
  | { tag: "empty"; reason: Option<string> }
  | { tag: "error"; error: E };
```

- `tag` 是唯一判定字段。
- `empty` 与 `error` 分离，避免“无内容”和“加载失败”混淆。
- `Option<string>` 只作为最小 empty reason 占位，后续如果需要更强语义，再升级为明确的枚举或结构体。

## Rendering Constraints

- 左侧树必须虚拟化。
- 正文区域优先服从阅读节奏。
- 右栏只展示当前文档上下文，不重复主导航。
- 中栏统一为 `ContentPane`，目录节点与文件节点共用同一个页面壳。
- `home`、`directory` 与 `article` 都通过 repository 进入前端，但内容模型彼此独立。
