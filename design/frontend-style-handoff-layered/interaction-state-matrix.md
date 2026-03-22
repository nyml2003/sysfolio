# SysFolio Interaction State Matrix

## 文档目的

这份文档把当前 handoff 中已经落地的状态体系整理成一份统一矩阵，给设计和前端同时使用。

它主要回答：

- 哪些状态属于 `primitives`
- 哪些状态应该在 `patterns / business` 才成立
- 同一个状态现在对应哪些类名或属性
- 状态叠加时，谁是主状态，谁只是覆盖层

## 使用范围

这份规范主要对应以下文件：

- `styles/primitives/actions.css`
- `styles/primitives/data-entry.css`
- `styles/primitives/data-display.css`
- `styles/primitives/feedback.css`
- `styles/primitives/overlays.css`
- `styles/patterns/tree-navigation.css`
- `styles/patterns/view-states.css`
- `styles/business/navigation.css`
- `styles/business/explorer.css`

## 文档边界

这份文档负责说明状态分层、优先级和类名契约。

它不负责：

- 单个 primitive 的完整视觉基线
- 具体导航组件的交互流程
- 页面级布局入口和区域进退场

配套文档：

- primitive 家族视觉见 [primitive-visual-spec.md](primitive-visual-spec.md)
- 导航与 TOC 细则见 [navigation-state-spec.md](navigation-state-spec.md)
- view-state 在不同主视图中的密度语气见 [view-density-spec.md](view-density-spec.md)

## Preference 不是 State

以下对象不应进入这份状态矩阵：

- `themeMode`
- `uiDensity`
- `motionMode`
- `leftRailPref / tocPref / contextPanelPref`

原因很简单：

- preference 是长期持久偏好
- state 是当前 UI 或当前数据的瞬时状态

两者都可能影响界面，但不应混成同一套类名状态。

## 一、状态分层

当前推荐把状态分成 5 组：

| 状态组 | 状态 | 主要承接层 |
| --- | --- | --- |
| 交互覆盖层 | `hover / focus-visible / active-press / disabled / loading` | `primitives` 起定义 |
| 校验与语义变体 | `invalid / success / warning / destructive` | `primitives` 提供变体，`business` 决定何时使用 |
| 导航 ownership | `current / selected` | `patterns` 定共享契约，`business` 定具体语义 |
| 结构与信息 | `expanded / collapsed / search-match` | `patterns + business` |
| 数据搬运与视图态 | `drag-target / reordering / idle / ready / empty / error` | `patterns + business` |

补充一组局部对象态：

| 状态组 | 状态 | 主要承接层 |
| --- | --- | --- |
| 对象局部态 | `read-only / filled / visited / dragging / dismissible / sticky / paused / muted` | `primitives` 定义，按对象局部使用 |

这些局部对象态不应被误用成全局 ownership 或页面主状态。

像 `required / optional / entering / visible / exiting / persistent / emphasis` 这类更强对象私有态，默认保留在具体组件合同里，不全部提升为跨系统全局状态。

## 二、优先级

### 1. Primitive 交互优先级

`disabled > loading > focus-visible > active-press > hover > default`

### 2. 导航优先级

`focus-visible > current > selected > search-match > hover > default`

### 3. View State 主流程

`idle -> loading -> ready | empty | error`

## 三、状态矩阵

