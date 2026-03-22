# SysFolio UI UX System Gap Research Report

研究日期：2026-03-22  
研究范围：除 preference system 以外，SysFolio 当前 UI UX 系统与业界成熟实践的差距  
研究方法：对照当前 `frontend-style-handoff-layered` active docs 与官方设计系统/平台规范

## 一、结论摘要

如果先不讨论 preference，当前 SysFolio UI UX 系统最大的结构性问题不是“样式还不够细”，而是：

`已经有视觉与分层骨架，但还没有完整的交互、信息、恢复、语义、国际化和治理系统。`

当前最值得优先补的 8 个系统缺口是：

1. `findability / commanding system`
   缺全局搜索、命令面板、搜索结果与范围切换模型。
2. `messaging / recovery system`
   缺从 helper text 到 banner / dialog 的消息升级与恢复梯度。
3. `form UX system`
   缺字段写法、placeholder 边界、验证时机、长表单结构等正式规范。
4. `accessibility as system`
   缺 headings、landmarks、links-vs-buttons、truncation、drag-drop alternatives、focus management 的正式合同。
5. `internationalization / bidi system`
   缺 RTL、leading/trailing、自然对齐、双向文本、文案膨胀的设计约束。
6. `data workbench system`
   缺 table toolbar、batch actions、selection model、inline actions、sorting/filter/search 组合规则。
7. `help / onboarding system`
   缺 contextual help、feature onboarding、teaching UI 的克制原则。
8. `wait UX system`
   缺长任务、后台任务、progress、completion、failure 的信任设计。

如果再压成一句话：

`当前 SysFolio 更像“有视觉语言的样式系统”，还不是“完整的产品交互系统”。`

## 二、当前 SysFolio 已覆盖的部分

从现有文档看，已经有明确工作的部分主要是：

- 分层架构：`tokens -> utilities -> primitives -> patterns -> business -> component`
- 响应式与多输入：`spacious / medium / compact` 与 `fine / coarse / hover / keyboard`
- navigation ownership：`TOC / FileTree / PathBar`
- view-state：`idle / loading / ready / empty / error`
- density、dark theme、motion
- primitive 家族基础盘点

这说明当前系统已经有：

- `visual grammar`
- `state grammar`
- `layout grammar`

但还缺：

- `task grammar`
- `recovery grammar`
- `content grammar`
- `semantic grammar`

## 三、业界成熟系统通常包含什么

调研到的官方实践显示，成熟 UI UX 系统通常不只覆盖组件外观，而会同时覆盖：

1. `navigation + search + command`
2. `messages + notifications + recovery`
3. `forms + validation + helper content`
4. `a11y contracts + semantic structure`
5. `localization + bidi`
6. `table/list workbench patterns`
7. `onboarding + help`
8. `wait UX`
9. `governance + annotation + checklists`

当前参考的官方来源包括：

- Apple HIG / Localization
- Fluent 2
- Carbon Design System
- Atlassian Design System
- Primer / GitHub
- VS Code Docs

## 四、主要缺口与业界对照

## 1. 缺 `findability / commanding system`

### 当前问题

SysFolio 现在有：

- `PathBar`
- `FileTree`
- `TOC`

但没有正式定义：

- 全局搜索入口
- 搜索范围切换
- 搜索结果视图
- 命令面板
- 键盘直达式导航

这意味着当前系统更偏“浏览式导航”，不够“查找式导航”。

### 业界信号

GitHub 已将 Command Palette 明确定义为：

- 导航
- 搜索
- 执行命令

三者合一的键盘入口，并且支持 context scope、快捷键自定义与命令模式切换。  
来源：GitHub Docs Command Palette  
https://docs.github.com/en/get-started/accessibility/github-command-palette

Fluent 也把 `Nav`、`Searchbox`、`Toolbar` 分开建模，而不是只做一个树。  
来源：

- https://fluent2.microsoft.design/components/web/react/core/nav/usage
- https://fluent2.microsoft.design/components/web/react/core/searchbox/usage
- https://fluent2.microsoft.design/components/web/react/core/toolbar/usage

### 对 SysFolio 的判断

当前缺的不是一个 `SearchBox` primitive，而是一套：

