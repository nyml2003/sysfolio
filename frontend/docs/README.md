# Frontend 文档

本目录是 **`frontend/`** 规范的唯一索引：具体规则分散在各 `.md` 文件中，**不在此重复细则**。先根据下面的「按任务」或「按主题」定位到单篇，再深入阅读。

---

## 新人从哪读起

按顺序读这 **4 篇** 即可覆盖日常开发的主干约束：

1. `[architecture.md](./architecture.md)` — 分层、`site` 与 `app`、数据形状、资源状态
2. `[code-organization.md](./code-organization.md)` — TSX/hooks、单文件职责、import、常量
3. `[i18n.md](./i18n.md)` — UI 文案放哪、`useUiCopy`、与 `constant` 分工
4. `[option-result.md](./option-result.md)` — `Option` / `Result` 怎么用、哪一层能用

其余文档 **按需查阅**（见下表）。

---

## 按任务找文档


| 你想做的事                        | 打开                                                                                              |
| ---------------------------- | ----------------------------------------------------------------------------------------------- |
| 搞清楚目录结构、数据从哪进页面              | `[architecture.md](./architecture.md)`、`[repository-contract.md](./repository-contract.md)`     |
| 写组件 / hook / 拆文件             | `[code-organization.md](./code-organization.md)`                                                |
| 加中英文字符串、换语言                  | `[i18n.md](./i18n.md)`                                                                          |
| 用 `Option`、`Result`、资源 `tag` | `[option-result.md](./option-result.md)`、`[architecture.md](./architecture.md)` 中 ResourceState |
| 状态放 store 还是 Context         | `[state-management.md](./state-management.md)`                                                  |
| 想了解文档阅读器终态架构 / 长期重构方向 | `[reader-end-state.md](./reader-end-state.md)`                                                   |
| 写样式、主题、token                 | `[styling-system.md](./styling-system.md)`、`[theme-mapping.md](./theme-mapping.md)`             |
| 能不能用原生 `button`/`input` 等      | `[code-organization.md](./code-organization.md)`（UI 库与原生 HTML）                              |
| 内容类型、节点 kind                 | `[content-model.md](./content-model.md)`                                                        |
| mock、fixtures、测试数据           | `[mock-data-spec.md](./mock-data-spec.md)`                                                      |
| 合并前跑什么命令                     | `[testing-strategy.md](./testing-strategy.md)`                                                  |
| 能用哪些依赖、`zod` 放哪              | `[dependencies.md](./dependencies.md)`                                                          |
| 搜索/标签导航（预留）                  | `[search-and-tag-navigation.md](./search-and-tag-navigation.md)`                                |
| 树性能、memo                     | `[performance-rules.md](./performance-rules.md)`                                                |
| 项目阶段、路线图                     | `[implementation-phases.md](./implementation-phases.md)`                                        |


---

## 按主题分组（全列表）

### 架构与运行时


| 文档                                                   | 一句话                                               |
| ---------------------------------------------------- | ------------------------------------------------- |
| `[architecture.md](./architecture.md)`               | `0.5` 范围、Layers、`site`、运行时数据规则、ResourceState、渲染约束 |
| `[repository-contract.md](./repository-contract.md)` | 唯一数据边界、API 列表、返回形状、读路径约定                          |
| `[reader-end-state.md](./reader-end-state.md)`       | 阅读器终态蓝图：Reader Core、Query Layer、State Machine、DOM Adapter |


### 代码写法与工具类型


| 文档                                               | 一句话                                             |
| ------------------------------------------------ | ----------------------------------------------- |
| `[code-organization.md](./code-organization.md)` | **一文件一主抽象**、TSX/hooks、**UI 库与原生标签**、文件命名、`constant` vs 文案、import 方向 |
| `[option-result.md](./option-result.md)`         | `Option`/`Result` 形状、helper、层级禁区                |
| `[i18n.md](./i18n.md)`                           | UI 文案表、locale、`useUiCopy`、场景 copy、`lang`        |


### 领域与数据


| 文档                                                               | 一句话                             |
| ---------------------------------------------------------------- | ------------------------------- |
| `[content-model.md](./content-model.md)`                         | 内容实体、渲染态、节点 kind、与 `0.5` 关系     |
| `[mock-data-spec.md](./mock-data-spec.md)`                       | fixtures、generator、树规模、可复现 mock |
| `[search-and-tag-navigation.md](./search-and-tag-navigation.md)` | 搜索/标签预留，**本阶段不定 UI**            |


### 样式与主题


| 文档                                         | 一句话                               |
| ------------------------------------------ | --------------------------------- |
| `[styling-system.md](./styling-system.md)` | CSS 分层、tokens→atomic→molecular、审批 |
| `[theme-mapping.md](./theme-mapping.md)`   | 主题与语义 token 映射                    |


### 状态与性能


| 文档                                               | 一句话                                   |
| ------------------------------------------------ | ------------------------------------- |
| `[state-management.md](./state-management.md)`   | 全局 vs Context vs 局部、偏好、为何不滥用 `Result` |
| `[performance-rules.md](./performance-rules.md)` | 树虚拟化、按需加载、memo 策略                     |


### 质量与工程


| 文档                                             | 一句话                                     |
| ---------------------------------------------- | --------------------------------------- |
| `[testing-strategy.md](./testing-strategy.md)` | `lint` / `typecheck` / `test`、测试分层、必覆盖点 |
| `[dependencies.md](./dependencies.md)`         | 工具链、第三方、`zod` 边界                        |


### 规划


| 文档                                                       | 一句话                    |
| -------------------------------------------------------- | ---------------------- |
| `[implementation-phases.md](./implementation-phases.md)` | Phase 0 / 0.5 / 1、完成定义 |


---

## 核心原则（跨文档共识）

- **分层**：页面聚合读走 repository；业务不扩散 `Result`；可选业务值用 `Option<T>`。  
- **报备**：未约定的 class、样式类别、共享抽象、领域/repository 形状，落代码前先对齐。  
- **单文件单职责**：默认**一文件一个主导出**（单函数 / 单类 / 单 hook / 单组件），仅允许未导出辅助函数与少量例外（barrel、monad 工具、i18n 大表等）；细则见 `code-organization.md`。  
- **界面语言**：用户可见文案与 locale 走 i18n copy（见 `i18n.md`）。  
- **UI 与原生标签**：除 `shared/ui`（及 `shared/lib/dom` 等适配实现）外，业务代码不直接用浏览器原生 **交互/表单类**标签拼产品 UI；用 UI 库 primitives/layout；细则见 `code-organization.md`。  
- **质量门槛**：合并前 `pnpm lint`、`pnpm typecheck`、`pnpm test`（见 `testing-strategy.md`）。

---

## 仓库共识

- 规范仅约束 **`frontend/`** 目录。  
- **`app`** 与 **`site`**：`app` 主产品壳；`site`（如 overview）并列入口，复用 `features`/`shared`，勿让主工程依赖 `site` 专有实现（分层见 `architecture.md`）。  
- **`0.5` 期**：核心边界不临时发明；与阶段不符的能力见 `implementation-phases.md`。