| 状态 | 层级归属 | 当前 CSS 契约 | 说明 |
| --- | --- | --- | --- |
| `default` | 全层可用 | 无额外类 | 所有组件默认基线 |
| `hover` | `primitives` 起定义 | `:hover` | 只做轻反馈，不生成 ownership |
| `focus-visible` | `primitives` 起定义 | `:focus-visible` / `:focus-within` | 统一由 `--u-focus` 承担 |
| `active-press` | `primitives` 起定义 | `:active` | 主要落在 button、entry、tree row |
| `disabled` | `primitives` | `.is-disabled` / `[aria-disabled=\"true\"]` / `:disabled` | 必须压过 hover |
| `loading` | `primitives` + `patterns` | `.is-loading` / `.m-loading-state` | 控件级 loading 和区块级 loading 分开 |
| `invalid` | `primitives` 校验变体 | `.is-invalid` / `[aria-invalid=\"true\"]` | 当前主要用于输入控件和字段消息联动 |
| `success` | `primitives` 语义变体 | `.is-success` / `--success` 变体 | 已落在 button、input/select/combobox、notice、progress |
| `warning` | `primitives` 语义变体 | `.is-warning` / `--warning` 变体 | 已落在 button、input/select/combobox、notice、progress、table row、menu item |
| `destructive` | `primitives` 语义变体 | `.is-destructive` / `--destructive` 变体 | 已落在 button、notice、progress、table row、menu item、error state |
| `current` | `patterns + business` | `.is-current` | 当前主 ownership；TOC 兼容 `.is-active` |
| `selected` | `business` | `.is-selected` | 当前主要用于 `FileTree / Menu / TableRow` |
| `search-match` | `business` | `.is-search-match` + `__hit` | 行只做轻提示，主要高亮 label 局部 |
| `expanded` | `patterns + business` | `[aria-expanded=\"true\"]` | 主要作用于 toggle，不抢 current |
| `collapsed` | `patterns + business` | 默认态 / `[aria-expanded=\"false\"]` | 与 expanded 成对出现 |
| `read-only` | `primitives` 局部对象态 | `[readonly]` / `.is-read-only` | 主要用于 `Input / NumberInput / DateInput / Textarea`，不等于 disabled |
| `filled` | `primitives` 局部对象态 | `.is-filled` / `[data-filled=\"true\"]` | 主要用于 `SearchInput / SelectTrigger / Combobox / multi-value trigger` 一类有值表面 |
| `visited` | `primitives` 局部对象态 | `:visited` | 仅用于 `Link`，不应扩散到按钮或菜单项 |
| `dragging` | `primitives + business` 局部对象态 | `.is-dragging` / `[data-dragging=\"true\"]` | 主要用于 `Slider thumb / drag handle / file drop interaction` |
| `drag-target` | `business` | `.is-drag-target` | 当前已落在 `FileTree / TableRow` |
| `reordering` | `business` | `.is-reordering` / `.is-reorder-before` / `.is-reorder-after` | 当前已落在 `TableRow`，FileTree 先保留轻量层 |
| `dismissible` | `primitives` 局部对象态 | `.is-dismissible` | 仅用于 `InlineNotice / MessageBar / Banner / Toast` 这类可关闭反馈 |
| `sticky` | `patterns + business` 局部对象态 | `.is-sticky` | 当前主要用于 `Banner`，表示布局驻留方式，不等于 current |
| `paused` | `primitives` 局部对象态 | `.is-paused` / `[data-state=\"paused\"]` | 当前主要用于 `Spinner / Toast / autoplay progress` 一类短时对象 |
| `muted` | `primitives` 局部对象态 | `.is-muted` / `--subtle` 变体 | 主要用于 `Text / Label / helper`，是文字层级，不是禁用态 |
| `idle` | `patterns` | `.m-idle-state` | 无数据请求或等待入口时使用 |
| `ready` | `patterns` | `.m-ready-state` | 正常内容态骨架 |
| `empty` | `patterns + business` | `.m-empty-state` | 通过 `.is-home / .is-directory / .is-document` 区分语气 |
| `error` | `patterns + business` | `.m-error-state` | 通过 `.is-home / .is-directory / .is-document` 区分恢复重量 |

## 四、对象级契约

### 1. Text And Inline Semantics

- `Text`
  支持 `default / muted / success / warning / destructive / disabled`
- `Label`
  支持 `default / muted / required / optional / disabled`
- `Link`
  支持 `default / hover / focus-visible / visited / current`
- `CodeInline / Kbd`
  只承接局部强调，不承接业务 ownership

### 2. Actions And Tooling

- `Button / IconButton / SplitButton`
  支持 `default / hover / focus-visible / active-press / disabled / loading`
- `ButtonGroup / Segmented`
  支持 `default / hover / focus-visible / current / disabled`