- `global search`
- `scoped search`
- `command palette`
- `search result pattern`

的 findability system。

### 建议优先级

`P0`

## 2. 缺 `messaging / recovery system`

### 当前问题

SysFolio 有：

- `InlineNotice`
- `Dialog`
- `Empty / Error / Loading state`

但没有正式定义消息梯度：

- helper / supporting text
- field validation
- inline message
- section message
- page message
- banner
- blocking dialog
- async completion / failure message

也没有定义：

- 什么情况下该 inline
- 什么情况下该 banner
- 什么情况下必须 blocking

### 业界信号

Fluent 的 MessageBar 明确区分：

- page / container / tab / drawer 等不同层级
- error / warning / success / info
- assertive / polite 的 `aria-live`

来源：
https://fluent2.microsoft.design/components/web/react/core/messagebar/usage

Primer 对 toast 的态度更激进，明确指出 toast 有显著的可访问性与可用性问题，并建议优先使用：

- banners
- dialogs
- inline validation
- 渐进式内容确认

来源：
https://primer.style/accessibility/patterns/accessible-notifications-and-messages/

Apple 也强调 alert 应少用，并且不要用 alert 去承载非必要信息。  
来源：
https://developer.apple.com/design/human-interface-guidelines/alerts

Atlassian 则把消息写作单独建成内容系统，要求错误消息说明：

- 发生了什么
- 为什么
- 下一步怎么做

来源：
https://atlassian.design/foundations/content/designing-messages/error-messages/

### 对 SysFolio 的判断

当前缺的不是“更多 notice 样式”，而是：

`feedback escalation ladder`

### 建议优先级

`P0`

## 3. 缺 `form UX system`

### 当前问题

SysFolio 已有 Input / Textarea / Select / Combobox / Field，但仍然缺：

- placeholder 使用边界
- helper text 与 validation message 的区分
- 验证时机策略
- required / optional 的系统语义
- 长表单、多步表单、渐进 disclosure
- 提交后焦点与错误汇总规则

### 业界信号

Primer 明确指出：

- placeholder 最好避免使用
- 如果用了，仍必须有清晰 label
- placeholder 会消失、可能不满足对比度、也可能在大字体下被截断

来源：
https://primer.style/accessibility/patterns/placeholders/

Fluent 的 Field / TextField 明确区分：

- label
- helper text
- validation message
- validation timing

来源：

- https://fluent2.microsoft.design/components/web/react/core/field/usage
- https://fluent2.microsoft.design/components/ios/core/textfield/usage

Atlassian 的 Forms pattern 已经把：

- 长表单
- 多步表单
- progressive disclosure
- validation and error messages

做成独立规范。  
来源：
https://atlassian.design/patterns/forms

### 对 SysFolio 的判断

当前 Field 家族已有基础视觉，但还没有完整的 form behavior system。

### 建议优先级

`P0`

## 4. 缺 `accessibility as system`

### 当前问题

SysFolio 当前有 focus、尺寸、reduced motion、主题这些基础意识，但仍然缺正式的系统性合同：

- headings hierarchy
- landmarks
- links vs buttons
- screen-reader naming
- truncation policy
- drag and drop alternatives
- focus return rules
- page-level a11y annotations / acceptance criteria

### 业界信号

Primer 明确把 accessibility 拆成：

- patterns
- design guidance
- checklists
- annotation toolkit

来源：
https://primer.style/accessibility/patterns/

Primer 对 headings 给出非常明确的设计与 handoff 规范：

- 不跳级
- 每页通常只一个 `h1`
- 设计稿要标注 heading level

来源：
https://primer.style/accessibility/patterns/primer-components/headings/

Primer 对 links vs buttons 也给出硬边界：

- link 用于导航
- button 用于动作

并强调 anchor/button 原生语义的 forced-color、focus、keyboard 能力。  
来源：
https://primer.style/accessibility/design-guidance/links-and-buttons/

Primer 对 truncation 明确指出：

- accessible truncation 很难
- 不应把 tooltip 当成万能补丁
- interactive text 不应被截断

来源：
https://primer.style/accessibility/patterns/truncation/

Primer 对 drag and drop 明确要求 multiple ways，而不是只给鼠标拖拽。  
来源：
https://primer.style/accessibility/patterns/drag-and-drop/

