import type {
  ArticleDocument,
  ArticleSection,
  ContentNode,
  DirectoryContent,
  DocumentId,
  HomeContent,
  NodeId,
} from '@/entities/content';
import { DEFAULT_LOCALE, type AppLocale } from '@/shared/lib/i18n/locale.types';
import { none, some, unwrapOr, type Option } from '@/shared/lib/monads/option';
import { createMarkdownDemoFixtures } from './markdown-fixtures';

export const ROOT_NODE_ID = 'root';
export const ROOT_NODE_TITLE = 'system-library';

export type OverviewFixtures = {
  rootNodeTitle: string;
  contentNodes: ContentNode[];
  homeContents: Record<DocumentId, HomeContent>;
  directoryDescriptions: Record<NodeId, DirectoryContent['description']>;
  articleDocuments: Record<DocumentId, ArticleDocument>;
};

export type OverviewLayer = 'foundation' | 'layout' | 'primitive' | 'pattern' | 'audit';
export type OverviewDocumentStatus = 'ready' | 'partial' | 'missing';
export type OverviewDesignStatus = 'confirmed' | 'needs-design' | 'needs-review';
export type OverviewGapOwner = 'design' | 'frontend' | 'shared';

export type OverviewGap = {
  id: string;
  title: string;
  description: string;
  owner: OverviewGapOwner;
};

export type OverviewDocumentMeta = {
  documentId: DocumentId;
  layer: OverviewLayer;
  status: OverviewDocumentStatus;
  designStatus: OverviewDesignStatus;
  demoIds: string[];
  tags: string[];
  gaps: OverviewGap[];
  relatedPaths: string[];
};

export type OverviewHomeCollectionEntry = {
  path: string;
  label: string;
};

export type OverviewHomeCollection = {
  id: string;
  title: string;
  description: string;
  entries: OverviewHomeCollectionEntry[];
};

type NodeConfig = {
  id: NodeId;
  kind: ContentNode['kind'];
  title: string;
  slug: string;
  parentId: NodeId;
  ancestorIds: NodeId[];
  pathSegments: string[];
  childrenCount: Option<number>;
  documentId: Option<DocumentId>;
  publishedAt: Option<string>;
  updatedAt: Option<string>;
  readingMinutes: Option<number>;
};

type ArticleConfig = {
  id: DocumentId;
  title: string;
  summary: string;
  eyebrow: string;
  sections: ArticleSection[];
};

function localize(locale: AppLocale, english: string, chinese: string): string {
  return locale === 'en-US' ? english : chinese;
}

function createNode(config: NodeConfig): ContentNode {
  const childrenCount = unwrapOr(config.childrenCount, 0);

  return {
    id: config.id,
    kind: config.kind,
    status: 'available',
    title: config.title,
    slug: config.slug,
    parentId: some(config.parentId),
    ancestorIds: config.ancestorIds,
    pathSegments: config.pathSegments,
    childrenCount,
    hasChildren: childrenCount > 0,
    documentId: config.documentId,
    publishedAt: config.publishedAt,
    updatedAt: config.updatedAt,
    readingMinutes: config.readingMinutes,
  };
}

function createArticle(config: ArticleConfig): ArticleDocument {
  return {
    kind: 'article',
    id: config.id,
    title: config.title,
    summary: config.summary,
    eyebrow: config.eyebrow,
    toc: config.sections.map((section) => ({
      id: section.id,
      title: section.title,
      level: section.level,
    })),
    sections: config.sections,
  };
}

function createSection(
  id: string,
  title: string,
  level: 2 | 3 | 4,
  paragraphs: string[]
): ArticleSection {
  return {
    id,
    title,
    level,
    paragraphs,
  };
}

