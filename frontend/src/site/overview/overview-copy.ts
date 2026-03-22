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
type DemoId =
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
  };
  context: {
    runtimeTitle: string;
    coverageTitle: string;
    noOpenDesignGaps: string;
  };
  demos: {
    liveTag: string;
    titleById: (demoId: DemoId) => string;
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
    },
    context: {
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
          return "按钮集合";
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
    },
    context: {
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
          return "Button set";
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