Apple 和 Fluent 也都把 larger text、control size、consistent navigation、focus management 作为基础，而不是额外优化。  
来源：

- https://developer.apple.com/design/human-interface-guidelines/accessibility
- https://fluent2.microsoft.design/accessibility

### 对 SysFolio 的判断

当前 SysFolio 的可访问性更多还停留在“局部能力”，还没有上升成：

`component accessibility contract + page semantics contract + QA checklist`

### 建议优先级

`P0`

## 5. 缺 `internationalization / bidi system`

### 当前问题

当前文档几乎没有正式覆盖：

- RTL 镜像
- `leading / trailing` 原则
- 文案膨胀
- 双向文本
- 图标翻转规则
- 表格/路径/工具条在 RTL 下的顺序变化

### 业界信号

Apple 对 RTL 的要求非常明确：

- UI 应镜像
- 应优先使用 `leading / trailing` 而不是 `left / right`
- 自然对齐和自然书写方向要进入文本系统
- 图片、图标、表格、工具栏要判断哪些该翻、哪些不该翻

来源：
https://developer.apple.com/library/archive/documentation/MacOSX/Conceptual/BPInternational/SupportingRight-To-LeftLanguages/SupportingRight-To-LeftLanguages.html

### 对 SysFolio 的判断

对于一个有：

- PathBar
- TOC
- FileTree
- 文档正文

的系统，不做 bidi/RTL，后面返工会很重。

### 建议优先级

`P0`

## 6. 缺 `data workbench system`

### 当前问题

虽然已有 `Table` 和 `TableRow` primitive，但没有定义：

- table toolbar
- selection model
- batch action bar
- row inline actions
- sorting / filtering / search 的组合策略
- row expansion
- pagination 行为

### 业界信号

Carbon 对 Data Table 的定义非常完整，明确包含：

- sorting
- row expansion
- table toolbar
- search
- multi-select & batch action
- inline actions
- pagination

来源：
https://v10.carbondesignsystem.com/components/data-table/usage/

Primer 的 ActionBar / Toolbar 也强调：

- groupings
- overflow
- roving tabindex / toolbar keyboard model

来源：
https://primer.style/product/components/action-bar/accessibility/

### 对 SysFolio 的判断

当前 Table 系统还停留在“行样式”和“状态样式”，没有进入“工作流工具表”层级。

### 建议优先级

`P1`

## 7. 缺 `help / onboarding system`

### 当前问题

SysFolio 虽然有 onboarding 样式入口，但没有完整规范：

- 什么是一次性欢迎
- 什么是 contextual help
- 什么是 teaching popover
- 什么时候该 inline explain
- 什么信息不能藏在 tooltip / popover 里

### 业界信号

Fluent Onboarding 明确要求 onboarding 应当：

- relevant
- non-distracting
- optional
- benefit-focused
- coherent

来源：
https://fluent2.microsoft.design/onboarding/

Fluent InfoLabel / Popover 也明确要求：

- critical info 不应藏在 info button / popover
- popover 只放补充信息

来源：

- https://fluent2.microsoft.design/components/web/react/core/infolabel/usage
- https://fluent2.microsoft.design/components/web/react/core/popover/usage

Primer 也把 feature onboarding 做成正式模式，并强调 proximity 与 proportion。  
来源：
https://primer.style/ui-patterns/feature-onboarding/

### 对 SysFolio 的判断

当前还没有：

`help disclosure ladder`

即：

- always-visible help
- helper text
- inline explanation
- teaching UI
- first-run / release onboarding

### 建议优先级

`P1`

## 8. 缺 `wait UX system`

### 当前问题

SysFolio 已有 loading / skeleton / progress，但还缺：

- 短等待 vs 长等待的分界
- determinate vs indeterminate 的使用边界
- completion / failure 的后续反馈
- 用户在等待期间能做什么
- 是否允许后台继续工作
- 长任务结束如何通知

### 业界信号

Fluent 的 Wait UX 明确要求：

- 用户要知道发生了什么、为什么
- 有进度时优先 determinate
- skeleton / shimmer 要保留结构感
- 短等待不必强行动画

来源：
https://fluent2.microsoft.design/wait-ux