function createOverviewDocumentMetaByLocale(
  locale: AppLocale
): Record<DocumentId, OverviewDocumentMeta> {
  return {
    'doc-style-provider': {
      documentId: 'doc-style-provider',
      layer: 'foundation',
      status: 'ready',
      designStatus: 'confirmed',
      demoIds: ['style-provider', 'preferences'],
      tags: ['runtime', 'preferences'],
      gaps: [],
      relatedPaths: ['/foundation/theme-and-density', '/layout/app-shell'],
    },
    'doc-tokens': {
      documentId: 'doc-tokens',
      layer: 'foundation',
      status: 'partial',
      designStatus: 'needs-review',
      demoIds: ['tokens'],
      tags: ['tokens', 'semantic aliases'],
      gaps: [
        {
          id: 'token-danger-tone',
          title: localize(locale, 'Destructive tone aliases', '危险态 tone alias'),
          description: localize(
            locale,
            'Need reviewed destructive tokens for buttons and notices.',
            '按钮和 notice 还需要经过评审的危险态 tokens。'
          ),
          owner: 'design',
        },
      ],
      relatedPaths: ['/foundation/theme-and-density'],
    },
    'doc-theme-density': {
      documentId: 'doc-theme-density',
      layer: 'foundation',
      status: 'ready',
      designStatus: 'confirmed',
      demoIds: ['theme-density'],
      tags: ['theme', 'density'],
      gaps: [],
      relatedPaths: ['/foundation/style-provider'],
    },
    'doc-layout-primitives': {
      documentId: 'doc-layout-primitives',
      layer: 'layout',
      status: 'ready',
      designStatus: 'confirmed',
      demoIds: ['layout-primitives'],
      tags: ['stack', 'inline', 'grid', 'surface'],
      gaps: [],
      relatedPaths: ['/layout/app-shell'],
    },
    'doc-app-shell': {
      documentId: 'doc-app-shell',
      layer: 'layout',
      status: 'partial',
      designStatus: 'needs-review',
      demoIds: ['app-shell'],
      tags: ['shell', 'responsive', 'filesystem'],
      gaps: [
        {
          id: 'app-shell-medium-drawer',
          title: localize(locale, 'Medium drawer polish', '中栏抽屉收尾'),
          description: localize(
            locale,
            'Need final motion and surface treatment for the medium context drawer.',
            '中栏 context drawer 还缺最终的动效和表面处理。'
          ),
          owner: 'design',
        },
      ],
      relatedPaths: ['/patterns/navigation/tree-nav'],
    },
    'doc-button': {
      documentId: 'doc-button',
      layer: 'primitive',
      status: 'partial',
      designStatus: 'needs-design',
      demoIds: ['button'],
      tags: ['button', 'actions'],
      gaps: [
        {
          id: 'button-destructive',
          title: localize(locale, 'Destructive button family', '破坏性按钮族'),
          description: localize(
            locale,
            'Need a complete destructive tone family and loading choreography.',
            '还需要完整的破坏性按钮 tone 家族和 loading 编排。'
          ),
          owner: 'design',
        },
      ],
      relatedPaths: ['/primitives/data-entry/field-and-input'],
    },
    'doc-heading': {
      documentId: 'doc-heading',
      layer: 'primitive',
      status: 'partial',
      designStatus: 'needs-review',
      demoIds: ['heading'],
      tags: ['heading', 'typography'],
      gaps: [
        {
          id: 'heading-anchor',
          title: localize(locale, 'Anchor and grouping', '锚点与分组'),
          description: localize(
            locale,
            'Anchor affordance and heading-group plus summary composition still need design follow-up.',
            '锚点 affordance、heading group 与 summary 的组合仍需设计补齐。'
          ),
          owner: 'design',
        },
      ],
      relatedPaths: [
        '/primitives/content/label',
        '/primitives/content/text',
        '/primitives/content/link',
        '/primitives/content/code-block-surface',
        '/primitives/actions/button',
      ],
    },
    'doc-label': {
      documentId: 'doc-label',
      layer: 'primitive',
      status: 'partial',
      designStatus: 'needs-review',
      demoIds: ['label'],
      tags: ['label', 'typography', 'inline-semantics'],
      gaps: [
        {
          id: 'label-multiline',
          title: localize(locale, 'Multiline label and actions', '多行标签与操作'),
          description: localize(
            locale,
            'Multiline label boundaries and label-action combinations still need design closure.',
            '多行 label、label action 与 info affordance 的组合边界仍需设计补齐。'
          ),
          owner: 'design',
        },
      ],
      relatedPaths: [
        '/primitives/content/heading',
        '/primitives/content/text',
        '/primitives/content/link',
        '/primitives/content/code-block-surface',
        '/primitives/data-entry/field-and-input',
      ],
    },
    'doc-text': {
      documentId: 'doc-text',
      layer: 'primitive',
      status: 'partial',
      designStatus: 'needs-review',
      demoIds: ['text'],
      tags: ['text', 'typography', 'inline-semantics'],
      gaps: [
        {
          id: 'text-prose',
          title: localize(locale, 'Long-form prose', '长篇正文'),
          description: localize(
            locale,
            'Long-form reading and business patterns remain outside this primitive; Text does not invent a full prose system.',
            '长篇阅读与业务 patterns 仍在外层；Text 不重新发明完整正文系统。'
          ),
          owner: 'design',
        },
      ],
      relatedPaths: [
        '/primitives/content/heading',
        '/primitives/content/label',
        '/primitives/content/link',
        '/primitives/content/code-block-surface',
      ],
    },
    'doc-link': {
      documentId: 'doc-link',
      layer: 'primitive',
      status: 'partial',
      designStatus: 'needs-review',
      demoIds: ['link'],
      tags: ['link', 'typography', 'navigation'],
      gaps: [
        {
          id: 'link-visited-density',
          title: localize(locale, 'Visited policy and density', 'visited 策略与密度'),
          description: localize(
            locale,
            'Visited styling and multi-link row density still need design closure.',
            'visited 样式与一行多 link 的密度仍待设计补齐。'
          ),
          owner: 'design',
        },
      ],
      relatedPaths: [
        '/primitives/content/text',
        '/primitives/content/code-block-surface',
        '/primitives/actions/button',
      ],
    },
    'doc-code-block-surface': {
      documentId: 'doc-code-block-surface',
      layer: 'primitive',
      status: 'partial',
      designStatus: 'needs-review',
      demoIds: ['code-block-surface'],
      tags: ['code', 'surface', 'reading'],
      gaps: [
        {
          id: 'code-block-richer',
          title: localize(locale, 'Richer code viewer', '更丰富的代码查看'),
          description: localize(
            locale,
            'Line numbers, highlighted lines, copy feedback, folding, and diff semantics stay outside this surface.',
            '行号、高亮行、复制反馈、折叠与 diff 语义不在 surface 层，由上层 pattern 承接。'
          ),
          owner: 'design',
        },
      ],
      relatedPaths: ['/primitives/content/text', '/primitives/actions/button'],
    },
    'doc-field-input': {
      documentId: 'doc-field-input',
      layer: 'primitive',
      status: 'partial',
      designStatus: 'needs-review',
      demoIds: ['field-input'],
      tags: ['field', 'input', 'select'],
      gaps: [
        {
          id: 'combobox-density',
          title: localize(locale, 'Compact combobox density', '紧凑 combobox 密度'),
          description: localize(
            locale,
            'Need a reviewed compact list treatment for search-heavy entry flows.',
            '搜索密集型录入流还缺经过评审的紧凑列表处理。'
          ),
          owner: 'design',
        },
      ],
      relatedPaths: [
        '/primitives/data-entry/search-input',
        '/primitives/data-entry/number-input',
        '/primitives/actions/button',
      ],
    },
    'doc-search-input': {
      documentId: 'doc-search-input',
      layer: 'primitive',
      status: 'partial',
      designStatus: 'needs-review',
      demoIds: ['search-input'],
      tags: ['search', 'input', 'data-entry'],
      gaps: [
        {
          id: 'search-debounce-scope',
          title: localize(locale, 'Debounced search and scope', '防抖与范围切换'),
          description: localize(
            locale,
            'Debounced search, scope switching, mobile submit, and recent queries still need pattern-level closure.',
            '防抖搜索、scope 切换、移动端提交与最近查询仍由 pattern 层收口。'
          ),
          owner: 'design',
        },
      ],
      relatedPaths: [
        '/primitives/data-entry/field-and-input',
        '/primitives/data-entry/number-input',
        '/primitives/actions/button',
      ],
    },
    'doc-number-input': {
      documentId: 'doc-number-input',
      layer: 'primitive',
      status: 'partial',
      designStatus: 'needs-review',
      demoIds: ['number-input'],
      tags: ['number', 'input', 'data-entry'],
      gaps: [
        {
          id: 'number-locale-wheel',
          title: localize(locale, 'Locale formatting and wheel', '本地化与小滚轮'),
          description: localize(
            locale,
            'Locale formatting, mouse wheel, large step, and unit messaging still need systematic follow-up.',
            '本地化格式、鼠标滚轮、大步进与单位提示仍待系统化。'
          ),
          owner: 'design',
        },
      ],
      relatedPaths: [
        '/primitives/data-entry/field-and-input',
        '/primitives/data-entry/search-input',
        '/primitives/actions/button',
      ],
    },
    'doc-tree-nav': {
      documentId: 'doc-tree-nav',
      layer: 'pattern',
      status: 'partial',
      designStatus: 'needs-review',
      demoIds: ['tree-nav'],
      tags: ['tree', 'navigation', 'priority'],
      gaps: [
        {
          id: 'tree-search-match',
          title: localize(locale, 'Search-match state', '搜索命中态'),
          description: localize(
            locale,
            'Need a visual rule that does not steal ownership from current or selected.',
            '还需要一条不会抢走 current 或 selected 语义的搜索命中视觉规则。'
          ),
          owner: 'design',
        },
      ],
      relatedPaths: ['/layout/app-shell'],
    },
    'doc-view-state-layout': {
      documentId: 'doc-view-state-layout',
      layer: 'pattern',
      status: 'partial',
      designStatus: 'needs-review',
      demoIds: ['view-state-layout'],
      tags: ['loading', 'empty', 'error'],
      gaps: [
        {
          id: 'empty-state-illustration',
          title: localize(locale, 'Illustrated empty-state tone', '带插图的空态语气'),
          description: localize(
            locale,
            'Need a reviewed empty-state treatment for docs and audit pages.',
            '文档页和审计页还需要经过评审的空态处理。'
          ),
          owner: 'design',
        },
      ],
      relatedPaths: ['/primitives/feedback/status-feedback'],
    },
    'doc-design-gaps': {
      documentId: 'doc-design-gaps',
      layer: 'audit',
      status: 'partial',
      designStatus: 'needs-review',
      demoIds: ['design-gaps', 'missing-components'],
      tags: ['audit', 'design'],
      gaps: [],
      relatedPaths: ['/primitives/actions/button', '/patterns/navigation/tree-nav'],
    },
  };
}

