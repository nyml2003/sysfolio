import type {
  ArticleDocument,
  ArticleSection,
  ContentNode,
  DirectoryContent,
  DocumentId,
  HomeContent,
  NodeId,
} from "@/entities/content";
import type { Option } from "@/shared/lib/monads/option";
import { none, some, unwrapOr } from "@/shared/lib/monads/option";

export const ROOT_NODE_ID = "root";
export const ROOT_NODE_TITLE = "sysfolio";

type NodeConfig = {
  id: NodeId;
  kind: ContentNode["kind"];
  title: string;
  slug: string;
  parentId: NodeId;
  ancestorIds: NodeId[];
  pathSegments: string[];
  status: Option<ContentNode["status"]>;
  childrenCount: Option<number>;
  documentId: Option<DocumentId>;
  publishedAt: Option<string>;
  updatedAt: Option<string>;
  readingMinutes: Option<number>;
};

function createNode(config: NodeConfig): ContentNode {
  const childrenCount = unwrapOr(config.childrenCount, 0);

  return {
    id: config.id,
    kind: config.kind,
    status: unwrapOr(config.status, "available"),
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

const emptyNodeMeta = {
  status: none<ContentNode["status"]>(),
  childrenCount: none<number>(),
  documentId: none<DocumentId>(),
  publishedAt: none<string>(),
  updatedAt: none<string>(),
  readingMinutes: none<number>(),
};

function createArticle(
  id: DocumentId,
  title: string,
  summary: string,
  eyebrow: string,
  sections: ArticleSection[],
): ArticleDocument {
  return {
    kind: "article",
    id,
    title,
    summary,
    eyebrow,
    toc: sections.map((section) => ({
      id: section.id,
      title: section.title,
      level: section.level,
    })),
    sections,
  };
}

export const mockContentNodes: ContentNode[] = [
  {
    id: ROOT_NODE_ID,
    kind: "folder",
    status: "available",
    title: ROOT_NODE_TITLE,
    slug: ROOT_NODE_TITLE,
    parentId: none(),
    ancestorIds: [],
    pathSegments: [],
    childrenCount: 5,
    hasChildren: true,
    documentId: none(),
    publishedAt: none(),
    updatedAt: none(),
    readingMinutes: none(),
  },
  createNode({
    ...emptyNodeMeta,
    id: "home",
    kind: "home",
    title: "首页",
    slug: "home",
    parentId: ROOT_NODE_ID,
    ancestorIds: [ROOT_NODE_ID],
    pathSegments: [],
    documentId: some("home-doc"),
  }),
  createNode({
    ...emptyNodeMeta,
    id: "archive",
    kind: "folder",
    title: "Archive",
    slug: "archive",
    parentId: ROOT_NODE_ID,
    ancestorIds: [ROOT_NODE_ID],
    pathSegments: ["archive"],
    childrenCount: some(3),
  }),
  createNode({
    ...emptyNodeMeta,
    id: "lab",
    kind: "folder",
    title: "Lab",
    slug: "lab",
    parentId: ROOT_NODE_ID,
    ancestorIds: [ROOT_NODE_ID],
    pathSegments: ["lab"],
    childrenCount: some(3),
  }),
  createNode({
    ...emptyNodeMeta,
    id: "playground",
    kind: "folder",
    title: "Playground",
    slug: "playground",
    parentId: ROOT_NODE_ID,
    ancestorIds: [ROOT_NODE_ID],
    pathSegments: ["playground"],
    childrenCount: some(2),
  }),
  createNode({
    ...emptyNodeMeta,
    id: "journal",
    kind: "folder",
    title: "Journal",
    slug: "journal",
    parentId: ROOT_NODE_ID,
    ancestorIds: [ROOT_NODE_ID],
    pathSegments: ["journal"],
    childrenCount: some(2),
  }),
  createNode({
    ...emptyNodeMeta,
    id: "archive-essays",
    kind: "folder",
    title: "Essays",
    slug: "essays",
    parentId: "archive",
    ancestorIds: [ROOT_NODE_ID, "archive"],
    pathSegments: ["archive", "essays"],
    childrenCount: some(2),
  }),
  createNode({
    ...emptyNodeMeta,
    id: "archive-notes",
    kind: "folder",
    title: "Notes",
    slug: "notes",
    parentId: "archive",
    ancestorIds: [ROOT_NODE_ID, "archive"],
    pathSegments: ["archive", "notes"],
    childrenCount: some(1),
  }),
  createNode({
    ...emptyNodeMeta,
    id: "archive-cabinet",
    kind: "folder",
    title: "Cabinet",
    slug: "cabinet",
    parentId: "archive",
    ancestorIds: [ROOT_NODE_ID, "archive"],
    pathSegments: ["archive", "cabinet"],
  }),
  createNode({
    ...emptyNodeMeta,
    id: "article-filesystem-reading",
    kind: "article",
    title: "文件系统式阅读",
    slug: "filesystem-reading",
    parentId: "archive-essays",
    ancestorIds: [ROOT_NODE_ID, "archive", "archive-essays"],
    pathSegments: ["archive", "essays", "filesystem-reading"],
    documentId: some("doc-filesystem-reading"),
    publishedAt: some("2026-03-08T10:00:00.000Z"),
    updatedAt: some("2026-03-20T08:15:00.000Z"),
    readingMinutes: some(8),
  }),
  createNode({
    ...emptyNodeMeta,
    id: "article-state-machines",
    kind: "article",
    title: "状态机不是过度工程",
    slug: "state-machines-not-overkill",
    parentId: "archive-essays",
    ancestorIds: [ROOT_NODE_ID, "archive", "archive-essays"],
    pathSegments: ["archive", "essays", "state-machines-not-overkill"],
    documentId: some("doc-state-machines"),
    publishedAt: some("2026-02-26T09:30:00.000Z"),
    updatedAt: some("2026-03-18T05:20:00.000Z"),
    readingMinutes: some(6),
  }),
  createNode({
    ...emptyNodeMeta,
    id: "article-indexing",
    kind: "article",
    title: "索引优先于分类",
    slug: "index-before-categories",
    parentId: "archive-notes",
    ancestorIds: [ROOT_NODE_ID, "archive", "archive-notes"],
    pathSegments: ["archive", "notes", "index-before-categories"],
    documentId: some("doc-indexing"),
    publishedAt: some("2026-03-12T13:10:00.000Z"),
    updatedAt: some("2026-03-12T13:10:00.000Z"),
    readingMinutes: some(4),
  }),
  createNode({
    ...emptyNodeMeta,
    id: "article-reading-ui",
    kind: "article",
    title: "阅读器原型的右栏节奏",
    slug: "reading-ui-rhythm",
    parentId: "lab",
    ancestorIds: [ROOT_NODE_ID, "lab"],
    pathSegments: ["lab", "reading-ui-rhythm"],
    documentId: some("doc-reading-ui"),
    publishedAt: some("2026-03-16T07:00:00.000Z"),
    updatedAt: some("2026-03-19T07:00:00.000Z"),
    readingMinutes: some(7),
  }),
  createNode({
    ...emptyNodeMeta,
    id: "article-design-systems",
    kind: "article",
    title: "设计系统里的温和约束",
    slug: "soft-constraints-in-design-systems",
    parentId: "lab",
    ancestorIds: [ROOT_NODE_ID, "lab"],
    pathSegments: ["lab", "soft-constraints-in-design-systems"],
    documentId: some("doc-design-systems"),
    publishedAt: some("2026-03-10T06:00:00.000Z"),
    updatedAt: some("2026-03-17T06:00:00.000Z"),
    readingMinutes: some(5),
  }),
  createNode({
    ...emptyNodeMeta,
    id: "lab-research",
    kind: "folder",
    title: "Research",
    slug: "research",
    parentId: "lab",
    ancestorIds: [ROOT_NODE_ID, "lab"],
    pathSegments: ["lab", "research"],
    childrenCount: some(1),
  }),
  createNode({
    ...emptyNodeMeta,
    id: "research-virtualization",
    kind: "folder",
    title: "Virtualization",
    slug: "virtualization",
    parentId: "lab-research",
    ancestorIds: [ROOT_NODE_ID, "lab", "lab-research"],
    pathSegments: ["lab", "research", "virtualization"],
    childrenCount: some(1),
  }),
  createNode({
    ...emptyNodeMeta,
    id: "article-tree-windowing",
    kind: "article",
    title: "Tree Windowing 不是把列表裁掉",
    slug: "tree-windowing-not-cropping",
    parentId: "research-virtualization",
    ancestorIds: [
      ROOT_NODE_ID,
      "lab",
      "lab-research",
      "research-virtualization",
    ],
    pathSegments: ["lab", "research", "virtualization", "tree-windowing-not-cropping"],
    documentId: some("doc-tree-windowing"),
    publishedAt: some("2026-03-21T03:00:00.000Z"),
    updatedAt: some("2026-03-21T10:30:00.000Z"),
    readingMinutes: some(9),
  }),
  createNode({
    ...emptyNodeMeta,
    id: "game-particle-garden",
    kind: "game",
    status: some("coming_soon"),
    title: "Particle Garden",
    slug: "particle-garden",
    parentId: "playground",
    ancestorIds: [ROOT_NODE_ID, "playground"],
    pathSegments: ["playground", "particle-garden"],
  }),
  createNode({
    ...emptyNodeMeta,
    id: "media-ambient-room",
    kind: "media",
    status: some("coming_soon"),
    title: "Ambient Room",
    slug: "ambient-room",
    parentId: "playground",
    ancestorIds: [ROOT_NODE_ID, "playground"],
    pathSegments: ["playground", "ambient-room"],
  }),
  createNode({
    ...emptyNodeMeta,
    id: "journal-week-01",
    kind: "article",
    title: "2026 Week 01",
    slug: "2026-week-01",
    parentId: "journal",
    ancestorIds: [ROOT_NODE_ID, "journal"],
    pathSegments: ["journal", "2026-week-01"],
    documentId: some("doc-week-01"),
    publishedAt: some("2026-03-02T01:00:00.000Z"),
    updatedAt: some("2026-03-15T01:00:00.000Z"),
    readingMinutes: some(3),
  }),
  createNode({
    ...emptyNodeMeta,
    id: "journal-week-02",
    kind: "article",
    title: "2026 Week 02",
    slug: "2026-week-02",
    parentId: "journal",
    ancestorIds: [ROOT_NODE_ID, "journal"],
    pathSegments: ["journal", "2026-week-02"],
    documentId: some("doc-week-02"),
    publishedAt: some("2026-03-09T01:00:00.000Z"),
    updatedAt: some("2026-03-22T01:00:00.000Z"),
    readingMinutes: some(4),
  }),
];

export const mockHomeContents: Record<DocumentId, HomeContent> = {
  "home-doc": {
    kind: "home",
    title: "首页",
  },
};

export const mockDirectoryDescriptions: Record<NodeId, DirectoryContent["description"]> = {
  archive: some("长文、短记和暂存目录都收在这里，按写作密度而不是产品栏目组织。"),
  lab: some("界面实验、阅读器原型和性能草稿集中在这一侧，风格会更偏工作台。"),
  playground: some("未来会挂载小游戏和媒体内容；当前先把入口和空态行为跑通。"),
  journal: some("每周进展与工作笔记，用来验证时间型内容也能进入同一棵树。"),
  "archive-essays": some("较完整的文章与系列草稿，面向可持续阅读。"),
  "archive-notes": some("更短的记录，适合验证轻量文章和简短摘要。"),
  "archive-cabinet": some("留空目录，用来覆盖空态路径。"),
  "lab-research": some("偏底层的模型和性能研究，不直接面向展示。"),
  "research-virtualization": some("专门放长列表、树窗口化和局部渲染相关实验。"),
};

export const mockArticleDocuments: Record<DocumentId, ArticleDocument> = {
  "doc-filesystem-reading": createArticle(
    "doc-filesystem-reading",
    "文件系统式阅读",
    "如果文件系统隐喻只是装饰，阅读体验会很快退化成一棵吵闹的树。",
    "archive / essays",
    [
      {
        id: "fsr-why-shell",
        title: "骨架先解释任务",
        level: 2,
        paragraphs: [
          "阅读页首先要解释的是任务，而不是风格。用户进入页面后，需要立刻明白左边负责定位，中间负责阅读，右边负责上下文，而不是被编辑器式装饰拖住注意力。",
          "因此文件系统感应该停留在路径、层级和切换语义上，正文区域则必须表现得更像一个稳定的阅读面，而不是代码编辑器的伪装。 ",
        ],
      },
      {
        id: "fsr-keep-center-calm",
        title: "把中栏压到主位",
        level: 2,
        paragraphs: [
          "真正影响停留时长的是中栏节奏。标题、摘要、正文宽度和段落间距如果站不住，任何树结构都只会把人重新推回导航状态。",
          "一个可持续的做法是限制中栏行宽，降低左右栏色彩分贝，让视觉最强的对比只发生在标题、正文和当前节点。 ",
        ],
      },
      {
        id: "fsr-right-panel-role",
        title: "右栏只做当前上下文",
        level: 3,
        paragraphs: [
          "右栏不应该复制第二棵导航树。它更适合承载目录、元信息、系列关系和恢复提示，这些信息都围绕当前文档，而不是围绕整个站点。",
        ],
      },
    ],
  ),
  "doc-state-machines": createArticle(
    "doc-state-machines",
    "状态机不是过度工程",
    "真正的过度工程，通常不是状态太清晰，而是状态已经存在却被散落在各层里。",
    "archive / essays",
    [
      {
        id: "sm-ui-lifecycle",
        title: "UI 生命周期本来就不止成功和失败",
        level: 2,
        paragraphs: [
          "页面数据的真实生命周期至少包含 idle、loading、ready、empty 和 error。把这些状态全部压成布尔值，会让组件到处补判断。",
          "显式资源状态的好处不是形式统一，而是 renderer 可以直接把分支和界面对应起来。 ",
        ],
      },
      {
        id: "sm-boundary",
        title: "边界层和业务层的职责",
        level: 2,
        paragraphs: [
          "Result 更适合边界层，因为它强调的是一次调用成功还是失败。进入业务层之后，页面真正需要的是用户可见的生命周期语义。",
        ],
      },
    ],
  ),
  "doc-indexing": createArticle(
    "doc-indexing",
    "索引优先于分类",
    "当内容量开始增长，真正决定查找效率的不是目录名字，而是路径索引和返回结构是否稳定。",
    "archive / notes",
    [
      {
        id: "indexing-entry",
        title: "先回答 path 对应什么",
        level: 2,
        paragraphs: [
          "页面层最需要的不是细粒度查询自由，而是给定 path 后能一次拿到可渲染结果。否则页面会被迫自己协调 node、content 和 context。",
        ],
      },
    ],
  ),
  "doc-reading-ui": createArticle(
    "doc-reading-ui",
    "阅读器原型的右栏节奏",
    "右栏的价值不在于放更多信息，而在于在不打断阅读的前提下让定位变得便宜。",
    "lab",
    [
      {
        id: "rui-less-more",
        title: "减少重复导航",
        level: 2,
        paragraphs: [
          "如果右栏再放一棵目录树，用户会同时面对三套导航。更克制的选择是只保留当前文档目录、元信息和系列关系。",
        ],
      },
      {
        id: "rui-reading-progress",
        title: "恢复提示要轻",
        level: 2,
        paragraphs: [
          "阅读进度恢复应该像一个轻提醒，而不是像系统弹窗。它的任务是告诉用户你并没有丢位置，而不是重新打断他。 ",
        ],
      },
    ],
  ),
  "doc-design-systems": createArticle(
    "doc-design-systems",
    "设计系统里的温和约束",
    "优秀的约束不是把组件压成一模一样，而是尽可能把变化限制在低成本的层。",
    "lab",
    [
      {
        id: "ds-layering",
        title: "先放 tokens，再谈组件外观",
        level: 2,
        paragraphs: [
          "跨主题、跨布局都稳定的东西应该先沉淀成 token。结构层和组件层则跟着真实使用场景走，而不是设计稿一口气抽完。",
        ],
      },
      {
        id: "ds-atomic-first",
        title: "原子层只收稳定的重复",
        level: 2,
        paragraphs: [
          "一个 pattern 只出现一次时，不值得提前命名成 shared 分子类。等它真的跨组件复用，再向上抽象，成本和判断都更低。",
        ],
      },
    ],
  ),
  "doc-tree-windowing": createArticle(
    "doc-tree-windowing",
    "Tree Windowing 不是把列表裁掉",
    "树的窗口化真正难的不是高度，而是展开、收起、懒加载和选中路径会一起改变可见序列。",
    "lab / research / virtualization",
    [
      {
        id: "tw-derived-rows",
        title: "把可见行当成派生结果",
        level: 2,
        paragraphs: [
          "树组件最稳的做法，是把 nodes、expandedIds 和 loadedChildren 当原始状态，再在纯函数里推导 visibleRows。TSX 只消费结果，不直接重算整棵树。",
        ],
      },
      {
        id: "tw-load-on-demand",
        title: "按需读取比首屏全量更重要",
        level: 2,
        paragraphs: [
          "目录再深也不应该在首屏为完整树付费。先给前两层一个稳定印象，后续层级在展开时异步读取，用户会更容易理解系统的节奏。",
        ],
      },
      {
        id: "tw-current-path",
        title: "深链路径必须能自我展开",
        level: 3,
        paragraphs: [
          "如果用户直接打开四层深的文章，树需要先保证祖先节点被加载，再把当前路径展开并高亮，否则深链体验会立刻失真。",
        ],
      },
    ],
  ),
  "doc-week-01": createArticle(
    "doc-week-01",
    "2026 Week 01",
    "这一周主要把内容模型和 repository 契约定下来，避免 UI 先跑、边界后补。",
    "journal",
    [
      {
        id: "wk1-contracts",
        title: "先把边界做窄",
        level: 2,
        paragraphs: [
          "最大的收益来自 repository 只有一套页面消费入口。这样无论首页、目录还是文章，都由同一层负责把 path 转成可渲染资源。",
        ],
      },
    ],
  ),
  "doc-week-02": createArticle(
    "doc-week-02",
    "2026 Week 02",
    "这一周把样式分层重新收紧，只保留全局稳定材料，把组件差异推回组件实现阶段。",
    "journal",
    [
      {
        id: "wk2-css",
        title: "不要一口气抽完整个分子层",
        level: 2,
        paragraphs: [
          "当组件还没写出来时，很多所谓共享分子类只是对设计稿结构的临时命名。等真实实现出现以后，再决定哪些 pattern 值得上收，会更稳。",
        ],
      },
    ],
  ),
};
