import type { ContentKind } from '@/entities/content';
import type { ThemePreference } from '@/shared/lib/theme/theme.types';

import type { AppLocale } from './locale.types';

type UiCopy = {
  common: {
    homeTitle: string;
    rootLabel: string;
    kindLabel: (kind: ContentKind) => string;
    itemCount: (count: number) => string;
    minuteCount: (count: number) => string;
    folderCount: (count: number) => string;
    articleCount: (count: number) => string;
  };
  pathBar: {
    navLabel: string;
    filesButton: string;
    contextButton: string;
  };
  appShell: {
    dismissOverlay: string;
    navigationPanelLabel: string;
    contextPanelLabel: string;
  };
  themeToggle: {
    switchToDark: string;
    switchToLight: string;
  };
  localeToggle: {
    buttonLabel: string;
    ariaLabel: string;
  };
  fileTree: {
    ariaLabel: string;
    title: string;
    loading: string;
    retryButton: string;
    expandDirectory: (title: string) => string;
    collapseDirectory: (title: string) => string;
    retryDirectoryLoad: (title: string) => string;
  };
  article: {
    publishedAt: (formattedDate: string) => string;
    updatedAt: (formattedDate: string) => string;
    restoreNotice: string;
    scrollToTop: string;
  };
  contextPanel: {
    placeholderTitle: string;
    placeholderBody: string;
    tocTitle: string;
    directoryStatsTitle: string;
    parentTitle: string;
    backTo: (title: string) => string;
    recentTitle: string;
  };
  home: {
    eyebrow: string;
    summary: string;
    quickEntriesTitle: string;
  };
  contentPane: {
    directorySharedMeta: string;
    unsupportedTitle: string;
    unsupportedBody: string;
    backToParent: string;
    loadingTitle: string;
    loadingBody: string;
    notFoundTitle: string;
    emptyTitle: string;
    defaultEmptyReason: string;
  };
  onboarding: {
    treeTip: string;
    contentTip: string;
    pathTip: string;
    dismiss: string;
  };
};

function pluralize(count: number, singular: string, plural: string): string {
  return `${count} ${count === 1 ? singular : plural}`;
}

