import type {
  OverviewDesignStatus,
  OverviewDocumentStatus,
  OverviewGapOwner,
  OverviewLayer,
} from "@/shared/data/mock/overview-library";
import type { AppLocale } from "@/shared/lib/i18n/locale.types";
import type {
  DensityPreference,
  LayoutMode,
  MotionMode,
} from "@/shared/lib/style/style.types";
import type { ThemePreference } from "@/shared/lib/theme/theme.types";
import { usePreferences } from "@/shared/store/preferences";

type RuntimeKey = "theme" | "density" | "layoutMode" | "motion";

/** 文档站 `OverviewDemoDeck` 中注册的 demo id（与 fixtures 中 demoIds 对齐） */
export type OverviewDemoId =
  | "style-provider"
  | "preferences"
  | "tokens"
  | "theme-density"
  | "layout-primitives"
  | "app-shell"
  | "button"
  | "field-input"
  | "tree-nav"
  | "view-state-layout"
  | "missing-components"
  | "design-gaps";

type OverviewCopy = {
  shell: {
    homeBreadcrumbTitle: string;
  };
  topBar: {
    filesButton: string;
    contextButton: string;
    densityLabel: string;
    densityOptionLabel: (density: DensityPreference) => string;
  };
  runtime: {
    keyLabel: (key: RuntimeKey) => string;
    themeLabel: (theme: ThemePreference) => string;
    densityLabel: (density: DensityPreference) => string;
    layoutModeLabel: (layoutMode: LayoutMode) => string;
    motionLabel: (motion: MotionMode) => string;
  };
  meta: {
    layerLabel: (layer: OverviewLayer) => string;
    statusLabel: (status: OverviewDocumentStatus) => string;
    designStatusLabel: (status: OverviewDesignStatus) => string;
    gapOwnerLabel: (owner: OverviewGapOwner) => string;
  };
  home: {
    eyebrow: string;
    summary: string;
    recentDocsTitle: string;
  };
  directory: {
    fallbackDescription: string;
    entryFallbackDescription: string;
    rootLabel: string;
  };
  rail: {
    fileTreeTitle: string;
  };
  shellViewState: {
    loadingTitle: string;
    loadingBody: string;
    emptyTitle: string;
    notRenderableBody: string;
    errorTitle: string;
  };
  context: {
    panelTitle: string;
    onThisPageTitle: string;
    recentEntriesTitle: string;
    placeholderBody: string;
    runtimeTitle: string;
    coverageTitle: string;
    noOpenDesignGaps: string;
  };
  demos: {
    liveTag: string;
    titleById: (demoId: OverviewDemoId) => string;
    preferenceThemeButton: (theme: ThemePreference) => string;
    preferenceBackedTag: string;
    tokenCanvas: string;
    tokenSurface: string;
    tokenAccent: string;
    themeDensityComfortableTag: string;
    themeDensityComfortableBody: string;
    themeDensityCompactTag: string;
    themeDensityCompactBody: string;
    layoutPrimitiveStack: string;
    layoutPrimitiveInline: string;
    layoutPrimitiveGrid: string;
    layoutPrimitiveStackBody: string;
    layoutPrimitiveInlineBody: string;
    layoutPrimitiveGridBody: string;
    shellPreviewTopbar: string;
    shellPreviewNavigation: string;
    shellPreviewReadingPane: string;
    shellPreviewContext: string;
    shellPreviewFilesystemTag: string;
    buttonPrimary: string;
    buttonSecondary: string;
    buttonGhost: string;
    buttonSuccess: string;
    buttonWarning: string;
    buttonDestructive: string;
    buttonIntroHeading: string;
    buttonIntroBullets: readonly string[];
    buttonToneHeading: string;
    buttonToneBullets: readonly string[];
    buttonSizeHeading: string;
    buttonSizeBullets: readonly string[];
    buttonShowcaseMd: string;
    buttonShowcaseSm: string;
    buttonA11yHeading: string;
    buttonA11yBullets: readonly string[];
    buttonIconAriaLabel: string;
    buttonDenseHeading: string;
    buttonDenseBullets: readonly string[];
    buttonLoadingHeading: string;
    buttonLoadingBullets: readonly string[];
    buttonLoadingLabel: string;
    buttonWithLeadingLabel: string;
    buttonLayoutHeading: string;
    buttonLayoutBullets: readonly string[];
    buttonFullWidthLabel: string;
    buttonTruncateLongLabel: string;
    buttonIconButtonHeading: string;
    buttonIconButtonBullets: readonly string[];
    buttonGroupHeading: string;
    buttonGroupBullets: readonly string[];
    buttonGroupSegmentLabel: string;
    buttonGroupItemA: string;
    buttonGroupItemB: string;
    buttonGroupItemC: string;
    fieldTextInputLabel: string;
    fieldTextInputDescription: string;
    fieldTextInputValue: string;
    fieldNotesLabel: string;
    fieldNotesDescription: string;
    fieldNotesValue: string;
    fieldDensityLabel: string;
    fieldDensityDescription: string;
    treeFoundation: string;
    treeStyleProvider: string;
    treeTokenMap: string;
    treeAudit: string;
    viewStateLoadingTitle: string;
    viewStateLoadingBody: string;
    viewStateEmptyTitle: string;
    viewStateEmptyBody: string;
    viewStateErrorTitle: string;
    viewStateErrorBody: string;
  };
};

