import type {
  ArticleDocument,
  ArticleSection,
  ContentNode,
  DirectoryContent,
  DocumentId,
  HomeContent,
  NodeId,
} from "@/entities/content";
import type { AppLocale } from "@/shared/lib/i18n/locale.types";
import { none, some, type Option } from "@/shared/lib/monads/option";

export const ROOT_NODE_ID = "root";
export const ROOT_NODE_TITLE = "system-library";

export type OverviewFixtures = {
  rootNodeTitle: string;
  contentNodes: ContentNode[];
  homeContents: Record<DocumentId, HomeContent>;
  directoryDescriptions: Record<NodeId, DirectoryContent["description"]>;
  articleDocuments: Record<DocumentId, ArticleDocument>;
};

export type OverviewLayer = "foundation" | "layout" | "primitive" | "pattern" | "audit";
export type OverviewDocumentStatus = "ready" | "partial" | "missing";
export type OverviewDesignStatus = "confirmed" | "needs-design" | "needs-review";
export type OverviewGapOwner = "design" | "frontend" | "shared";

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

export type OverviewHomeCollection = {
  id: string;
  title: string;
  description: string;
  paths: string[];
};

type NodeConfig = {
  id: NodeId;
  kind: ContentNode["kind"];
  title: string;
  slug: string;
  parentId: NodeId;
  ancestorIds: NodeId[];
  pathSegments: string[];
  childrenCount?: number;
  documentId?: DocumentId;
  publishedAt?: string;
  updatedAt?: string;
  readingMinutes?: number;
};

type ArticleConfig = {
  id: DocumentId;
  title: string;
  summary: string;
  eyebrow: string;
  sections: ArticleSection[];
};

function createNode(config: NodeConfig): ContentNode {
  const childrenCount = config.childrenCount ?? 0;

  return {
    id: config.id,
    kind: config.kind,
    status: "available",
    title: config.title,
    slug: config.slug,
    parentId: some(config.parentId),
    ancestorIds: config.ancestorIds,
    pathSegments: config.pathSegments,
    childrenCount,
    hasChildren: childrenCount > 0,
    documentId: config.documentId === undefined ? none() : some(config.documentId),
    publishedAt: config.publishedAt === undefined ? none() : some(config.publishedAt),
    updatedAt: config.updatedAt === undefined ? none() : some(config.updatedAt),
    readingMinutes: config.readingMinutes === undefined ? none() : some(config.readingMinutes),
  };
}

