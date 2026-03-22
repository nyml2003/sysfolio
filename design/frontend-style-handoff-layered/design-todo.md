# SysFolio Design TODO

## 文档目的

这份文档维护当前 handoff 仍待完成的设计工作。  
它只记录未完成项、优先级和维护规则，不重复描述已经定稿的规范。

已完成内容进入 [CHANGELOG.md](CHANGELOG.md)。  
整体设计模型见 [design-overview.md](design-overview.md)。

两份调研补充材料：

- [preference-system-research-report.md](preference-system-research-report.md)
- [ui-ux-system-gap-research-report.md](ui-ux-system-gap-research-report.md)

## Now

这些是当前最应继续推进的事项：

1. 补齐 primitive 缺口，重点收口 `Select / Combobox / Menu / DialogContent / TableRow / DrawerContent` 的高级场景，并继续推进 `Text / Label / Link / SearchInput / NumberInput / DateInput / Slider / Toolbar / ListItem / MessageBar / Banner` 这批 `priority-next` 原件。
2. 收完整交互状态矩阵，补齐 `success / warning / destructive / drag-target / reordering` 在不同 primitive 与 pattern 中的边界。
3. 定稿 `medium / compact` 下左右栏、TOC、ContextPanel 与 PathBar 的最终交互策略。
4. 再收一轮 `TOC / FileTree / PathBar` 的状态层级，明确 `current / selected / search-match / clickable` 的视觉差异。
5. 校准 `Home / Directory / Document` 三类视图在不同宽度和 `uiDensity` 下的密度与状态容器重量。
6. 把 preference system 的第二层细节补齐，尤其是 layout panel preference 与 density preference 的实际生效边界。

## System Gaps

这些是 2026-03-22 调研后确认的系统级缺口。  
它们不是单个 primitive 的补丁，而是会反向影响组件合同、页面交互和 handoff 验收标准的主骨架问题。

### `P0`

1. `messaging / recovery system`
   需要建立从 helper text、inline validation、section message、banner 到 blocking dialog 的升级梯度，以及 async completion / failure 的承接规则。
2. `findability / commanding system`
   需要建立 global search、scoped search、command palette、search result pattern 与键盘直达模型。
3. `accessibility contracts`
   需要正式定义 headings、landmarks、links vs buttons、focus return、truncation、drag alternatives 与 page-level a11y 验收合同。
4. `internationalization / bidi system`
   需要正式定义 RTL 镜像、leading / trailing、文本膨胀、双向文本与图标翻转边界。

### `P1`

1. `form UX system`
   需要把 field 家族从视觉合同扩展到 placeholder 边界、validation timing、helper text、long form / multi-step / progressive disclosure。
2. `data workbench system`
   需要把 Table 扩展到 toolbar、selection、batch action、sorting / filtering / search 组合和 row action。
3. `wait UX system`
   需要定义短等待 / 长等待、determinate / indeterminate、后台任务、完成与失败通知的信任模型。
4. `help / onboarding system`
   需要定义 always-visible help、helper text、teaching UI、first-run / release onboarding 的披露梯度。
5. `content semantics / UI writing`
   需要正式定义 heading hierarchy、summary/meta 语义、link text、button text 与 message writing 合同。
6. `governance / annotation / QA`
   需要建立设计标注模板、组件验收清单、a11y checklist 与 ready-for-handoff 基准。

## Next

这些工作排在当前主线之后：

1. 复核 dark theme 下的阅读舒适度、导航 ownership、语义色和代码内容对比度。
2. 统一 motion 节奏，补齐 overlay、panel、tree expansion 和 onboarding 的 reduced motion 降级。
3. 补完整树导航相关的键盘与多输入行为说明，确保 `TreeNav pattern` 可被 TOC / FileTree 稳定复用。
4. 继续补齐 primitive 组件目录中的“已支持 / 待扩展”差异，避免文档和 CSS 漏同步。
5. 评估第二批 preference，包含 `tocExpandDepth / fileTreeRevealMode / codeWrap` 等更细的阅读与导航偏好。
6. 将 `System Gaps` 中的 `P0` 能力优先吸收到现有 active specs，避免另起平行文档体系。

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
5. 系统级调研结论先写入本文件，再分配到对应 active spec 的 `Remaining TODO` 段落中。