export function getOverviewDocumentMetaById(
  locale: AppLocale = DEFAULT_LOCALE
): Record<DocumentId, OverviewDocumentMeta> {
  return createOverviewDocumentMetaByLocale(locale);
}

export const overviewDocumentMetaById = getOverviewDocumentMetaById(DEFAULT_LOCALE);

export function getOverviewHomeCollections(
  locale: AppLocale = DEFAULT_LOCALE
): OverviewHomeCollection[] {
  return [
    {
      id: 'runtime',
      title: localize(locale, 'Start With The Runtime', '先看运行时'),
      description: localize(
        locale,
        'Preferences, tokens, and layout resolution are the base of the library.',
        '偏好、tokens 和布局解析构成了组件库最底层的运行时。'
      ),
      entries: [
        { path: '/foundation/style-provider', label: 'StyleProvider' },
        { path: '/foundation/token-map', label: 'Token Map' },
        {
          path: '/foundation/theme-and-density',
          label: localize(locale, 'Theme And Density', '主题与密度'),
        },
      ],
    },
    {
      id: 'layout',
      title: localize(locale, 'Then Lock Layout', '再把布局定住'),
      description: localize(
        locale,
        'The shell and layout primitives stop product pages from inventing their own scaffolds.',
        '外壳和布局原语先把页面脚手架收口，业务页面就不会各写各的。'
      ),
      entries: [
        {
          path: '/layout/layout-primitives',
          label: localize(locale, 'Layout Primitives', '布局原语'),
        },
        { path: '/layout/app-shell', label: 'App Shell' },
      ],
    },
    {
      id: 'audit',
      title: localize(locale, 'Audit What Still Needs Design', '审计还缺什么设计'),
      description: localize(
        locale,
        'Use the audit page to see which contracts are still incomplete.',
        '用审计页集中查看哪些契约还没有收敛完成。'
      ),
      entries: [
        {
          path: '/audit/design-gaps',
          label: localize(locale, 'Design Gaps', '设计缺口'),
        },
      ],
    },
  ];
}

export const overviewHomeCollections = getOverviewHomeCollections(DEFAULT_LOCALE);

export function listOverviewDesignGaps(locale: AppLocale = DEFAULT_LOCALE): OverviewGap[] {
  return Object.values(getOverviewDocumentMetaById(locale)).flatMap((meta) => meta.gaps);
}