Fluent 的 Progress Bar 和 Activity Indicator 也强调：

- 长于 1 秒才考虑 progress
- indeterminate 不适合长时间任务
- progress 不应倒退

来源：

- https://fluent2.microsoft.design/components/web/react/core/progressbar/usage
- https://fluent2.microsoft.design/components/ios/core/activityindicator/usage

### 对 SysFolio 的判断

当前 loading 更像视觉状态，还不是完整的 trust-building wait system。

### 建议优先级

`P1`

## 9. 缺 `content and information semantics`

### 当前问题

SysFolio 已有阅读页密度，但仍缺：

- 标题层级与语义标注规范
- landmarks
- 文案语气与 message writing
- link text / button text 命名规则
- 文档型页面的 heading / summary / meta 语义合同

### 业界信号

Primer 对 headings 明确要求设计稿标注 heading level。  
来源：
https://primer.style/accessibility/patterns/primer-components/headings/

Atlassian 把 content design 单独当成系统基础能力，而不是后置文案修饰。  
来源：
https://atlassian.design/get-started/content-design/

Atlassian 的 error / empty / info messages 也都以“文案合同”方式给出规范。  
来源：

- https://atlassian.design/foundations/content/designing-messages/error-messages/
- https://atlassian.design/foundations/content/designing-messages/empty-state/
- https://atlassian.design/foundations/content/designing-messages/info-messages/

### 对 SysFolio 的判断

当前阅读系统已经有版式，但还缺：

`content semantics + UI writing system`

### 建议优先级

`P1`

## 10. 缺 `governance / annotation / QA system`

### 当前问题

当前 handoff 主要是规范文档，但没有明确：

- 设计注释模板
- 组件验收清单
- accessibility checklist
- semantic annotation
- 什么时候算 ready for handoff

### 业界信号

Primer 把 accessibility 做成：

- designer checklist
- engineering checklist
- annotation toolkit

来源：
https://primer.style/accessibility/patterns/

Carbon 大量组件文档带 `usage / style / code / accessibility` 四联结构。  
来源示例：
https://v10.carbondesignsystem.com/components/data-table/accessibility/

### 对 SysFolio 的判断

当前规范已经不少，但缺“如何被 consistently 执行和验收”的治理层。

### 建议优先级

`P1`

## 五、建议的优先级路线

## Phase A：先补系统合同

1. `messaging / recovery system`
2. `findability / commanding system`
3. `a11y contracts`
4. `i18n / bidi contracts`

原因：

- 这四项会反向影响 navigation、layout、view state、copy、component API。

## Phase B：再补高频任务系统

1. `form UX system`
2. `data workbench system`
3. `wait UX system`
4. `help / onboarding system`

原因：

- 这些会直接影响真实前端页面行为和交互成本。

## Phase C：最后补治理

1. `content semantics`
2. `annotation templates`
3. `design QA / accessibility QA`

原因：

- 这是让系统长期不漂移的基础设施。

## 六、对当前文档结构的建议

如果按现有 active docs 继续收敛，建议不要再为每个点都新开文件。

更稳的吸收方式：

- `design-overview.md`
  只保留总模型与总边界
- `primitive-component-catalog.md`
  补 `SearchBox / CommandBar / MessageBar / Banner / ActionBar / TableToolbar / BatchActionBar`
- `interaction-state-matrix.md`
  补消息升级与 async result 状态
- `navigation-state-spec.md`
  补 search / command / truncation / heading semantics
- `layout-behavior-spec.md`
  补 landmarks、global search 入口、RTL 结构镜像
- `view-density-spec.md`
  补 content semantics、heading hierarchy、text scale 对版式的影响
- `dark-theme-spec.md`
  补 contrast / forced-colors 的对象级规则
- `motion-spec.md`
  补 wait UX 与 message transitions

如果后续确实要新增文档，我只建议新增两份：

1. `accessibility-contract.md`
2. `message-and-recovery-spec.md`

因为这两个缺口目前最系统化，也最容易污染其他文档。

## 七、最终判断

对当前 SysFolio 来说，除了 preference 之外，最大的系统问题不是“缺更多视觉稿”，而是：

