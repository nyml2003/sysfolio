# SysFolio Design TODO

## 文档目的

这份文档维护当前 handoff 仍待完成的设计工作。  
它只记录未完成项、优先级和维护规则，不重复描述已经定稿的规范。

已完成内容进入 [CHANGELOG.md](CHANGELOG.md)。  
整体设计模型见 [design-overview.md](design-overview.md)。

## Now

这些是当前最应继续推进的事项：

1. 补齐 primitive 缺口，重点收口 `Select / Combobox / Menu / DialogContent / TableRow / DrawerContent` 的高级场景。
2. 收完整交互状态矩阵，补齐 `success / warning / destructive / drag-target / reordering` 在不同 primitive 与 pattern 中的边界。
3. 定稿 `medium / compact` 下左右栏、TOC、ContextPanel 与 PathBar 的最终交互策略。
4. 再收一轮 `TOC / FileTree / PathBar` 的状态层级，明确 `current / selected / search-match / clickable` 的视觉差异。
5. 校准 `Home / Directory / Document` 三类视图在 `comfortable / medium / compact` 使用场景下的密度与状态容器重量。

## Next

这些工作排在当前主线之后：

1. 复核 dark theme 下的阅读舒适度、导航 ownership、语义色和代码内容对比度。
2. 统一 motion 节奏，补齐 overlay、panel、tree expansion 和 onboarding 的 reduced motion 降级。
3. 补完整树导航相关的键盘与多输入行为说明，确保 `TreeNav pattern` 可被 TOC / FileTree 稳定复用。
4. 继续补齐 primitive 组件目录中的“已支持 / 待扩展”差异，避免文档和 CSS 漏同步。

## Later

这些属于后续业务内容或更晚一轮的视觉工作：

1. `footer / comments / recommendations` 等 document page 的业务内容模块。
2. 更完整的列表搬运场景，例如批量选择、拖拽把手、重排预览与落点提示。
3. 进一步收敛命名与 selector 体系，评估是否要从当前 `.m-*` 迁移到更明确的层级命名。

## Ownership

按当前文档分工维护待办：

| 范围 | 主文档 |
| --- | --- |
| 设计总方向与推进顺序 | `design-todo.md` |
| primitive 基线与视觉边界 | `primitive-visual-spec.md` |
| primitive 组件合同与缺口 | `primitive-component-catalog.md` |
| 状态矩阵与 view-state 分层 | `interaction-state-matrix.md` |
| TOC / FileTree / PathBar 导航规则 | `navigation-state-spec.md` |
| 响应式、多端交互、左右栏布局 | `layout-behavior-spec.md` |
| 业务视图密度与状态容器语气 | `view-density-spec.md` |
| 深色主题 | `dark-theme-spec.md` |
| 动效 | `motion-spec.md` |

## 维护规则

1. 当前待办只维护在这份文档和对应 active spec 的 `Remaining TODO` 段落里。
2. `CHANGELOG.md` 只记录已完成变更，不记录未完成项。
3. 新的讨论型或过程型专题文档，默认先吸收到现有 active docs；只有在现有结构无法承载时才新建。
4. 已被吸收的阶段性文档移入 `archive/`，避免继续作为并行主入口。