- `Toolbar`
  支持 `focus-within / disabled-item / overflow-open`
  但不应自行承接 `current` 语义

### 3. Data Entry

- `Input / Textarea / SelectTrigger / Combobox`
  支持 `default / focus-visible / disabled / loading / invalid / warning / success`
- 当前类名：
  `.is-invalid / .is-warning / .is-success / .is-loading / .is-disabled`
- `SearchInput`
  在 input 基础上补 `filled`
- `NumberInput / DateInput`
  在 input 基础上补 `read-only`
- `Slider`
  支持 `default / hover / focus-visible / dragging / disabled`
- `FileTrigger`
  支持 `default / hover / focus-visible / drag-target / loading / disabled / error`

### 4. Data Display

- `List / ListItem`
  支持 `default / hover / focus-visible / selected / current / disabled / drag-target`
  但 `current` 仅在被 pattern/business 借用时才成立
- `KeyValue`
  支持 `default / loading`
- `Token`
  支持 `default / hover / focus-visible / selected / disabled`
- `TableRow`
  支持 `default / hover / focus-visible / selected / drag-target / reordering / disabled`

### 5. Feedback

- `InlineNotice`
  支持 `default / emphasis / dismissible`
- `MessageBar`
  支持 `default / emphasis / persistent / dismissible`
- `Banner`
  支持 `default / sticky / dismissible`
- `Toast`
  支持 `entering / visible / exiting / paused`
- `Progress`
  支持 `default / indeterminate / complete / error`

### 6. Overlay / Menu

- `MenuItem`
  支持 `default / hover / focus-visible / selected / warning / destructive / disabled`
- `Dialog / Drawer`
  区分 `surface` 和 `content`
- `OverlayScrim`
  支持 `data-state=\"closed\"`

### 7. Tree Navigation

- `TreeNav`
  共享 `current / hover / focus-visible / expanded`
- `TOC`
  主状态是 `current`
- `FileTree`
  主状态拆成 `current / selected / search-match / drag-target / reordering`

### 8. PathBar

- `Path segment`
  使用 `.is-current / .is-clickable / .is-collapsible / .is-ellipsis`
- `Path entry`
  使用 `.m-path-entry`，激活态用 `.is-active`

### 9. View States

- `Idle / Ready / Loading / Empty / Error`
  统一由 `patterns/view-states.css` 提供
- 视图语气通过：
  `.is-home / .is-directory / .is-document`

## 五、View-State 分层责任

五态的职责分工统一为：

| 层级 | 责任 |
| --- | --- |
| `Primitives` | 提供 `Spinner / Skeleton / InlineNotice / loading button` 等状态原件 |
| `Patterns` | 提供 `idle / ready / loading / empty / error` 的结构容器 |
| `Business` | 计算状态，注入文案、空态说明、恢复动作 |
| `Component` | 决定局部状态是否升级成更高层阻塞状态 |

因此：

- `Button` 的 `loading` 属于控件级状态
- `FileTree`、`ReadingPane`、`ContextPanel` 的 `empty / error` 属于内容承载状态
- 页面是否整体退回 `loading`，属于更高层编排决策

## 六、当前落地结论

1. 控件级状态已经不再只剩 `hover / disabled / invalid`，而是补成了可复用的语义状态矩阵。
2. 导航 ownership 已经从 `current / selected / search-match` 三者混用，收敛成明确分层。
3. 小屏导航入口和 overlay 状态已进入同一体系，不再依赖“直接隐藏”。
4. `idle / ready / loading / empty / error` 已经进入 pattern 层契约，而不是继续散落在页面级。

## Remaining TODO

1. 继续补齐 `success / warning / destructive / drag-target / reordering` 在所有 relevant primitives 与 patterns 中的完整覆盖。
2. 收紧复杂叠加态，重点是 `current + hover`、`selected + search-match`、`drag-target + reordering`。
3. 把 view-state 分层再对照真实业务视图核一遍，避免局部刷新被错误升级成整页状态。
4. 把 `visited / filled / read-only / dragging / dismissible / sticky / paused / muted` 这批局部对象态继续回写到具体组件规范与未来 CSS 契约。