const uiCopyByLocale: Record<AppLocale, UiCopy> = {
  'zh-CN': {
    common: {
      homeTitle: '首页',
      rootLabel: '根目录',
      kindLabel(kind) {
        if (kind === 'folder') {
          return '目录';
        }

        if (kind === 'home') {
          return '首页';
        }

        if (kind === 'article') {
          return '文章';
        }

        if (kind === 'game') {
          return '游戏';
        }

        if (kind === 'media') {
          return '媒体';
        }

        return '未知';
      },
      itemCount(count) {
        return `${count} 项`;
      },
      minuteCount(count) {
        return `${count} 分钟`;
      },
      folderCount(count) {
        return `${count} 个目录`;
      },
      articleCount(count) {
        return `${count} 篇文章`;
      },
    },
    pathBar: {
      navLabel: '当前路径',
      filesButton: '文件',
      contextButton: '上下文',
    },
    appShell: {
      dismissOverlay: '关闭面板',
      navigationPanelLabel: '文件导航',
      contextPanelLabel: '上下文面板',
    },
    themeToggle: {
      switchToDark: '切换到深色主题',
      switchToLight: '切换到浅色主题',
    },
    localeToggle: {
      buttonLabel: '中',
      ariaLabel: '切换为 English',
    },
    fileTree: {
      ariaLabel: '文件树',
      title: '文件树',
      loading: '正在展开目录视图…',
      retryButton: '重试',
      expandDirectory(title) {
        return `展开 ${title}`;
      },
      collapseDirectory(title) {
        return `折叠 ${title}`;
      },
      retryDirectoryLoad(title) {
        return `重新加载 ${title}`;
      },
    },
    article: {
      publishedAt(formattedDate) {
        return `发布于 ${formattedDate}`;
      },
      updatedAt(formattedDate) {
        return `更新于 ${formattedDate}`;
      },
      restoreNotice: '已恢复到上次阅读位置。',
      scrollToTop: '回到顶部',
    },
    contextPanel: {
      placeholderTitle: '上下文',
      placeholderBody: '上下文信息会在当前内容就绪后出现。',
      tocTitle: '目录',
      directoryStatsTitle: '目录统计',
      parentTitle: '上一级',
      backTo(title) {
        return `返回 ${title}`;
      },
      recentTitle: '最近内容',
    },
    home: {
      eyebrow: 'sysfolio / 首页',
      summary:
        '左侧目录负责定位，中栏负责阅读，右栏负责当前上下文。这个首页只做一件事：让用户以最低成本进入文件系统式阅读。',
      quickEntriesTitle: '快捷入口',
    },
    contentPane: {
      directorySharedMeta: '目录和文章共用统一内容壳',
      unsupportedTitle: '正在搭建当前视图',
      unsupportedBody:
        '这条路径已经进入统一 repository，但当前类型还没有正文阅读器。你可以先返回父级目录继续浏览。',
      backToParent: '返回上一级',
      loadingTitle: '正在读取内容',
      loadingBody: '路径已经解析完成，当前正在从 repository 聚合渲染所需内容。',
      notFoundTitle: '路径未命中',
      emptyTitle: '当前内容为空',
      defaultEmptyReason: '这条路径暂时没有可渲染内容。',
    },
    onboarding: {
      treeTip: '左侧浏览文件和目录。',
      contentTip: '中间查看首页、目录或阅读当前文件。',
      pathTip: '这里查看当前所在路径，并切换语言与主题。',
      dismiss: '知道了',
    },
  },
  'en-US': {
    common: {
      homeTitle: 'Home',
      rootLabel: 'Root',
      kindLabel(kind) {
        if (kind === 'folder') {
          return 'Folder';
        }

        if (kind === 'home') {
          return 'Home';
        }

        if (kind === 'article') {
          return 'Article';
        }

        if (kind === 'game') {
          return 'Game';
        }

        if (kind === 'media') {
          return 'Media';
        }

        return 'Unknown';
      },
      itemCount(count) {
        return pluralize(count, 'item', 'items');
      },
      minuteCount(count) {
        return pluralize(count, 'min', 'mins');
      },
      folderCount(count) {
        return pluralize(count, 'folder', 'folders');
      },
      articleCount(count) {
        return pluralize(count, 'article', 'articles');
      },
    },
    pathBar: {
      navLabel: 'Current path',
      filesButton: 'Files',
      contextButton: 'Context',
    },
    appShell: {
      dismissOverlay: 'Dismiss panel',
      navigationPanelLabel: 'File navigation',
      contextPanelLabel: 'Context panel',
    },
    themeToggle: {
      switchToDark: 'Switch to dark theme',
      switchToLight: 'Switch to light theme',
    },
    localeToggle: {
      buttonLabel: 'EN',
      ariaLabel: 'Switch language to 简体中文',
    },
    fileTree: {
      ariaLabel: 'File tree',
      title: 'Filesystem',
      loading: 'Expanding the directory view…',
      retryButton: 'Retry',
      expandDirectory(title) {
        return `Expand ${title}`;
      },
      collapseDirectory(title) {
        return `Collapse ${title}`;
      },
      retryDirectoryLoad(title) {
        return `Retry loading ${title}`;
      },
    },
    article: {
      publishedAt(formattedDate) {
        return `Published ${formattedDate}`;
      },
      updatedAt(formattedDate) {
        return `Updated ${formattedDate}`;
      },
      restoreNotice: 'Restored your previous reading position.',
      scrollToTop: 'Back to top',
    },
    contextPanel: {
      placeholderTitle: 'Context',
      placeholderBody: 'Context details will appear once the current content is ready.',
      tocTitle: 'Table of contents',
      directoryStatsTitle: 'Directory stats',
      parentTitle: 'Parent',
      backTo(title) {
        return `Back to ${title}`;
      },
      recentTitle: 'Recent',
    },
    home: {
      eyebrow: 'sysfolio / home',
      summary:
        'The left rail is for orientation, the middle rail is for reading, and the right rail is for the current context. This home view does one thing: get people into filesystem-style reading with minimal friction.',
      quickEntriesTitle: 'Quick entries',
    },
    contentPane: {
      directorySharedMeta: 'Directories and articles share the same content shell',
      unsupportedTitle: 'This view is still being built',
      unsupportedBody:
        'This path already exists in the unified repository, but the current content type does not have a reader yet. You can go back to the parent directory for now.',
      backToParent: 'Back to parent',
      loadingTitle: 'Loading content',
      loadingBody:
        'The path is resolved. The repository is now assembling the data needed to render this view.',
      notFoundTitle: 'Path not found',
      emptyTitle: 'Nothing to render',
      defaultEmptyReason: 'This path does not have renderable content yet.',
    },
    onboarding: {
      treeTip: 'Browse files and directories on the left.',
      contentTip:
        'Use the middle pane to view the home page, directories, or the current document.',
      pathTip: 'Use this bar to track the current path and switch language or theme.',
      dismiss: 'Dismiss',
    },
  },
};

export function getUiCopy(locale: AppLocale): UiCopy {
  return uiCopyByLocale[locale];
}

export function getThemeToggleAriaLabel(locale: AppLocale, theme: ThemePreference): string {
  const copy = getUiCopy(locale);

  return theme === 'light' ? copy.themeToggle.switchToDark : copy.themeToggle.switchToLight;
}