function createOverviewArticleDocuments(locale: AppLocale): Record<DocumentId, ArticleDocument> {
  return {
    'doc-style-provider': createArticle({
      id: 'doc-style-provider',
      title: 'StyleProvider',
      summary: localize(
        locale,
        'StyleProvider resolves preferences and environment capabilities into one stable UI runtime.',
        'StyleProvider 把偏好和环境能力解析成统一、稳定的 UI 运行时。'
      ),
      eyebrow: localize(locale, 'foundation / runtime', '基础 / 运行时'),
      sections: [
        createSection(
          'style-provider-why',
          localize(locale, 'Why the provider exists', '为什么需要这个 provider'),
          2,
          [
            localize(
              locale,
              'Theme, density, layout mode, and motion should not be recomputed inside product views. StyleProvider resolves them once and shares the result with the whole library scope.',
              '主题、密度、布局模式和动效不应该在业务页面里反复计算。StyleProvider 只解析一次，再把结果分发给整套组件库作用域。'
            ),
          ]
        ),
        createSection(
          'style-provider-inputs',
          localize(locale, 'What flows into the runtime', '哪些输入会进入运行时'),
          2,
          [
            localize(
              locale,
              'Theme and density come from user preferences. Layout mode comes from the shell container width unless a host overrides it. Motion follows the system preference unless a host overrides it.',
              '主题和密度来自用户偏好。布局模式默认由外壳容器宽度决定，除非宿主显式覆盖。动效默认跟随系统偏好，除非宿主显式覆盖。'
            ),
          ]
        ),
      ],
    }),
    'doc-tokens': createArticle({
      id: 'doc-tokens',
      title: 'Token Map',
      summary: localize(
        locale,
        'Tokens define the system vocabulary for surfaces, text, borders, density, and motion before component styling begins.',
        '在组件样式落地之前，tokens 先定义表面、文字、边框、密度和动效这些系统词汇。'
      ),
      eyebrow: localize(locale, 'foundation / tokens', '基础 / tokens'),
      sections: [
        createSection(
          'tokens-surfaces',
          localize(locale, 'Semantic surfaces first', '先定义语义表面'),
          2,
          [
            localize(
              locale,
              'Canvas, raised surfaces, borders, text, and status colors are expressed as semantic roles so components stop hard-coding their own visual relationships.',
              '画布、抬升表面、边框、文字和状态色都应该先被表达成语义角色，组件才能停止硬编码彼此的视觉关系。'
            ),
          ]
        ),
        createSection(
          'tokens-density',
          localize(locale, 'Density and motion are also tokens', '密度和动效也应该是 token'),
          2,
          [
            localize(
              locale,
              'Spacing, radius, row height, and transition aliases all shift through tokens. Components consume those aliases instead of branching per page.',
              '间距、圆角、行高和过渡别名都应该通过 tokens 切换。组件消费这些别名，而不是在页面里各自分叉。'
            ),
          ]
        ),
      ],
    }),
    'doc-theme-density': createArticle({
      id: 'doc-theme-density',
      title: localize(locale, 'Theme And Density', '主题与密度'),
      summary: localize(
        locale,
        'Theme and density are persisted preferences that reshape the system without changing component structure.',
        '主题和密度是持久化偏好，它们会改变系统气质，但不会改动组件结构。'
      ),
      eyebrow: localize(locale, 'foundation / preferences', '基础 / 偏好'),
      sections: [
        createSection(
          'theme-density-jobs',
          localize(locale, 'Two preferences, two jobs', '两个偏好，各管一件事'),
          2,
          [
            localize(
              locale,
              'Theme controls light and dark semantics. Density controls rhythm, spacing, control sizing, and the weight of state containers.',
              '主题负责浅色和深色语义。密度负责节奏、间距、控件尺寸，以及状态容器的重量感。'
            ),
          ]
        ),
        createSection(
          'theme-density-rules',
          localize(
            locale,
            'Patterns still stay inside the same scale',
            '模式层仍然留在同一套刻度里'
          ),
          2,
          [
            localize(
              locale,
              'Patterns may derive tighter spacing in compact contexts, but they cannot invent a second density system.',
              '模式层可以在紧凑场景里拿更紧的间距，但不能再发明第二套密度系统。'
            ),
          ]
        ),
      ],
    }),
    'doc-layout-primitives': createArticle({
      id: 'doc-layout-primitives',
      title: localize(locale, 'Layout Primitives', '布局原语'),
      summary: localize(
        locale,
        'Stack, Inline, Grid, Surface, and ScrollArea provide the layout vocabulary product pages should compose instead of re-creating.',
        'Stack、Inline、Grid、Surface 和 ScrollArea 提供了页面应该直接组合的布局词汇，而不是每页重写一遍。'
      ),
      eyebrow: localize(locale, 'layout / primitives', '布局 / 原语'),
      sections: [
        createSection(
          'layout-primitives-why',
          localize(locale, 'Why layout belongs in the library', '为什么布局应该属于组件库'),
          2,
          [
            localize(
              locale,
              'If business pages own flex, grid, surface, and spacing rules, each page becomes its own design system. Layout primitives pull that responsibility back into the shared layer.',
              '如果业务页自己掌控 flex、grid、surface 和 spacing，每一页都会变成自己的设计系统。布局原语就是把这份责任收回共享层。'
            ),
          ]
        ),
        createSection(
          'layout-primitives-usage',
          localize(locale, 'How product code should consume them', '业务代码应该怎么消费它们'),
          2,
          [
            localize(
              locale,
              'Low-level layout comes from composable primitives. High-level shells come from slot-based patterns that keep page scaffolds consistent.',
              '低层布局由可组合原语提供。高层页面外壳由 slot 化模式提供，这样页面脚手架才能保持一致。'
            ),
          ]
        ),
      ],
    }),
    'doc-app-shell': createArticle({
      id: 'doc-app-shell',
      title: 'App Shell',
      summary: localize(
        locale,
        'The shell is a layout pattern that owns the filesystem rails, reading region, and responsive drawer behavior.',
        'App Shell 是一个布局模式，负责文件系统双栏、阅读区，以及响应式抽屉行为。'
      ),
      eyebrow: localize(locale, 'layout / shell', '布局 / 外壳'),
      sections: [
        createSection(
          'app-shell-structure',
          localize(locale, 'A shell, not a page hack', '它是外壳，不是页面补丁'),
          2,
          [
            localize(
              locale,
              'The shell owns the top bar, left navigation rail, reading region, and right context rail. It belongs to the layout layer, not to an individual product page.',
              '外壳统一拥有顶栏、左侧导航栏、阅读区和右侧上下文栏。它属于布局层，而不应该挂在某个单独的业务页面上。'
            ),
          ]
        ),
        createSection(
          'app-shell-layout-mode',
          localize(locale, 'Layout mode changes structure', '布局模式会改变结构'),
          2,
          [
            localize(
              locale,
              'Spacious mode keeps both rails visible. Medium mode keeps navigation visible and pushes context into a drawer. Compact mode turns both rails into temporary overlays.',
              '宽屏模式同时保留两侧栏。中栏模式保留导航栏，把 context 推进抽屉。紧凑模式把两侧栏都改成临时 overlay。'
            ),
          ]
        ),
      ],
    }),
    'doc-button': createArticle({
      id: 'doc-button',
      title: 'Button',
      summary: localize(
        locale,
        'Buttons define the action language of the library and still expose the few action states that need design follow-up.',
        'Button 定义了组件库的动作语言，同时把还需要设计补位的动作态显式暴露出来。'
      ),
      eyebrow: localize(locale, 'primitives / actions', '基础组件 / 操作'),
      sections: [
        createSection('button-current', localize(locale, 'Current coverage', '当前覆盖面'), 2, [
          localize(
            locale,
            'The current primitive covers primary, secondary, and ghost emphasis while already respecting theme, density, and reduced motion.',
            '当前 primitive 已经覆盖 primary、secondary 和 ghost 三档强调，同时尊重主题、密度和减弱动效偏好。'
          ),
        ]),
        createSection('button-missing', localize(locale, 'What is still missing', '还缺什么'), 2, [
          localize(
            locale,
            'The destructive family and loading choreography still need design coverage before the action set can be called complete.',
            '在把动作体系称为完整之前，破坏性按钮族和 loading 编排还需要设计补齐。'
          ),
        ]),
      ],
    }),
    'doc-heading': createArticle({
      id: 'doc-heading',
      title: localize(locale, 'Heading', 'Heading'),
      summary: localize(
        locale,
        'Heading anchors structured titles on the shared typographic scale instead of page-local font tweaks.',
        'Heading 把结构化标题锚定在共享的打字阶梯上，而不是让页面各自改字号。'
      ),
      eyebrow: localize(locale, 'primitives / inline semantics', '基础组件 / 文本与语义'),
      sections: [
        createSection(
          'heading-scale',
          localize(locale, 'Variant-first scale', '变体优先的阶梯'),
          2,
          [
            localize(
              locale,
              'Semantic level chooses the tag; visual density comes from display, section, subsection, and caption-heading variants.',
              '语义 level 决定标签；视觉密度来自 display、section、subsection 与 caption-heading 等变体。'
            ),
          ]
        ),
        createSection('heading-gaps', localize(locale, 'What is still open', '仍待收敛'), 2, [
          localize(
            locale,
            'Anchor copy targets, heading groups with disclosure, and prose-specific spacing still belong to pattern follow-up.',
            '锚点文案目标、可折叠 heading group 以及长文专用间距仍由 pattern 层跟进。'
          ),
        ]),
      ],
    }),
    'doc-label': createArticle({
      id: 'doc-label',
      title: localize(locale, 'Label', 'Label'),
      summary: localize(
        locale,
        'Label gives controls a shared name treatment so required, optional, and helper affordances stay consistent.',
        'Label 为控件提供统一的名称语气，让必填、选填与辅助入口保持一致。'
      ),
      eyebrow: localize(locale, 'primitives / inline semantics', '基础组件 / 文本与语义'),
      sections: [
        createSection(
          'label-contract',
          localize(locale, 'Variant and state first', '变体与状态优先'),
          2,
          [
            localize(
              locale,
              'Default, strong, and subtle variants pair with default, disabled, required, and optional states without page-local overrides.',
              'default、strong、subtle 变体与 default、disabled、required、optional 状态成对出现，不靠页面局部覆盖。'
            ),
          ]
        ),
        createSection('label-gaps', localize(locale, 'Known gaps', '已知缺口'), 2, [
          localize(
            locale,
            'Multiline labels, inline actions, and info affordance combinations still need pattern-level follow-up.',
            '多行 label、行内操作与 info affordance 的组合仍由 pattern 层跟进。'
          ),
        ]),
      ],
    }),
    'doc-text': createArticle({
      id: 'doc-text',
      title: localize(locale, 'Text', 'Text'),
      summary: localize(
        locale,
        'Text unifies UI copy, helper lines, and technical literals on one typographic and semantic tone matrix.',
        'Text 将界面文案、说明行与技术字面量统一在一套排版与语义 tone 矩阵上。'
      ),
      eyebrow: localize(locale, 'primitives / inline semantics', '基础组件 / 文本与语义'),
      sections: [
        createSection(
          'text-variants',
          localize(locale, 'Variant-first typography', '变体优先的排版'),
          2,
          [
            localize(
              locale,
              'ui, body, strong, subtle, caption, and mono variants share one slot; tone carries semantic color without ad-hoc classes.',
              'ui、body、strong、subtle、caption、mono 共用 content 插槽；tone 承载语义色，避免页面散落 class。'
            ),
          ]
        ),
        createSection('text-gaps', localize(locale, 'Known gaps', '已知缺口'), 2, [
          localize(
            locale,
            'Article-length prose and pattern-level density still belong outside this primitive.',
            '文章级正文与 pattern 层密度仍由外层承担。'
          ),
        ]),
      ],
    }),
    'doc-link': createArticle({
      id: 'doc-link',
      title: localize(locale, 'Link', 'Link'),
      summary: localize(
        locale,
        'Link carries navigation-style text interactions instead of action-style clicks.',
        'Link 承担导航型文本交互，而不是动作型点击。'
      ),
      eyebrow: localize(locale, 'primitives / inline semantics', '基础组件 / 文本与语义'),
      sections: [
        createSection('link-slots', localize(locale, 'Label and icons', '文案与图标'), 2, [
          localize(
            locale,
            'The label slot is required; leading and trailing icons are optional and use Option (none/some).',
            'label 为必填插槽；前后缀图标可选，使用 Option（none/some）。'
          ),
        ]),
        createSection('link-gaps', localize(locale, 'Known gaps', '已知缺口'), 2, [
          localize(
            locale,
            'Visited policy and external affordance combinations still need follow-up.',
            'visited 策略与 external affordance 的组合仍待跟进。'
          ),
        ]),
      ],
    }),
    'doc-code-block-surface': createArticle({
      id: 'doc-code-block-surface',
      title: localize(locale, 'Code Block Surface', '代码块表面'),
      summary: localize(
        locale,
        'CodeBlockSurface provides the baseline block-level code shell so pages do not hand-style pre and code.',
        'CodeBlockSurface 提供块级代码的基础表面，避免业务层随意写 pre/code 样式。'
      ),
      eyebrow: localize(locale, 'primitives / inline semantics', '基础组件 / 文本与语义'),
      sections: [
        createSection('code-block-slots', localize(locale, 'Slots and variants', '插槽与变体'), 2, [
          localize(
            locale,
            'Optional header, language, meta, actions, and footer use Option; body is required. Variants default, command, and diff-neutral tune the surface tone.',
            'header、language、meta、actions、footer 可选且用 Option；body 必填。default、command、diff-neutral 变体调节表面气质。'
          ),
        ]),
        createSection(
          'code-block-states',
          localize(locale, 'Wrapped and scrollable', '换行与滚动'),
          2,
          [
            localize(
              locale,
              'lineWrap and scrollable align with catalog wrapped and scrollable presentation; focus-within uses the container outline.',
              'lineWrap 与 scrollable 对应 catalog 的 wrapped / scrollable 表现；focus-within 使用容器轮廓。'
            ),
          ]
        ),
      ],
    }),
    'doc-field-input': createArticle({
      id: 'doc-field-input',
      title: localize(locale, 'Field And Input', 'Field 与 Input'),
      summary: localize(
        locale,
        'Field, Input, Textarea, and Select Trigger share one calm data-entry contract.',
        'Field、Input、Textarea 和 Select Trigger 共享同一套克制的数据录入契约。'
      ),
      eyebrow: localize(locale, 'primitives / data-entry', '基础组件 / 数据录入'),
      sections: [
        createSection(
          'field-input-contract',
          localize(locale, 'One field language', '一套统一的 field 语言'),
          2,
          [
            localize(
              locale,
              'Labels, help text, text inputs, and select triggers should feel like one family. The current primitive set keeps them aligned through one surface, focus, and support-text treatment.',
              '标签、帮助文案、文本输入框和 select trigger 应该像一个家族。当前 primitive 通过统一表面、focus 和辅助文本处理把它们收在一起。'
            ),
          ]
        ),
        createSection(
          'field-input-gap',
          localize(locale, 'Where the contract still needs work', '这套契约还缺哪块'),
          2,
          [
            localize(
              locale,
              'Combobox and dense search surfaces still need a final compact-mode rule before the family is complete.',
              '在把这套家族称为完整之前，combobox 和高密搜索表面还需要最终的紧凑模式规则。'
            ),
          ]
        ),
      ],
    }),
    'doc-search-input': createArticle({
      id: 'doc-search-input',
      title: localize(locale, 'Search Input', '搜索输入'),
      summary: localize(
        locale,
        'SearchInput carries keyword lookup rather than general-purpose text entry.',
        'SearchInput 承担关键词查找，而不是通用文本填写。'
      ),
      eyebrow: localize(locale, 'primitives / data-entry', '基础组件 / 数据录入'),
      sections: [
        createSection('search-slots', localize(locale, 'Slots', '插槽'), 2, [
          localize(
            locale,
            'leadingSearchIcon, clear, submit, and scope use Option; loading shows the built-in spinner and aria-busy.',
            'leadingSearchIcon、clear、submit、scope 使用 Option；loading 展示内置 spinner 与 aria-busy。'
          ),
        ]),
        createSection(
          'search-variants',
          localize(locale, 'Variants and filled state', '变体与 filled'),
          2,
          [
            localize(
              locale,
              'default and subtle tune the surface; filled is derived from the controlled value when present.',
              'default 与 subtle 调整表面；在受控 value 存在时由文案推导 filled。'
            ),
          ]
        ),
      ],
    }),
    'doc-number-input': createArticle({
      id: 'doc-number-input',
      title: localize(locale, 'Number Input', '数字输入'),
      summary: localize(
        locale,
        'NumberInput carries numeric entry, stepping, and unit slots instead of a plain text field.',
        'NumberInput 承担数值输入、步进与单位插槽，而不是普通文本框。'
      ),
      eyebrow: localize(locale, 'primitives / data-entry', '基础组件 / 数据录入'),
      sections: [
        createSection(
          'number-slots',
          localize(locale, 'Slots and built-in steppers', '插槽与内置步进'),
          2,
          [
            localize(
              locale,
              'prefix and suffix use Option; stepDown and stepUp use Option with built-in minus and plus when none.',
              'prefix、suffix 使用 Option；stepDown、stepUp 使用 Option，为 none 时提供内置 − 与 +。'
            ),
          ]
        ),
        createSection('number-variants', localize(locale, 'Semantic variants', '语义变体'), 2, [
          localize(
            locale,
            'invalid, warning, and success tune border feedback; loading sets aria-busy and a spinner.',
            'invalid、warning、success 调整边框反馈；loading 设置 aria-busy 与 spinner。'
          ),
        ]),
      ],
    }),
    'doc-tree-nav': createArticle({
      id: 'doc-tree-nav',
      title: 'TreeNav',
      summary: localize(
        locale,
        'TreeNav is the shared navigation pattern for filesystem views and other layered navigation surfaces.',
        'TreeNav 是文件系统视图以及其他分层导航表面的共享导航模式。'
      ),
      eyebrow: localize(locale, 'patterns / navigation', '模式 / 导航'),
      sections: [
        createSection(
          'tree-nav-states',
          localize(locale, 'State priority comes first', '状态优先级先行'),
          2,
          [
            localize(
              locale,
              'Current, selected, expanded, hover, and focus-visible can all exist at once. The pattern owns their visual priority so product surfaces do not improvise.',
              'current、selected、expanded、hover 和 focus-visible 可能同时存在。模式层必须统一定义它们的视觉优先级，避免业务表面临时 improvisation。'
            ),
          ]
        ),
        createSection(
          'tree-nav-gap',
          localize(locale, 'Search match is still unresolved', '搜索命中态还没收敛'),
          2,
          [
            localize(
              locale,
              'Search match needs to read as informative without stealing ownership from current or selected. That gap stays visible until design finalizes it.',
              '搜索命中态需要保持信息性，但不能抢走 current 或 selected 的所有权。在设计定稿前，这个缺口必须保持可见。'
            ),
          ]
        ),
      ],
    }),
    'doc-view-state-layout': createArticle({
      id: 'doc-view-state-layout',
      title: 'ViewStateLayout',
      summary: localize(
        locale,
        'ViewStateLayout gives loading, ready, empty, and error states a reusable wrapper so product code only decides which state applies.',
        'ViewStateLayout 把 loading、ready、empty 和 error 包成统一壳层，业务代码只需要判断当前属于哪种状态。'
      ),
      eyebrow: localize(locale, 'patterns / states', '模式 / 状态'),
      sections: [
        createSection(
          'view-state-layout-role',
          localize(
            locale,
            'A state wrapper, not a spinner shortcut',
            '它是状态壳层，不是 spinner 捷径'
          ),
          2,
          [
            localize(
              locale,
              'The pattern owns pacing, hierarchy, and state-surface weight. Product code passes state and copy but does not build a new state shell every time.',
              '这个模式统一负责节奏、层级和状态表面的重量。业务代码只传入状态和值得展示的文案，而不是每次再拼一套新的状态壳。'
            ),
          ]
        ),
        createSection(
          'view-state-layout-gap',
          localize(locale, 'Where the pattern still needs design', '模式层还需要哪些设计补位'),
          2,
          [
            localize(
              locale,
              'Some empty-state treatments still need design confirmation before the pattern can be treated as complete.',
              '在把这个模式视为完整之前，部分空态处理还需要设计确认。'
            ),
          ]
        ),
      ],
    }),
    'doc-design-gaps': createArticle({
      id: 'doc-design-gaps',
      title: localize(locale, 'Design Gaps', '设计缺口'),
      summary: localize(
        locale,
        'The audit page collects every open visual or interaction contract that still blocks a fully reusable library.',
        '审计页把所有仍然阻塞“可复用组件库”的视觉和交互契约缺口集中列出来。'
      ),
      eyebrow: localize(locale, 'audit / design', '审计 / 设计'),
      sections: [
        createSection(
          'design-gaps-purpose',
          localize(locale, 'Why the gaps stay public', '为什么这些缺口必须公开存在'),
          2,
          [
            localize(
              locale,
              'The audit view keeps pending design work visible so engineering does not quietly paper over missing contracts with one-off implementation details.',
              '审计视图要让待完成的设计工作持续可见，避免工程侧用一次性实现细节悄悄把缺失契约糊过去。'
            ),
          ]
        ),
      ],
    }),
  };
}