`缺少搜索与命令、消息与恢复、语义与可访问性、国际化与数据工作流这几条产品级主骨架。`

如果只列最关键的前 6 项，我建议是：

1. `messaging / recovery system`
2. `findability / commanding system`
3. `accessibility contracts`
4. `internationalization / bidi`
5. `form UX system`
6. `data workbench system`

## 参考来源

以下均为 2026-03-22 访问的官方来源：

- GitHub Docs: [GitHub Command Palette](https://docs.github.com/en/get-started/accessibility/github-command-palette)
- Primer: [Accessible notifications and messages](https://primer.style/accessibility/patterns/accessible-notifications-and-messages/)
- Primer: [Placeholders](https://primer.style/accessibility/patterns/placeholders/)
- Primer: [Headings](https://primer.style/accessibility/patterns/primer-components/headings/)
- Primer: [Links and buttons](https://primer.style/accessibility/design-guidance/links-and-buttons/)
- Primer: [Truncation](https://primer.style/accessibility/patterns/truncation/)
- Primer: [Drag and Drop](https://primer.style/accessibility/patterns/drag-and-drop/)
- Primer: [Accessibility patterns](https://primer.style/accessibility/patterns/)
- Primer: [Feature onboarding](https://primer.style/ui-patterns/feature-onboarding/)
- Fluent 2: [Accessibility](https://fluent2.microsoft.design/accessibility)
- Fluent 2: [Nav usage](https://fluent2.microsoft.design/components/web/react/core/nav/usage)
- Fluent 2: [Searchbox usage](https://fluent2.microsoft.design/components/web/react/core/searchbox/usage)
- Fluent 2: [Toolbar usage](https://fluent2.microsoft.design/components/web/react/core/toolbar/usage)
- Fluent 2: [MessageBar usage](https://fluent2.microsoft.design/components/web/react/core/messagebar/usage)
- Fluent 2: [Field usage](https://fluent2.microsoft.design/components/web/react/core/field/usage)
- Fluent 2: [Text field usage](https://fluent2.microsoft.design/components/ios/core/textfield/usage)
- Fluent 2: [Popover usage](https://fluent2.microsoft.design/components/web/react/core/popover/usage)
- Fluent 2: [Info label usage](https://fluent2.microsoft.design/components/web/react/core/infolabel/usage)
- Fluent 2: [Onboarding](https://fluent2.microsoft.design/onboarding/)
- Fluent 2: [Wait UX](https://fluent2.microsoft.design/wait-ux)
- Fluent 2: [Progress bar usage](https://fluent2.microsoft.design/components/web/react/core/progressbar/usage)
- Fluent 2: [Design tokens](https://fluent2.microsoft.design/design-tokens)
- Carbon: [Data table usage](https://v10.carbondesignsystem.com/components/data-table/usage/)
- Carbon: [Data table accessibility](https://v10.carbondesignsystem.com/components/data-table/accessibility/)
- Carbon: [Empty states pattern](https://carbondesignsystem.com/patterns/empty-states-pattern/)
- Atlassian: [Content design](https://atlassian.design/get-started/content-design/)
- Atlassian: [Forms pattern](https://atlassian.design/patterns/forms)
- Atlassian: [Messages pattern](https://atlassian.design/patterns/messages/)
- Atlassian: [Error messages](https://atlassian.design/foundations/content/designing-messages/error-messages/)
- Atlassian: [Empty state](https://atlassian.design/foundations/content/designing-messages/empty-state/)
- Atlassian: [Info messages](https://atlassian.design/foundations/content/designing-messages/info-messages/)
- Apple HIG: [Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility)
- Apple HIG: [Alerts](https://developer.apple.com/design/human-interface-guidelines/alerts)
- Apple Localization Guide: [Supporting Right-to-Left Languages](https://developer.apple.com/library/archive/documentation/MacOSX/Conceptual/BPInternational/SupportingRight-To-LeftLanguages/SupportingRight-To-LeftLanguages.html)
- VS Code Docs: [User and workspace settings](https://code.visualstudio.com/docs/configure/settings)
- VS Code Docs: [Profiles](https://code.visualstudio.com/docs/configure/profiles)
- VS Code Docs: [User interface](https://code.visualstudio.com/docs/getstarted/userinterface)
