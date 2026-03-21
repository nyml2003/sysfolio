# Architecture

## Scope

- `0.5` 期只实现文件系统视图。
- 当前正式可打开文件类型只有 `home` 和 `article`。
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
   - 文件树、阅读区、右栏、主题、引导
6. `shared/ui`
   - tokens、atomic、molecular、primitives
7. `shared/lib`
   - 纯 TS 模型与算法

## Runtime Flow

1. `react-router-dom` 解析 URL。
2. 路由层把 URL 归一化为 content path。
3. repository 根据 path 返回节点和对应内容状态。
4. renderer 根据节点 kind 分派到 `HomeRenderer` 或 `ArticleRenderer`。
5. theme、onboarding、reading progress 通过统一偏好层读写。
6. 页面级复杂状态优先通过动态 Provider Context 在 feature 根部创建，而不是直接进全局 store。

## Data Shape Rules

- 内部数据只允许：
  - `number`
  - `string`
  - `boolean`
  - 数组
  - `Option<T>`
  - 由这些组成的结构体
- 枚举语义允许，但运行时值必须落成字符串或数字常量。
- 内部数据不使用：
  - `null`
  - `undefined`
  - `Result`
  - `Date`
  - `Map`
  - `Set`
  - `Proxy`
  - 其他复杂 class 实例
- 时间字段统一使用 ISO 字符串或时间戳。

## Error And Loading Semantics

- 业务层不用 `Result`。
- 失败边界通过显式资源状态表达：
  - `idle`
  - `loading`
  - `ready`
  - `empty`
  - `error`
- 这样建模的原因是：前端关心的不只是“成功 / 失败”，还关心“尚未加载”“加载中”“成功但为空”等 UI 生命周期。
- 如果改用 `Result`，业务层仍然需要额外维护加载阶段状态，最终会让状态表达变成双层结构。
- repository 边界负责把异常输入转换为显式状态结构，不把异常直接扩散到 feature 层。

## Rendering Constraints

- 左侧树必须虚拟化。
- 正文区域优先服从阅读节奏。
- 右栏只展示当前文档上下文，不重复主导航。
- `home` 与 `article` 共用页面壳，且都通过 repository 进入前端，但内容模型彼此独立。