export function getOverviewDocumentMeta(
  documentId: DocumentId,
  locale: AppLocale = DEFAULT_LOCALE
): Option<OverviewDocumentMeta> {
  const documentMetaById = getOverviewDocumentMetaById(locale);

  return Object.prototype.hasOwnProperty.call(documentMetaById, documentId)
    ? some(documentMetaById[documentId])
    : none();
}

export function createOverviewLibraryFixtures(locale: AppLocale): OverviewFixtures {
  const baseArticleDocuments = createOverviewArticleDocuments(locale);
  const markdownFixtures = createMarkdownDemoFixtures();
  const articleDocuments: Record<DocumentId, ArticleDocument> = {
    ...baseArticleDocuments,
    ...markdownFixtures.articleDocuments,
  };
  const homeTitle = localize(locale, 'UI Library Overview', 'UI 组件库总览');
  const foundationTitle = localize(locale, 'Foundation', '基础');
  const layoutTitle = localize(locale, 'Layout', '布局');
  const primitivesTitle = localize(locale, 'Primitives', '基础组件');
  const patternsTitle = localize(locale, 'Patterns', '模式');
  const auditTitle = localize(locale, 'Audit', '审计');
  const actionsTitle = localize(locale, 'Actions', '操作');
  const contentTitle = localize(locale, 'Content', '文本与语义');
  const dataEntryTitle = localize(locale, 'Data Entry', '数据录入');
  const navigationTitle = localize(locale, 'Navigation', '导航');
  const statesTitle = localize(locale, 'States', '状态');
  const defaultNodeMeta = {
    childrenCount: none(),
    documentId: none(),
    publishedAt: none(),
    updatedAt: none(),
    readingMinutes: none(),
  };
  const directoryDescriptions: Record<NodeId, DirectoryContent['description']> = {
    foundation: some(
      localize(
        locale,
        'Style runtime, token semantics, theme, density, and motion live here.',
        '样式运行时、token 语义、主题、密度和动效都收在这里。'
      )
    ),
    layout: some(
      localize(
        locale,
        'Shell behavior and reusable layout primitives belong to the layout layer.',
        '外壳行为和可复用布局原语都归在布局层。'
      )
    ),
    primitives: some(
      localize(
        locale,
        'Action, input, and feedback components that product code should never re-invent.',
        '操作、输入和反馈组件都不该由业务代码重复发明。'
      )
    ),
    patterns: some(
      localize(
        locale,
        'Shared structural patterns that assemble primitives into reusable UI behavior.',
        '把基础组件组装成可复用 UI 行为的共享结构模式都放在这里。'
      )
    ),
    audit: some(
      localize(
        locale,
        'Coverage, design asks, and implementation gaps stay visible here.',
        '覆盖面、设计诉求和实现缺口都在这里保持可见。'
      )
    ),
    'primitives-actions': some(
      localize(
        locale,
        "Action primitives define the system's baseline interaction language.",
        '操作类 primitive 定义了系统的基础交互语言。'
      )
    ),
    'primitives-data-entry': some(
      localize(
        locale,
        'Field and input surfaces share one calm data-entry contract.',
        'Field 和 input 表面共享同一套克制的数据录入契约。'
      )
    ),
    'primitives-content': some(
      localize(
        locale,
        'Typography primitives for headings, body copy, and inline semantics.',
        '标题、正文片段与行内语义的排版原语。'
      )
    ),
    'patterns-navigation': some(
      localize(
        locale,
        'Navigation patterns centralize ownership and state priority.',
        '导航模式负责收口 ownership 和状态优先级。'
      )
    ),
    'patterns-states': some(
      localize(
        locale,
        'State wrappers keep loading, empty, and error surfaces reusable.',
        '状态壳层让 loading、empty 和 error 表面保持可复用。'
      )
    ),
  };
  const contentNodes: ContentNode[] = [
    {
      id: ROOT_NODE_ID,
      kind: 'folder',
      status: 'available',
      title: ROOT_NODE_TITLE,
      slug: ROOT_NODE_TITLE,
      parentId: none(),
      ancestorIds: [],
      pathSegments: [],
      childrenCount: 6,
      hasChildren: true,
      documentId: none(),
      publishedAt: none(),
      updatedAt: none(),
      readingMinutes: none(),
    },
    createNode({
      ...defaultNodeMeta,
      id: 'home',
      kind: 'home',
      title: homeTitle,
      slug: 'home',
      parentId: ROOT_NODE_ID,
      ancestorIds: [ROOT_NODE_ID],
      pathSegments: [],
      documentId: some('home-doc'),
    }),
    createNode({
      ...defaultNodeMeta,
      id: 'foundation',
      kind: 'folder',
      title: foundationTitle,
      slug: 'foundation',
      parentId: ROOT_NODE_ID,
      ancestorIds: [ROOT_NODE_ID],
      pathSegments: ['foundation'],
      childrenCount: some(3),
    }),
    createNode({
      ...defaultNodeMeta,
      id: 'layout',
      kind: 'folder',
      title: layoutTitle,
      slug: 'layout',
      parentId: ROOT_NODE_ID,
      ancestorIds: [ROOT_NODE_ID],
      pathSegments: ['layout'],
      childrenCount: some(2),
    }),
    createNode({
      ...defaultNodeMeta,
      id: 'primitives',
      kind: 'folder',
      title: primitivesTitle,
      slug: 'primitives',
      parentId: ROOT_NODE_ID,
      ancestorIds: [ROOT_NODE_ID],
      pathSegments: ['primitives'],
      childrenCount: some(3),
    }),
    createNode({
      ...defaultNodeMeta,
      id: 'patterns',
      kind: 'folder',
      title: patternsTitle,
      slug: 'patterns',
      parentId: ROOT_NODE_ID,
      ancestorIds: [ROOT_NODE_ID],
      pathSegments: ['patterns'],
      childrenCount: some(2),
    }),
    createNode({
      ...defaultNodeMeta,
      id: 'audit',
      kind: 'folder',
      title: auditTitle,
      slug: 'audit',
      parentId: ROOT_NODE_ID,
      ancestorIds: [ROOT_NODE_ID],
      pathSegments: ['audit'],
      childrenCount: some(1 + markdownFixtures.contentNodes.length),
    }),
    createNode({
      ...defaultNodeMeta,
      id: 'article-style-provider',
      kind: 'article',
      title: articleDocuments['doc-style-provider'].title,
      slug: 'style-provider',
      parentId: 'foundation',
      ancestorIds: [ROOT_NODE_ID, 'foundation'],
      pathSegments: ['foundation', 'style-provider'],
      documentId: some('doc-style-provider'),
      publishedAt: some('2026-03-21T08:30:00.000Z'),
      updatedAt: some('2026-03-22T07:30:00.000Z'),
      readingMinutes: some(4),
    }),
    createNode({
      ...defaultNodeMeta,
      id: 'article-token-map',
      kind: 'article',
      title: articleDocuments['doc-tokens'].title,
      slug: 'token-map',
      parentId: 'foundation',
      ancestorIds: [ROOT_NODE_ID, 'foundation'],
      pathSegments: ['foundation', 'token-map'],
      documentId: some('doc-tokens'),
      publishedAt: some('2026-03-20T08:30:00.000Z'),
      updatedAt: some('2026-03-22T07:15:00.000Z'),
      readingMinutes: some(4),
    }),
    createNode({
      ...defaultNodeMeta,
      id: 'article-theme-density',
      kind: 'article',
      title: articleDocuments['doc-theme-density'].title,
      slug: 'theme-and-density',
      parentId: 'foundation',
      ancestorIds: [ROOT_NODE_ID, 'foundation'],
      pathSegments: ['foundation', 'theme-and-density'],
      documentId: some('doc-theme-density'),
      publishedAt: some('2026-03-19T08:30:00.000Z'),
      updatedAt: some('2026-03-22T06:30:00.000Z'),
      readingMinutes: some(4),
    }),
    createNode({
      ...defaultNodeMeta,
      id: 'article-layout-primitives',
      kind: 'article',
      title: articleDocuments['doc-layout-primitives'].title,
      slug: 'layout-primitives',
      parentId: 'layout',
      ancestorIds: [ROOT_NODE_ID, 'layout'],
      pathSegments: ['layout', 'layout-primitives'],
      documentId: some('doc-layout-primitives'),
      publishedAt: some('2026-03-20T07:30:00.000Z'),
      updatedAt: some('2026-03-21T11:00:00.000Z'),
      readingMinutes: some(4),
    }),
    createNode({
      ...defaultNodeMeta,
      id: 'article-app-shell',
      kind: 'article',
      title: articleDocuments['doc-app-shell'].title,
      slug: 'app-shell',
      parentId: 'layout',
      ancestorIds: [ROOT_NODE_ID, 'layout'],
      pathSegments: ['layout', 'app-shell'],
      documentId: some('doc-app-shell'),
      publishedAt: some('2026-03-21T07:30:00.000Z'),
      updatedAt: some('2026-03-22T06:45:00.000Z'),
      readingMinutes: some(5),
    }),
    createNode({
      ...defaultNodeMeta,
      id: 'primitives-actions',
      kind: 'folder',
      title: actionsTitle,
      slug: 'actions',
      parentId: 'primitives',
      ancestorIds: [ROOT_NODE_ID, 'primitives'],
      pathSegments: ['primitives', 'actions'],
      childrenCount: some(1),
    }),
    createNode({
      ...defaultNodeMeta,
      id: 'primitives-data-entry',
      kind: 'folder',
      title: dataEntryTitle,
      slug: 'data-entry',
      parentId: 'primitives',
      ancestorIds: [ROOT_NODE_ID, 'primitives'],
      pathSegments: ['primitives', 'data-entry'],
      childrenCount: some(3),
    }),
    createNode({
      ...defaultNodeMeta,
      id: 'primitives-content',
      kind: 'folder',
      title: contentTitle,
      slug: 'content',
      parentId: 'primitives',
      ancestorIds: [ROOT_NODE_ID, 'primitives'],
      pathSegments: ['primitives', 'content'],
      childrenCount: some(5),
    }),
    createNode({
      ...defaultNodeMeta,
      id: 'article-button',
      kind: 'article',
      title: articleDocuments['doc-button'].title,
      slug: 'button',
      parentId: 'primitives-actions',
      ancestorIds: [ROOT_NODE_ID, 'primitives', 'primitives-actions'],
      pathSegments: ['primitives', 'actions', 'button'],
      documentId: some('doc-button'),
      publishedAt: some('2026-03-18T07:45:00.000Z'),
      updatedAt: some('2026-03-22T05:20:00.000Z'),
      readingMinutes: some(4),
    }),
    createNode({
      ...defaultNodeMeta,
      id: 'article-field-input',
      kind: 'article',
      title: articleDocuments['doc-field-input'].title,
      slug: 'field-and-input',
      parentId: 'primitives-data-entry',
      ancestorIds: [ROOT_NODE_ID, 'primitives', 'primitives-data-entry'],
      pathSegments: ['primitives', 'data-entry', 'field-and-input'],
      documentId: some('doc-field-input'),
      publishedAt: some('2026-03-18T07:50:00.000Z'),
      updatedAt: some('2026-03-21T16:20:00.000Z'),
      readingMinutes: some(4),
    }),
    createNode({
      ...defaultNodeMeta,
      id: 'article-search-input',
      kind: 'article',
      title: articleDocuments['doc-search-input'].title,
      slug: 'search-input',
      parentId: 'primitives-data-entry',
      ancestorIds: [ROOT_NODE_ID, 'primitives', 'primitives-data-entry'],
      pathSegments: ['primitives', 'data-entry', 'search-input'],
      documentId: some('doc-search-input'),
      publishedAt: some('2026-03-22T10:00:00.000Z'),
      updatedAt: some('2026-03-22T10:00:00.000Z'),
      readingMinutes: some(3),
    }),
    createNode({
      ...defaultNodeMeta,
      id: 'article-number-input',
      kind: 'article',
      title: articleDocuments['doc-number-input'].title,
      slug: 'number-input',
      parentId: 'primitives-data-entry',
      ancestorIds: [ROOT_NODE_ID, 'primitives', 'primitives-data-entry'],
      pathSegments: ['primitives', 'data-entry', 'number-input'],
      documentId: some('doc-number-input'),
      publishedAt: some('2026-03-22T10:15:00.000Z'),
      updatedAt: some('2026-03-22T10:15:00.000Z'),
      readingMinutes: some(3),
    }),
    createNode({
      ...defaultNodeMeta,
      id: 'article-heading',
      kind: 'article',
      title: articleDocuments['doc-heading'].title,
      slug: 'heading',
      parentId: 'primitives-content',
      ancestorIds: [ROOT_NODE_ID, 'primitives', 'primitives-content'],
      pathSegments: ['primitives', 'content', 'heading'],
      documentId: some('doc-heading'),
      publishedAt: some('2026-03-22T08:10:00.000Z'),
      updatedAt: some('2026-03-22T08:10:00.000Z'),
      readingMinutes: some(3),
    }),
    createNode({
      ...defaultNodeMeta,
      id: 'article-label',
      kind: 'article',
      title: articleDocuments['doc-label'].title,
      slug: 'label',
      parentId: 'primitives-content',
      ancestorIds: [ROOT_NODE_ID, 'primitives', 'primitives-content'],
      pathSegments: ['primitives', 'content', 'label'],
      documentId: some('doc-label'),
      publishedAt: some('2026-03-22T08:25:00.000Z'),
      updatedAt: some('2026-03-22T08:25:00.000Z'),
      readingMinutes: some(3),
    }),
    createNode({
      ...defaultNodeMeta,
      id: 'article-text',
      kind: 'article',
      title: articleDocuments['doc-text'].title,
      slug: 'text',
      parentId: 'primitives-content',
      ancestorIds: [ROOT_NODE_ID, 'primitives', 'primitives-content'],
      pathSegments: ['primitives', 'content', 'text'],
      documentId: some('doc-text'),
      publishedAt: some('2026-03-22T09:00:00.000Z'),
      updatedAt: some('2026-03-22T09:00:00.000Z'),
      readingMinutes: some(3),
    }),
    createNode({
      ...defaultNodeMeta,
      id: 'article-link',
      kind: 'article',
      title: articleDocuments['doc-link'].title,
      slug: 'link',
      parentId: 'primitives-content',
      ancestorIds: [ROOT_NODE_ID, 'primitives', 'primitives-content'],
      pathSegments: ['primitives', 'content', 'link'],
      documentId: some('doc-link'),
      publishedAt: some('2026-03-22T09:15:00.000Z'),
      updatedAt: some('2026-03-22T09:15:00.000Z'),
      readingMinutes: some(3),
    }),
    createNode({
      ...defaultNodeMeta,
      id: 'article-code-block-surface',
      kind: 'article',
      title: articleDocuments['doc-code-block-surface'].title,
      slug: 'code-block-surface',
      parentId: 'primitives-content',
      ancestorIds: [ROOT_NODE_ID, 'primitives', 'primitives-content'],
      pathSegments: ['primitives', 'content', 'code-block-surface'],
      documentId: some('doc-code-block-surface'),
      publishedAt: some('2026-03-22T09:30:00.000Z'),
      updatedAt: some('2026-03-22T09:30:00.000Z'),
      readingMinutes: some(3),
    }),
    createNode({
      ...defaultNodeMeta,
      id: 'patterns-navigation',
      kind: 'folder',
      title: navigationTitle,
      slug: 'navigation',
      parentId: 'patterns',
      ancestorIds: [ROOT_NODE_ID, 'patterns'],
      pathSegments: ['patterns', 'navigation'],
      childrenCount: some(1),
    }),
    createNode({
      ...defaultNodeMeta,
      id: 'patterns-states',
      kind: 'folder',
      title: statesTitle,
      slug: 'states',
      parentId: 'patterns',
      ancestorIds: [ROOT_NODE_ID, 'patterns'],
      pathSegments: ['patterns', 'states'],
      childrenCount: some(1),
    }),
    createNode({
      ...defaultNodeMeta,
      id: 'article-tree-nav',
      kind: 'article',
      title: articleDocuments['doc-tree-nav'].title,
      slug: 'tree-nav',
      parentId: 'patterns-navigation',
      ancestorIds: [ROOT_NODE_ID, 'patterns', 'patterns-navigation'],
      pathSegments: ['patterns', 'navigation', 'tree-nav'],
      documentId: some('doc-tree-nav'),
      publishedAt: some('2026-03-18T08:30:00.000Z'),
      updatedAt: some('2026-03-22T05:45:00.000Z'),
      readingMinutes: some(4),
    }),
    createNode({
      ...defaultNodeMeta,
      id: 'article-view-state-layout',
      kind: 'article',
      title: articleDocuments['doc-view-state-layout'].title,
      slug: 'view-state-layout',
      parentId: 'patterns-states',
      ancestorIds: [ROOT_NODE_ID, 'patterns', 'patterns-states'],
      pathSegments: ['patterns', 'states', 'view-state-layout'],
      documentId: some('doc-view-state-layout'),
      publishedAt: some('2026-03-18T08:40:00.000Z'),
      updatedAt: some('2026-03-21T10:10:00.000Z'),
      readingMinutes: some(4),
    }),
    createNode({
      ...defaultNodeMeta,
      id: 'article-design-gaps',
      kind: 'article',
      title: articleDocuments['doc-design-gaps'].title,
      slug: 'design-gaps',
      parentId: 'audit',
      ancestorIds: [ROOT_NODE_ID, 'audit'],
      pathSegments: ['audit', 'design-gaps'],
      documentId: some('doc-design-gaps'),
      publishedAt: some('2026-03-22T04:05:00.000Z'),
      updatedAt: some('2026-03-22T04:25:00.000Z'),
      readingMinutes: some(3),
    }),
    ...markdownFixtures.contentNodes,
  ];
  const homeContents: Record<DocumentId, HomeContent> = {
    'home-doc': {
      kind: 'home',
      title: homeTitle,
    },
  };

  return {
    rootNodeTitle: ROOT_NODE_TITLE,
    contentNodes,
    homeContents,
    directoryDescriptions,
    articleDocuments,
  };
}
