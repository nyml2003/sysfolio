import type {
  OverviewDesignStatus,
  OverviewDocumentStatus,
  OverviewGapOwner,
  OverviewLayer,
} from '@/shared/data/mock/overview-library';
import type { AppLocale } from '@/shared/lib/i18n/locale.types';
import type { DensityPreference, LayoutMode, MotionMode } from '@/shared/lib/style/style.types';
import type { ThemePreference } from '@/shared/lib/theme/theme.types';
import { usePreferences } from '@/shared/store/preferences';

type RuntimeKey = 'theme' | 'density' | 'layoutMode' | 'motion';

/** 文档站 `OverviewDemoDeck` 中注册的 demo id（与 fixtures 中 demoIds 对齐） */
export type OverviewDemoId =
  | 'style-provider'
  | 'preferences'
  | 'tokens'
  | 'theme-density'
  | 'layout-primitives'
  | 'app-shell'
  | 'button'
  | 'heading'
  | 'label'
  | 'text'
  | 'link'
  | 'code-block-surface'
  | 'search-input'
  | 'number-input'
  | 'field-input'
  | 'tree-nav'
  | 'view-state-layout'
  | 'missing-components'
  | 'design-gaps';

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
    artifactFallbackDescription: string;
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
    recentArtifactsTitle: string;
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
    headingIntroHeading: string;
    headingIntroBullets: readonly string[];
    headingVariantHeading: string;
    headingVariantBullets: readonly string[];
    headingSampleDisplay: string;
    headingSampleSection: string;
    headingSampleSubsection: string;
    headingSampleCaption: string;
    headingToneHeading: string;
    headingToneBullets: readonly string[];
    headingToneDefault: string;
    headingToneMuted: string;
    headingToneCurrent: string;
    headingSlotsHeading: string;
    headingSlotsBullets: readonly string[];
    headingSlotTitle: string;
    headingTrailingTag: string;
    labelIntroHeading: string;
    labelIntroBullets: readonly string[];
    labelVariantHeading: string;
    labelVariantBullets: readonly string[];
    labelSampleDefault: string;
    labelSampleStrong: string;
    labelSampleSubtle: string;
    labelStateHeading: string;
    labelStateBullets: readonly string[];
    labelStateDefault: string;
    labelStateDisabled: string;
    labelStateRequired: string;
    labelStateOptional: string;
    labelOptionalMarkText: string;
    labelAffordanceHeading: string;
    labelAffordanceBullets: readonly string[];
    labelInfoIconSrLabel: string;
    labelWithInfoSlot: string;
    textIntroHeading: string;
    textIntroBullets: readonly string[];
    textVariantHeading: string;
    textVariantBullets: readonly string[];
    textSampleUi: string;
    textSampleBody: string;
    textSampleStrong: string;
    textSampleSubtle: string;
    textSampleCaption: string;
    textSampleMono: string;
    textToneHeading: string;
    textToneBullets: readonly string[];
    textToneDefault: string;
    textToneMuted: string;
    textToneSuccess: string;
    textToneWarning: string;
    textToneDestructive: string;
    textToneDisabled: string;
    linkIntroHeading: string;
    linkIntroBullets: readonly string[];
    linkVariantHeading: string;
    linkVariantBullets: readonly string[];
    linkSampleDefault: string;
    linkSampleSubtle: string;
    linkSampleExternal: string;
    linkNavHeading: string;
    linkNavBullets: readonly string[];
    linkNavCurrent: string;
    linkNavOther: string;
    codeBlockSurfaceIntroHeading: string;
    codeBlockSurfaceIntroBullets: readonly string[];
    codeBlockSurfaceVariantHeading: string;
    codeBlockSurfaceVariantBullets: readonly string[];
    codeBlockSurfaceSnippetTsx: string;
    codeBlockSurfaceSnippetCommand: string;
    codeBlockSurfaceSnippetDiff: string;
    codeBlockSurfaceLayoutHeading: string;
    codeBlockSurfaceLayoutBullets: readonly string[];
    codeBlockSurfaceMetaReadOnly: string;
    codeBlockSurfaceCopyAction: string;
    codeBlockSurfaceFooterNote: string;
    searchInputIntroHeading: string;
    searchInputIntroBullets: readonly string[];
    searchInputVariantHeading: string;
    searchInputVariantBullets: readonly string[];
    searchInputPlaceholder: string;
    searchInputLoadingHeading: string;
    searchInputLoadingLabel: string;
    searchInputSubmitLabel: string;
    searchInputScopeLabel: string;
    searchInputSlotsHeading: string;
    searchInputSlotsBullets: readonly string[];
    numberInputIntroHeading: string;
    numberInputIntroBullets: readonly string[];
    numberInputVariantHeading: string;
    numberInputVariantBullets: readonly string[];
    numberInputSlotsHeading: string;
    numberInputSlotsBullets: readonly string[];
    numberInputPrefixLabel: string;
    numberInputSuffixLabel: string;
    numberInputLoadingHeading: string;
    numberInputDecrementLabel: string;
    numberInputIncrementLabel: string;
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
  'zh-CN': {
    shell: {
      homeBreadcrumbTitle: '总览',
    },
    topBar: {
      filesButton: '文件',
      contextButton: '上下文',
      densityLabel: '密度',
      densityOptionLabel(density) {
        if (density === 'comfortable') {
          return '舒展';
        }

        if (density === 'medium') {
          return '标准';
        }

        return '紧凑';
      },
    },
    runtime: {
      keyLabel(key) {
        if (key === 'theme') {
          return '主题';
        }

        if (key === 'density') {
          return '密度';
        }

        if (key === 'layoutMode') {
          return '布局';
        }

        return '动效';
      },
      themeLabel(theme) {
        return theme === 'light' ? '浅色' : '深色';
      },
      densityLabel(density) {
        if (density === 'comfortable') {
          return '舒展';
        }

        if (density === 'medium') {
          return '标准';
        }

        return '紧凑';
      },
      layoutModeLabel(layoutMode) {
        if (layoutMode === 'spacious') {
          return '宽屏';
        }

        if (layoutMode === 'medium') {
          return '中栏';
        }

        return '紧凑';
      },
      motionLabel(motion) {
        return motion === 'full' ? '完整动效' : '减弱动效';
      },
    },
    meta: {
      layerLabel(layer) {
        if (layer === 'foundation') {
          return '基础层';
        }

        if (layer === 'layout') {
          return '布局层';
        }

        if (layer === 'primitive') {
          return '基础组件';
        }

        if (layer === 'pattern') {
          return '模式层';
        }

        return '审计';
      },
      statusLabel(status) {
        if (status === 'ready') {
          return '已就绪';
        }

        if (status === 'partial') {
          return '部分覆盖';
        }

        return '缺失';
      },
      designStatusLabel(status) {
        if (status === 'confirmed') {
          return '设计已确认';
        }

        if (status === 'needs-design') {
          return '待设计';
        }

        return '待评审';
      },
      gapOwnerLabel(owner) {
        if (owner === 'design') {
          return '设计';
        }

        if (owner === 'frontend') {
          return '前端';
        }

        return '共享层';
      },
    },
    home: {
      eyebrow: 'system-library / 总览',
      summary:
        '这是内部 UI 组件库的文件系统式文档站。先看运行时，再看布局与基础组件，最后回到审计层检查还缺哪些设计契约。',
      recentDocsTitle: '最近更新的文档',
    },
    directory: {
      fallbackDescription: '先浏览当前这一层组件库切片，再决定往下钻到哪条契约。',
      artifactFallbackDescription: '打开这条 artifact，查看当前契约的实现、演示和缺口。',
      rootLabel: '根',
    },
    rail: {
      fileTreeTitle: '文件树',
    },
    shellViewState: {
      loadingTitle: '正在加载 artifact',
      loadingBody: '总览站正在解析当前路径。',
      emptyTitle: '暂无 artifact 内容',
      notRenderableBody: '这条路径暂时没有 artifact 内容。',
      errorTitle: '路径未找到',
    },
    context: {
      panelTitle: '上下文',
      onThisPageTitle: '本页',
      recentArtifactsTitle: '最近 artifact',
      placeholderBody: '当前 artifact 解析完成后会显示上下文。',
      runtimeTitle: '运行时',
      coverageTitle: '覆盖情况',
      noOpenDesignGaps: '当前页面没有待处理的设计缺口。',
    },
    demos: {
      liveTag: '实时',
      titleById(demoId) {
        if (demoId === 'style-provider') {
          return '解析后的运行时';
        }

        if (demoId === 'preferences') {
          return '偏好控制';
        }

        if (demoId === 'tokens') {
          return 'Token 色板';
        }

        if (demoId === 'theme-density') {
          return '主题与密度';
        }

        if (demoId === 'layout-primitives') {
          return '布局原语';
        }

        if (demoId === 'app-shell') {
          return '外壳预览';
        }

        if (demoId === 'button') {
          return '按钮';
        }

        if (demoId === 'heading') {
          return '标题 Heading';
        }

        if (demoId === 'label') {
          return '标签 Label';
        }

        if (demoId === 'text') {
          return '正文 Text';
        }

        if (demoId === 'link') {
          return '链接 Link';
        }

        if (demoId === 'code-block-surface') {
          return '代码块 CodeBlockSurface';
        }

        if (demoId === 'search-input') {
          return '搜索 SearchInput';
        }

        if (demoId === 'number-input') {
          return '数字 NumberInput';
        }

        if (demoId === 'field-input') {
          return 'Field 家族';
        }

        if (demoId === 'tree-nav') {
          return '树导航优先级';
        }

        if (demoId === 'view-state-layout') {
          return '生命周期状态面';
        }

        if (demoId === 'missing-components') {
          return '覆盖摘要';
        }

        return '设计缺口待办';
      },
      preferenceThemeButton(theme) {
        return `切换主题（${theme === 'light' ? '浅色' : '深色'}）`;
      },
      preferenceBackedTag: '由偏好驱动',
      tokenCanvas: '画布',
      tokenSurface: '抬升表面',
      tokenAccent: '强调色',
      themeDensityComfortableTag: '舒展节奏',
      themeDensityComfortableBody: '长文阅读和 overview 页面用更从容的纵向节奏。',
      themeDensityCompactTag: '紧凑节奏',
      themeDensityCompactBody: '高密导航和清单视图会收紧间距，但不改变结构语义。',
      layoutPrimitiveStack: 'Stack',
      layoutPrimitiveInline: 'Inline',
      layoutPrimitiveGrid: 'Grid',
      layoutPrimitiveStackBody: 'Stack 负责纵向节奏。',
      layoutPrimitiveInlineBody: 'Inline 负责对齐操作和元信息。',
      layoutPrimitiveGridBody: 'Grid 负责重复卡片的排布。',
      shellPreviewTopbar: '顶栏',
      shellPreviewNavigation: '导航',
      shellPreviewReadingPane: '阅读区',
      shellPreviewContext: '上下文',
      shellPreviewFilesystemTag: '文件系统外壳',
      buttonPrimary: '主按钮',
      buttonSecondary: '次按钮',
      buttonGhost: '幽灵按钮',
      buttonSuccess: '成功',
      buttonWarning: '警告',
      buttonDestructive: '危险',
      buttonIntroHeading: '概述',
      buttonIntroBullets: [
        '入口：从 @/shared/ui/primitives 导入 Button / IconButton / ButtonGroup（及预设）；主应用与总览壳内的操作控件统一使用这些原语。',
        '约束：app / features / site 内业务 TSX 不直接使用原生 button 元素拼产品界面（shared/ui 内部封装除外）。',
        '样式：根节点挂 sf-button 与 sf-button--{tone|size} 修饰类；规则在 src/shared/ui/styles/components.css，颜色随主题 token 变化。',
        '设计对齐：design/frontend-style-handoff-layered 中 primitive-component-catalog 的 Button 家族（含语义 tone）与本节演示一致；改 token 或 CSS 后在此页做视觉回归。',
      ],
      buttonToneHeading: '变体 tone',
      buttonToneBullets: [
        'primary：主操作、单屏关键 CTA。',
        'secondary：次主操作，或与 primary 成对出现。',
        'ghost：工具栏、文件树行、面包屑等弱对比、依赖上下文的点击面。',
        'success / warning / destructive：语义反馈（success/warning 用 surface + 语义色；destructive 用边框+浅底，避免整块重红底）。',
      ],
      buttonSizeHeading: '尺寸 size',
      buttonSizeBullets: [
        'md：默认控制高度，适用于表单与一般块内操作。',
        'sm：顶栏、与 Tag / SegmentedControl 并排等密集区域。',
      ],
      buttonShowcaseMd: '默认 md',
      buttonShowcaseSm: '紧凑 sm',
      buttonA11yHeading: '可访问性',
      buttonA11yBullets: [
        '纯图标按钮：必须提供可访问名称（常用 aria-label），文案应走 i18n / useUiCopy。',
        '其余：disabled、aria-expanded、aria-current 等原生属性由 Button 透传到根部的 button 元素。',
      ],
      buttonIconAriaLabel: '示例：切换主题',
      buttonDenseHeading: '紧凑布局（覆盖全局样式）',
      buttonDenseBullets: [
        '场景：文件树 disclosure、窄轨等，全局 .sf-button 的 min-height / padding 与栅格冲突。',
        '做法：在局部 CSS Module 用 .localClass:global(.sf-button) 等组合选择器覆盖。',
        '参考：主应用 features/file-tree/components/FileTree.module.css；总览站见 overview.css 中的 .overview-tree__*.sf-button。',
      ],
      buttonLoadingHeading: '加载与图标位',
      buttonLoadingBullets: [
        'loading：前导 spinner、aria-busy、并禁用按钮至结束。',
        'leadingIcon / trailingIcon：使用 Option（none()/some(…)）与 catalog slot 对齐；loading 时前导位仅显示 spinner。',
      ],
      buttonLoadingLabel: '保存中…',
      buttonWithLeadingLabel: '带图标',
      buttonLayoutHeading: '布局与溢出',
      buttonLayoutBullets: [
        'fullWidth：块级宽度（inline-size: 100%），用于表单与空态主操作。',
        'truncateLabel：catalog 中长文案单行省略；与 leadingIcon/trailingIcon 混排时 label 占满剩余空间。',
        'loading：同时挂 sf-button--loading 与 is-loading（interaction-state-matrix）；coarse pointer 下最小高度不低于 44px。',
      ],
      buttonFullWidthLabel: '全宽主操作',
      buttonTruncateLongLabel: '这是一段会在窄容器内被截断的示例按钮文案',
      buttonIconButtonHeading: 'IconButton',
      buttonIconButtonBullets: [
        'catalog：primary / ghost / success / warning / destructive；结构为 icon + srLabel（aria-label）+ loading 时 spinner。',
        '尺寸：md≈36px、sm 更密；coarse pointer 下最小点击面不低于 44px。',
        '优先用 IconButtonGhostSm / IconButtonGhostMd 预设；危险操作用 destructive tone。',
      ],
      buttonGroupHeading: 'ButtonGroup',
      buttonGroupBullets: [
        'variant：default（带 gap）与 attached（贴合并共享边框）。',
        '子项使用 ButtonGroupItem 包裹 Button，可选 current 映射为 aria-pressed。',
        '容器 role="group"，须传入 label 作为可访问名称。',
      ],
      buttonGroupSegmentLabel: '对齐方式示例',
      buttonGroupItemA: '左',
      buttonGroupItemB: '中',
      buttonGroupItemC: '右',
      headingIntroHeading: '概述',
      headingIntroBullets: [
        '入口：从 @/shared/ui/primitives 导入 Heading；语义层级 level 与视觉 variant 分离，避免页面手调字号。',
        '变体：display / section / subsection / caption-heading（primitive-component-catalog）。',
        '语气：default / muted / current；前后缀插槽用 Option（none/some）。',
      ],
      headingVariantHeading: '视觉变体 variant',
      headingVariantBullets: [
        'display：页面主标题气质。',
        'section：区块标题。',
        'subsection：小节标题。',
        'caption-heading：全大写标签型标题（类似 eyebrow）。',
      ],
      headingSampleDisplay: 'Display：主标题',
      headingSampleSection: 'Section：区块标题',
      headingSampleSubsection: 'Subsection：小节标题',
      headingSampleCaption: 'Caption heading',
      headingToneHeading: '语气 tone',
      headingToneBullets: [
        'default：正文强调色阶。',
        'muted：退后说明。',
        'current：导航或选中上下文（accent）。',
      ],
      headingToneDefault: '默认',
      headingToneMuted: '弱化',
      headingToneCurrent: '当前',
      headingSlotsHeading: '插槽',
      headingSlotsBullets: [
        'leadingIcon / trailingMeta：Option；用于图标与右侧元信息（如 Tag）。',
        '锚点与 heading group 组合仍待设计补齐（catalog known gaps）。',
      ],
      headingSlotTitle: '带图标与标签的区块标题',
      headingTrailingTag: 'Live',
      labelIntroHeading: '概述',
      labelIntroBullets: [
        '入口：从 @/shared/ui/primitives 导入 Label；Field 已用 Label 作为标签层。',
        '变体：default / strong / subtle；状态：default / disabled / required / optional。',
        '插槽：requiredMark / optionalMark / infoAffordance 使用 Option；optional 文案须 i18n。',
      ],
      labelVariantHeading: '变体 variant',
      labelVariantBullets: [
        'default：与 Field 默认标签一致（小号大写）。',
        'strong：略强调，适合分区标题式 label。',
        'subtle：更退后，用于次要字段名。',
      ],
      labelSampleDefault: 'Default',
      labelSampleStrong: 'Strong',
      labelSampleSubtle: 'Subtle',
      labelStateHeading: '状态 state',
      labelStateBullets: [
        'required：默认星号；可用 requiredMark 覆盖。',
        'optional：仅当 optionalMark 为 some 时渲染（示例用短文案）。',
        'disabled：降低透明度并 aria-disabled。',
      ],
      labelStateDefault: '普通',
      labelStateDisabled: '禁用态',
      labelStateRequired: '必填',
      labelStateOptional: '选填字段',
      labelOptionalMarkText: '（可选）',
      labelAffordanceHeading: '信息入口',
      labelAffordanceBullets: [
        'infoAffordance：右侧放置 IconButton 等轻量入口；与控件本身的帮助文案分工。',
      ],
      labelInfoIconSrLabel: '字段说明',
      labelWithInfoSlot: '带说明入口',
      textIntroHeading: '概述',
      textIntroBullets: [
        '入口：从 @/shared/ui/primitives 导入 Text；统一界面文案、说明行与技术字面量的排版与语义色。',
        '变体：ui / body / strong / subtle / caption / mono（primitive-component-catalog）。',
        '语气 tone：default / muted / success / warning / destructive / disabled；与变体正交组合。',
      ],
      textVariantHeading: '变体 variant',
      textVariantBullets: [
        'ui：与控件字号对齐的界面文案。',
        'body：块级说明段落（display: block）。',
        'strong：强调句。',
        'subtle：更轻的辅助语气。',
        'caption：小号标签式说明。',
        'mono：等宽字面量。',
      ],
      textSampleUi: 'UI：界面文案',
      textSampleBody:
        'Body：这是一段块级说明示例，用于表单下方或卡片内的补充说明，不与长篇 article 正文混用。',
      textSampleStrong: 'Strong：关键结论',
      textSampleSubtle: 'Subtle：辅助说明',
      textSampleCaption: 'Caption · 小号',
      textSampleMono: 'pnpm run build',
      textToneHeading: '语气 tone',
      textToneBullets: [
        'default：主文本色。',
        'muted：退后一层。',
        'success / warning / destructive：语义反馈色（仍由 token 驱动）。',
        'disabled：降低对比并 aria-disabled。',
      ],
      textToneDefault: '默认',
      textToneMuted: '弱化',
      textToneSuccess: '成功',
      textToneWarning: '警告',
      textToneDestructive: '危险',
      textToneDisabled: '禁用',
      linkIntroHeading: '概述',
      linkIntroBullets: [
        '入口：从 @/shared/ui/primitives 导入 Link；用于导航型文本，与 Button 的动作语义区分。',
        '变体：default / subtle / external；leadingIcon / trailingIcon 使用 Option。',
        'external：未传 trailingIcon 时显示默认 ↗；可与 target、rel 等原生属性组合。',
      ],
      linkVariantHeading: '变体 variant',
      linkVariantBullets: [
        'default：强调色链路与下划线反馈。',
        'subtle：弱化行内导航。',
        'external：外链气质 + 默认可达 ↗（可被 trailingIcon 覆盖）。',
      ],
      linkSampleDefault: '默认链接',
      linkSampleSubtle: '弱化链接',
      linkSampleExternal: '外部文档',
      linkNavHeading: '当前项 current',
      linkNavBullets: [
        'current：映射 catalog 的 current 状态，设置 aria-current="page" 与 sf-link--current。',
        '用于侧栏、面包屑等导航上下文；具体路由集成由应用层处理。',
      ],
      linkNavCurrent: '当前页',
      linkNavOther: '其他页',
      codeBlockSurfaceIntroHeading: '概述',
      codeBlockSurfaceIntroBullets: [
        '入口：从 @/shared/ui/primitives 导入 CodeBlockSurface；等宽正文传 `code` 字符串即可，组件会包一层 pre/code；完全自定义时再传 children。',
        '插槽：header / language / meta / actions / footer 均为 Option；行号与高亮仍属 pattern。',
        'lineWrap 与 scrollable 对应 wrapped / scrollable 表现；容器 :focus-within 呈现轮廓。',
      ],
      codeBlockSurfaceVariantHeading: '变体 variant',
      codeBlockSurfaceVariantBullets: [
        'default：常规阅读面。',
        'command：偏终端/命令行气质。',
        'diff-neutral：中性 diff 承载面（不含行级 diff 语义）。',
      ],
      codeBlockSurfaceSnippetTsx: 'export function Demo() {\n  return <span>ok</span>;\n}',
      codeBlockSurfaceSnippetCommand: 'pnpm install && pnpm run build',
      codeBlockSurfaceSnippetDiff: '  context\n- old line\n+ new line',
      codeBlockSurfaceLayoutHeading: '头部与辅助槽',
      codeBlockSurfaceLayoutBullets: [
        'language / meta / actions 演示顶栏信息密度；footer 放短说明。',
        '复制等操作用 Button 原语，复制反馈仍由上层承接。',
      ],
      codeBlockSurfaceMetaReadOnly: '只读',
      codeBlockSurfaceCopyAction: '复制',
      codeBlockSurfaceFooterNote: '行号与语法高亮不在 primitive 层实现。',
      searchInputIntroHeading: '概述',
      searchInputIntroBullets: [
        '入口：从 @/shared/ui/primitives 导入 SearchInput；与通用 TextInput 区分，专注关键词查找。',
        '插槽：leadingSearchIcon / clear / submit / scope 使用 Option；loading 时内置 spinner。',
        '变体 default / subtle；filled 在受控 value 有内容时自动加上（用于表面反馈）。',
      ],
      searchInputVariantHeading: '变体 variant',
      searchInputVariantBullets: ['default：常规抬升表面。', 'subtle：更弱对比，适合工具栏内嵌。'],
      searchInputPlaceholder: '搜索文档…',
      searchInputLoadingHeading: '加载状态',
      searchInputLoadingLabel: '正在搜索',
      searchInputSubmitLabel: '搜索',
      searchInputScopeLabel: '全局',
      searchInputSlotsHeading: '插槽示例',
      searchInputSlotsBullets: [
        'clear / submit 使用轻量按钮；scope 演示右侧范围标签。',
        '防抖、范围切换与最近查询仍属 catalog known gaps，由 pattern 承接。',
      ],
      numberInputIntroHeading: '概述',
      numberInputIntroBullets: [
        '入口：从 @/shared/ui/primitives 导入 NumberInput；type="number"，隐藏原生 spinner，由槽位或内置 − / + 步进。',
        'prefix / suffix 与 stepDown / stepUp 使用 Option；槽为 none 时渲染内置步进并尊重 step、min、max。',
        '变体 invalid / warning / success 用于语义边框；loading 显示 spinner。',
      ],
      numberInputVariantHeading: '变体 variant',
      numberInputVariantBullets: [
        'default：常规录入。',
        'invalid / warning / success：语义反馈边框（与校验状态配合）。',
      ],
      numberInputSlotsHeading: '前缀与后缀',
      numberInputSlotsBullets: [
        'prefix / suffix 承载单位或字段提示；stepDown/stepUp 为 none 时仍用内置 − / +。',
        '受控示例用 value + onChange；步进会调用 onChange 写入新值。',
      ],
      numberInputPrefixLabel: '宽',
      numberInputSuffixLabel: 'px',
      numberInputLoadingHeading: '加载',
      numberInputDecrementLabel: '减小',
      numberInputIncrementLabel: '增大',
      fieldTextInputLabel: '文本输入',
      fieldTextInputDescription: '共享的平静输入表面。',
      fieldTextInputValue: '按钮文案',
      fieldNotesLabel: '备注',
      fieldNotesDescription: 'Textarea 沿用同一套 token 家族。',
      fieldNotesValue: '设计诉求需要始终可见。',
      fieldDensityLabel: '密度',
      fieldDensityDescription: 'Select trigger 也应留在同一套 field 系统里。',
      treeFoundation: '基础',
      treeStyleProvider: 'StyleProvider',
      treeTokenMap: 'Token Map',
      treeAudit: '审计',
      viewStateLoadingTitle: '加载中',
      viewStateLoadingBody: '稳定的加载面应该有克制的层级和节奏。',
      viewStateEmptyTitle: '空态',
      viewStateEmptyBody: '空态需要独立的语气和明确的后续动作。',
      viewStateErrorTitle: '错误',
      viewStateErrorBody: '错误态应该复用同一套反馈语言。',
    },
  },
  'en-US': {
    shell: {
      homeBreadcrumbTitle: 'overview',
    },
    topBar: {
      filesButton: 'Files',
      contextButton: 'Context',
      densityLabel: 'Density',
      densityOptionLabel(density) {
        if (density === 'comfortable') {
          return 'Comfortable';
        }

        if (density === 'medium') {
          return 'Medium';
        }

        return 'Compact';
      },
    },
    runtime: {
      keyLabel(key) {
        if (key === 'theme') {
          return 'Theme';
        }

        if (key === 'density') {
          return 'Density';
        }

        if (key === 'layoutMode') {
          return 'Layout';
        }

        return 'Motion';
      },
      themeLabel(theme) {
        return theme === 'light' ? 'Light' : 'Dark';
      },
      densityLabel(density) {
        if (density === 'comfortable') {
          return 'Comfortable';
        }

        if (density === 'medium') {
          return 'Medium';
        }

        return 'Compact';
      },
      layoutModeLabel(layoutMode) {
        if (layoutMode === 'spacious') {
          return 'Spacious';
        }

        if (layoutMode === 'medium') {
          return 'Medium';
        }

        return 'Compact';
      },
      motionLabel(motion) {
        return motion === 'full' ? 'Full motion' : 'Reduced motion';
      },
    },
    meta: {
      layerLabel(layer) {
        if (layer === 'foundation') {
          return 'Foundation';
        }

        if (layer === 'layout') {
          return 'Layout';
        }

        if (layer === 'primitive') {
          return 'Primitives';
        }

        if (layer === 'pattern') {
          return 'Patterns';
        }

        return 'Audit';
      },
      statusLabel(status) {
        if (status === 'ready') {
          return 'Ready';
        }

        if (status === 'partial') {
          return 'Partial';
        }

        return 'Missing';
      },
      designStatusLabel(status) {
        if (status === 'confirmed') {
          return 'Design confirmed';
        }

        if (status === 'needs-design') {
          return 'Needs design';
        }

        return 'Needs review';
      },
      gapOwnerLabel(owner) {
        if (owner === 'design') {
          return 'Design';
        }

        if (owner === 'frontend') {
          return 'Frontend';
        }

        return 'Shared';
      },
    },
    home: {
      eyebrow: 'system-library / overview',
      summary:
        'This is a filesystem-style documentation station for the internal UI library. Start with the runtime, move through layout and primitives, and use the audit layer to track missing design contracts.',
      recentDocsTitle: 'Recently touched docs',
    },
    directory: {
      fallbackDescription:
        'Browse the current slice of the UI library before drilling into a specific contract.',
      artifactFallbackDescription:
        'Open this artifact to inspect the current contract, its demos, and the remaining gaps.',
      rootLabel: 'root',
    },
    rail: {
      fileTreeTitle: 'Filesystem',
    },
    shellViewState: {
      loadingTitle: 'Loading artifact',
      loadingBody: 'The overview station is resolving the current path.',
      emptyTitle: 'Nothing to render',
      notRenderableBody: 'This path does not have artifact content yet.',
      errorTitle: 'Path not found',
    },
    context: {
      panelTitle: 'Context',
      onThisPageTitle: 'On this page',
      recentArtifactsTitle: 'Recent artifacts',
      placeholderBody: 'Context appears once the current artifact is resolved.',
      runtimeTitle: 'Runtime',
      coverageTitle: 'Coverage',
      noOpenDesignGaps: 'No open design gaps on this page.',
    },
    demos: {
      liveTag: 'Live',
      titleById(demoId) {
        if (demoId === 'style-provider') {
          return 'Resolved runtime';
        }

        if (demoId === 'preferences') {
          return 'Preference controls';
        }

        if (demoId === 'tokens') {
          return 'Token swatches';
        }

        if (demoId === 'theme-density') {
          return 'Theme and density';
        }

        if (demoId === 'layout-primitives') {
          return 'Layout primitives';
        }

        if (demoId === 'app-shell') {
          return 'Shell preview';
        }

        if (demoId === 'button') {
          return 'Button';
        }

        if (demoId === 'heading') {
          return 'Heading';
        }

        if (demoId === 'label') {
          return 'Label';
        }

        if (demoId === 'text') {
          return 'Text';
        }

        if (demoId === 'link') {
          return 'Link';
        }

        if (demoId === 'code-block-surface') {
          return 'CodeBlockSurface';
        }

        if (demoId === 'search-input') {
          return 'SearchInput';
        }

        if (demoId === 'number-input') {
          return 'NumberInput';
        }

        if (demoId === 'field-input') {
          return 'Field family';
        }

        if (demoId === 'tree-nav') {
          return 'Tree navigation priority';
        }

        if (demoId === 'view-state-layout') {
          return 'Lifecycle surfaces';
        }

        if (demoId === 'missing-components') {
          return 'Coverage summary';
        }

        return 'Design gap backlog';
      },
      preferenceThemeButton(theme) {
        return `Toggle theme (${theme === 'light' ? 'light' : 'dark'})`;
      },
      preferenceBackedTag: 'Preference-backed',
      tokenCanvas: 'Canvas',
      tokenSurface: 'Raised surface',
      tokenAccent: 'Accent',
      themeDensityComfortableTag: 'Comfortable rhythm',
      themeDensityComfortableBody: 'Long-form reading and overview pages use the relaxed scale.',
      themeDensityCompactTag: 'Compact rhythm',
      themeDensityCompactBody:
        'Dense navigation and inventory views tighten spacing without changing structure.',
      layoutPrimitiveStack: 'Stack',
      layoutPrimitiveInline: 'Inline',
      layoutPrimitiveGrid: 'Grid',
      layoutPrimitiveStackBody: 'Stack controls vertical rhythm.',
      layoutPrimitiveInlineBody: 'Inline aligns controls and metadata.',
      layoutPrimitiveGridBody: 'Grid handles repeatable card layouts.',
      shellPreviewTopbar: 'Topbar',
      shellPreviewNavigation: 'Navigation',
      shellPreviewReadingPane: 'Reading pane',
      shellPreviewContext: 'Context',
      shellPreviewFilesystemTag: 'filesystem shell',
      buttonPrimary: 'Primary',
      buttonSecondary: 'Secondary',
      buttonGhost: 'Ghost',
      buttonSuccess: 'Success',
      buttonWarning: 'Warning',
      buttonDestructive: 'Destructive',
      buttonIntroHeading: 'Overview',
      buttonIntroBullets: [
        'Import: use Button / IconButton / ButtonGroup (and presets) from @/shared/ui/primitives for actions in the app shell and on this site.',
        'Rule: in app / features / site, do not use raw button elements for product UI (except inside shared/ui implementations).',
        'Styling: root classes sf-button and sf-button--{tone|size}; rules live in src/shared/ui/styles/components.css and follow theme tokens.',
        'Design alignment: the Button family in design/frontend-style-handoff-layered/primitive-component-catalog (including semantic tones) matches this demo; use this page for visual regression after token/CSS changes.',
      ],
      buttonToneHeading: 'tone variants',
      buttonToneBullets: [
        'primary: main action / strongest CTA.',
        'secondary: secondary action, or paired with primary.',
        'ghost: toolbars, tree rows, breadcrumbs—low chrome, context-dependent.',
        'success / warning / destructive: semantic feedback (success/warning use surface + semantic ink; destructive uses border + light fill, not a heavy solid red block).',
      ],
      buttonSizeHeading: 'size',
      buttonSizeBullets: [
        'md: default control height for forms and general in-flow actions.',
        'sm: top bars and dense rows next to Tag / SegmentedControl.',
      ],
      buttonShowcaseMd: 'Default md',
      buttonShowcaseSm: 'Compact sm',
      buttonA11yHeading: 'Accessibility',
      buttonA11yBullets: [
        'Icon-only: provide an accessible name (commonly aria-label); copy via i18n / useUiCopy.',
        'Other props: disabled, aria-expanded, aria-current, etc. pass through to the underlying button element.',
      ],
      buttonIconAriaLabel: 'Example: toggle theme',
      buttonDenseHeading: 'Dense layouts (overriding globals)',
      buttonDenseBullets: [
        'When: file-tree disclosure, narrow rails, etc.—global .sf-button min-height/padding fights the grid.',
        'How: in a local CSS Module, use compound selectors such as .localClass:global(.sf-button) to override.',
        'Refs: main app features/file-tree/components/FileTree.module.css; overview overview.css (.overview-tree__*.sf-button).',
      ],
      buttonLoadingHeading: 'Loading and icon slots',
      buttonLoadingBullets: [
        'loading: leading spinner, aria-busy, and disabled until cleared.',
        'leadingIcon / trailingIcon: Option (none/some) aligned to catalog slots; trailing hides while loading.',
      ],
      buttonLoadingLabel: 'Saving…',
      buttonWithLeadingLabel: 'With icon',
      buttonLayoutHeading: 'Layout and overflow',
      buttonLayoutBullets: [
        'fullWidth: block-level width (inline-size: 100%) for forms and primary CTAs.',
        'truncateLabel: single-line ellipsis for long labels (catalog); with leading/trailing icons the label flexes and truncates.',
        'loading: applies sf-button--loading and is-loading (interaction-state-matrix); coarse pointers keep min height ≥ 44px.',
      ],
      buttonFullWidthLabel: 'Full-width primary',
      buttonTruncateLongLabel: 'This long label truncates inside a narrow container',
      buttonIconButtonHeading: 'IconButton',
      buttonIconButtonBullets: [
        'catalog: primary / ghost / success / warning / destructive; structure is icon + srLabel (aria-label) + spinner when loading.',
        'Sizes: md ≈ 36px, sm tighter; coarse pointers keep the hit target ≥ 44px.',
        'Prefer IconButtonGhostSm / IconButtonGhostMd presets; destructive tone for dangerous actions.',
      ],
      buttonGroupHeading: 'ButtonGroup',
      buttonGroupBullets: [
        'variant: default (with gap) vs attached (merged borders).',
        'Children use ButtonGroupItem wrapping Button; optional current maps to aria-pressed.',
        'Container uses role="group"; pass label for the accessible name.',
      ],
      buttonGroupSegmentLabel: 'Alignment sample',
      buttonGroupItemA: 'Left',
      buttonGroupItemB: 'Center',
      buttonGroupItemC: 'Right',
      headingIntroHeading: 'Overview',
      headingIntroBullets: [
        'Import Heading from @/shared/ui/primitives; semantic level is separate from visual variant so pages do not hand-tune font sizes.',
        'Variants: display / section / subsection / caption-heading (primitive-component-catalog).',
        'Tones: default / muted / current; leading/trailing slots use Option (none/some).',
      ],
      headingVariantHeading: 'Variants',
      headingVariantBullets: [
        'display: page hero title presence.',
        'section: block titles.',
        'subsection: nested section titles.',
        'caption-heading: uppercase label-style heading (eyebrow-like).',
      ],
      headingSampleDisplay: 'Display: hero title',
      headingSampleSection: 'Section: block title',
      headingSampleSubsection: 'Subsection: nested title',
      headingSampleCaption: 'Caption heading',
      headingToneHeading: 'Tones',
      headingToneBullets: [
        'default: standard text emphasis.',
        'muted: de-emphasized supporting context.',
        'current: navigation or selection context (accent).',
      ],
      headingToneDefault: 'Default',
      headingToneMuted: 'Muted',
      headingToneCurrent: 'Current',
      headingSlotsHeading: 'Slots',
      headingSlotsBullets: [
        'leadingIcon / trailingMeta: Option-based; for icons and trailing metadata (such as Tag).',
        'Anchor affordances and heading groups are still tracked as catalog gaps.',
      ],
      headingSlotTitle: 'Block title with icon and trailing tag',
      headingTrailingTag: 'Live',
      labelIntroHeading: 'Overview',
      labelIntroBullets: [
        'Import Label from @/shared/ui/primitives; Field now uses Label for the label surface.',
        'Variants: default / strong / subtle; states: default / disabled / required / optional.',
        'Slots: requiredMark, optionalMark, and infoAffordance use Option; optional copy must be localized.',
      ],
      labelVariantHeading: 'Variants',
      labelVariantBullets: [
        'default: matches the default Field label treatment (small caps).',
        'strong: slightly heavier for section-like labels.',
        'subtle: more de-emphasized for secondary field names.',
      ],
      labelSampleDefault: 'Default',
      labelSampleStrong: 'Strong',
      labelSampleSubtle: 'Subtle',
      labelStateHeading: 'States',
      labelStateBullets: [
        'required: default asterisk; override with requiredMark when needed.',
        'optional: renders only when optionalMark is some (demo uses short copy).',
        'disabled: lowers contrast and sets aria-disabled.',
      ],
      labelStateDefault: 'Normal',
      labelStateDisabled: 'Disabled',
      labelStateRequired: 'Required',
      labelStateOptional: 'Optional field',
      labelOptionalMarkText: '(optional)',
      labelAffordanceHeading: 'Info affordance',
      labelAffordanceBullets: [
        'infoAffordance: trailing slot for IconButton or similar; separate from control help text.',
      ],
      labelInfoIconSrLabel: 'Field help',
      labelWithInfoSlot: 'With info affordance',
      textIntroHeading: 'Overview',
      textIntroBullets: [
        'Import Text from @/shared/ui/primitives to align UI copy, helper lines, and technical literals on one scale.',
        'Variants: ui / body / strong / subtle / caption / mono (primitive-component-catalog).',
        'Tones: default / muted / success / warning / destructive / disabled; orthogonal to variants.',
      ],
      textVariantHeading: 'Variants',
      textVariantBullets: [
        'ui: control-aligned UI copy.',
        'body: block helper paragraphs (display: block).',
        'strong: emphasized sentences.',
        'subtle: lighter supporting tone.',
        'caption: small caption-style copy.',
        'mono: monospace literals.',
      ],
      textSampleUi: 'UI: interface copy',
      textSampleBody:
        'Body: a block helper paragraph for forms or cards—not a full article prose system.',
      textSampleStrong: 'Strong: key takeaway',
      textSampleSubtle: 'Subtle: supporting detail',
      textSampleCaption: 'Caption · small',
      textSampleMono: 'pnpm run build',
      textToneHeading: 'Tones',
      textToneBullets: [
        'default: primary ink.',
        'muted: one step back.',
        'success / warning / destructive: semantic feedback (token-driven).',
        'disabled: lowers contrast and sets aria-disabled.',
      ],
      textToneDefault: 'Default',
      textToneMuted: 'Muted',
      textToneSuccess: 'Success',
      textToneWarning: 'Warning',
      textToneDestructive: 'Destructive',
      textToneDisabled: 'Disabled',
      linkIntroHeading: 'Overview',
      linkIntroBullets: [
        'Import Link from @/shared/ui/primitives for navigation-style text, distinct from Button actions.',
        'Variants: default / subtle / external; leadingIcon and trailingIcon use Option.',
        'external: shows a default ↗ when trailingIcon is none; combine with target/rel as needed.',
      ],
      linkVariantHeading: 'Variants',
      linkVariantBullets: [
        'default: accent link with underline feedback.',
        'subtle: de-emphasized inline navigation.',
        'external: outbound affordance with a default ↗ (override with trailingIcon).',
      ],
      linkSampleDefault: 'Default link',
      linkSampleSubtle: 'Subtle link',
      linkSampleExternal: 'External docs',
      linkNavHeading: 'Current',
      linkNavBullets: [
        'current: maps the catalog current state with aria-current="page" and sf-link--current.',
        'Use in side rails and breadcrumbs; routing integration stays in the app layer.',
      ],
      linkNavCurrent: 'This page',
      linkNavOther: 'Other page',
      codeBlockSurfaceIntroHeading: 'Overview',
      codeBlockSurfaceIntroBullets: [
        'Import CodeBlockSurface from @/shared/ui/primitives; pass a `code` string for monospace body (pre/code is internal), or `children` for custom markup.',
        'Slots header, language, meta, actions, and footer use Option; line numbers and highlighting belong to patterns.',
        'lineWrap and scrollable map to wrapped / scrollable presentation; the shell uses :focus-within for focus outline.',
      ],
      codeBlockSurfaceVariantHeading: 'Variants',
      codeBlockSurfaceVariantBullets: [
        'default: standard reading surface.',
        'command: terminal-like tone.',
        'diff-neutral: neutral diff shell without line-level diff semantics.',
      ],
      codeBlockSurfaceSnippetTsx: 'export function Demo() {\n  return <span>ok</span>;\n}',
      codeBlockSurfaceSnippetCommand: 'pnpm install && pnpm run build',
      codeBlockSurfaceSnippetDiff: '  context\n- old line\n+ new line',
      codeBlockSurfaceLayoutHeading: 'Header slots',
      codeBlockSurfaceLayoutBullets: [
        'language, meta, and actions show header density; footer carries a short note.',
        'Use Button primitives for actions; copy feedback stays in upper layers.',
      ],
      codeBlockSurfaceMetaReadOnly: 'Read-only',
      codeBlockSurfaceCopyAction: 'Copy',
      codeBlockSurfaceFooterNote:
        'Line numbers and syntax highlighting are not implemented at the primitive layer.',
      searchInputIntroHeading: 'Overview',
      searchInputIntroBullets: [
        'Import SearchInput from @/shared/ui/primitives; it is for keyword lookup, not general text entry.',
        'Slots leadingSearchIcon, clear, submit, and scope use Option; loading shows the built-in spinner.',
        'Variants default and subtle; filled is derived when a controlled value is non-empty.',
      ],
      searchInputVariantHeading: 'Variants',
      searchInputVariantBullets: [
        'default: standard raised surface.',
        'subtle: lower contrast for inline toolbars.',
      ],
      searchInputPlaceholder: 'Search docs…',
      searchInputLoadingHeading: 'Loading state',
      searchInputLoadingLabel: 'Searching',
      searchInputSubmitLabel: 'Search',
      searchInputScopeLabel: 'Global',
      searchInputSlotsHeading: 'Slot examples',
      searchInputSlotsBullets: [
        'clear and submit use small buttons; scope shows a trailing range label.',
        'Debounce, scope switching, and recent queries stay in patterns per catalog gaps.',
      ],
      numberInputIntroHeading: 'Overview',
      numberInputIntroBullets: [
        'Import NumberInput from @/shared/ui/primitives; it uses type="number", hides native spinners, and uses slots or built-in − / +.',
        'prefix, suffix, stepDown, and stepUp use Option; when step slots are none, built-in steppers respect step, min, and max.',
        'invalid, warning, and success tune semantic borders; loading shows a spinner.',
      ],
      numberInputVariantHeading: 'Variants',
      numberInputVariantBullets: [
        'default: standard entry.',
        'invalid / warning / success: semantic border feedback for validation states.',
      ],
      numberInputSlotsHeading: 'Prefix and suffix',
      numberInputSlotsBullets: [
        'prefix and suffix carry units or labels; built-in steppers stay unless step slots are provided.',
        'The controlled demo uses value and onChange; nudging fires onChange with the next value.',
      ],
      numberInputPrefixLabel: 'W',
      numberInputSuffixLabel: 'px',
      numberInputLoadingHeading: 'Loading',
      numberInputDecrementLabel: 'Decrease',
      numberInputIncrementLabel: 'Increase',
      fieldTextInputLabel: 'Text input',
      fieldTextInputDescription: 'Shared calm field surface.',
      fieldTextInputValue: 'Button copy',
      fieldNotesLabel: 'Notes',
      fieldNotesDescription: 'Textarea follows the same token family.',
      fieldNotesValue: 'Design asks should stay visible.',
      fieldDensityLabel: 'Density',
      fieldDensityDescription: 'Select trigger stays inside the same field system.',
      treeFoundation: 'Foundation',
      treeStyleProvider: 'StyleProvider',
      treeTokenMap: 'Token Map',
      treeAudit: 'Audit',
      viewStateLoadingTitle: 'Loading',
      viewStateLoadingBody: 'Stable loading surface with calm hierarchy.',
      viewStateEmptyTitle: 'Empty',
      viewStateEmptyBody: 'Empty states need a dedicated tone and action path.',
      viewStateErrorTitle: 'Error',
      viewStateErrorBody: 'Error states reuse the same feedback language.',
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