const overviewCopyByLocale: Record<AppLocale, OverviewCopy> = {
  "zh-CN": {
    shell: {
      homeBreadcrumbTitle: "总览",
    },
    topBar: {
      filesButton: "文件",
      contextButton: "上下文",
      densityLabel: "密度",
      densityOptionLabel(density) {
        if (density === "comfortable") {
          return "舒展";
        }

        if (density === "medium") {
          return "标准";
        }

        return "紧凑";
      },
    },
    runtime: {
      keyLabel(key) {
        if (key === "theme") {
          return "主题";
        }

        if (key === "density") {
          return "密度";
        }

        if (key === "layoutMode") {
          return "布局";
        }

        return "动效";
      },
      themeLabel(theme) {
        return theme === "light" ? "浅色" : "深色";
      },
      densityLabel(density) {
        if (density === "comfortable") {
          return "舒展";
        }

        if (density === "medium") {
          return "标准";
        }

        return "紧凑";
      },
      layoutModeLabel(layoutMode) {
        if (layoutMode === "spacious") {
          return "宽屏";
        }

        if (layoutMode === "medium") {
          return "中栏";
        }

        return "紧凑";
      },
      motionLabel(motion) {
        return motion === "full" ? "完整动效" : "减弱动效";
      },
    },
    meta: {
      layerLabel(layer) {
        if (layer === "foundation") {
          return "基础层";
        }

        if (layer === "layout") {
          return "布局层";
        }

        if (layer === "primitive") {
          return "基础组件";
        }

        if (layer === "pattern") {
          return "模式层";
        }

        return "审计";
      },
      statusLabel(status) {
        if (status === "ready") {
          return "已就绪";
        }

        if (status === "partial") {
          return "部分覆盖";
        }

        return "缺失";
      },
      designStatusLabel(status) {
        if (status === "confirmed") {
          return "设计已确认";
        }

        if (status === "needs-design") {
          return "待设计";
        }

        return "待评审";
      },
      gapOwnerLabel(owner) {
        if (owner === "design") {
          return "设计";
        }

        if (owner === "frontend") {
          return "前端";
        }

        return "共享层";
      },
    },
    home: {
      eyebrow: "system-library / 总览",
      summary:
        "这是内部 UI 组件库的文件系统式文档站。先看运行时，再看布局与基础组件，最后回到审计层检查还缺哪些设计契约。",
      recentDocsTitle: "最近更新的文档",
    },
    directory: {
      fallbackDescription: "先浏览当前这一层组件库切片，再决定往下钻到哪条契约。",
      entryFallbackDescription: "打开这条入口，查看当前契约的实现、演示和缺口。",
      rootLabel: "根",
    },
    rail: {
      fileTreeTitle: "文件树",
    },
    shellViewState: {
      loadingTitle: "正在加载文档",
      loadingBody: "总览站正在解析当前路径。",
      emptyTitle: "暂无可渲染内容",
      notRenderableBody: "这条路径暂时没有可渲染内容。",
      errorTitle: "路径未找到",
    },
    context: {
      panelTitle: "上下文",
      onThisPageTitle: "本页",
      recentEntriesTitle: "最近",
      placeholderBody: "当前文档解析完成后会显示上下文。",
      runtimeTitle: "运行时",
      coverageTitle: "覆盖情况",
      noOpenDesignGaps: "当前页面没有待处理的设计缺口。",
    },
    demos: {
      liveTag: "实时",
      titleById(demoId) {
        if (demoId === "style-provider") {
          return "解析后的运行时";
        }

        if (demoId === "preferences") {
          return "偏好控制";
        }

        if (demoId === "tokens") {
          return "Token 色板";
        }

        if (demoId === "theme-density") {
          return "主题与密度";
        }

        if (demoId === "layout-primitives") {
          return "布局原语";
        }

        if (demoId === "app-shell") {
          return "外壳预览";
        }

        if (demoId === "button") {
          return "按钮";
        }

        if (demoId === "field-input") {
          return "Field 家族";
        }

        if (demoId === "tree-nav") {
          return "树导航优先级";
        }

        if (demoId === "view-state-layout") {
          return "生命周期状态面";
        }

        if (demoId === "missing-components") {
          return "覆盖摘要";
        }

        return "设计缺口待办";
      },
      preferenceThemeButton(theme) {
        return `切换主题（${theme === "light" ? "浅色" : "深色"}）`;
      },
      preferenceBackedTag: "由偏好驱动",
      tokenCanvas: "画布",
      tokenSurface: "抬升表面",
      tokenAccent: "强调色",
      themeDensityComfortableTag: "舒展节奏",
      themeDensityComfortableBody: "长文阅读和 overview 页面用更从容的纵向节奏。",
      themeDensityCompactTag: "紧凑节奏",
      themeDensityCompactBody: "高密导航和清单视图会收紧间距，但不改变结构语义。",
      layoutPrimitiveStack: "Stack",
      layoutPrimitiveInline: "Inline",
      layoutPrimitiveGrid: "Grid",
      layoutPrimitiveStackBody: "Stack 负责纵向节奏。",
      layoutPrimitiveInlineBody: "Inline 负责对齐操作和元信息。",
      layoutPrimitiveGridBody: "Grid 负责重复卡片的排布。",
      shellPreviewTopbar: "顶栏",
      shellPreviewNavigation: "导航",
      shellPreviewReadingPane: "阅读区",
      shellPreviewContext: "上下文",
      shellPreviewFilesystemTag: "文件系统外壳",
      buttonPrimary: "主按钮",
      buttonSecondary: "次按钮",
      buttonGhost: "幽灵按钮",
      buttonSuccess: "成功",
      buttonWarning: "警告",
      buttonDestructive: "危险",
      buttonIntroHeading: "概述",
      buttonIntroBullets: [
        "入口：从 @/shared/ui/primitives 导入 Button / IconButton / ButtonGroup（及预设）；主应用与总览壳内的操作控件统一使用这些原语。",
        "约束：app / features / site 内业务 TSX 不直接使用原生 button 元素拼产品界面（shared/ui 内部封装除外）。",
        "样式：根节点挂 sf-button 与 sf-button--{tone|size} 修饰类；规则在 src/shared/ui/styles/components.css，颜色随主题 token 变化。",
        "设计对齐：design/frontend-style-handoff-layered 中 primitive-component-catalog 的 Button 家族（含语义 tone）与本节演示一致；改 token 或 CSS 后在此页做视觉回归。",
      ],
      buttonToneHeading: "变体 tone",
      buttonToneBullets: [
        "primary：主操作、单屏关键 CTA。",
        "secondary：次主操作，或与 primary 成对出现。",
        "ghost：工具栏、文件树行、面包屑等弱对比、依赖上下文的点击面。",
        "success / warning / destructive：语义反馈（success/warning 用 surface + 语义色；destructive 用边框+浅底，避免整块重红底）。",
      ],
      buttonSizeHeading: "尺寸 size",
      buttonSizeBullets: [
        "md：默认控制高度，适用于表单与一般块内操作。",
        "sm：顶栏、与 Tag / SegmentedControl 并排等密集区域。",
      ],
      buttonShowcaseMd: "默认 md",
      buttonShowcaseSm: "紧凑 sm",
      buttonA11yHeading: "可访问性",
      buttonA11yBullets: [
        "纯图标按钮：必须提供可访问名称（常用 aria-label），文案应走 i18n / useUiCopy。",
        "其余：disabled、aria-expanded、aria-current 等原生属性由 Button 透传到根部的 button 元素。",
      ],
      buttonIconAriaLabel: "示例：切换主题",
      buttonDenseHeading: "紧凑布局（覆盖全局样式）",
      buttonDenseBullets: [
        "场景：文件树 disclosure、窄轨等，全局 .sf-button 的 min-height / padding 与栅格冲突。",
        "做法：在局部 CSS Module 用 .localClass:global(.sf-button) 等组合选择器覆盖。",
        "参考：主应用 features/file-tree/components/FileTree.module.css；总览站见 overview.css 中的 .overview-tree__*.sf-button。",
      ],
      buttonLoadingHeading: "加载与图标位",
      buttonLoadingBullets: [
        "loading：前导 spinner、aria-busy、并禁用按钮至结束。",
        "leadingIcon / trailingIcon：使用 Option（none()/some(…)）与 catalog slot 对齐；loading 时前导位仅显示 spinner。",
      ],
      buttonLoadingLabel: "保存中…",
      buttonWithLeadingLabel: "带图标",
      buttonLayoutHeading: "布局与溢出",
      buttonLayoutBullets: [
        "fullWidth：块级宽度（inline-size: 100%），用于表单与空态主操作。",
        "truncateLabel：catalog 中长文案单行省略；与 leadingIcon/trailingIcon 混排时 label 占满剩余空间。",
        "loading：同时挂 sf-button--loading 与 is-loading（interaction-state-matrix）；coarse pointer 下最小高度不低于 44px。",
      ],
      buttonFullWidthLabel: "全宽主操作",
      buttonTruncateLongLabel: "这是一段会在窄容器内被截断的示例按钮文案",
      buttonIconButtonHeading: "IconButton",
      buttonIconButtonBullets: [
        "catalog：primary / ghost / success / warning / destructive；结构为 icon + srLabel（aria-label）+ loading 时 spinner。",
        "尺寸：md≈36px、sm 更密；coarse pointer 下最小点击面不低于 44px。",
        "优先用 IconButtonGhostSm / IconButtonGhostMd 预设；危险操作用 destructive tone。",
      ],
      buttonGroupHeading: "ButtonGroup",
      buttonGroupBullets: [
        "variant：default（带 gap）与 attached（贴合并共享边框）。",
        "子项使用 ButtonGroupItem 包裹 Button，可选 current 映射为 aria-pressed。",
        "容器 role=\"group\"，须传入 label 作为可访问名称。",
      ],
      buttonGroupSegmentLabel: "对齐方式示例",
      buttonGroupItemA: "左",
      buttonGroupItemB: "中",
      buttonGroupItemC: "右",
      fieldTextInputLabel: "文本输入",
      fieldTextInputDescription: "共享的平静输入表面。",
      fieldTextInputValue: "按钮文案",
      fieldNotesLabel: "备注",
      fieldNotesDescription: "Textarea 沿用同一套 token 家族。",
      fieldNotesValue: "设计诉求需要始终可见。",
      fieldDensityLabel: "密度",
      fieldDensityDescription: "Select trigger 也应留在同一套 field 系统里。",
      treeFoundation: "基础",
      treeStyleProvider: "StyleProvider",
      treeTokenMap: "Token Map",
      treeAudit: "审计",
      viewStateLoadingTitle: "加载中",
      viewStateLoadingBody: "稳定的加载面应该有克制的层级和节奏。",
      viewStateEmptyTitle: "空态",
      viewStateEmptyBody: "空态需要独立的语气和明确的后续动作。",
      viewStateErrorTitle: "错误",
      viewStateErrorBody: "错误态应该复用同一套反馈语言。",
    },
  },
  "en-US": {
    shell: {
      homeBreadcrumbTitle: "overview",
    },
    topBar: {
      filesButton: "Files",
      contextButton: "Context",
      densityLabel: "Density",
      densityOptionLabel(density) {
        if (density === "comfortable") {
          return "Comfortable";
        }

        if (density === "medium") {
          return "Medium";
        }

        return "Compact";
      },
    },
    runtime: {
      keyLabel(key) {
        if (key === "theme") {
          return "Theme";
        }

        if (key === "density") {
          return "Density";
        }

        if (key === "layoutMode") {
          return "Layout";
        }

        return "Motion";
      },
      themeLabel(theme) {
        return theme === "light" ? "Light" : "Dark";
      },
      densityLabel(density) {
        if (density === "comfortable") {
          return "Comfortable";
        }

        if (density === "medium") {
          return "Medium";
        }

        return "Compact";
      },
      layoutModeLabel(layoutMode) {
        if (layoutMode === "spacious") {
          return "Spacious";
        }

        if (layoutMode === "medium") {
          return "Medium";
        }

        return "Compact";
      },
      motionLabel(motion) {
        return motion === "full" ? "Full motion" : "Reduced motion";
      },
    },
    meta: {
      layerLabel(layer) {
        if (layer === "foundation") {
          return "Foundation";
        }

        if (layer === "layout") {
          return "Layout";
        }

        if (layer === "primitive") {
          return "Primitives";
        }

        if (layer === "pattern") {
          return "Patterns";
        }

        return "Audit";
      },
      statusLabel(status) {
        if (status === "ready") {
          return "Ready";
        }

        if (status === "partial") {
          return "Partial";
        }

        return "Missing";
      },
      designStatusLabel(status) {
        if (status === "confirmed") {
          return "Design confirmed";
        }

        if (status === "needs-design") {
          return "Needs design";
        }

        return "Needs review";
      },
      gapOwnerLabel(owner) {
        if (owner === "design") {
          return "Design";
        }

        if (owner === "frontend") {
          return "Frontend";
        }

        return "Shared";
      },
    },
    home: {
      eyebrow: "system-library / overview",
      summary:
        "This is a filesystem-style documentation station for the internal UI library. Start with the runtime, move through layout and primitives, and use the audit layer to track missing design contracts.",
      recentDocsTitle: "Recently touched docs",
    },
    directory: {
      fallbackDescription: "Browse the current slice of the UI library before drilling into a specific contract.",
      entryFallbackDescription: "Open this entry to inspect the current contract, its demos, and the remaining gaps.",
      rootLabel: "root",
    },
    rail: {
      fileTreeTitle: "Filesystem",
    },
    shellViewState: {
      loadingTitle: "Loading document",
      loadingBody: "The overview station is resolving the current path.",
      emptyTitle: "Nothing to render",
      notRenderableBody: "This path does not have renderable content yet.",
      errorTitle: "Path not found",
    },
    context: {
      panelTitle: "Context",
      onThisPageTitle: "On this page",
      recentEntriesTitle: "Recent",
      placeholderBody: "Context appears once the current document is resolved.",
      runtimeTitle: "Runtime",
      coverageTitle: "Coverage",
      noOpenDesignGaps: "No open design gaps on this page.",
    },
    demos: {
      liveTag: "Live",
      titleById(demoId) {
        if (demoId === "style-provider") {
          return "Resolved runtime";
        }

        if (demoId === "preferences") {
          return "Preference controls";
        }

        if (demoId === "tokens") {
          return "Token swatches";
        }

        if (demoId === "theme-density") {
          return "Theme and density";
        }

        if (demoId === "layout-primitives") {
          return "Layout primitives";
        }

        if (demoId === "app-shell") {
          return "Shell preview";
        }

        if (demoId === "button") {
          return "Button";
        }

        if (demoId === "field-input") {
          return "Field family";
        }

        if (demoId === "tree-nav") {
          return "Tree navigation priority";
        }

        if (demoId === "view-state-layout") {
          return "Lifecycle surfaces";
        }

        if (demoId === "missing-components") {
          return "Coverage summary";
        }

        return "Design gap backlog";
      },
      preferenceThemeButton(theme) {
        return `Toggle theme (${theme === "light" ? "light" : "dark"})`;
      },
      preferenceBackedTag: "Preference-backed",
      tokenCanvas: "Canvas",
      tokenSurface: "Raised surface",
      tokenAccent: "Accent",
      themeDensityComfortableTag: "Comfortable rhythm",
      themeDensityComfortableBody:
        "Long-form reading and overview pages use the relaxed scale.",
      themeDensityCompactTag: "Compact rhythm",
      themeDensityCompactBody:
        "Dense navigation and inventory views tighten spacing without changing structure.",
      layoutPrimitiveStack: "Stack",
      layoutPrimitiveInline: "Inline",
      layoutPrimitiveGrid: "Grid",
      layoutPrimitiveStackBody: "Stack controls vertical rhythm.",
      layoutPrimitiveInlineBody: "Inline aligns controls and metadata.",
      layoutPrimitiveGridBody: "Grid handles repeatable card layouts.",
      shellPreviewTopbar: "Topbar",
      shellPreviewNavigation: "Navigation",
      shellPreviewReadingPane: "Reading pane",
      shellPreviewContext: "Context",
      shellPreviewFilesystemTag: "filesystem shell",
      buttonPrimary: "Primary",
      buttonSecondary: "Secondary",
      buttonGhost: "Ghost",
      buttonSuccess: "Success",
      buttonWarning: "Warning",
      buttonDestructive: "Destructive",
      buttonIntroHeading: "Overview",
      buttonIntroBullets: [
        "Import: use Button / IconButton / ButtonGroup (and presets) from @/shared/ui/primitives for actions in the app shell and on this site.",
        "Rule: in app / features / site, do not use raw button elements for product UI (except inside shared/ui implementations).",
        "Styling: root classes sf-button and sf-button--{tone|size}; rules live in src/shared/ui/styles/components.css and follow theme tokens.",
        "Design alignment: the Button family in design/frontend-style-handoff-layered/primitive-component-catalog (including semantic tones) matches this demo; use this page for visual regression after token/CSS changes.",
      ],
      buttonToneHeading: "tone variants",
      buttonToneBullets: [
        "primary: main action / strongest CTA.",
        "secondary: secondary action, or paired with primary.",
        "ghost: toolbars, tree rows, breadcrumbs—low chrome, context-dependent.",
        "success / warning / destructive: semantic feedback (success/warning use surface + semantic ink; destructive uses border + light fill, not a heavy solid red block).",
      ],
      buttonSizeHeading: "size",
      buttonSizeBullets: [
        "md: default control height for forms and general in-flow actions.",
        "sm: top bars and dense rows next to Tag / SegmentedControl.",
      ],
      buttonShowcaseMd: "Default md",
      buttonShowcaseSm: "Compact sm",
      buttonA11yHeading: "Accessibility",
      buttonA11yBullets: [
        "Icon-only: provide an accessible name (commonly aria-label); copy via i18n / useUiCopy.",
        "Other props: disabled, aria-expanded, aria-current, etc. pass through to the underlying button element.",
      ],
      buttonIconAriaLabel: "Example: toggle theme",
      buttonDenseHeading: "Dense layouts (overriding globals)",
      buttonDenseBullets: [
        "When: file-tree disclosure, narrow rails, etc.—global .sf-button min-height/padding fights the grid.",
        "How: in a local CSS Module, use compound selectors such as .localClass:global(.sf-button) to override.",
        "Refs: main app features/file-tree/components/FileTree.module.css; overview overview.css (.overview-tree__*.sf-button).",
      ],
      buttonLoadingHeading: "Loading and icon slots",
      buttonLoadingBullets: [
        "loading: leading spinner, aria-busy, and disabled until cleared.",
        "leadingIcon / trailingIcon: Option (none/some) aligned to catalog slots; trailing hides while loading.",
      ],
      buttonLoadingLabel: "Saving…",
      buttonWithLeadingLabel: "With icon",
      buttonLayoutHeading: "Layout and overflow",
      buttonLayoutBullets: [
        "fullWidth: block-level width (inline-size: 100%) for forms and primary CTAs.",
        "truncateLabel: single-line ellipsis for long labels (catalog); with leading/trailing icons the label flexes and truncates.",
        "loading: applies sf-button--loading and is-loading (interaction-state-matrix); coarse pointers keep min height ≥ 44px.",
      ],
      buttonFullWidthLabel: "Full-width primary",
      buttonTruncateLongLabel: "This long label truncates inside a narrow container",
      buttonIconButtonHeading: "IconButton",
      buttonIconButtonBullets: [
        "catalog: primary / ghost / success / warning / destructive; structure is icon + srLabel (aria-label) + spinner when loading.",
        "Sizes: md ≈ 36px, sm tighter; coarse pointers keep the hit target ≥ 44px.",
        "Prefer IconButtonGhostSm / IconButtonGhostMd presets; destructive tone for dangerous actions.",
      ],
      buttonGroupHeading: "ButtonGroup",
      buttonGroupBullets: [
        "variant: default (with gap) vs attached (merged borders).",
        "Children use ButtonGroupItem wrapping Button; optional current maps to aria-pressed.",
        "Container uses role=\"group\"; pass label for the accessible name.",
      ],
      buttonGroupSegmentLabel: "Alignment sample",
      buttonGroupItemA: "Left",
      buttonGroupItemB: "Center",
      buttonGroupItemC: "Right",
      fieldTextInputLabel: "Text input",
      fieldTextInputDescription: "Shared calm field surface.",
      fieldTextInputValue: "Button copy",
      fieldNotesLabel: "Notes",
      fieldNotesDescription: "Textarea follows the same token family.",
      fieldNotesValue: "Design asks should stay visible.",
      fieldDensityLabel: "Density",
      fieldDensityDescription: "Select trigger stays inside the same field system.",
      treeFoundation: "Foundation",
      treeStyleProvider: "StyleProvider",
      treeTokenMap: "Token Map",
      treeAudit: "Audit",
      viewStateLoadingTitle: "Loading",
      viewStateLoadingBody: "Stable loading surface with calm hierarchy.",
      viewStateEmptyTitle: "Empty",
      viewStateEmptyBody: "Empty states need a dedicated tone and action path.",
      viewStateErrorTitle: "Error",
      viewStateErrorBody: "Error states reuse the same feedback language.",
    },
  },
};

export function getOverviewCopy(locale: AppLocale): OverviewCopy {
  return overviewCopyByLocale[locale];
}

export function useOverviewCopy() {
  const { locale } = usePreferences();

  return getOverviewCopy(locale);
}