function createArticle(config: ArticleConfig): ArticleDocument {
  return {
    kind: "article",
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
  paragraphs: string[],
): ArticleSection {
  return {
    id,
    title,
    level,
    paragraphs,
  };
}

export const overviewDocumentMetaById: Record<DocumentId, OverviewDocumentMeta> = {
  "doc-style-provider": {
    documentId: "doc-style-provider",
    layer: "foundation",
    status: "ready",
    designStatus: "confirmed",
    demoIds: ["style-provider", "preferences"],
    tags: ["runtime", "preferences"],
    gaps: [],
    relatedPaths: ["/foundation/theme-and-density", "/layout/app-shell"],
  },
  "doc-tokens": {
    documentId: "doc-tokens",
    layer: "foundation",
    status: "partial",
    designStatus: "needs-review",
    demoIds: ["tokens"],
    tags: ["tokens", "semantic aliases"],
    gaps: [
      {
        id: "token-danger-tone",
        title: "Destructive tone aliases",
        description: "Need reviewed destructive tokens for buttons and notices.",
        owner: "design",
      },
    ],
    relatedPaths: ["/foundation/theme-and-density"],
  },
  "doc-theme-density": {
    documentId: "doc-theme-density",
    layer: "foundation",
    status: "ready",
    designStatus: "confirmed",
    demoIds: ["theme-density"],
    tags: ["theme", "density"],
    gaps: [],
    relatedPaths: ["/foundation/style-provider"],
  },
  "doc-layout-primitives": {
    documentId: "doc-layout-primitives",
    layer: "layout",
    status: "ready",
    designStatus: "confirmed",
    demoIds: ["layout-primitives"],
    tags: ["stack", "inline", "grid", "surface"],
    gaps: [],
    relatedPaths: ["/layout/app-shell"],
  },
  "doc-app-shell": {
    documentId: "doc-app-shell",
    layer: "layout",
    status: "partial",
    designStatus: "needs-review",
    demoIds: ["app-shell"],
    tags: ["shell", "responsive", "filesystem"],
    gaps: [
      {
        id: "app-shell-medium-drawer",
        title: "Medium drawer polish",
        description: "Need final motion and surface treatment for the medium context drawer.",
        owner: "design",
      },
    ],
    relatedPaths: ["/patterns/navigation/tree-nav"],
  },
  "doc-button": {
    documentId: "doc-button",
    layer: "primitive",
    status: "partial",
    designStatus: "needs-design",
    demoIds: ["button"],
    tags: ["button", "actions"],
    gaps: [
      {
        id: "button-destructive",
        title: "Destructive button family",
        description: "Need a complete destructive tone family and loading choreography.",
        owner: "design",
      },
    ],
    relatedPaths: ["/primitives/data-entry/field-and-input"],
  },
  "doc-field-input": {
    documentId: "doc-field-input",
    layer: "primitive",
    status: "partial",
    designStatus: "needs-review",
    demoIds: ["field-input"],
    tags: ["field", "input", "select"],
    gaps: [
      {
        id: "combobox-density",
        title: "Compact combobox density",
        description: "Need a reviewed compact list treatment for search-heavy entry flows.",
        owner: "design",
      },
    ],
    relatedPaths: ["/primitives/actions/button"],
  },
  "doc-tree-nav": {
    documentId: "doc-tree-nav",
    layer: "pattern",
    status: "partial",
    designStatus: "needs-review",
    demoIds: ["tree-nav"],
    tags: ["tree", "navigation", "priority"],
    gaps: [
      {
        id: "tree-search-match",
        title: "Search-match state",
        description: "Need a visual rule that does not steal ownership from current or selected.",
        owner: "design",
      },
    ],
    relatedPaths: ["/layout/app-shell"],
  },
  "doc-view-state-layout": {
    documentId: "doc-view-state-layout",
    layer: "pattern",
    status: "partial",
    designStatus: "needs-review",
    demoIds: ["view-state-layout"],
    tags: ["loading", "empty", "error"],
    gaps: [
      {
        id: "empty-state-illustration",
        title: "Illustrated empty-state tone",
        description: "Need a reviewed empty-state treatment for docs and audit pages.",
        owner: "design",
      },
    ],
    relatedPaths: ["/primitives/feedback/status-feedback"],
  },
  "doc-design-gaps": {
    documentId: "doc-design-gaps",
    layer: "audit",
    status: "partial",
    designStatus: "needs-review",
    demoIds: ["design-gaps", "missing-components"],
    tags: ["audit", "design"],
    gaps: [],
    relatedPaths: ["/primitives/actions/button", "/patterns/navigation/tree-nav"],
  },
};

export const overviewHomeCollections: OverviewHomeCollection[] = [
  {
    id: "runtime",
    title: "Start With The Runtime",
    description: "Preferences, tokens, and layout resolution are the base of the library.",
    paths: ["/foundation/style-provider", "/foundation/token-map", "/foundation/theme-and-density"],
  },
  {
    id: "layout",
    title: "Then Lock Layout",
    description: "The shell and layout primitives stop product pages from inventing their own scaffolds.",
    paths: ["/layout/layout-primitives", "/layout/app-shell"],
  },
  {
    id: "audit",
    title: "Audit What Still Needs Design",
    description: "Use the audit page to see which contracts are still incomplete.",
    paths: ["/audit/design-gaps"],
  },
];

export function listOverviewDesignGaps(): OverviewGap[] {
  return Object.values(overviewDocumentMetaById).flatMap((meta) => meta.gaps);
}

function createOverviewArticleDocuments(): Record<DocumentId, ArticleDocument> {
  return {
    "doc-style-provider": createArticle({
      id: "doc-style-provider",
      title: "StyleProvider",
      summary: "StyleProvider resolves preferences and environment capabilities into one stable UI runtime.",
      eyebrow: "foundation / runtime",
      sections: [
        createSection("style-provider-why", "Why the provider exists", 2, [
          "Theme, density, layout mode, and motion should not be recomputed inside product views. StyleProvider resolves them once and shares the result with the whole library scope.",
        ]),
        createSection("style-provider-inputs", "What flows into the runtime", 2, [
          "Theme and density come from user preferences. Layout mode comes from the shell container width unless a host overrides it. Motion follows the system preference unless a host overrides it.",
        ]),
      ],
    }),
    "doc-tokens": createArticle({
      id: "doc-tokens",
      title: "Token Map",
      summary: "Tokens define the system vocabulary for surfaces, text, borders, density, and motion before component styling begins.",
      eyebrow: "foundation / tokens",
      sections: [
        createSection("tokens-surfaces", "Semantic surfaces first", 2, [
          "Canvas, raised surfaces, borders, text, and status colors are expressed as semantic roles so components stop hard-coding their own visual relationships.",
        ]),
        createSection("tokens-density", "Density and motion are also tokens", 2, [
          "Spacing, radius, row height, and transition aliases all shift through tokens. Components consume those aliases instead of branching per page.",
        ]),
      ],
    }),
    "doc-theme-density": createArticle({
      id: "doc-theme-density",
      title: "Theme And Density",
      summary: "Theme and density are persisted preferences that reshape the system without changing component structure.",
      eyebrow: "foundation / preferences",
      sections: [
        createSection("theme-density-jobs", "Two preferences, two jobs", 2, [
          "Theme controls light and dark semantics. Density controls rhythm, spacing, control sizing, and the weight of state containers.",
        ]),
        createSection("theme-density-rules", "Patterns still stay inside the same scale", 2, [
          "Patterns may derive tighter spacing in compact contexts, but they cannot invent a second density system.",
        ]),
      ],
    }),
    "doc-layout-primitives": createArticle({
      id: "doc-layout-primitives",
      title: "Layout Primitives",
      summary: "Stack, Inline, Grid, Surface, and ScrollArea provide the layout vocabulary product pages should compose instead of re-creating.",
      eyebrow: "layout / primitives",
      sections: [
        createSection("layout-primitives-why", "Why layout belongs in the library", 2, [
          "If business pages own flex, grid, surface, and spacing rules, each page becomes its own design system. Layout primitives pull that responsibility back into the shared layer.",
        ]),
        createSection("layout-primitives-usage", "How product code should consume them", 2, [
          "Low-level layout comes from composable primitives. High-level shells come from slot-based patterns that keep page scaffolds consistent.",
        ]),
      ],
    }),
    "doc-app-shell": createArticle({
      id: "doc-app-shell",
      title: "App Shell",
      summary: "The shell is a layout pattern that owns the filesystem rails, reading region, and responsive drawer behavior.",
      eyebrow: "layout / shell",
      sections: [
        createSection("app-shell-structure", "A shell, not a page hack", 2, [
          "The shell owns the top bar, left navigation rail, reading region, and right context rail. It belongs to the layout layer, not to an individual product page.",
        ]),
        createSection("app-shell-layout-mode", "Layout mode changes structure", 2, [
          "Spacious mode keeps both rails visible. Medium mode keeps navigation visible and pushes context into a drawer. Compact mode turns both rails into temporary overlays.",
        ]),
      ],
    }),
    "doc-button": createArticle({
      id: "doc-button",
      title: "Button",
      summary: "Buttons define the action language of the library and still expose the few action states that need design follow-up.",
      eyebrow: "primitives / actions",
      sections: [
        createSection("button-current", "Current coverage", 2, [
          "The current primitive covers primary, secondary, and ghost emphasis while already respecting theme, density, and reduced motion.",
        ]),
        createSection("button-missing", "What is still missing", 2, [
          "The destructive family and loading choreography still need design coverage before the action set can be called complete.",
        ]),
      ],
    }),
    "doc-field-input": createArticle({
      id: "doc-field-input",
      title: "Field And Input",
      summary: "Field, Input, Textarea, and Select Trigger share one calm data-entry contract.",
      eyebrow: "primitives / data-entry",
      sections: [
        createSection("field-input-contract", "One field language", 2, [
          "Labels, help text, text inputs, and select triggers should feel like one family. The current primitive set keeps them aligned through one surface, focus, and support-text treatment.",
        ]),
        createSection("field-input-gap", "Where the contract still needs work", 2, [
          "Combobox and dense search surfaces still need a final compact-mode rule before the family is complete.",
        ]),
      ],
    }),
    "doc-tree-nav": createArticle({
      id: "doc-tree-nav",
      title: "TreeNav",
      summary: "TreeNav is the shared navigation pattern for filesystem views and other layered navigation surfaces.",
      eyebrow: "patterns / navigation",
      sections: [
        createSection("tree-nav-states", "State priority comes first", 2, [
          "Current, selected, expanded, hover, and focus-visible can all exist at once. The pattern owns their visual priority so product surfaces do not improvise.",
        ]),
        createSection("tree-nav-gap", "Search match is still unresolved", 2, [
          "Search match needs to read as informative without stealing ownership from current or selected. That gap stays visible until design finalizes it.",
        ]),
      ],
    }),
    "doc-view-state-layout": createArticle({
      id: "doc-view-state-layout",
      title: "View State Layout",
      summary: "ViewStateLayout gives loading, ready, empty, and error states a reusable wrapper so product code only decides which state applies.",
      eyebrow: "patterns / states",
      sections: [
        createSection("view-state-layout-role", "A state wrapper, not a spinner shortcut", 2, [
          "The pattern owns pacing, hierarchy, and state-surface weight. Product code passes state and copy but does not build a new state shell every time.",
        ]),
        createSection("view-state-layout-gap", "Where the pattern still needs design", 2, [
          "Some empty-state treatments still need design confirmation before the pattern can be treated as complete.",
        ]),
      ],
    }),
    "doc-design-gaps": createArticle({
      id: "doc-design-gaps",
      title: "Design Gaps",
      summary: "The audit page collects every open visual or interaction contract that still blocks a fully reusable library.",
      eyebrow: "audit / design",
      sections: [
        createSection("design-gaps-purpose", "Why the gaps stay public", 2, [
          "The audit view keeps pending design work visible so engineering does not quietly paper over missing contracts with one-off implementation details.",
        ]),
      ],
    }),
  };
}

export function getOverviewDocumentMeta(
  documentId: DocumentId,
): Option<OverviewDocumentMeta> {
  const meta = overviewDocumentMetaById[documentId];

  return meta === undefined ? none() : some(meta);
}

export function createOverviewLibraryFixtures(locale: AppLocale): OverviewFixtures {
  void locale;

  const articleDocuments = createOverviewArticleDocuments();
  const directoryDescriptions: Record<NodeId, DirectoryContent["description"]> = {
    foundation: some("Style runtime, token semantics, theme, density, and motion live here."),
    layout: some("Shell behavior and reusable layout primitives belong to the layout layer."),
    primitives: some("Action, input, and feedback components that product code should never re-invent."),
    patterns: some("Shared structural patterns that assemble primitives into reusable UI behavior."),
    audit: some("Coverage, design asks, and implementation gaps stay visible here."),
    "primitives-actions": some("Action primitives define the system's baseline interaction language."),
    "primitives-data-entry": some("Field and input surfaces share one calm data-entry contract."),
    "patterns-navigation": some("Navigation patterns centralize ownership and state priority."),
    "patterns-states": some("State wrappers keep loading, empty, and error surfaces reusable."),
  };
  const contentNodes: ContentNode[] = [
    {
      id: ROOT_NODE_ID,
      kind: "folder",
      status: "available",
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
      id: "home",
      kind: "home",
      title: "UI Library Overview",
      slug: "home",
      parentId: ROOT_NODE_ID,
      ancestorIds: [ROOT_NODE_ID],
      pathSegments: [],
      documentId: "home-doc",
    }),
    createNode({
      id: "foundation",
      kind: "folder",
      title: "Foundation",
      slug: "foundation",
      parentId: ROOT_NODE_ID,
      ancestorIds: [ROOT_NODE_ID],
      pathSegments: ["foundation"],
      childrenCount: 3,
    }),
    createNode({
      id: "layout",
      kind: "folder",
      title: "Layout",
      slug: "layout",
      parentId: ROOT_NODE_ID,
      ancestorIds: [ROOT_NODE_ID],
      pathSegments: ["layout"],
      childrenCount: 2,
    }),
    createNode({
      id: "primitives",
      kind: "folder",
      title: "Primitives",
      slug: "primitives",
      parentId: ROOT_NODE_ID,
      ancestorIds: [ROOT_NODE_ID],
      pathSegments: ["primitives"],
      childrenCount: 2,
    }),
    createNode({
      id: "patterns",
      kind: "folder",
      title: "Patterns",
      slug: "patterns",
      parentId: ROOT_NODE_ID,
      ancestorIds: [ROOT_NODE_ID],
      pathSegments: ["patterns"],
      childrenCount: 2,
    }),
    createNode({
      id: "audit",
      kind: "folder",
      title: "Audit",
      slug: "audit",
      parentId: ROOT_NODE_ID,
      ancestorIds: [ROOT_NODE_ID],
      pathSegments: ["audit"],
      childrenCount: 1,
    }),
    createNode({
      id: "article-style-provider",
      kind: "article",
      title: "StyleProvider",
      slug: "style-provider",
      parentId: "foundation",
      ancestorIds: [ROOT_NODE_ID, "foundation"],
      pathSegments: ["foundation", "style-provider"],
      documentId: "doc-style-provider",
      publishedAt: "2026-03-21T08:30:00.000Z",
      updatedAt: "2026-03-22T07:30:00.000Z",
      readingMinutes: 4,
    }),
    createNode({
      id: "article-token-map",
      kind: "article",
      title: "Token Map",
      slug: "token-map",
      parentId: "foundation",
      ancestorIds: [ROOT_NODE_ID, "foundation"],
      pathSegments: ["foundation", "token-map"],
      documentId: "doc-tokens",
      publishedAt: "2026-03-20T08:30:00.000Z",
      updatedAt: "2026-03-22T07:15:00.000Z",
      readingMinutes: 4,
    }),
    createNode({
      id: "article-theme-density",
      kind: "article",
      title: "Theme And Density",
      slug: "theme-and-density",
      parentId: "foundation",
      ancestorIds: [ROOT_NODE_ID, "foundation"],
      pathSegments: ["foundation", "theme-and-density"],
      documentId: "doc-theme-density",
      publishedAt: "2026-03-19T08:30:00.000Z",
      updatedAt: "2026-03-22T06:30:00.000Z",
      readingMinutes: 4,
    }),
    createNode({
      id: "article-layout-primitives",
      kind: "article",
      title: "Layout Primitives",
      slug: "layout-primitives",
      parentId: "layout",
      ancestorIds: [ROOT_NODE_ID, "layout"],
      pathSegments: ["layout", "layout-primitives"],
      documentId: "doc-layout-primitives",
      publishedAt: "2026-03-20T07:30:00.000Z",
      updatedAt: "2026-03-21T11:00:00.000Z",
      readingMinutes: 4,
    }),
    createNode({
      id: "article-app-shell",
      kind: "article",
      title: "App Shell",
      slug: "app-shell",
      parentId: "layout",
      ancestorIds: [ROOT_NODE_ID, "layout"],
      pathSegments: ["layout", "app-shell"],
      documentId: "doc-app-shell",
      publishedAt: "2026-03-21T07:30:00.000Z",
      updatedAt: "2026-03-22T06:45:00.000Z",
      readingMinutes: 5,
    }),
    createNode({
      id: "primitives-actions",
      kind: "folder",
      title: "Actions",
      slug: "actions",
      parentId: "primitives",
      ancestorIds: [ROOT_NODE_ID, "primitives"],
      pathSegments: ["primitives", "actions"],
      childrenCount: 1,
    }),
    createNode({
      id: "primitives-data-entry",
      kind: "folder",
      title: "Data Entry",
      slug: "data-entry",
      parentId: "primitives",
      ancestorIds: [ROOT_NODE_ID, "primitives"],
      pathSegments: ["primitives", "data-entry"],
      childrenCount: 1,
    }),
    createNode({
      id: "article-button",
      kind: "article",
      title: "Button",
      slug: "button",
      parentId: "primitives-actions",
      ancestorIds: [ROOT_NODE_ID, "primitives", "primitives-actions"],
      pathSegments: ["primitives", "actions", "button"],
      documentId: "doc-button",
      publishedAt: "2026-03-18T07:45:00.000Z",
      updatedAt: "2026-03-22T05:20:00.000Z",
      readingMinutes: 4,
    }),
    createNode({
      id: "article-field-input",
      kind: "article",
      title: "Field And Input",
      slug: "field-and-input",
      parentId: "primitives-data-entry",
      ancestorIds: [ROOT_NODE_ID, "primitives", "primitives-data-entry"],
      pathSegments: ["primitives", "data-entry", "field-and-input"],
      documentId: "doc-field-input",
      publishedAt: "2026-03-18T07:50:00.000Z",
      updatedAt: "2026-03-21T16:20:00.000Z",
      readingMinutes: 4,
    }),
    createNode({
      id: "patterns-navigation",
      kind: "folder",
      title: "Navigation",
      slug: "navigation",
      parentId: "patterns",
      ancestorIds: [ROOT_NODE_ID, "patterns"],
      pathSegments: ["patterns", "navigation"],
      childrenCount: 1,
    }),
    createNode({
      id: "patterns-states",
      kind: "folder",
      title: "States",
      slug: "states",
      parentId: "patterns",
      ancestorIds: [ROOT_NODE_ID, "patterns"],
      pathSegments: ["patterns", "states"],
      childrenCount: 1,
    }),
    createNode({
      id: "article-tree-nav",
      kind: "article",
      title: "TreeNav",
      slug: "tree-nav",
      parentId: "patterns-navigation",
      ancestorIds: [ROOT_NODE_ID, "patterns", "patterns-navigation"],
      pathSegments: ["patterns", "navigation", "tree-nav"],
      documentId: "doc-tree-nav",
      publishedAt: "2026-03-18T08:30:00.000Z",
      updatedAt: "2026-03-22T05:45:00.000Z",
      readingMinutes: 4,
    }),
    createNode({
      id: "article-view-state-layout",
      kind: "article",
      title: "View State Layout",
      slug: "view-state-layout",
      parentId: "patterns-states",
      ancestorIds: [ROOT_NODE_ID, "patterns", "patterns-states"],
      pathSegments: ["patterns", "states", "view-state-layout"],
      documentId: "doc-view-state-layout",
      publishedAt: "2026-03-18T08:40:00.000Z",
      updatedAt: "2026-03-21T10:10:00.000Z",
      readingMinutes: 4,
    }),
    createNode({
      id: "article-design-gaps",
      kind: "article",
      title: "Design Gaps",
      slug: "design-gaps",
      parentId: "audit",
      ancestorIds: [ROOT_NODE_ID, "audit"],
      pathSegments: ["audit", "design-gaps"],
      documentId: "doc-design-gaps",
      publishedAt: "2026-03-22T04:05:00.000Z",
      updatedAt: "2026-03-22T04:25:00.000Z",
      readingMinutes: 3,
    }),
  ];
  const homeContents: Record<DocumentId, HomeContent> = {
    "home-doc": {
      kind: "home",
      title: "UI Library Overview",
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
