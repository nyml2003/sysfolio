import type { ArticleDocument, ArticleSection, DocumentId, NodeId } from '@/entities/content';

function createArticle(
  id: DocumentId,
  title: string,
  summary: string,
  eyebrow: string,
  sections: ArticleSection[]
): ArticleDocument {
  return {
    kind: 'article',
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

export const englishHomeTitle = 'Home';

export const englishDirectoryDescriptions: Record<NodeId, string> = {
  archive:
    'Long-form essays, short notes, and holding folders all live here, organized by writing density rather than by product-facing sections.',
  lab: 'Interface experiments, reader prototypes, and performance drafts gather on this side, with a stronger workbench tone.',
  playground:
    'Mini-games and media content will land here later. For now the goal is to exercise the entry states and empty-state behavior.',
  journal:
    'Weekly progress logs and working notes, used to verify that time-based content can also live in the same tree.',
  'archive-essays': 'More complete essays and series drafts designed for sustained reading.',
  'archive-notes': 'Shorter notes that help validate lightweight articles and concise summaries.',
  'archive-cabinet': 'An intentionally empty directory used to cover the empty-path state.',
  'lab-research':
    'Lower-level model and performance studies that are not directly presentation-facing.',
  'research-virtualization':
    'A dedicated branch for long lists, tree windowing, and partial rendering experiments.',
};

export const englishArticleDocuments: Record<DocumentId, ArticleDocument> = {
  'doc-filesystem-reading': createArticle(
    'doc-filesystem-reading',
    'Filesystem-Style Reading',
    'If the filesystem metaphor is only decorative, the reading experience quickly collapses into a noisy tree.',
    'archive / essays',
    [
      {
        id: 'fsr-why-shell',
        title: 'Let the shell explain the job first',
        level: 2,
        paragraphs: [
          'A reading page should explain the job before it explains the style. As soon as someone lands on it, they should understand that the left rail is for orientation, the middle rail is for reading, and the right rail is for context, instead of getting dragged into editor-like decoration.',
          'That means the filesystem feeling should live in the path, hierarchy, and switching semantics. The body area itself has to behave like a stable reading surface, not an editor costume.',
        ],
      },
      {
        id: 'fsr-keep-center-calm',
        title: 'Push the center rail to the front',
        level: 2,
        paragraphs: [
          'What really affects dwell time is the rhythm of the middle rail. If the title, summary, line length, and paragraph spacing do not hold, any tree structure will only push the user back into navigation mode.',
          'A sustainable approach is to cap the reading measure, turn down the chroma on the side rails, and let the strongest contrast happen only on the title, body, and current node.',
        ],
      },
      {
        id: 'fsr-right-panel-role',
        title: 'The right rail is only for the current context',
        level: 3,
        paragraphs: [
          'The right rail should not duplicate a second navigation tree. It is better used for the table of contents, metadata, series relationships, and restore hints, all of which orbit the current document rather than the whole site.',
        ],
      },
    ]
  ),
  'doc-state-machines': createArticle(
    'doc-state-machines',
    'State Machines Are Not Over-Engineering',
    'Real over-engineering is usually not that the states are too explicit. It is that the states already exist and are scattered across layers.',
    'archive / essays',
    [
      {
        id: 'sm-ui-lifecycle',
        title: 'A UI lifecycle is never just success or failure',
        level: 2,
        paragraphs: [
          'The real lifecycle of page data includes at least idle, loading, ready, empty, and error. Compressing all of that into booleans only spreads conditionals across the component tree.',
          'The value of explicit resource states is not formal symmetry. It is that the renderer can map branches directly to visible interface states.',
        ],
      },
      {
        id: 'sm-boundary',
        title: 'Where the boundary layer stops and the product layer starts',
        level: 2,
        paragraphs: [
          'Result is a better fit for boundary code because it emphasizes whether a call succeeds or fails. Once you move into product code, what the page really needs is a user-visible lifecycle model.',
        ],
      },
    ]
  ),
  'doc-indexing': createArticle(
    'doc-indexing',
    'Index Before Categories',
    'As content volume grows, lookup efficiency is determined less by directory names and more by whether the path index and return shape stay stable.',
    'archive / notes',
    [
      {
        id: 'indexing-entry',
        title: 'Answer what a path resolves to first',
        level: 2,
        paragraphs: [
          'What the page layer needs most is not fine-grained query freedom. It needs to resolve a path into a renderable result in one shot. Otherwise the page has to coordinate node, content, and context on its own.',
        ],
      },
    ]
  ),
  'doc-reading-ui': createArticle(
    'doc-reading-ui',
    'The Rhythm of the Right Rail in a Reader Prototype',
    'The right rail is valuable not because it can hold more information, but because it can make orientation cheap without interrupting reading.',
    'lab',
    [
      {
        id: 'rui-less-more',
        title: 'Reduce duplicated navigation',
        level: 2,
        paragraphs: [
          'If the right rail holds another directory tree, users have to process three navigation systems at once. A more disciplined choice is to keep only the current document outline, metadata, and series relationships.',
        ],
      },
      {
        id: 'rui-reading-progress',
        title: 'Keep restore hints light',
        level: 2,
        paragraphs: [
          'A reading-progress restore should feel like a gentle reminder, not like a system modal. Its job is to signal that the position was preserved, not to interrupt the reader again.',
        ],
      },
    ]
  ),
  'doc-design-systems': createArticle(
    'doc-design-systems',
    'Soft Constraints in Design Systems',
    'Good constraints do not flatten every component into the same shape. They keep change inside the cheapest possible layer.',
    'lab',
    [
      {
        id: 'ds-layering',
        title: 'Start with tokens, then discuss component appearance',
        level: 2,
        paragraphs: [
          'Anything stable across themes and layouts should become a token first. Structure and component layers should follow actual usage, rather than extracting the entire design file in one pass.',
        ],
      },
      {
        id: 'ds-atomic-first',
        title: 'The atomic layer should only collect stable repetition',
        level: 2,
        paragraphs: [
          'If a pattern appears only once, it is not worth naming as a shared molecular class in advance. Wait until it actually crosses component boundaries, then abstract upward with less cost and better judgment.',
        ],
      },
    ]
  ),
  'doc-tree-windowing': createArticle(
    'doc-tree-windowing',
    'Tree Windowing Is Not Just Cropping a List',
    'The real difficulty in windowing a tree is not height. It is that expand, collapse, lazy loading, and selected paths all reshape the visible sequence together.',
    'lab / research / virtualization',
    [
      {
        id: 'tw-derived-rows',
        title: 'Treat visible rows as derived output',
        level: 2,
        paragraphs: [
          'The most stable way to build a tree is to keep nodes, expandedIds, and loadedChildren as raw state, then derive visibleRows inside a pure function. TSX should consume the result instead of recomputing the whole tree directly.',
          'The consequence is that you must be explicit about which inputs are allowed to change the visible rows. If expandedIds, childrenByParentId, or selectedPath change, recomputation is justified. Visual state should not sneak into the same dependency surface.',
        ],
      },
      {
        id: 'tw-load-on-demand',
        title: 'On-demand loading matters more than a full first paint',
        level: 2,
        paragraphs: [
          'No matter how deep the hierarchy becomes, the first paint should not pay for the whole tree. Give people a stable impression with the first two levels, then load deeper branches when they expand them.',
        ],
      },
      {
        id: 'tw-current-path',
        title: 'Deep links must be able to expand themselves',
        level: 3,
        paragraphs: [
          'If a user opens an article that sits four levels deep, the tree has to load the ancestors first, then expand and highlight the current path. Otherwise deep linking feels broken immediately.',
        ],
      },
      {
        id: 'tw-stable-identity',
        title: 'Stable identity matters more than cache volume',
        level: 2,
        paragraphs: [
          'Many windowing bugs are not about slow computation. They come from references changing on every render. Once an unstable object lands in an effect dependency list, the view reloads, recenters, and re-highlights itself.',
          'That is why boundary objects such as the repository, the tree index, and the scroll container should guarantee stable identity first, before you look for more memoization.',
        ],
      },
      {
        id: 'tw-effect-loops',
        title: 'Effect loops usually hide inside synchronous correction',
        level: 3,
        paragraphs: [
          'The most dangerous pattern is not obvious recursion. It is an effect that reads derived state, sets state in order to correct it, and then retriggers itself because the same dependencies changed again.',
          'Tree views are especially vulnerable because path expansion, async child loading, and default expansion rules often coexist.',
        ],
      },
      {
        id: 'tw-guard-loaded-branches',
        title: 'You need a clear signal for whether a branch is loaded',
        level: 4,
        paragraphs: [
          'Without an explicit loaded signal, the only thing left is guessing from children.length. The problem is that empty folders and unloaded folders can both look like zero children, which leads the effect to request the same branch again and again.',
        ],
      },
      {
        id: 'tw-scroll-anchoring',
        title: 'Keep a visual anchor after expansion',
        level: 2,
        paragraphs: [
          'When a user expands a node, the worst outcome is for the whole list to jump away. A windowed tree should either maintain the scroll anchor or at least keep the clicked row in view on the next frame.',
        ],
      },
      {
        id: 'tw-anchor-nearby',
        title: 'Anchor the area around the interaction point first',
        level: 3,
        paragraphs: [
          'In practice you do not need absolute pixel-perfect immobility. Keeping the area around the interaction point stable is usually enough, and it matches user expectations better while lowering implementation cost.',
        ],
      },
      {
        id: 'tw-toc-as-diagnostic',
        title: 'A long TOC is a diagnostic tool',
        level: 2,
        paragraphs: [
          'Once an article TOC becomes long enough, the right rail can expose whether active-heading synchronization is actually stable. If the highlight jumps back to the top after a few sections, the bug is usually in body scroll tracking or heading positioning, not in the TOC itself.',
          'That is why a long-form mock is not only for demos. It is also a fixture for testing the reading experience layer.',
        ],
      },
      {
        id: 'tw-active-heading-threshold',
        title: 'Active heading needs a threshold, not a hit test',
        level: 3,
        paragraphs: [
          'If the highlight changes only when a heading top lands exactly on the container top, the highlight will flicker between two headings. A fixed threshold makes the experience far more stable.',
        ],
      },
      {
        id: 'tw-progress-persistence',
        title: 'Persist reading progress after scroll settles',
        level: 2,
        paragraphs: [
          'Writing to storage on every scroll event amplifies cost and makes it easier to save a temporary position as the final one. A safer approach is to throttle or debounce persistence.',
        ],
      },
      {
        id: 'tw-restore-is-contextual',
        title: 'Restore should be a contextual hint, not a mode switch',
        level: 3,
        paragraphs: [
          'When users reopen an article, they only need to know that the system remembered their last position and that they can jump back to the top if they want. The hint should stay light and should not reorganize the page hierarchy.',
        ],
      },
      {
        id: 'tw-empty-branches',
        title: 'Empty directories must stay separate from load failures',
        level: 2,
        paragraphs: [
          'Empty branches are normal in a tree. They help validate layout, empty-state copy, and path behavior. If you misclassify them as load failures, the whole information architecture becomes heavier than it needs to be.',
        ],
      },
      {
        id: 'tw-shared-contract',
        title: 'Shared contracts come last',
        level: 2,
        paragraphs: [
          'Only after the tree, body, and right rail all feel stable should you extract repository contracts and shared models. Otherwise many supposedly stable abstractions are just shadows cast by the first implementation.',
          'That is also why mock data should be long, deep, and uneven enough. Only interfaces that survive complex fixtures deserve to rise into the shared layer.',
        ],
      },
    ]
  ),
  'doc-week-01': createArticle(
    'doc-week-01',
    '2026 Week 01',
    'This week was mainly about locking in the content model and repository contract, so the UI would not race ahead while the boundary layer lagged behind.',
    'journal',
    [
      {
        id: 'wk1-contracts',
        title: 'Narrow the boundary first',
        level: 2,
        paragraphs: [
          'The biggest gain comes from keeping a single page-consumption entry inside the repository. That way the same layer resolves a path into renderable data for the home page, directories, and articles alike.',
        ],
      },
    ]
  ),
  'doc-week-02': createArticle(
    'doc-week-02',
    '2026 Week 02',
    'This week was about tightening the style layers again, keeping only globally stable materials and pushing component differences back into component implementation.',
    'journal',
    [
      {
        id: 'wk2-css',
        title: 'Do not extract the whole molecular layer in one shot',
        level: 2,
        paragraphs: [
          'Before the components exist, many so-called shared molecular classes are only temporary names for design-file structure. It is more reliable to wait for real implementations, then decide which patterns actually deserve promotion.',
        ],
      },
    ]
  ),
};
