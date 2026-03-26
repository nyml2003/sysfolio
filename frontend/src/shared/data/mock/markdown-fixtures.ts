import type {
  ArticleDocument,
  ArticleSection,
  ContentNode,
  DocumentId,
  NodeId,
} from '@/entities/content';
import { none, some } from '@/shared/lib/monads/option';

import contentModelMarkdown from '../../../../docs/content-model.md?raw';
import readmeMarkdown from '../../../../docs/README.md?raw';

type MarkdownArticleSource = {
  key: string;
  markdown: string;
  pathSegments: string[];
};

type MarkdownFixtureBundle = {
  contentNodes: ContentNode[];
  articleDocuments: Record<DocumentId, ArticleDocument>;
};

const MARKDOWN_DEMO_SOURCES: MarkdownArticleSource[] = [
  {
    key: 'docs-readme',
    markdown: readmeMarkdown,
    pathSegments: ['audit', 'demo-docs-readme'],
  },
  {
    key: 'docs-content-model',
    markdown: contentModelMarkdown,
    pathSegments: ['audit', 'demo-content-model'],
  },
];

function slugify(input: string): string {
  const normalized = input
    .toLowerCase()
    .trim()
    .replace(/[`*_~[\]()]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return normalized.length > 0 ? normalized : 'section';
}

function toParagraphs(lines: string[]): string[] {
  const paragraphs: string[] = [];
  let buffer: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.length === 0) {
      if (buffer.length > 0) {
        paragraphs.push(buffer.join(' ').trim());
        buffer = [];
      }
      continue;
    }

    buffer.push(trimmed);
  }

  if (buffer.length > 0) {
    paragraphs.push(buffer.join(' ').trim());
  }

  return paragraphs.filter((paragraph) => paragraph.length > 0);
}

function parseMarkdownArticle(
  markdown: string,
  fallbackTitle: string
): Omit<ArticleDocument, 'id'> {
  const rawLines = markdown.split(/\r?\n/);
  const lines: string[] = [];
  let inCodeBlock = false;

  for (const line of rawLines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      continue;
    }

    if (!inCodeBlock) {
      lines.push(line);
    }
  }

  const firstHeading = lines.find((line) => line.trim().startsWith('# '));
  const title = firstHeading ? firstHeading.trim().slice(2).trim() : fallbackTitle;

  const sections: ArticleSection[] = [];
  let currentSection: {
    title: string;
    level: 2 | 3 | 4;
    lines: string[];
  } | null = null;
  let sectionCounter = 0;

  for (const line of lines) {
    const trimmed = line.trim();
    const headingMatch = /^(#{2,4})\s+(.+)$/.exec(trimmed);
    if (headingMatch) {
      if (currentSection) {
        const paragraphs = toParagraphs(currentSection.lines);
        sections.push({
          id: `${slugify(currentSection.title)}-${sectionCounter}`,
          title: currentSection.title,
          level: currentSection.level,
          paragraphs: paragraphs.length > 0 ? paragraphs : [''],
        });
      }

      sectionCounter += 1;
      const headingLevel = headingMatch[1].length;
      currentSection = {
        title: headingMatch[2].trim(),
        level: headingLevel === 2 ? 2 : headingLevel === 3 ? 3 : 4,
        lines: [],
      };
      continue;
    }

    if (!currentSection) {
      currentSection = {
        title: 'Overview',
        level: 2,
        lines: [],
      };
      sectionCounter += 1;
    }

    if (trimmed.startsWith('# ')) {
      continue;
    }

    currentSection.lines.push(line);
  }

  if (currentSection) {
    const paragraphs = toParagraphs(currentSection.lines);
    sections.push({
      id: `${slugify(currentSection.title)}-${sectionCounter}`,
      title: currentSection.title,
      level: currentSection.level,
      paragraphs: paragraphs.length > 0 ? paragraphs : [''],
    });
  }

  const firstParagraph =
    sections.flatMap((section) => section.paragraphs).find((paragraph) => paragraph.length > 0) ??
    '';

  return {
    kind: 'article',
    title,
    summary: firstParagraph.slice(0, 140) || title,
    eyebrow: 'demo / markdown-import',
    toc: sections.map((section) => ({
      id: section.id,
      title: section.title,
      level: section.level,
    })),
    sections:
      sections.length > 0
        ? sections
        : [
            {
              id: 'overview-1',
              title: 'Overview',
              level: 2,
              paragraphs: [title],
            },
          ],
  };
}

function createMarkdownFixtureNode(
  source: MarkdownArticleSource,
  articleId: DocumentId,
  articleTitle: string
): ContentNode {
  const nodeId: NodeId = `article-${source.key}`;

  return {
    id: nodeId,
    kind: 'article',
    status: 'available',
    title: articleTitle,
    slug: source.pathSegments[source.pathSegments.length - 1] ?? source.key,
    parentId: some('audit'),
    ancestorIds: ['root', 'audit'],
    pathSegments: source.pathSegments,
    childrenCount: 0,
    hasChildren: false,
    documentId: some(articleId),
    publishedAt: none(),
    updatedAt: none(),
    readingMinutes: none(),
  };
}

export function createMarkdownDemoFixtures(): MarkdownFixtureBundle {
  const articleDocuments: Record<DocumentId, ArticleDocument> = {};
  const contentNodes: ContentNode[] = [];

  for (const source of MARKDOWN_DEMO_SOURCES) {
    const articleId: DocumentId = `doc-${source.key}`;
    const parsedArticle = parseMarkdownArticle(source.markdown, source.key);
    const article: ArticleDocument = {
      ...parsedArticle,
      id: articleId,
    };

    articleDocuments[articleId] = article;
    contentNodes.push(createMarkdownFixtureNode(source, articleId, article.title));
  }

  return {
    contentNodes,
    articleDocuments,
  };
}
