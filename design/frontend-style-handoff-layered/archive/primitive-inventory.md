# Archived: SysFolio Primitive Inventory

> 已归档。当前请优先阅读 `../primitive-component-catalog.md` 与 `../primitive-visual-spec.md`。

# SysFolio Primitive Inventory

## 文档目的

这份文档用于定义 `primitives` 层当前应该覆盖哪些基础控件，以及哪些看起来像“组件库组件”的对象其实不该落在 `primitives`。

这里参考了 Ant Design 的组件总览做覆盖检查，但不按它的目录机械照搬。  
SysFolio 仍然按自己的 6 层架构划分职责。

## 结论

当前最合理的做法是：

- `primitives` 按能力家族拆文件，不按单个组件一文件拆
- 用 Ant Design 的组件分类检查“有没有缺口”
- 但把 `Layout / Tree / Shell / TOC / FileTree / PathBar / Sidebar` 这类结构型对象留在 `patterns` 或 `business`

一句话：

`Ant Design 用来校验覆盖面，6 层架构用来决定归属。`

## 当前目录

- `styles/primitives/actions.css`
  `Button / IconButton / ButtonGroup`
- `styles/primitives/data-entry.css`
  `Field / Input / Textarea / Select / SelectTrigger / Combobox / Checkbox / Radio / Switch`
- `styles/primitives/navigation.css`
  `Breadcrumb / Segmented / TabsNav / Pagination`
- `styles/primitives/data-display.css`
  `Tag / Badge / Avatar / Card / Divider / Stat / Table / TableRow`
- `styles/primitives/feedback.css`
  `Spinner / SkeletonBlock / InlineNotice / Progress`
- `styles/primitives/overlays.css`
  `SurfacePopover / FootnotePopover / Tooltip / DropdownSurface / Menu / DialogSurface / DialogContent / DrawerSurface / DrawerContent`

## 这些组件应该进 primitives

### 1. Actions

- `Button`
- `IconButton`
- `ButtonGroup`

判断标准：

- 主要解决“触发动作”
- 不绑定业务数据结构
- 可以被任意视图复用

### 2. Data Entry

- `Field`
- `Input`
- `Textarea`
- `Select`
- `SelectTrigger`
- `Combobox`
- `Checkbox`
- `Radio`
- `Switch`

判断标准：

- 主要解决“输入与控件状态”
- 要覆盖 `focus / disabled / invalid / loading` 这类控件级状态

### 3. Navigation Controls

- `Breadcrumb`
- `Segmented`
- `TabsNav`
- `Pagination`

判断标准：

- 是通用导航控件
- 不直接承载产品信息架构
- 不包含应用级路由结构和业务语义

补充说明：

- `Breadcrumb` 可以是 primitive
- 但当前产品的 `PathBar` 不是 primitive，它属于 `business`

### 4. Data Display

- `Tag`
- `Badge`
- `Avatar`
- `Card`
- `Divider`
- `Stat`
- `Table`
- `TableRow`

判断标准：

- 是轻量展示原件
- 不自带复杂业务流程
- 适合作为更高层 pattern 的局部组成

### 5. Feedback

- `Spinner`
- `SkeletonBlock`
- `InlineNotice`
- `Progress`

判断标准：

- 提供状态表达原件
- 但不承担完整内容区的 `idle / loading / ready / empty / error`

### 6. Overlays

- `SurfacePopover`
- `FootnotePopover`
- `Tooltip`
- `DropdownSurface`
- `Menu`
- `DialogSurface`
- `DialogContent`
- `DrawerSurface`
- `DrawerContent`

判断标准：

- 提供浮层表面和基础交互容器
- 不直接定义业务弹窗流程

## 这些对象不要进 primitives

### 1. Layout

- `Shell`
- `Sidebar`
- `ContentPane`
- `ReadingPane`
- `ContextPanel`

这些是结构模式，应进入 `patterns` 或 `business`。

### 2. Tree-like Navigation

- `TreeNav`
- `TOC`
- `FileTree`

这里要分三层：

- `TreeNav` 是 `patterns`
- `TOC / FileTree` 是 `business`
- 不是 `primitives`

### 3. View State Containers

- `LoadingState`
- `EmptyState`
- `ErrorState`
- `Result`

这些属于内容承载模式，不属于最小控件。  
它们应该主要落在 `patterns`。

### 4. Product Navigation

- `PathBar`
- `AddressBar`
- `CommandBar`
- `ThemeToggle` 这类带产品语义的入口控件

如果对象已经绑定当前产品的信息架构，就不该再算 primitive。

## 为什么按家族拆，不按单个组件拆

如果按单个组件一文件拆，`primitives` 稍微变多后就会出现两个问题：

- 文件数量快速膨胀
- 状态、尺寸、交互规则会在很多小文件里重复出现

按家族拆更适合 handoff 仓库，因为：

- 前端容易找到同类控件
- 状态规则更容易保持一致
- 后续继续补 `Select / Menu / Drawer / Tabs` 时不会把目录拆碎

## 和 Ant Design 的关系

这次整理主要借了 Ant Design 两个价值：

- 用它的组件总览检查基础覆盖是否完整
- 用它的组件家族感知来提醒我们哪些基础控件迟早会出现

但没有直接照搬它的组件分层，因为：

- Ant Design 是通用 UI 库
- SysFolio 这里是产品 handoff 样式架构
- 我们必须优先保证 `primitives / patterns / business` 的边界稳定

## 当前建议

如果后面继续补基础控件，优先顺序建议改为：

1. `List row / Description list / KeyValue row`
2. `Combobox` 的 async / multi-select / empty-result 细分契约
3. `Menu` 的 shortcut / checkable / nested submenu 扩展
4. `Dialog / Drawer` 的 header-action / destructive confirm / form layout 细分
5. `Drag handle / Reorder affordance` 这类数据搬运型 primitive

但在这一步之前，不建议把 `Sidebar`、`TOC`、`FileTree` 重新塞回 `primitives`。
